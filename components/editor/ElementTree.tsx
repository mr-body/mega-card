
import React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Barcode, Eye, EyeOff, ImageIcon, MoreVertical, QrCode, Square, Star, Type } from "lucide-react"
import { ElementData } from "@/types/visual-editor"
import { availableIcons } from "@/lib/editor-config"

interface ElementTreeProps {
  elements: ElementData[]
  selectedElement: string | null
  setSelectedElement: (id: string | null) => void
  toggleHide: (id: string) => void
  handleTreeDragStart: (id: string) => void
  handleDrop: (e: React.DragEvent, parentId: string) => void
  handleDragOver: (e: React.DragEvent) => void
  copyElement: (id: string) => void
  pasteElement: (parentId?: string) => void
  deleteElement: (id: string) => void
  copiedElement: ElementData | null
}

const getElementIcon = (type: ElementData["type"]) => {
  switch (type) {
    case "frame":
      return Square
    case "text":
      return Type
    case "image":
      return ImageIcon
    case "icon":
      return Star
    case "QRcode":
      return QrCode
    case "barcode":
      return Barcode
    default:
      return Square
  }
}

export const ElementTree: React.FC<ElementTreeProps> = ({
  elements,
  selectedElement,
  setSelectedElement,
  toggleHide,
  handleTreeDragStart,
  handleDrop,
  handleDragOver,
  copyElement,
  pasteElement,
  deleteElement,
  copiedElement,
}) => {
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
                !element.hidden ?  <EyeOff /> : <Eye />
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
              if (draggedTreeElement && draggedTreeElement !== element.id as any) {
                handleDrop(e, element.id)
              }
            }}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center px-4">
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
          <div className="space-y-1 ">{element.children.map((child) => renderElementTree(child as any, depth + 1))}</div>
        )}
      </div>
    )
  }

  return <>{elements.map((element) => renderElementTree(element))}</>
}

export function draggedTreeElement(draggedTreeElement: any, arg1: string, id: any) {
  throw new Error("Function not implemented.")
}
