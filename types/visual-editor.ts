
import { icons } from "lucide-react"

// Tipos para os elementos
export type ElementType = "frame" | "text" | "image" | "icon"

export interface CanvasProperties {
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

export interface BaseElementData {
  id: string
  type: ElementType
  name: string
  variavel: string
  hidden: boolean
  children?: BaseElementData[]
}

export interface FrameElement extends BaseElementData {
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

export interface TextElement extends BaseElementData {
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

export interface ImageElement extends BaseElementData {
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

export interface IconElement extends BaseElementData {
  type: "icon"
  properties: {
    iconName: keyof typeof icons
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

export type ElementData = FrameElement | TextElement | ImageElement | IconElement

export interface HistoryState {
  elements: ElementData[]
  canvasProperties: CanvasProperties
  selectedElement: string | null
}

export interface CRDFile {
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

export interface WorkspaceTab {
  id: string
  name: string
  elements: ElementData[]
  canvasProperties: CanvasProperties
  selectedElement: string | null
  history: HistoryState[]
  historyIndex: number
  isModified: boolean
}
