
import React from "react"
import { ElementData, FrameElement, TextElement, ImageElement, IconElement } from "@/types/visual-editor"
import { availableIcons } from "@/lib/editor-config"
import { ImageIcon, Star } from "lucide-react"

interface ElementRendererProps {
  element: ElementData
  selected: boolean
  onClick: (e: React.MouseEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onResize: (direction: string, deltaX: number, deltaY: number) => void
  children?: React.ReactNode
}

// Componentes reutilizáveis para cada elemento
export const ElementComponents = {
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

export const ElementRenderer: React.FC<ElementRendererProps> = (props) => {
  const Component = ElementComponents[props.element.type]
  return <Component {...props} />
}
