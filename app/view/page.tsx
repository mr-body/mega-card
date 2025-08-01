"use client"
import React from "react"
import { useState, useRef } from "react"
import {
  ImageIcon,
  Star,
  FolderOpen,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { availableIcons } from "@/components/editor/icon-picker-dialog copy"

const ElementComponents = {
  frame: ({ element, selected, onClick, children, onDrop, onDragOver }: any) => {
    const frameElement = element as FrameElement

    const contentStyle: React.CSSProperties = {
      position: frameElement.properties.position === "static" ? "static" : (frameElement.properties.position as any),
      left:
        frameElement.properties.left && frameElement.properties.left !== "auto"
          ? frameElement.properties.left
          : undefined,
      top:
        frameElement.properties.top && frameElement.properties.top !== "auto" ? frameElement.properties.top : undefined,
      right:
        frameElement.properties.right && frameElement.properties.right !== "auto"
          ? frameElement.properties.right
          : undefined,
      bottom:
        frameElement.properties.bottom && frameElement.properties.bottom !== "auto"
          ? frameElement.properties.bottom
          : undefined,
      backgroundColor: frameElement.properties.backgroundColor || "transparent",
      backgroundImage: frameElement.properties.backgroundImage
        ? `url(${frameElement.properties.backgroundImage})`
        : undefined,
      borderRadius: frameElement.properties.borderRadius || "0",
      width: frameElement.properties.width || "100px",
      height: frameElement.properties.height || "100px",
      minWidth: frameElement.properties.minWidth || undefined,
      minHeight: frameElement.properties.minHeight || undefined,
      maxWidth: frameElement.properties.maxWidth || undefined,
      maxHeight: frameElement.properties.maxHeight || undefined,
      margin: frameElement.properties.margin || "0",
      padding: frameElement.properties.padding || "8px",
      display: frameElement.properties.display || "flex",
      border: frameElement.properties.border || "none",
      opacity: frameElement.properties.opacity || "1",
      zIndex: frameElement.properties.zIndex || "auto",
      overflow: frameElement.properties.overflow || "visible",
      justifyContent: frameElement.properties.justifyContent || "auto",
      alignItems: frameElement.properties.alignItems || "auto",
      flexDirection: (frameElement.properties.flexDirection as any) || "auto",
      flexWrap: (frameElement.properties.flexWrap as any) || "auto",
      gap: frameElement.properties.gap || "0",
      gridTemplateColumns: frameElement.properties.gridTemplateColumns || "none",
      gridTemplateRows: frameElement.properties.gridTemplateRows || "none",
      gridGap: frameElement.properties.gridGap || "0",
    }

    if (frameElement.hidden === false) return null

    return (
      <>
        <div
          className={`cursor-pointer transition-all ${selected ? "ring-2 ring-blue-400" : ""}`}
          style={contentStyle}
          onClick={onClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {children && React.Children.count(children) > 0 && (
            children
          )}
        </div>
      </>
    )
  },

  text: ({ element, selected, onClick }: any) => {
    const textElement = element as TextElement

    const contentStyle: React.CSSProperties = {
      position: textElement.properties.position === "relative" ? "relative" : (textElement.properties.position as any),
      left:
        textElement.properties.left && textElement.properties.left !== "auto" ? textElement.properties.left : undefined,
      top: textElement.properties.top && textElement.properties.top !== "auto" ? textElement.properties.top : undefined,
      right:
        textElement.properties.right && textElement.properties.right !== "auto"
          ? textElement.properties.right
          : undefined,
      bottom:
        textElement.properties.bottom && textElement.properties.bottom !== "auto"
          ? textElement.properties.bottom
          : undefined,
      color: textElement.properties.color || "#000000",
      backgroundColor: textElement.properties.backgroundColor || "transparent",
      fontSize: textElement.properties.fontSize || "14px",
      fontWeight: textElement.properties.fontWeight || "normal",
      fontFamily: textElement.properties.fontFamily || undefined,
      lineHeight: textElement.properties.lineHeight || "normal",
      letterSpacing: textElement.properties.letterSpacing || "normal",
      textAlign: (textElement.properties.textAlign as any) || "left",
      textDecoration: textElement.properties.textDecoration || "none",
      textTransform: (textElement.properties.textTransform as any) || "none",
      width: textElement.properties.width || "auto",
      height: textElement.properties.height || "auto",
      minWidth: textElement.properties.minWidth || undefined,
      minHeight: textElement.properties.minHeight || undefined,
      maxWidth: textElement.properties.maxWidth || undefined,
      maxHeight: textElement.properties.maxHeight || undefined,
      margin: textElement.properties.margin || "0",
      padding: textElement.properties.padding || "4px",
      borderRadius: textElement.properties.borderRadius || "0",
      border: textElement.properties.border || "none",
      opacity: textElement.properties.opacity || "1",
      zIndex: textElement.properties.zIndex || "auto",
    }

    if (textElement.hidden === false) return null

    return (
      <>
        <div
          style={contentStyle}
          className={` ${selected ? "ring-2 ring-blue-400" : ""} relative cursor-pointer transition-all ${textElement.properties.customStyle}`}
          onClick={onClick}
        >
          <span>
            {textElement.properties.content || "Sample text"}
          </span>
        </div>
      </>
    )
  },

  image: ({ element, selected, onClick }: any) => {
    const imageElement = element as ImageElement

    const contentStyle: React.CSSProperties = {
      position: imageElement.properties.position === "static" ? "static" : (imageElement.properties.position as any),
      left:
        imageElement.properties.left && imageElement.properties.left !== "auto"
          ? imageElement.properties.left
          : undefined,
      top:
        imageElement.properties.top && imageElement.properties.top !== "auto" ? imageElement.properties.top : undefined,
      right:
        imageElement.properties.right && imageElement.properties.right !== "auto"
          ? imageElement.properties.right
          : undefined,
      bottom:
        imageElement.properties.bottom && imageElement.properties.bottom !== "auto"
          ? imageElement.properties.bottom
          : undefined,
      width: imageElement.properties.width || "96px",
      height: imageElement.properties.height || "64px",
      minWidth: imageElement.properties.minWidth || undefined,
      minHeight: imageElement.properties.minHeight || undefined,
      maxWidth: imageElement.properties.maxWidth || undefined,
      maxHeight: imageElement.properties.maxHeight || undefined,
      margin: imageElement.properties.margin || "0",
      padding: imageElement.properties.padding || "0",
      borderRadius: imageElement.properties.borderRadius || "0",
      border: imageElement.properties.border || "none",
      // boxShadow: imageElement.properties.boxShadow || undefined,
      opacity: imageElement.properties.opacity || "1",
      zIndex: imageElement.properties.zIndex || "auto",
      overflow: "hidden",
    }

    const imageSrc = imageElement.properties.fileData || imageElement.properties.file || "/placeholder.svg"

    if (imageElement.hidden === false) return null

    return (
      <>
        <div
          style={contentStyle}
          onClick={onClick}
        >
          {imageSrc && imageSrc !== "/placeholder.svg" ? (
            <img
              src={imageSrc || "/placeholder.svg"}
              alt="Uploaded"
              className={`relative ${selected ? "ring-2 ring-blue-400" : ""} cursor-pointer transition-all flex items-center justify-center ${imageElement.properties.customStyle}`}
              style={{ objectFit: imageElement.properties.objectFit as any }}
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </>
    )
  },

  icon: ({ element, selected, onClick }: any) => {
    const iconElement = element as IconElement
    const IconComponent = availableIcons[iconElement.properties.iconName as keyof typeof availableIcons] || Star

    const contentStyle: React.CSSProperties = {
      position: iconElement.properties.position === "static" ? "static" : (iconElement.properties.position as any),
      left:
        iconElement.properties.left && iconElement.properties.left !== "auto" ? iconElement.properties.left : undefined,
      top: iconElement.properties.top && iconElement.properties.top !== "auto" ? iconElement.properties.top : undefined,
      right:
        iconElement.properties.right && iconElement.properties.right !== "auto"
          ? iconElement.properties.right
          : undefined,
      bottom:
        iconElement.properties.bottom && iconElement.properties.bottom !== "auto"
          ? iconElement.properties.bottom
          : undefined,
      color: iconElement.properties.color || "#000000",
      backgroundColor: iconElement.properties.backgroundColor || "transparent",
      width: iconElement.properties.width || "32px",
      height: iconElement.properties.height || "32px",
      minWidth: iconElement.properties.minWidth || undefined,
      minHeight: iconElement.properties.minHeight || undefined,
      maxWidth: iconElement.properties.maxWidth || undefined,
      maxHeight: iconElement.properties.maxHeight || undefined,
      margin: iconElement.properties.margin || "0",
      padding: iconElement.properties.padding || "4px",
      borderRadius: iconElement.properties.borderRadius || "0",
      border: iconElement.properties.border || "none",
      // boxShadow: iconElement.properties.boxShadow || undefined,
      opacity: iconElement.properties.opacity || "1",
      zIndex: iconElement.properties.zIndex || "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }

    if (iconElement.hidden === false) return null

    return (
      <>
        <div
          className={`relative ${selected ? "ring-2 ring-blue-400" : ""} cursor-pointer transition-all ${iconElement.properties.customStyle}`}
          style={contentStyle}
          onClick={onClick}
        >
          <IconComponent
            style={{ width: iconElement.properties.size || "16px", height: iconElement.properties.size || "16px" }}
          />
        </div>
      </>
    )
  },
}


export default function VisualEditor() {
  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    {
      id: "1",
      name: "Workspace 1",
      elements: [],
      canvasProperties: {
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
      },
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
        {element.children?.map((child) => renderElement(child))}
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
