"use client"
import React from "react"
import { useState, useRef } from "react"
import { FolderOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { initialCanvasProperties } from "@/hooks/use-visual-editor"
import { ElementComponents } from "@/components/editor/ElementRenderer"


export default function VisualEditor() {
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
  const elements = activeTab.elements
  const canvasProperties = activeTab.canvasProperties
  const canvasRef = useRef<HTMLDivElement>(null)
  const loadFileInputRef = useRef<HTMLInputElement>(null)


  // Carregar arquivo .crd
  const loadCRDFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const crdData: CRDFile = JSON.parse(content)
          if (crdData.version && crdData.canvas && crdData.elements) {
            // Criar nova tab com os dados carregados
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

  const updateElementProperty = (id: string, property: string, value: any) => {
    const updatedElements = activeTab.elements.map((el) => {
      if (el.id === id) {
        return {
          ...el,
          properties: {
            ...el.properties,
            [property]: value,
          },
        }
      }
      return el
    })
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            elements: updatedElements,
            isModified: true,
          }
        }
        return tab
      })
    )
  }

  const renderElement = (element: ElementData): React.ReactNode => {
    const Component = ElementComponents[element.type]

    return (
      <Component
        key={element.id}
        element={element}
      >
        {element.children?.map((child) => renderElement(child as any))}
      </Component>
    )
  }

  const renderVars = (element: ElementData): React.ReactNode => {
    const vars: {
      id: string
      name: string
      variavel: string
      type: ElementType
      properties: any
    }[] = []

    const collectVars = (el: any) => {
      if (el.variavel && el.variavel !== null && el.variavel !== "") {
        vars.push({
          id: el.id,
          name: el.name,
          variavel: el.variavel,
          type: el.type,
          properties: el.properties,
        })
      }
      if (el.children) {
        el.children.forEach(collectVars)
      }
    }

    collectVars(element)

    const renderEditableFields = (v: typeof vars[0]) => {
      switch (v.type) {
        case "text":
          return (
            <>
              <input
                type="text"
                value={v.properties.content}
                onChange={(e) => {
                  const newValue = e.target.value
                  updateElementProperty(v.id, "content", newValue)
                }}
                placeholder="Content"
                className="border p-1 rounded mb-2 w-full"
              />
              <input
                type="color"
                value={v.properties.color}
                onChange={(e) => {
                  const newColor = e.target.value
                  updateElementProperty(v.id, "color", newColor)
                }}
                placeholder="Color"
                className="border p-1 rounded mb-2 w-full"
              />
            </>
          )
        case "image":
          return (
            <>
              <input
                type="text"
                value={v.properties.file}
                onChange={(e) => {
                  const newFile = e.target.value
                  updateElementProperty(v.id, "file", newFile)
                }}
                placeholder="File path"
                className="border p-1 rounded mb-2 w-full"
              />
              <input
                type="text"
                value={v.properties.fileData}
                onChange={(e) => {
                  const newData = e.target.value
                  updateElementProperty(v.id, "fileData", newData)
                }}
                placeholder="Base64 data"
                className="border p-1 rounded mb-2 w-full"
              />
            </>
          )
        case "icon":
          return (
            <>
              <input
                type="text"
                value={v.properties.iconName}
                onChange={(e) => {
                  const newIcon = e.target.value
                  updateElementProperty(v.id, "iconName", newIcon)
                }}
                placeholder="Icon name"
                className="border p-1 rounded mb-2 w-full"
              />
              <input
                type="color"
                value={v.properties.color}
                onChange={(e) => {
                  const newColor = e.target.value
                  updateElementProperty(v.id, "color", newColor)
                }}
                className="border p-1 rounded mb-2 w-full"
              />
            </>
          )
        default:
          return null
      }
    }

    return (
      <div>
        {vars.length > 0 ? (
          <>
            <ul>
              {vars.map((v) => (
                <li key={v.id}>
                  <strong>{v.type}</strong>: {v.variavel}
                </li>
              ))}
            </ul>
            <div>
              {vars.map((v) => (
                <div key={v.id} className="mb-4">
                  {renderEditableFields(v)}
                </div>
              ))}
            </div>
          </>
        ) : (
          <span className="text-gray-400">Nenhuma variável encontrada</span>
        )}
      </div>
    )
  }


  const canvasStyle: React.CSSProperties = {
    backgroundColor: canvasProperties.backgroundColor,
    backgroundImage: canvasProperties.backgroundImage ? `url(${canvasProperties.backgroundImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    zIndex: 0,
    overflow: "hidden",
    width: canvasProperties.width,
    height: canvasProperties.height,
    borderRadius: canvasProperties.borderRadius,
    padding: canvasProperties.padding,
    display: canvasProperties.display as any,
    justifyContent: canvasProperties.justifyContent as any,
    alignItems: canvasProperties.alignItems as any,
    flexDirection: canvasProperties.flexDirection as any,
    gap: canvasProperties.gap,
    border: canvasProperties.border,
  }

  return (
    <div className="bg-gray-100 h-screen flex flex-col">

      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full bg-gray-50">

          <ResizableHandle />

          {/* Centro - Folha de edição (Cartão) */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full p-8 flex items-center justify-center bg-gray-50">
              {
                elements && elements.length > 0 ? (
                  <div
                    ref={canvasRef}
                    style={canvasStyle}
                    className={`shadow-lg border  border-gray-300 hover:border-blue-300 transition-colors overflow-visible`}
                  >
                    {
                      elements && elements.map((element) => renderElement(element))
                    }
                  </div>
                ) : (
                  <div className="text-gray-500 text-center flex items-center gap-2">
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadFileInputRef.current?.click()}
                        className="p-2"
                        title="Load .crd file"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </Button>
                      <input ref={loadFileInputRef} type="file" accept=".crd" onChange={loadCRDFile} className="hidden" />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      window.location.href = "/"
                    }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )
              }

            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Lado direito - Painel de controle */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <div>
              {
                elements && elements.map((element) => renderVars(element))
              }
            </div>

          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
