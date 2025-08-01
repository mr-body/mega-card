
import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconPickerDialog } from "@/components/editor/icon-picker-dialog copy"
import { availableIcons } from "@/lib/editor-config"
import { CanvasProperties, ElementData, TextElement, ImageElement, IconElement } from "@/types/visual-editor"
import { Asterisk, MoreVertical, Star, Type } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface PropertiesPanelProps {
  selectedElement: string | null
  selectedElementData: ElementData | null
  canvasProperties: CanvasProperties
  updateCanvasProperty: (property: string, value: string) => void
  updateElementProperty: (elementId: string, property: string, value: string) => void
  updateElementVariavel: (elementId: string, value: string) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  selectedElementData,
  canvasProperties,
  updateCanvasProperty,
  updateElementProperty,
  updateElementVariavel,
  fileInputRef,
  handleFileUpload,
}) => {
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
