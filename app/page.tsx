"use client"
import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { useVisualEditor } from "@/hooks/use-visual-editor"
import { ElementTree } from "@/components/editor/ElementTree"
import { PropertiesPanel } from "@/components/editor/PropertiesPanel"
import { ElementRenderer } from "@/components/editor/ElementRenderer"
import { availableElements } from "@/lib/editor-config"
import { ElementData } from "@/types/visual-editor"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Braces, FolderOpen, Plus, Save, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VisualEditor() {
  const {
    tabs,
    activeTabId,
    elements,
    canvasProperties,
    selectedElement,
    selectedElementData,
    canvasRef,
    fileInputRef,
    loadFileInputRef,
    copiedElement,
    switchTab,
    closeTab,
    createNewTab,
    renameTab,
    saveCRDFile,
    loadCRDFile,
    handleCanvasClick,
    handleDragOver,
    handleDrop,
    handleDragStart,
    handleElementClick,
    handleResize,
    handleTreeDragStart,
    toggleHide,
    setSelectedElement,
    copyElement,
    pasteElement,
    deleteElement,
    updateCanvasProperty,
    updateElementProperty,
    updateElementVariavel,
    handleFileUpload,
  } = useVisualEditor()

  const renderElement = (element: ElementData): React.ReactNode => {
    const isSelected = selectedElement === element.id

    return (
      <ElementRenderer
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
      </ElementRenderer>
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
      <div className="flex items-center bg-gray-100 border-b border-gray-200 px h-[50px]-4 py-2">
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

  return (
    <div className="h-screen">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={switchTab}
        onTabClose={closeTab}
        onTabAdd={createNewTab}
        onTabRename={renameTab}
      />
      <ResizablePanelGroup direction="horizontal" className="w-full h-[100%-50px] bg-gray-50">
        <ResizablePanel defaultSize={15} className="bg-white min-w-[200px] border-r">
          <Tabs defaultValue="templates">
            <TabsList className="w-full grid-cols-2 h-[50px] p-0 shadow-none rounded-none bg-transparent border-b">
              <TabsTrigger className="rounded-none border-none" value="templates">Templates</TabsTrigger>
              <TabsTrigger className="rounded-none border-none" value="position">Camadas</TabsTrigger>
            </TabsList>
            <TabsContent value="templates">
              {/*  */}
            </TabsContent>
            <TabsContent value="position">
              <div className="mt-4 space-y-2">
                <ElementTree
                  elements={elements}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  toggleHide={toggleHide}
                  handleTreeDragStart={handleTreeDragStart}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  copyElement={copyElement}
                  pasteElement={pasteElement}
                  deleteElement={deleteElement}
                  copiedElement={copiedElement}
                />
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizablePanel defaultSize={65} >
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
              className="bg-white shadow-lg overflow-auto relative"
              style={canvasProperties}
              onClick={handleCanvasClick}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e)}
            >
              {elements.map((element) => renderElement(element))}
            </div>

          </div>
        </ResizablePanel>

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
                      <PropertiesPanel
                        selectedElement={selectedElement}
                        selectedElementData={selectedElementData}
                        canvasProperties={canvasProperties}
                        updateCanvasProperty={updateCanvasProperty}
                        updateElementProperty={updateElementProperty}
                        updateElementVariavel={updateElementVariavel}
                        fileInputRef={fileInputRef}
                        handleFileUpload={handleFileUpload}
                      />
                    </TabsContent>
                    <TabsContent value="style" className="mt-4 overflow-auto max-h-[calc(100%-50px)]">
                      {selectedElementData ? (
                        <div>
                          <Label className="text-sm font-medium">
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
  )
}