"use client"

import React, { useRef, useState } from "react"
import { Star } from "lucide-react"
import { availableIcons } from "@/components/editor/icon-picker-dialog copy"

export default function PreviewPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [elements, setElements] = useState<ElementData[]>([])
  const [canvasProperties, setCanvasProperties] = useState<Record<string, any>>({})

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as CRDFile
        setCanvasProperties(json.canvas)
        setElements(json.elements)
      } catch (err) {
        alert("Erro ao carregar o arquivo .crd")
      }
    }
    reader.readAsText(file)
  }

  const resolveStyle = (props: Record<string, any>): React.CSSProperties => ({
    position: props.position === "static" ? "static" : props.position,
    left: props.left !== "auto" ? props.left : undefined,
    top: props.top !== "auto" ? props.top : undefined,
    right: props.right !== "auto" ? props.right : undefined,
    bottom: props.bottom !== "auto" ? props.bottom : undefined,

    width: props.width,
    height: props.height,
    minWidth: props.minWidth,
    minHeight: props.minHeight,
    maxWidth: props.maxWidth,
    maxHeight: props.maxHeight,

    margin: props.margin,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,

    padding: props.padding,
    paddingTop: props.paddingTop,
    paddingRight: props.paddingRight,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,

    borderRadius: props.borderRadius,
    borderTopLeftRadius: props.borderRadiusTop,
    borderTopRightRadius: props.borderRadiusRight,
    borderBottomRightRadius: props.borderRadiusBottom,
    borderBottomLeftRadius: props.borderRadiusLeft,

    border: props.border,
    backgroundColor: props.backgroundColor || "transparent",
    backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",

    display: props.display,
    flexDirection: props.flexDirection,
    flexWrap: props.flexWrap,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    flexGrow: props.flexGrow,
    flexShrink: props.flexShrink,

    gridTemplateColumns: props.gridTemplateColumns,
    gridTemplateRows: props.gridTemplateRows,
    gridGap: props.gridGap,
    gridColumn: props.gridColumn,
    gridRow: props.gridRow,
    gap: props.gap,

    fontSize: props.fontSize,
    color: props.color,
    opacity: props.opacity,
    zIndex: props.zIndex,
    overflow: props.overflow,
  })

  const renderElement = (el: ElementData) => {
    if (el.hidden === false) return null
    const style = resolveStyle(el.properties)

    switch (el.type) {
      case "text":
        return (
          <div key={el.id} style={style}>
            {el.properties.content}
          </div>
        )
      case "image":
        return (
          <img
            key={el.id}
            src={el.properties.fileData || el.properties.file}
            alt="image"
            style={{ ...style, objectFit: el.properties.objectFit || "cover" }}
          />
        )
      case "icon":
        const Icon = availableIcons[el.properties.iconName as keyof typeof availableIcons] || Star
        return (
          <div key={el.id} style={style}>
            <Icon style={{ width: el.properties.size || "24px", height: el.properties.size || "24px" }} />
          </div>
        )
      case "frame":
        return (
          <div key={el.id} style={style}>
            {el.children?.map(renderElement)}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-2xl font-semibold">Preview do Cartão .CRD</h1>

      <input type="file" ref={fileInputRef} accept=".crd" onChange={handleFileChange} className="mb-4" />

      <div className="relative border border-gray-300 shadow-md" style={resolveStyle(canvasProperties)}>
        {elements.map(renderElement)}
      </div>
    </div>
  )
}
