"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import * as XLSX from "xlsx"
import { HotTable } from "@handsontable/react"
import { registerAllModules } from "handsontable/registry"
import "handsontable/dist/handsontable.full.min.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Upload, Eye, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Register Handsontable modules
registerAllModules()

interface SheetInfo {
  name: string
  data: any[][]
  range: string
  rowCount: number
  colCount: number
}

export default function ExcelReader() {
  const [file, setFile] = useState<File | null>(null)
  const [sheets, setSheets] = useState<SheetInfo[]>([])
  const [selectedSheet, setSelectedSheet] = useState<SheetInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const hotTableRef = useRef<any>(null)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      processExcelFile(uploadedFile)
    }
  }, [])

  const processExcelFile = async (file: File) => {
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })

      const sheetsInfo: SheetInfo[] = workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" })
        const range = worksheet["!ref"] || "A1"

        return {
          name: sheetName,
          data: jsonData as any[][],
          range,
          rowCount: jsonData.length,
          colCount: jsonData[0]?.length || 0,
        }
      })

      setSheets(sheetsInfo)
      setSelectedSheet(null)
    } catch (error) {
      console.error("Erro ao processar arquivo Excel:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectSheet = (sheet: SheetInfo) => {
    setSelectedSheet(sheet)
    setSearchTerm("")
  }

  const resetReader = () => {
    setFile(null)
    setSheets([])
    setSelectedSheet(null)
    setSearchTerm("")
  }

  const exportToCSV = () => {
    if (selectedSheet && hotTableRef.current) {
      const hot = hotTableRef.current.hotInstance
      const exportPlugin = hot.getPlugin("exportFile")
      exportPlugin.downloadFile("csv", {
        filename: `${selectedSheet.name}_export`,
        columnHeaders: true,
        rowHeaders: true,
      })
    }
  }

  const searchInTable = () => {
    if (hotTableRef.current && searchTerm) {
      const hot = hotTableRef.current.hotInstance
      const search = hot.getPlugin("search")
      search.query(searchTerm)
    }
  }

  const clearSearch = () => {
    if (hotTableRef.current) {
      const hot = hotTableRef.current.hotInstance
      const search = hot.getPlugin("search")
      search.query("")
      setSearchTerm("")
    }
  }

  useEffect(() => {
    if (searchTerm === "") {
      clearSearch()
    }
  }, [searchTerm])

  const handsontableSettings = {
    data: selectedSheet?.data || [],
    rowHeaders: true,
    colHeaders: true,
    width: "100%",
    height: 600,
    licenseKey: "non-commercial-and-evaluation",
    readOnly: false,
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    manualColumnMove: true,
    manualRowMove: true,
    columnSorting: true,
    filters: true,
    dropdownMenu: true,
    hiddenColumns: {
      indicators: true,
    },
    hiddenRows: {
      indicators: true,
    },
    search: {
      searchResultClass: "search-result-cell",
    },
    cells: (row: number, col: number) => {
      const cellProperties: any = {}

      // Highlight empty cells
      if (!selectedSheet?.data[row]?.[col] || selectedSheet?.data[row]?.[col] === "") {
        cellProperties.className = "empty-cell"
      }

      return cellProperties
    },
  }

  return (
    <div className="container mx-auto p-6 max-w-full">
      <style jsx global>{`
        .search-result-cell {
          background-color: #ffeb3b !important;
          color: #000 !important;
        }
        .empty-cell {
          background-color: #f5f5f5 !important;
        }
        .handsontable .htCore {
          border: 1px solid #e2e8f0;
        }
        .handsontable .ht_master .wtHolder {
          border-radius: 6px;
        }
      `}</style>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leitor de Planilhas Excel</h1>
        <p className="text-muted-foreground">
          Selecione um arquivo Excel para visualizar e editar todas as planilhas com Handsontable
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Arquivo
          </CardTitle>
          <CardDescription>Selecione um arquivo Excel (.xlsx, .xls) para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" id="excel-upload" />
            <label htmlFor="excel-upload">
              <Button asChild className="cursor-pointer">
                <span>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Selecionar Arquivo
                </span>
              </Button>
            </label>
            {file && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{file.name}</Badge>
                <Button variant="outline" size="sm" onClick={resetReader}>
                  Limpar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Processando arquivo...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sheets List */}
      {sheets.length > 0 && !selectedSheet && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Planilhas Disponíveis</CardTitle>
            <CardDescription>Clique em uma planilha para visualizar e editar seu conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sheets.map((sheet, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                  onClick={() => selectSheet(sheet)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      {sheet.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Linhas:</span>
                        <Badge variant="outline">{sheet.rowCount}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Colunas:</span>
                        <Badge variant="outline">{sheet.colCount}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Range:</span>
                        <Badge variant="outline">{sheet.range}</Badge>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sheet Data Display with Handsontable */}
      {selectedSheet && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  {selectedSheet.name}
                </CardTitle>
                <CardDescription>
                  {selectedSheet.rowCount} linhas × {selectedSheet.colCount} colunas
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Buscar nas células..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <Button size="sm" onClick={searchInTable} disabled={!searchTerm}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button variant="outline" onClick={() => setSelectedSheet(null)}>
                  Voltar às Planilhas
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <HotTable ref={hotTableRef} settings={handsontableSettings} />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Dicas:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Clique com o botão direito para acessar o menu contextual</li>
                <li>Use os filtros nos cabeçalhos das colunas para filtrar dados</li>
                <li>Arraste as bordas das colunas/linhas para redimensionar</li>
                <li>Clique nos cabeçalhos das colunas para ordenar</li>
                <li>Use a busca para destacar células com conteúdo específico</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {sheets.length === 0 && !loading && file && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Nenhuma planilha encontrada no arquivo selecionado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
