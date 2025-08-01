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