"use client"
import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Square,
  Type,
  ImageIcon,
  Star,
  Heart,
  Home,
  User,
  Settings,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Music,
  Video,
  Download,
  Upload,
  Search,
  Bell,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Edit,
  Trash,
  Trash2,
  Plus,
  Minus,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Save,
  FolderOpen,
  icons,
  SlidersHorizontal,
  Braces,
  Code,
  Asterisk,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { TextFormatDialog } from "@/components/editor/text-formate"
import { IconPickerDialog } from "@/components/editor/icon-picker-dialog copy"
import { Separator } from "@/components/ui/separator"

// Tipos para os elementos
type ElementType = "frame" | "text" | "image" | "icon"

interface CanvasProperties {
  backgroundColor: string
  backgroundImage: string
  borderRadius: string
  borderRadiusTop: string
  borderRadiusRight: string
  borderRadiusBottom: string
  borderRadiusLeft: string
  width: string
  height: string
  margin: string
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string
  padding: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string
  display: string
  justifyContent: string
  alignItems: string
  flexDirection: string
  flexWrap: string
  flexGrow: string
  flexShrink: string
  gridTemplateColumns: string
  gridTemplateRows: string
  gridGap: string
  gridColumn: string
  gridRow: string
  gap: string
  border: string
  customStyle: string
}

interface BaseElementData {
  id: string
  type: ElementType
  name: string
  variavel: string
  hidden: boolean
  children?: BaseElementData[]
}

interface FrameElement extends BaseElementData {
  type: "frame"
  properties: {
    position: string
    left: string
    top: string
    right: string
    bottom: string
    backgroundColor: string
    backgroundImage: string
    borderRadius: string
    borderRadiusTop: string
    borderRadiusRight: string
    borderRadiusBottom: string
    borderRadiusLeft: string
    width: string
    height: string
    minWidth: string
    minHeight: string
    maxWidth: string
    maxHeight: string
    margin: string
    marginTop: string
    marginRight: string
    marginBottom: string
    marginLeft: string
    padding: string
    paddingTop: string
    paddingRight: string
    paddingBottom: string
    paddingLeft: string
    display: string
    justifyContent: string
    alignItems: string
    flexDirection: string
    flexWrap: string
    flexGrow: string
    flexShrink: string
    gridTemplateColumns: string
    gridTemplateRows: string
    gridGap: string
    gridColumn: string
    gridRow: string
    gap: string
    border: string
    borderTop: string
    borderRight: string
    borderBottom: string
    borderLeft: string
    boxShadow: string
    opacity: string
    zIndex: string
    overflow: string
    customStyle: string
  }
}

interface TextElement extends BaseElementData {
  type: "text"
  properties: {
    content: string
    position: string
    left: string
    top: string
    right: string
    bottom: string
    color: string
    backgroundColor: string
    fontSize: string
    fontWeight: string
    fontFamily: string
    lineHeight: string
    letterSpacing: string
    textAlign: string
    textDecoration: string
    textTransform: string
    width: string
    height: string
    minWidth: string
    minHeight: string
    maxWidth: string
    maxHeight: string
    margin: string
    marginTop: string
    marginRight: string
    marginBottom: string
    marginLeft: string
    padding: string
    paddingTop: string
    paddingRight: string
    paddingBottom: string
    paddingLeft: string
    borderRadius: string
    borderRadiusTop: string
    borderRadiusRight: string
    borderRadiusBottom: string
    borderRadiusLeft: string
    border: string
    borderTop: string
    borderRight: string
    borderBottom: string
    borderLeft: string
    boxShadow: string
    opacity: string
    zIndex: string
    customStyle: string
  }
}

interface ImageElement extends BaseElementData {
  type: "image"
  properties: {
    file: string
    fileData: string
    position: string
    left: string
    top: string
    right: string
    bottom: string
    width: string
    height: string
    minWidth: string
    minHeight: string
    maxWidth: string
    maxHeight: string
    margin: string
    marginTop: string
    marginRight: string
    marginBottom: string
    marginLeft: string
    padding: string
    paddingTop: string
    paddingRight: string
    paddingBottom: string
    paddingLeft: string
    borderRadius: string
    borderRadiusTop: string
    borderRadiusRight: string
    borderRadiusBottom: string
    borderRadiusLeft: string
    border: string
    borderTop: string
    borderRight: string
    borderBottom: string
    borderLeft: string
    boxShadow: string
    opacity: string
    zIndex: string
    objectFit: string
    customStyle: string
  }
}

interface IconElement extends BaseElementData {
  type: "icon"
  properties: {
    iconName: string
    position: string
    left: string
    top: string
    right: string
    bottom: string
    color: string
    backgroundColor: string
    size: string
    width: string
    height: string
    minWidth: string
    minHeight: string
    maxWidth: string
    maxHeight: string
    margin: string
    marginTop: string
    marginRight: string
    marginBottom: string
    marginLeft: string
    padding: string
    paddingTop: string
    paddingRight: string
    paddingBottom: string
    paddingLeft: string
    borderRadius: string
    borderRadiusTop: string
    borderRadiusRight: string
    borderRadiusBottom: string
    borderRadiusLeft: string
    border: string
    borderTop: string
    borderRight: string
    borderBottom: string
    borderLeft: string
    boxShadow: string
    opacity: string
    zIndex: string
    customStyle: string
  }
}

type ElementData = FrameElement | TextElement | ImageElement | IconElement

interface HistoryState {
  elements: ElementData[]
  canvasProperties: CanvasProperties
  selectedElement: string | null
}

