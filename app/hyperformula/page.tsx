"use client"
import { useState, useRef, useEffect } from "react"
import {
  AutoColumnSize,
  Autofill,
  ColumnSorting,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  Formulas,
  HiddenRows,
  ManualColumnResize,
  NestedHeaders,
  registerPlugin,
  UndoRedo,
} from "handsontable/plugins"
import HyperFormula from "hyperformula"
import { CheckboxCellType, NumericCellType, registerCellType } from "handsontable/cellTypes"
import { HotTable, HotColumn } from "@handsontable/react"
import "handsontable/styles/handsontable.min.css"
import "handsontable/styles/ht-theme-main.min.css"
import { data, Data } from "./data"

registerCellType(CheckboxCellType)
registerCellType(NumericCellType)
registerPlugin(AutoColumnSize)
registerPlugin(Autofill)
registerPlugin(ContextMenu)
registerPlugin(CopyPaste)
registerPlugin(DropdownMenu)
registerPlugin(Filters)
registerPlugin(HiddenRows)
registerPlugin(NestedHeaders)
registerPlugin(Formulas)
registerPlugin(ColumnSorting)
registerPlugin(ManualColumnResize)
registerPlugin(UndoRedo)

type GridProps = {
  data: Data
}

export default function Grid(props: GridProps) {
  const [isInfoExpanded, setIsInfoExpanded] = useState(true)
  const hotRef = useRef<any>(null)
  const [isHotInitialized, setIsHotInitialized] = useState(false)

  const toggleInfoColumns = () => {
    setIsInfoExpanded(prev => !prev)
  }

  useEffect(() => {
    if (isHotInitialized) {
      const hot = hotRef.current?.hotInstance
      if (!hot) return

      const hiddenColumns = hot.getPlugin('hiddenColumns')
      if (!hiddenColumns) return

      if (isInfoExpanded) {
        hiddenColumns.showColumns([1, 2])
      } else {
        hiddenColumns.hideColumns([1, 2])
      }

      hot.updateSettings({
        nestedHeaders: getNestedHeaders()
      })

      hot.render()
    }
  }, [isInfoExpanded, isHotInitialized])

  const getNestedHeaders = () => {
    const infoHeader = `Info ${isInfoExpanded ? "Details" : "Summary"}`
    const infoDHeader = `Info ${isInfoExpanded ? "Details" : "Summary"}`

    return [
      [
        {
          label: infoHeader,
          colspan: isInfoExpanded ? 3 : 1,
          className: "info-header-group",
        },
        {
          label: infoDHeader,
          colspan: isInfoExpanded ? 8 : 4,
          className: "info-header-group",
        },
      ],
      [
        "Company name",
        ...(isInfoExpanded ? ["Country", "Name"] : []),
        "Sell date",
        ...(isInfoExpanded ? ["Order ID", "In stock", "Qty", "Progress", "Rating"] : []),
      ],
    ]
  }

  const afterRender = () => {
    setIsHotInitialized(true)
    const infoHeaders = document.querySelectorAll(".info-header-group")
    infoHeaders.forEach((header) => {
      header.removeEventListener("click", toggleInfoColumns)
      header.addEventListener("click", toggleInfoColumns)
    })
  }

  return (
    <div className="ht-theme-main">
      <style jsx>{`
        .info-header-group {
          background-color: #f5f5f5 !important;
          font-weight: bold !important;
          cursor: pointer !important;
          user-select: none !important;
          border: 1px solid #ccc !important;
        }
        .info-header-group:hover {
          background-color: #e9e9e9 !important;
        }
      `}</style>
      <HotTable
        ref={hotRef}
        data={data}
        colWidths={[140, 126, 192, 100, 100, 90, 90, 110, 97]}
        nestedHeaders={getNestedHeaders()}
        dropdownMenu={true}
        contextMenu={true}
        filters={true}
        rowHeaders={true}
        manualRowMove={true}
        navigableHeaders={true}
        autoWrapRow={true}
        autoWrapCol={true}
        height={363}
        imeFastEdit={true}
        columnSorting={true}
        manualColumnResize={true}
        autoColumnSize={true}
        copyPaste={true}
        undo={true}
        licenseKey="non-commercial-and-evaluation"
        afterRender={afterRender}
        formulas={{
          engine: HyperFormula
        }}
        hiddenColumns={{
          columns: isInfoExpanded ? [] : [1, 2],
          indicators: false,
        }}
      >
        <HotColumn data={1} />
        {isInfoExpanded && <HotColumn data={2} />}
        {isInfoExpanded && <HotColumn data={3} />}
        <HotColumn data={5} />
        {isInfoExpanded && <HotColumn data={6} type="checkbox" className="htCenter" />}
        {isInfoExpanded && <HotColumn data={7} type="numeric" />}
        {isInfoExpanded && <HotColumn data={8} readOnly={true} className="htMiddle" />}
        {isInfoExpanded && <HotColumn data={9} readOnly={true} className="htCenter" />}
        {isInfoExpanded && <HotColumn data={10} readOnly={true} className="htCenter" />}
      </HotTable>
    </div>
  )
}