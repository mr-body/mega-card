
import { useState, useRef, useEffect, useCallback } from "react"
import { createRoot } from 'react-dom/client';
import { ElementData, CanvasProperties, HistoryState, WorkspaceTab, CRDFile, ElementType } from "@/types/visual-editor"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const initialCanvasProperties: CanvasProperties = {
  backgroundColor: "#ffffff",
  backgroundImage: "",
  width: "400px",
  height: "300px",
  borderRadius: "8px",
  borderRadiusTop: "8px",
  borderRadiusRight: "8px",
  borderRadiusBottom: "8px",
  borderRadiusLeft: "8px",
  margin: "0",
  marginTop: "0",
  marginRight: "0",
  marginBottom: "0",
  marginLeft: "0",
  padding: "16px",
  paddingTop: "16px",
  paddingRight: "16px",
  paddingBottom: "16px",
  paddingLeft: "16px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  flexDirection: "column",
  flexWrap: "nowrap",
  flexGrow: "0",
  flexShrink: "1",
  gridTemplateColumns: "none",
  gridTemplateRows: "none",
  gridGap: "0",
  gridColumn: "auto",
  gridRow: "auto",
  gap: "8px",
  border: "1px solid #e5e7eb",
  customStyle: "",
}

export const useVisualEditor = () => {
  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    {
      id: "1",
      name: "Workspace 1",
      elements: [],
      canvasProperties: initialCanvasProperties,
      selectedElement: null,
      history: [],
      historyIndex: -1,
      isModified: false,
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")

  const activeTab = tabs.find((tab) => tab.id === activeTabId)!
  const selectedElement = activeTab.selectedElement
  const elements = activeTab.elements
  const canvasProperties = activeTab.canvasProperties
  const history = activeTab.history
  const historyIndex = activeTab.historyIndex

  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [draggedTreeElement, setDraggedTreeElement] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadFileInputRef = useRef<HTMLInputElement>(null)
  const [copiedElement, setCopiedElement] = useState<ElementData | null>(null)

  const updateActiveTab = (updates: Partial<WorkspaceTab>) => {
    setTabs((prevTabs) => prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, ...updates } : tab)))
  }

  const setElements = (newElements: ElementData[] | ((prev: ElementData[]) => ElementData[])) => {
    const updatedElements = typeof newElements === "function" ? newElements(elements) : newElements
    updateActiveTab({ elements: updatedElements, isModified: true })
  }

  const setCanvasProperties = (newProps: CanvasProperties | ((prev: CanvasProperties) => CanvasProperties)) => {
    const updatedProps = typeof newProps === "function" ? newProps(canvasProperties) : newProps
    updateActiveTab({ canvasProperties: updatedProps, isModified: true })
  }

  const setSelectedElement = (elementId: string | null) => {
    updateActiveTab({ selectedElement: elementId })
  }

  const saveToHistory = useCallback(() => {
    const newState: HistoryState = {
      elements: JSON.parse(JSON.stringify(elements)),
      canvasProperties: { ...canvasProperties },
      selectedElement,
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    updateActiveTab((prevState) => ({
      ...prevState,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    }))
  }, [elements, canvasProperties, selectedElement, history, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setElements(prevState.elements)
      setCanvasProperties(prevState.canvasProperties)
      setSelectedElement(prevState.selectedElement)
      updateActiveTab((prevState) => ({
        ...prevState,
        historyIndex: historyIndex - 1,
      }))
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setElements(nextState.elements)
      setCanvasProperties(nextState.canvasProperties)
      setSelectedElement(nextState.selectedElement)
      updateActiveTab((prevState) => ({
        ...prevState,
        historyIndex: historyIndex + 1,
      }))
    }
  }, [history, historyIndex])

  const saveCRDFile = () => {
    const crdData: CRDFile = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      canvas: canvasProperties,
      elements: elements,
      metadata: {
        name: activeTab.name,
        description: "Created with Visual Editor",
      },
    }
    const dataStr = JSON.stringify(crdData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${activeTab.name.replace(/\s+/g, "_")}_${new Date().getTime()}.crd`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    updateActiveTab({ isModified: false })
  }

  const loadCRDFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const crdData: CRDFile = JSON.parse(content)
          if (crdData.version && crdData.canvas && crdData.elements) {
            const newTabId = Date.now().toString()
            const newTab: WorkspaceTab = {
              id: newTabId,
              name: crdData.metadata.name || "Loaded Workspace",
              elements: crdData.elements,
              canvasProperties: crdData.canvas,
              selectedElement: null,
              history: [],
              historyIndex: -1,
              isModified: false,
            }
            setTabs((prevTabs) => [...prevTabs, newTab])
            setActiveTabId(newTabId)
          } else {
            alert("Arquivo .crd inválido!")
          }
        } catch (error) {
          alert("Erro ao carregar arquivo .crd!")
          console.error("Error loading CRD file:", error)
        }
      }
      reader.readAsText(file)
    }
    if (loadFileInputRef.current) {
      loadFileInputRef.current.value = ""
    }
  }

  const copyElement = (elementId: string) => {
    const element = findElement(elements, elementId)
    if (element) {
      setCopiedElement(JSON.parse(JSON.stringify(element)))
    }
  }

  const pasteElement = (parentId?: string) => {
    if (!copiedElement) return

    const generateUniqueId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

    const cloneElementWithNewIds = (element: ElementData): ElementData => {
      const newElement = {
        ...element,
        id: generateUniqueId(),
        name: `${element.name} Copy`,
        children: element.children?.map((child) => cloneElementWithNewIds(child)),
      }
      return newElement
    }

    const newElement = cloneElementWithNewIds(copiedElement)

    if (parentId) {
      const addToParent = (elements: ElementData[]): ElementData[] => {
        return elements.map((element) => {
          if (element.id === parentId) {
            return {
              ...element,
              children: [...(element.children || []), newElement],
            }
          }
          if (element.children) {
            return {
              ...element,
              children: addToParent(element.children),
            }
          }
          return element
        })
      }
      setElements(addToParent(elements))
    } else {
      setElements([...elements, newElement])
    }

    setSelectedElement(newElement.id)
    saveToHistory()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElement && selectedElement !== "canvas") {
        e.preventDefault()
        deleteElement(selectedElement)
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault()
        undo()
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault()
        redo()
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        saveCRDFile()
      }
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault()
        createNewTab()
      }
      if (e.ctrlKey && e.key === "w") {
        e.preventDefault()
        if (tabs.length > 1) {
          closeTab(activeTabId)
        }
      }
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault()
        if (selectedElement && selectedElement !== "canvas") {
          copyElement(selectedElement)
        }
      }
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault()
        if (copiedElement) {
          if (selectedElement && selectedElement !== "canvas") {
            const element = findElement(elements, selectedElement)
            if (element && element.type === "frame") {
              pasteElement(selectedElement)
            } else {
              pasteElement()
            }
          } else {
            pasteElement()
          }
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedElement, undo, redo, tabs.length, activeTabId, elements, copiedElement])

  const createNewTab = () => {
    const newTabId = Date.now().toString()
    const newTab: WorkspaceTab = {
      id: newTabId,
      name: `Workspace ${tabs.length + 1}`,
      elements: [],
      canvasProperties: initialCanvasProperties,
      selectedElement: null,
      history: [],
      historyIndex: -1,
      isModified: false,
    }
    setTabs((prevTabs) => [...prevTabs, newTab])
    setActiveTabId(newTabId)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return
    const tabToClose = tabs.find((tab) => tab.id === tabId)
    if (tabToClose?.isModified) {
      const confirmClose = window.confirm(`"${tabToClose.name}" has unsaved changes. Close anyway?`)
      if (!confirmClose) return
    }
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTabId === tabId) {
      const currentIndex = tabs.findIndex((tab) => tab.id === tabId)
      const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : 0
      setActiveTabId(newTabs[newActiveIndex].id)
    }
  }

  const renameTab = (tabId: string, newName: string) => {
    setTabs((prevTabs) => prevTabs.map((tab) => (tab.id === tabId ? { ...tab, name: newName } : tab)))
  }

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId)
  }

  const createDefaultProperties = (type: ElementType): any => {
    const baseProps = {
      position: "static",
      left: "auto",
      top: "auto",
      right: "auto",
      bottom: "auto",
      width: "auto",
      height: "auto",
      minWidth: "",
      minHeight: "",
      maxWidth: "",
      maxHeight: "",
      margin: "0",
      marginTop: "0",
      marginRight: "0",
      marginBottom: "0",
      marginLeft: "0",
      padding: "8px",
      paddingTop: "8px",
      paddingRight: "8px",
      paddingBottom: "8px",
      paddingLeft: "8px",
      borderRadius: "0",
      borderRadiusTop: "0",
      borderRadiusRight: "0",
      borderRadiusBottom: "0",
      borderRadiusLeft: "0",
      border: "none",
      borderTop: "none",
      borderRight: "none",
      borderBottom: "none",
      borderLeft: "none",
      boxShadow: "none",
      opacity: "1",
      zIndex: "auto",
      customStyle: "",
    }

    switch (type) {
      case "frame":
        return {
          ...baseProps,
          backgroundColor: "transparent",
          backgroundImage: "",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "stretch",
          flexDirection: "row",
          flexWrap: "nowrap",
          flexGrow: "0",
          flexShrink: "1",
          gridTemplateColumns: "none",
          gridTemplateRows: "none",
          gridGap: "0",
          gridColumn: "auto",
          gridRow: "auto",
          gap: "0",
          width: "200px",
          height: "100px",
          overflow: "visible",
          border: "2px dashed #d1d5db",
        }
      case "text":
        return {
          ...baseProps,
          content: "Sample text",
          color: "#000000",
          backgroundColor: "transparent",
          fontSize: "14px",
          fontWeight: "normal",
          fontFamily: "",
          lineHeight: "normal",
          letterSpacing: "normal",
          textAlign: "left",
          textDecoration: "none",
          textTransform: "none",
          width: "auto",
          height: "auto",
        }
      case "image":
        return {
          ...baseProps,
          file: "",
          fileData: "",
          objectFit: "cover",
          width: "100px",
          height: "100px",
        }
      case "icon":
        return {
          ...baseProps,
          iconName: "star",
          color: "#000000",
          backgroundColor: "transparent",
          size: "24px",
          width: "40px",
          height: "40px",
        }
      default:
        return baseProps
    }
  }

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedElement(elementId)
  }

  const handleCanvasClick = () => {
    setSelectedElement("canvas")
  }

  const handleDragStart = (elementType: ElementType) => {
    setDraggedElement(elementType)
  }

  const handleTreeDragStart = (elementId: string) => {
    setDraggedTreeElement(elementId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, parentId?: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedElement) {
      const newElement: ElementData = {
        id: Date.now().toString(),
        type: draggedElement,
        name: `${draggedElement.charAt(0).toUpperCase() + draggedElement.slice(1)} ${Date.now()}`,
        children: [],
        properties: createDefaultProperties(draggedElement),
      } as ElementData

      if (parentId) {
        const addToParent = (elements: ElementData[]): ElementData[] => {
          return elements.map((element) => {
            if (element.id === parentId) {
              return {
                ...element,
                children: [...(element.children || []), newElement],
              }
            }
            if (element.children) {
              return {
                ...element,
                children: addToParent(element.children),
              }
            }
            return element
          })
        }
        setElements(addToParent(elements))
      } else {
        setElements([...elements, newElement])
      }
      setDraggedElement(null)
      saveToHistory()
    }

    if (draggedTreeElement && parentId) {
      moveElementToParent(draggedTreeElement, parentId)
      setDraggedTreeElement(null)
    }
  }

  const handleResize = (elementId: string, direction: string, deltaX: number, deltaY: number) => {
    const element = findElement(elements, elementId)
    if (!element) return

    const currentWidth = Number.parseInt(element.properties.width) || 100
    const currentHeight = Number.parseInt(element.properties.height) || 100

    let newWidth = currentWidth
    let newHeight = currentHeight

    switch (direction) {
      case "se":
        newWidth = Math.max(20, currentWidth + deltaX)
        newHeight = Math.max(20, currentHeight + deltaY)
        break
      case "sw":
        newWidth = Math.max(20, currentWidth - deltaX)
        newHeight = Math.max(20, currentHeight + deltaY)
        break
      case "ne":
        newWidth = Math.max(20, currentWidth + deltaX)
        newHeight = Math.max(20, currentHeight - deltaY)
        break
      case "nw":
        newWidth = Math.max(20, currentWidth - deltaX)
        newHeight = Math.max(20, currentHeight - deltaY)
        break
      case "e":
        newWidth = Math.max(20, currentWidth + deltaX)
        break
      case "w":
        newWidth = Math.max(20, currentWidth - deltaX)
        break
      case "n":
        newHeight = Math.max(20, currentHeight - deltaY)
        break
      case "s":
        newHeight = Math.max(20, currentHeight + deltaY)
        break
    }

    updateElementProperty(elementId, "width", `${newWidth}px`)
    updateElementProperty(elementId, "height", `${newHeight}px`)
  }

  const moveElementToParent = (elementId: string, newParentId: string) => {
    let elementToMove: ElementData | null = null

    const removeElement = (elements: ElementData[]): ElementData[] => {
      return elements.filter((element) => {
        if (element.id === elementId) {
          elementToMove = element
          return false
        }
        if (element.children) {
          element.children = removeElement(element.children)
        }
        return true
      })
    }

    const newElements = removeElement([...elements])

    if (elementToMove) {
      const addToNewParent = (elements: ElementData[]): ElementData[] => {
        return elements.map((element) => {
          if (element.id === newParentId) {
            return {
              ...element,
              children: [...(element.children || []), elementToMove!],
            }
          }
          if (element.children) {
            return {
              ...element,
              children: addToNewParent(element.children),
            }
          }
          return element
        })
      }

      if (newParentId === "canvas") {
        setElements([...newElements, elementToMove])
      } else {
        setElements(addToNewParent(newElements))
      }
      saveToHistory()
    }
  }

  const deleteElement = (elementId: string) => {
    // 1. Mostrar o Alert Dialog de confirmação
    const confirmDelete = async () => {
      return new Promise<boolean>((resolve) => {
        // Criar um container para o dialog
        const dialogContainer = document.createElement('div');
        dialogContainer.id = 'confirm-delete-dialog';
        document.body.appendChild(dialogContainer);

        // Criar o root com a nova API
        const root = createRoot(dialogContainer);

        // Renderizar o dialog
        root.render(
          <AlertDialog
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                resolve(false);
                setTimeout(() => {
                  root.unmount();
                  dialogContainer.remove();
                }, 100);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O elemento e seus filhos serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => {
                  resolve(false);
                  setTimeout(() => {
                    root.unmount();
                    dialogContainer.remove();
                  }, 100);
                }}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  resolve(true);
                  setTimeout(() => {
                    root.unmount();
                    dialogContainer.remove();
                  }, 100);
                }}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      });
    };

    // 2. Processar a deleção se confirmado
    confirmDelete().then((confirmed) => {
      if (!confirmed) return;

      const removeElement = (elements: ElementData[]): ElementData[] => {
        return elements.filter((element) => {
          if (element.id === elementId) {
            return false;
          }
          if (element.children) {
            element.children = removeElement(element.children);
          }
          return true;
        });
      };

      setElements(removeElement(elements));
      setSelectedElement(null);
      saveToHistory();
    });
  };

  const updateElementProperty = (elementId: string, property: string, value: string) => {
    const updateElement = (elements: ElementData[]): ElementData[] => {
      return elements.map((element) => {
        if (element.id === elementId) {
          return {
            ...element,
            properties: {
              ...element.properties,
              [property]: value,
            },
          }
        }
        if (element.children) {
          return {
            ...element,
            children: updateElement(element.children),
          }
        }
        return element
      })
    }

    setElements(updateElement(elements))
  }

  const updateElementVariavel = (elementId: string, value: string) => {
    const updateElement = (elements: ElementData[]): ElementData[] => {
      return elements.map((element) => {
        if (element.id === elementId) {
          return {
            ...element,
            variavel: value,
            properties: {
              ...element.properties,
            },
          }
        }
        if (element.children) {
          return {
            ...element,
            children: updateElement(element.children),
          }
        }
        return element
      })
    }

    setElements(updateElement(elements))
  }

  const updateCanvasProperty = (property: string, value: string) => {
    setCanvasProperties({
      ...canvasProperties,
      [property]: value,
    })
    updateActiveTab({ isModified: true })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && selectedElement) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        updateElementProperty(selectedElement, "fileData", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const findElement = (elements: ElementData[], id: string): ElementData | null => {
    for (const element of elements) {
      if (element.id === id) return element
      if (element.children) {
        const found = findElement(element.children, id)
        if (found) return found
      }
    }
    return null
  }

  const toggleHide = (elementId: string) => {
    const toggleElement = (elements: ElementData[]): ElementData[] => {
      return elements.map((element) => {
        if (element.id === elementId) {
          return {
            ...element,
            hidden: !element.hidden,
          }
        }
        if (element.children) {
          return {
            ...element,
            children: toggleElement(element.children),
          }
        }
        return element
      })
    }
    setElements(toggleElement(elements))
  }

  const selectedElementData = selectedElement && selectedElement !== "canvas" ? findElement(elements, selectedElement) : null

  return {
    tabs,
    activeTabId,
    elements,
    canvasProperties,
    selectedElement,
    selectedElementData,
    draggedElement,
    draggedTreeElement,
    canvasRef,
    fileInputRef,
    loadFileInputRef,
    copiedElement,
    setTabs,
    setActiveTabId,
    setElements,
    setCanvasProperties,
    setSelectedElement,
    setDraggedElement,
    setDraggedTreeElement,
    setCopiedElement,
    saveToHistory,
    undo,
    redo,
    saveCRDFile,
    loadCRDFile,
    copyElement,
    pasteElement,
    createNewTab,
    closeTab,
    renameTab,
    switchTab,
    handleElementClick,
    handleCanvasClick,
    handleDragStart,
    handleTreeDragStart,
    handleDragOver,
    handleDrop,
    handleResize,
    deleteElement,
    updateElementProperty,
    updateElementVariavel,
    updateCanvasProperty,
    handleFileUpload,
    findElement,
    toggleHide,
  }
}