interface CRDFile {
  version: string
  createdAt: string
  updatedAt: string
  canvas: CanvasProperties
  elements: ElementData[]
  metadata: {
    name: string
    description: string
  }
}

interface WorkspaceTab {
  id: string
  name: string
  elements: ElementData[]
  canvasProperties: CanvasProperties
  selectedElement: string | null
  history: HistoryState[]
  historyIndex: number
  isModified: boolean
}

interface TabBarProps {
  tabs: WorkspaceTab[]
  activeTabId: string
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabAdd: () => void
  onTabRename: (tabId: string, newName: string) => void
}

// Lista de ícones disponíveis
const availableIcons = {
  star: Star,
  heart: Heart,
  home: Home,
  user: User,
  settings: Settings,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  mapPin: MapPin,
  camera: Camera,
  music: Music,
  video: Video,
  download: Download,
  upload: Upload,
  search: Search,
  bell: Bell,
  lock: Lock,
  unlock: Unlock,
  eye: Eye,
  eyeOff: EyeOff,
  edit: Edit,
  trash: Trash,
  plus: Plus,
  minus: Minus,
  check: Check,
  x: X,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
}

// Função para obter o ícone do elemento
const getElementIcon = (type: ElementType) => {
  switch (type) {
    case "frame":
      return Square
    case "text":
      return Type
    case "image":
      return ImageIcon
    case "icon":
      return Star
    default:
      return Square
  }
}

// Componente de handles de redimensionamento aprimorado
const ResizeHandles = ({
  onResize,
  isAbsolute = false,
}: {
  onResize: (direction: string, deltaX: number, deltaY: number) => void
  isAbsolute?: boolean
}) => {
  const handleMouseDown = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      onResize(direction, deltaX, deltaY)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleStyle = "absolute w-2 h-2 bg-blue-500 border border-white rounded z-50"
  const cornerStyle = "w-3 h-3 bg-blue-500 border-2 border-white rounded"
  const edgeStyle = "w-2 h-2 bg-blue-500 border border-white rounded"

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
      {/* Corner handles */}
      <div
        className={`absolute -top-1.5 -left-1.5 ${cornerStyle} cursor-nw-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("nw")}
      />
      <div
        className={`absolute -top-1.5 -right-1.5 ${cornerStyle} cursor-ne-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("ne")}
      />
      <div
        className={`absolute -bottom-1.5 -left-1.5 ${cornerStyle} cursor-sw-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("sw")}
      />
      <div
        className={`absolute -bottom-1.5 -right-1.5 ${cornerStyle} cursor-se-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("se")}
      />

      {/* Edge handles */}
      <div
        className={`absolute -top-1 left-1/2 transform -translate-x-1/2 ${edgeStyle} cursor-n-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("n")}
      />
      <div
        className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 ${edgeStyle} cursor-s-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("s")}
      />
      <div
        className={`absolute -left-1 top-1/2 transform -translate-y-1/2 ${edgeStyle} cursor-w-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("w")}
      />
      <div
        className={`absolute -right-1 top-1/2 transform -translate-y-1/2 ${edgeStyle} cursor-e-resize pointer-events-auto`}
        onMouseDown={handleMouseDown("e")}
      />
    </div>
  )
}

// Componentes reutilizáveis para cada elemento
const ElementComponents = {
  frame: ({ element, selected, onClick, children, onDrop, onDragOver, onResize }: any) => {
    const frameElement = element as FrameElement

    // Content style (onde aplicamos as propriedades do usuário)
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
      // boxShadow: frameElement.properties.boxShadow || undefined,
      opacity: frameElement.properties.opacity || "1",
      zIndex: frameElement.properties.zIndex || "auto",
      overflow: frameElement.properties.overflow || "visible",
      // Propriedades de flexbox
      justifyContent: frameElement.properties.justifyContent || "auto",
      alignItems: frameElement.properties.alignItems || "auto",
      flexDirection: (frameElement.properties.flexDirection as any) || "auto",
      flexWrap: (frameElement.properties.flexWrap as any) || "auto",
      gap: frameElement.properties.gap || "0",
      // Propriedades de grid
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
          {children && React.Children.count(children) > 0 ? (
            children
          ) : (
            <div className="text-xs text-gray-500 select-none">Frame</div>
          )}
        </div>
        {/* {selected && (
          <ResizeHandles
            onResize={onResize}
            isAbsolute={frameElement.properties.position === "absolute" || frameElement.properties.position === "fixed"}
          />
        )} */}
      </>
    )
  },

  text: ({ element, selected, onClick, onResize }: any) => {
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
      // boxShadow: textElement.properties.boxShadow || undefined,
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
        {/* {selected && (
          <ResizeHandles
            onResize={onResize}
            isAbsolute={textElement.properties.position === "absolute" || textElement.properties.position === "fixed"}
          />
        )} */}
      </>
    )
  },

  image: ({ element, selected, onClick, onResize }: any) => {
    const imageElement = element as ImageElement

    const containerStyle: React.CSSProperties = {
      position: "relative",
      display: "inline-block",
    }

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
        {/* {selected && (
          <ResizeHandles
            onResize={onResize}
            isAbsolute={imageElement.properties.position === "absolute" || imageElement.properties.position === "fixed"}
          />
        )} */}
      </>
    )
  },

  icon: ({ element, selected, onClick, onResize }: any) => {
    const iconElement = element as IconElement
    const IconComponent = availableIcons[iconElement.properties.iconName as keyof typeof availableIcons] || Star

    const containerStyle: React.CSSProperties = {
      position: "relative",
      display: "inline-block",
    }

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
        {/* {selected && (
          <ResizeHandles
            onResize={onResize}
            isAbsolute={iconElement.properties.position === "absolute" || iconElement.properties.position === "fixed"}
          />
        )} */}
      </>
    )
  },
}

// Lista de elementos disponíveis
const availableElements = [
  { type: "frame" as ElementType, name: "Frame", icon: Square },
  { type: "text" as ElementType, name: "Text", icon: Type },
  { type: "image" as ElementType, name: "Image", icon: ImageIcon },
  { type: "icon" as ElementType, name: "Icon", icon: Star },
]

export default function VisualEditor() {
  // Estado das tabs
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

  // Estados derivados da tab ativa
  const activeTab = tabs.find((tab) => tab.id === activeTabId)!
  const selectedElement = activeTab.selectedElement
  const elements = activeTab.elements
  const canvasProperties = activeTab.canvasProperties
  const history = activeTab.history
  const historyIndex = activeTab.historyIndex

  // Estados locais (não dependem da tab)
  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [draggedTreeElement, setDraggedTreeElement] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadFileInputRef = useRef<HTMLInputElement>(null)
  const [copiedElement, setCopiedElement] = useState<ElementData | null>(null)

  // Salvar estado no histórico
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

  // Undo
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

  // Redo
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

  // Salvar arquivo .crd
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
    // Marcar como não modificado após salvar
    updateActiveTab({ isModified: false })
  }

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

  // Função para copiar elemento
  const copyElement = (elementId: string) => {
    const element = findElement(elements, elementId)
    if (element) {
      setCopiedElement(JSON.parse(JSON.stringify(element))) // Deep clone
    }
  }

  // Função para colar elemento
  const pasteElement = (parentId?: string) => {
    if (!copiedElement) return

    // Gerar novo ID e nome únicos
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
      // Colar dentro de um frame específico
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
      // Colar no canvas
      setElements([...elements, newElement])
    }

    // Selecionar o elemento colado
    setSelectedElement(newElement.id)
    saveToHistory()
  }

  // Event listeners para teclado
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
          // Se um frame estiver selecionado, colar dentro dele
          if (selectedElement && selectedElement !== "canvas") {
            const element = findElement(elements, selectedElement)
            if (element && element.type === "frame") {
              pasteElement(selectedElement)
            } else {
              pasteElement() // Colar no canvas
            }
          } else {
            pasteElement() // Colar no canvas
          }
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedElement, undo, redo, tabs.length, activeTabId])

  // Funções de gerenciamento de tabs
  const updateActiveTab = (updates: Partial<WorkspaceTab>) => {
    setTabs((prevTabs) => prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, ...updates } : tab)))
  }

  const createNewTab = () => {
    const newTabId = Date.now().toString()
    const newTab: WorkspaceTab = {
      id: newTabId,
      name: `Workspace ${tabs.length + 1}`,
      elements: [],
      canvasProperties: {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        width: "400px",
        height: "300px",
        borderRadius: "auto",
        borderRadiusTop: "auto",
        borderRadiusRight: "auto",
        borderRadiusBottom: "auto",
        borderRadiusLeft: "auto",
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
    }
    setTabs((prevTabs) => [...prevTabs, newTab])
    setActiveTabId(newTabId)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return // Não permitir fechar a última tab
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

  const setSelectedElement = (elementId: string | null) => {
    updateActiveTab({ selectedElement: elementId })
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

  const setElements = (newElements: ElementData[] | ((prev: ElementData[]) => ElementData[])) => {
    const updatedElements = typeof newElements === "function" ? newElements(elements) : newElements
    updateActiveTab({ elements: updatedElements })
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
      case "se": // Southeast
        newWidth = Math.max(20, currentWidth + deltaX)
        newHeight = Math.max(20, currentHeight + deltaY)
        break
      case "sw": // Southwest
        newWidth = Math.max(20, currentWidth - deltaX)
        newHeight = Math.max(20, currentHeight + deltaY)
        break
      case "ne": // Northeast
        newWidth = Math.max(20, currentWidth + deltaX)
        newHeight = Math.max(20, currentHeight - deltaY)
        break
      case "nw": // Northwest
        newWidth = Math.max(20, currentWidth - deltaX)
        newHeight = Math.max(20, currentHeight - deltaY)
        break
      case "e": // East
        newWidth = Math.max(20, currentWidth + deltaX)
        break
      case "w": // West
        newWidth = Math.max(20, currentWidth - deltaX)
        break
      case "n": // North
        newHeight = Math.max(20, currentHeight - deltaY)
        break
      case "s": // South
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
    const removeElement = (elements: ElementData[]): ElementData[] => {
      return elements.filter((element) => {
        if (element.id === elementId) {
          return false
        }
        if (element.children) {
          element.children = removeElement(element.children)
        }
        return true
      })
    }

    setElements(removeElement(elements))
    setSelectedElement(null)
    saveToHistory()
  }

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
    updateActiveTab({ isModified: true })
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
    updateActiveTab({ isModified: true })
  }

  const setCanvasProperties = (newProps: CanvasProperties | ((prev: CanvasProperties) => CanvasProperties)) => {
    const updatedProps = typeof newProps === "function" ? newProps(canvasProperties) : newProps
    updateActiveTab({ canvasProperties: updatedProps })
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

  const selectedElementData =
    selectedElement && selectedElement !== "canvas" ? findElement(elements, selectedElement) : null

  const renderElement = (element: ElementData): React.ReactNode => {
    const Component = ElementComponents[element.type]
    const isSelected = selectedElement === element.id

    return (
      <Component
        key={element.id}
        element={element}
        selected={isSelected}
        onClick={(e: React.MouseEvent) => handleElementClick(element.id, e)}
        onDrop={(e: React.DragEvent) => handleDrop(e, element.id)}
        onDragOver={handleDragOver}
        onResize={(direction: string, deltaX: number, deltaY: number) =>
          handleResize(element.id, direction, deltaX, deltaY)
        }
      >
        {element.children?.map((child) => renderElement(child))}
      </Component>
    )
  }

  const toggleHide = (elementId: string) => {

    const toggleElement = (elements: ElementData[]): ElementData[] => {
      return elements.map((element) => {
        if (element.id === elementId) {
          return {
            ...element,
            hidden: !element.hidden
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

  const renderElementTree = (element: ElementData, depth = 0): React.ReactNode => {
    const isSelected = selectedElement === element.id
    const ElementIcon = getElementIcon(element.type)
    const indentStyle = { paddingLeft: `${depth * 16}px` }

    return (
      <div key={element.id} className="space-y-1">
        <div className="space-y-1 relative line flex justify-between items-center cursor-pointer">
          <div>
            <Button variant={'link'}
              onClick={() => {
                toggleHide(element.id);
              }}

              size={'icon'}>
              {
                !element.hidden ? <Eye /> : <EyeOff />
              }
            </Button>
          </div>
          <div
            className={`h-full w-full flex items-center justify-between py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-blue-100 text-blue-700" : ""
              }`}
            style={indentStyle}
            onClick={() => setSelectedElement(element.id)}
            draggable
            onDragStart={() => handleTreeDragStart(element.id)}
            onDrop={(e) => {
              e.stopPropagation()
              if (draggedTreeElement && draggedTreeElement !== element.id) {
                handleDrop(e, element.id)
              }
            }}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center">
              {
                element.type === 'icon'
                  ? (() => {
                    const IconComponent =
                      availableIcons[element.properties.iconName as keyof typeof availableIcons] || Star
                    return <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                  })()
                  : <ElementIcon className="w-4 h-4 mr-2 text-gray-500" />
              }
              <span className="text-sm truncate">
                {
                  (() => {
                    let text =
                      element.type === 'text' && element.properties.content
                        ? element.properties.content
                        : element.name || `New ${element.type.charAt(0).toUpperCase() + element.type.slice(1)}`
                    return text.length > 15 ? text.slice(0, 15) + '...' : text
                  })()
                }
              </span>
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    copyElement(element.id)
                  }}
                >
                  Copy (Ctrl+C)
                </DropdownMenuItem>
                {copiedElement && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      if (element.type === "frame") {
                        pasteElement(element.id)
                      } else {
                        pasteElement()
                      }
                    }}
                  >
                    Paste Here (Ctrl+V)
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteElement(element.id)
                  }}
                  className="text-red-600"
                >
                  Delete (Del)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {element.children && element.children.length > 0 && (
          <div className="space-y-1 ">{element.children.map((child) => renderElementTree(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  const renderSpacingControl = (
    label: string,
    baseProperty: string,
    value: string,
    onChange: (value: string) => void,
  ) => {
    return (
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center space-x-2">
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-2 bg-transparent">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  const currentValue = value || "0"
                  updateElementProperty(selectedElement!, `${baseProperty}Top`, currentValue)
                  updateElementProperty(selectedElement!, `${baseProperty}Right`, currentValue)
                  updateElementProperty(selectedElement!, `${baseProperty}Bottom`, currentValue)
                  updateElementProperty(selectedElement!, `${baseProperty}Left`, currentValue)
                }}
              >
                Apply to all sides
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const currentValue = value || "0"
                  updateElementProperty(selectedElement!, `${baseProperty}Top`, currentValue)
                  updateElementProperty(selectedElement!, `${baseProperty}Bottom`, currentValue)
                }}
              >
                Apply to top & bottom
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const currentValue = value || "0"
                  updateElementProperty(selectedElement!, `${baseProperty}Left`, currentValue)
                  updateElementProperty(selectedElement!, `${baseProperty}Right`, currentValue)
                }}
              >
                Apply to left & right
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  const renderProperties = () => {
    if (selectedElement === "canvas") {
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Canvas Properties</Label>
          </div>
          <div>
            <Label htmlFor="canvasBgColor" className="text-sm font-medium">
              Background Color
            </Label>
            <Input
              type="color"
              id="canvasBgColor"
              className="h-10"
              value={canvasProperties.backgroundColor}
              onChange={(e) => updateCanvasProperty("backgroundColor", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="canvasBgImage" className="text-sm font-medium">
              Background Image URL
            </Label>
            <Input
              id="canvasBgImage"
              value={canvasProperties.backgroundImage}
              onChange={(e) => updateCanvasProperty("backgroundImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="canvasWidth" className="text-sm font-medium">
                Width
              </Label>
              <Input
                id="canvasWidth"
                value={canvasProperties.width}
                onChange={(e) => updateCanvasProperty("width", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="canvasHeight" className="text-sm font-medium">
                Height
              </Label>
              <Input
                id="canvasHeight"
                value={canvasProperties.height}
                onChange={(e) => updateCanvasProperty("height", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="canvasBorderRadius" className="text-sm font-medium">
              Border Radius
            </Label>
            <Input
              id="canvasBorderRadius"
              value={canvasProperties.borderRadius}
              onChange={(e) => updateCanvasProperty("borderRadius", e.target.value)}
              placeholder="12px"
            />
          </div>
          <div>
            <Label htmlFor="canvasPadding" className="text-sm font-medium">
              Padding
            </Label>
            <Input
              id="canvasPadding"
              value={canvasProperties.padding}
              onChange={(e) => updateCanvasProperty("padding", e.target.value)}
              placeholder="12px"
            />
          </div>
        </div>
      )
    }

    if (!selectedElementData) {
      return <div className="text-center text-gray-500 text-sm">Select an element or canvas to edit properties</div>
    }

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center gap-4">
          <Label className="text-sm font-medium">Element:</Label>
          <Label className="text-sm font-medium">{selectedElementData.name}</Label>
        </div>
        <div className="grid grid-cols-[1fr_2fr] items-center relative">
          <Label className="text-sm font-medium">Variavel:</Label>
          <Input
            id="variavelContent"
            value={(selectedElementData as TextElement).variavel || ""}
            onChange={(e) => updateElementVariavel(selectedElement!, e.target.value)}
            placeholder="Variavel"
          />
          <Asterisk className="absolute right-2" size={13} />
        </div>
        {/* Propriedades específicas por tipo */}
        {selectedElementData.type === "text" && (
          <>
            <Separator />
            <Label className="text-md font-bold">Context</Label>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="textContent" className="text-sm font-medium">
                Content
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="textContent"
                  value={(selectedElementData as TextElement).properties.content}
                  onChange={(e) => updateElementProperty(selectedElement!, "content", e.target.value)}
                  placeholder="Enter text content"
                />
                {/* <TextFormatDialog
                selectedIcon={(selectedElementData as TextElement).properties}
                onIconSelect={(iconName) => updateElementProperty(selectedElement!, "iconName", iconName)}
              >
                <Button variant="outline" size="icon">
                  <Type />
                </Button>
              </TextFormatDialog> */}
              </div>
            </div>
          </>
        )}

        {selectedElementData.type === "text" && (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="fontSize" className="text-sm font-medium">
                Font Size
              </Label>
              <Input
                id="fontSize"
                value={(selectedElementData as TextElement).properties.fontSize}
                onChange={(e) => updateElementProperty(selectedElement!, "fontSize", e.target.value)}
                placeholder="14px"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="fontWeight" className="text-sm font-medium">
                Font Weight
              </Label>
              <div className="">
                <Select
                  value={(selectedElementData as TextElement).properties.fontWeight}
                  onValueChange={(value) => updateElementProperty(selectedElement!, "fontWeight", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-ful">
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="lighter">Lighter</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="400">400</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="600">600</SelectItem>
                    <SelectItem value="700">700</SelectItem>
                    <SelectItem value="800">800</SelectItem>
                    <SelectItem value="900">900</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="textAlign" className="text-sm font-medium">
                Text Align
              </Label>
              <Select
                value={(selectedElementData as TextElement).properties.textAlign}
                onValueChange={(value) => updateElementProperty(selectedElement!, "textAlign", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedElementData.type === "image" && (
          <div className="space-y-3">
            <Separator />
            <Label className="text-md font-bold">Data</Label>

            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="imageFile" className="text-sm font-medium">
                Image URL
              </Label>
              <Input
                id="imageFile"
                value={(selectedElementData as ImageElement).properties.file}
                onChange={(e) => updateElementProperty(selectedElement!, "file", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="imageUpload" className="text-sm font-medium">
                Upload Image
              </Label>
              <Input
                ref={fileInputRef}
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="objectFit" className="text-sm font-medium">
                Object Fit
              </Label>
              <Select
                value={(selectedElementData as ImageElement).properties.objectFit}
                onValueChange={(value) => updateElementProperty(selectedElement!, "objectFit", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="scale-down">Scale Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedElementData.type === "icon" && (
          <div className="space-y-3">
            <Separator />
            <Label className="text-md font-bold">Component</Label>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label className="text-sm font-medium">Icon</Label>
              <IconPickerDialog
                selectedIcon={(selectedElementData as IconElement).properties.iconName}
                onIconSelect={(iconName) => updateElementProperty(selectedElement!, "iconName", iconName)}
              >
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  {(() => {
                    const IconComponent =
                      availableIcons[
                      (selectedElementData as IconElement).properties.iconName as keyof typeof availableIcons
                      ] || Star
                    return (
                      <>
                        <IconComponent className="w-4 h-4 mr-2" />
                        {(selectedElementData as IconElement).properties.iconName}
                      </>
                    )
                  })()}
                </Button>
              </IconPickerDialog>
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="iconSize" className="text-sm font-medium">
                Icon Size
              </Label>
              <Input
                id="iconSize"
                value={(selectedElementData as IconElement).properties.size}
                onChange={(e) => updateElementProperty(selectedElement!, "size", e.target.value)}
                placeholder="24px"
              />
            </div>
          </div>
        )}


        <Separator />
        <Label className="text-md font-bold">Layout</Label>
        {/* Propriedades de posição */}
        <div className="grid grid-cols-[1fr_2fr]">
          <Label htmlFor="position" className="text-sm font-medium">
            Position
          </Label>
          <Select
            value={selectedElementData.properties.position}
            onValueChange={(value) => updateElementProperty(selectedElement!, "position", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="static">Static</SelectItem>
              <SelectItem value="relative">Relative</SelectItem>
              <SelectItem value="absolute">Absolute</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Propriedades de posicionamento (left, top, right, bottom) */}
        {selectedElementData.properties.position !== "static" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="left" className="text-sm font-medium">
                Left
              </Label>
              <Input
                id="left"
                value={selectedElementData.properties.left}
                onChange={(e) => updateElementProperty(selectedElement!, "left", e.target.value)}
                placeholder="auto"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="top" className="text-sm font-medium">
                Top
              </Label>
              <Input
                id="top"
                value={selectedElementData.properties.top}
                onChange={(e) => updateElementProperty(selectedElement!, "top", e.target.value)}
                placeholder="auto"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="right" className="text-sm font-medium">
                Right
              </Label>
              <Input
                id="right"
                value={selectedElementData.properties.right}
                onChange={(e) => updateElementProperty(selectedElement!, "right", e.target.value)}
                placeholder="auto"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="bottom" className="text-sm font-medium">
                Bottom
              </Label>
              <Input
                id="bottom"
                value={selectedElementData.properties.bottom}
                onChange={(e) => updateElementProperty(selectedElement!, "bottom", e.target.value)}
                placeholder="auto"
              />
            </div>
          </div>
        )}

        {/* Propriedades de Display */}
        {selectedElementData.type === "frame" && (

          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="display" className="text-sm font-medium">
              Display
            </Label>
            <Select
              value={selectedElementData.properties.display}
              onValueChange={(value) => updateElementProperty(selectedElement!, "display", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="inline-block">Inline Block</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Propriedades de layout para Frame */}
        {selectedElementData.type === "frame" && selectedElementData.properties.display === "flex" && (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="flexDirection" className="text-sm font-medium">
                Flex Direction
              </Label>
              <Select
                value={selectedElementData.properties.flexDirection}
                onValueChange={(value) => updateElementProperty(selectedElement!, "flexDirection", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="justifyContent" className="text-sm font-medium">
                Justify Content
              </Label>
              <Select
                value={selectedElementData.properties.justifyContent}
                onValueChange={(value) => updateElementProperty(selectedElement!, "justifyContent", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Flex Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">Flex End</SelectItem>
                  <SelectItem value="space-between">Space Between</SelectItem>
                  <SelectItem value="space-around">Space Around</SelectItem>
                  <SelectItem value="space-evenly">Space Evenly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="alignItems" className="text-sm font-medium">
                Align Items
              </Label>
              <Select
                value={selectedElementData.properties.alignItems}
                onValueChange={(value) => updateElementProperty(selectedElement!, "alignItems", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="flex-start">Flex Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">Flex End</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="flexWrap" className="text-sm font-medium">
                Flex Wrap
              </Label>
              <Select
                value={selectedElementData.properties.flexWrap}
                onValueChange={(value) => updateElementProperty(selectedElement!, "flexWrap", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nowrap">No Wrap</SelectItem>
                  <SelectItem value="wrap">Wrap</SelectItem>
                  <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="gap" className="text-sm font-medium">
                Gap
              </Label>
              <Input
                id="gap"
                value={selectedElementData.properties.gap}
                onChange={(e) => updateElementProperty(selectedElement!, "gap", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        )}

        {/* Propriedades de layout para Grid */}
        {selectedElementData.type === "frame" && selectedElementData.properties.display === "grid" && (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="gridTemplateColumns" className="text-sm font-medium">
                Grid Template Columns
              </Label>
              <Input
                id="gridTemplateColumns"
                value={selectedElementData.properties.gridTemplateColumns}
                onChange={(e) => updateElementProperty(selectedElement!, "gridTemplateColumns", e.target.value)}
                placeholder="1fr 1fr"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="gridTemplateRows" className="text-sm font-medium">
                Grid Template Rows
              </Label>
              <Input
                id="gridTemplateRows"
                value={selectedElementData.properties.gridTemplateRows}
                onChange={(e) => updateElementProperty(selectedElement!, "gridTemplateRows", e.target.value)}
                placeholder="auto"
              />
            </div>
            <div className="grid grid-cols-[1fr_2fr]">
              <Label htmlFor="gridGap" className="text-sm font-medium">
                Grid Gap
              </Label>
              <Input
                id="gridGap"
                value={selectedElementData.properties.gridGap}
                onChange={(e) => updateElementProperty(selectedElement!, "gridGap", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        )}

        <Separator />
        <Label className="text-md font-bold">Colors</Label>

        {/* Propriedades de cor */}
        {(selectedElementData.type === "text" || selectedElementData.type === "icon") && (
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="textColor" className="text-sm font-medium">
              Color
            </Label>
            <Input
              type="color"
              id="textColor"
              className="h-10"
              value={selectedElementData.properties.color}
              onChange={(e) => updateElementProperty(selectedElement!, "color", e.target.value)}
            />
          </div>
        )}

        {/* Background Color */}
        {selectedElementData.type !== "image" && (
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="bgColor" className="text-sm font-medium">
              Background
            </Label>
            <Input
              type="color"
              id="bgColor"
              className="h-10"
              value={
                selectedElementData.properties.backgroundColor === "transparent"
                  ? "#ffffff"
                  : selectedElementData.properties.backgroundColor
              }
              onChange={(e) => updateElementProperty(selectedElement!, "backgroundColor", e.target.value)}
            />
          </div>
        )}

        <Separator />
        <Label className="text-md font-bold">Sizes</Label>
        {/* Tamanho */}
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="width" className="text-sm font-medium">
              Width
            </Label>
            <Input
              id="width"
              value={selectedElementData.properties.width}
              onChange={(e) => updateElementProperty(selectedElement!, "width", e.target.value)}
              placeholder="auto"
            />
          </div>
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="height" className="text-sm font-medium">
              Height
            </Label>
            <Input
              id="height"
              value={selectedElementData.properties.height}
              onChange={(e) => updateElementProperty(selectedElement!, "height", e.target.value)}
              placeholder="auto"
            />
          </div>
        </div>

        {/* Min/Max Size */}
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="minWidth" className="text-[8pt] font-medium">
              Min Width
            </Label>
            <Input
              id="minWidth"
              value={selectedElementData.properties.minWidth}
              onChange={(e) => updateElementProperty(selectedElement!, "minWidth", e.target.value)}
              placeholder="auto"
            />
          </div>
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="minHeight" className="text-[8pt] font-medium">
              Min Height
            </Label>
            <Input
              id="minHeight"
              value={selectedElementData.properties.minHeight}
              onChange={(e) => updateElementProperty(selectedElement!, "minHeight", e.target.value)}
              placeholder="auto"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="maxWidth" className="text-[8pt] font-medium">
              Max Width
            </Label>
            <Input
              id="maxWidth"
              value={selectedElementData.properties.maxWidth}
              onChange={(e) => updateElementProperty(selectedElement!, "maxWidth", e.target.value)}
              placeholder="none"
            />
          </div>
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="maxHeight" className="text-[8pt] font-medium">
              Max Height
            </Label>
            <Input
              id="maxHeight"
              value={selectedElementData.properties.maxHeight}
              onChange={(e) => updateElementProperty(selectedElement!, "maxHeight", e.target.value)}
              placeholder="none"
            />
          </div>
        </div>

        <Separator />
        <Label className="text-md font-bold">Lines</Label>

        {/* Border Radius com dropdown */}
        {renderSpacingControl("Border Radius", "borderRadius", selectedElementData.properties.borderRadius, (value) =>
          updateElementProperty(selectedElement!, "borderRadius", value),
        )}

        {/* Border */}
        <div className="grid grid-cols-[1fr_2fr]">
          <Label htmlFor="border" className="text-sm font-medium">
            Border
          </Label>
          <Input
            id="border"
            value={selectedElementData.properties.border}
            onChange={(e) => updateElementProperty(selectedElement!, "border", e.target.value)}
            placeholder="1px solid #000"
          />
        </div>

        {/* Box Shadow */}
        <div className="grid grid-cols-[1fr_2fr]">
          <Label htmlFor="boxShadow" className="text-sm font-medium">
            Box Shadow
          </Label>
          <Input
            id="boxShadow"
            value={selectedElementData.properties.boxShadow}
            onChange={(e) => updateElementProperty(selectedElement!, "boxShadow", e.target.value)}
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
          />
        </div>

        {/* Opacity */}
        <div className="grid grid-cols-[1fr_2fr]">
          <Label htmlFor="opacity" className="text-sm font-medium">
            Opacity
          </Label>
          <Input
            id="opacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedElementData.properties.opacity}
            onChange={(e) => updateElementProperty(selectedElement!, "opacity", e.target.value)}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">{selectedElementData.properties.opacity}</div>
        </div>

        {/* Z-Index */}
        <div className="grid grid-cols-[1fr_2fr]">
          <Label htmlFor="zIndex" className="text-sm font-medium">
            Z-Index
          </Label>
          <Input
            id="zIndex"
            value={selectedElementData.properties.zIndex}
            onChange={(e) => updateElementProperty(selectedElement!, "zIndex", e.target.value)}
            placeholder="auto"
          />
        </div>

        {/* Overflow (apenas para frame) */}
        {selectedElementData.type === "frame" && (
          <div className="grid grid-cols-[1fr_2fr]">
            <Label htmlFor="overflow" className="text-sm font-medium">
              Overflow
            </Label>
            <Select
              value={selectedElementData.properties.overflow}
              onValueChange={(value) => updateElementProperty(selectedElement!, "overflow", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="scroll">Scroll</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Separator />
        <Label className="text-md font-bold">Spacing</Label>

        {/* Margin com dropdown */}
        {renderSpacingControl("Margin", "margin", selectedElementData.properties.margin, (value) =>
          updateElementProperty(selectedElement!, "margin", value),
        )}

        {/* Padding com dropdown */}
        {renderSpacingControl("Padding", "padding", selectedElementData.properties.padding, (value) =>
          updateElementProperty(selectedElement!, "padding", value),
        )}
        <div className="mb-10" />
      </div>
    )
  }

  const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onTabSelect, onTabClose, onTabAdd, onTabRename }) => {
    const [editingTabId, setEditingTabId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState("")

    const handleTabDoubleClick = (tab: WorkspaceTab) => {
      setEditingTabId(tab.id)
      setEditingName(tab.name)
    }

    const handleNameSubmit = () => {
      if (editingTabId && editingName.trim()) {
        onTabRename(editingTabId, editingName.trim())
      }
      setEditingTabId(null)
      setEditingName("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNameSubmit()
      } else if (e.key === "Escape") {
        setEditingTabId(null)
        setEditingName("")
      }
    }

    return (
      <div className="flex items-center bg-gray-100 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-1 flex-1 overflow-x-auto">
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
            <Button
              variant="outline"
              size="sm"
              onClick={saveCRDFile}
              className="p-2 bg-transparent"
              title="Save as .crd file (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </Button>
            <input ref={loadFileInputRef} type="file" accept=".crd" onChange={loadCRDFile} className="hidden" />
          </div>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-3 py-1.5 rounded cursor-pointer transition-colors min-w-0 ${tab.id === activeTabId
                ? "bg-white border border-gray-200 text-blue-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              onClick={() => onTabSelect(tab.id)}
              onDoubleClick={() => handleTabDoubleClick(tab)}
            >
              {editingTabId === tab.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleNameSubmit}
                  onKeyDown={handleKeyDown}
                  className="h-6 px-1 py-0 text-xs border-none bg-transparent focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <>
                  <span className="text-sm truncate max-w-32">
                    {tab.name}
                    {tab.isModified && <span className="text-orange-500 ml-1">•</span>}
                  </span>
                  {tabs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-gray-400 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTabClose(tab.id)
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onTabAdd}
          className="ml-2 h-8 w-8 p-0 hover:bg-gray-300 rounded"
          title="New Workspace (Ctrl+T)"
        >
          <Plus className="w-4 h-4" />
        </Button>
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
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={switchTab}
        onTabClose={closeTab}
        onTabAdd={createNewTab}
        onTabRename={renameTab}
      />
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full bg-gray-50">
          {/* Lado esquerdo - Tools */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={15}>
            <div className="p-4 h-full">
              <h3 className="text-sm font-semibold mb-3 text-gray-800">Element Tree</h3>
              <div className="overflow-auto h-[calc(100%-40px)]">
                <div className="space-y-1">
                  {/* Canvas root */}
                  <div
                    className={`flex items-center justify-between py-2 px-2 rounded cursor-pointer hover:bg-gray-100 ${selectedElement === "canvas" ? "bg-blue-100 text-blue-700" : ""
                      }`}
                    onClick={() => setSelectedElement("canvas")}
                    onDrop={(e) => {
                      e.stopPropagation()
                      if (draggedTreeElement) {
                        handleDrop(e, "canvas")
                      }
                    }}
                    onDragOver={handleDragOver}
                  >
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">Canvas</span>
                    </div>
                  </div>
                  {/* Elements tree */}
                  {elements.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-4 ml-6">No elements added</div>
                  ) : (
                    <div className="ml-2 space-y-1">
                      {elements.map((element) => renderElementTree(element, 1))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-full bg-white border-r border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                {copiedElement && (
                  <div className="text-xs absolute bottom-4 text-blue-600 bg-blue-50 px-2 py-1 rounded border">
                    {copiedElement.name} copied
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Centro - Folha de edição (Cartão) */}
          <ResizablePanel defaultSize={65} minSize={30}>
            <div className="space-y-2 flex flex-col absolute m-4">
              {availableElements.map((element) => {
                const IconComponent = element.icon
                return (
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    key={element.type}
                    draggable
                    onDragStart={() => handleDragStart(element.type)}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <IconComponent className="w-5 h-5 text-gray-600 " />
                      </TooltipTrigger>
                      <TooltipContent>
                        {element.name}
                      </TooltipContent>
                    </Tooltip>
                  </Button>
                )
              })}
            </div>
            <div className="h-full p-8 flex items-center justify-center bg-gray-50">
              <div
                ref={canvasRef}
                className={`shadow-lg border  border-gray-300 hover:border-blue-300 transition-colors overflow-visible ${selectedElement === "canvas" ? "ring-2 ring-blue-400" : ""
                  }`}
                style={canvasStyle}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
                onClick={handleCanvasClick}
              >
                {elements.length === 0 ? (
                  <div className="h-full flex w-full items-center justify-center text-gray-400 text-sm pointer-events-none select-none">
                    {canvasProperties.width} x {canvasProperties.height}
                  </div>
                ) : (
                  elements.map((element) => renderElement(element))
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Lado direito - Painel de controle */}
          <ResizablePanel defaultSize={20} minSize={10} maxSize={20}>
            <div className="h-full bg-white border-l border-gray-200 flex flex-col">
              <ResizablePanelGroup direction="vertical">
                {/* Parte superior - Properties/Style */}
                <ResizablePanel defaultSize={60} minSize={40}>
                  <div className="border-b border-gray-200 h-full">
                    <Tabs defaultValue="properties" className="h-full">
                      <TabsList className="w-full grid-cols-2 h-[50px] p-0 shadow-none rounded-none bg-transparent border-b">
                        <TabsTrigger className="rounded-none border-none" value="properties"><SlidersHorizontal /> Properties</TabsTrigger>
                        <TabsTrigger className="rounded-none border-none" value="style"><Braces /> Style</TabsTrigger>
                      </TabsList>
                      <TabsContent value="properties" className="px-4 space-y-4 overflow-auto max-h-[calc(100%-50px)]">
                        {renderProperties()}
                      </TabsContent>
                      <TabsContent value="style" className="mt-4 overflow-auto max-h-[calc(100%-50px)]">
                        {selectedElementData ? (
                          <div>
                            <Label htmlFor="customStyle" className="text-sm font-medium">
                              Custom CSS/Tailwind
                            </Label>
                            <Textarea
                              id="customStyle"
                              placeholder="Enter Tailwind classes or custom CSS..."
                              className="mt-2 h-32 resize-none"
                              value={selectedElementData.properties.customStyle}
                              onChange={(e) => updateElementProperty(selectedElement!, "customStyle", e.target.value)}
                            />
                          </div>
                        ) : selectedElement === "canvas" ? (
                          <div className="text-center text-gray-500 text-sm">
                            Canvas doesn't have custom style properties
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 text-sm">Select an element to edit style</div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
