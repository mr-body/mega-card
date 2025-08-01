"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface SpacingControlProps {
  label: string
  baseProperty: string
  values: {
    all: string
    top: string
    right: string
    bottom: string
    left: string
  }
  onChange: (property: string, value: string) => void
  defaultValue?: string
}

export function SpacingControl({ label, baseProperty, values, onChange, defaultValue = "0" }: SpacingControlProps) {
  const [mode, setMode] = useState<"full" | "specific">("full")

  // Check if all sides have the same value to determine initial mode
  useEffect(() => {
    const { top, right, bottom, left } = values
    if (top === right && right === bottom && bottom === left && top !== "") {
      setMode("full")
    } else if (top || right || bottom || left) {
      setMode("specific")
    }
  }, [values])

  const handleModeChange = (newMode: "full" | "specific") => {
    if (!newMode) return
    setMode(newMode)

    if (newMode === "full") {
      // Use the current "all" value or the first non-empty specific value
      const allValue = values.all || values.top || values.right || values.bottom || values.left || defaultValue
      onChange(baseProperty, allValue)
      onChange(`${baseProperty}Top`, allValue)
      onChange(`${baseProperty}Right`, allValue)
      onChange(`${baseProperty}Bottom`, allValue)
      onChange(`${baseProperty}Left`, allValue)
    }
  }

  const handleFullValueChange = (value: string) => {
    onChange(baseProperty, value)
    onChange(`${baseProperty}Top`, value)
    onChange(`${baseProperty}Right`, value)
    onChange(`${baseProperty}Bottom`, value)
    onChange(`${baseProperty}Left`, value)
  }

  const handleReset = () => {
    onChange(baseProperty, defaultValue)
    onChange(`${baseProperty}Top`, defaultValue)
    onChange(`${baseProperty}Right`, defaultValue)
    onChange(`${baseProperty}Bottom`, defaultValue)
    onChange(`${baseProperty}Left`, defaultValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 w-6 p-0" title={`Reset ${label}`}>
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>

      <ToggleGroup type="single" value={mode} onValueChange={handleModeChange} className="justify-start">
        <ToggleGroupItem value="full" size="sm">
          Full
        </ToggleGroupItem>
        <ToggleGroupItem value="specific" size="sm">
          Specific
        </ToggleGroupItem>
      </ToggleGroup>

      {mode === "full" ? (
        <Input
          value={values.all || values.top || defaultValue}
          onChange={(e) => handleFullValueChange(e.target.value)}
          placeholder={defaultValue}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">Top</Label>
            <Input
              value={values.top || ""}
              onChange={(e) => onChange(`${baseProperty}Top`, e.target.value)}
              placeholder={defaultValue}
              size="sm"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Right</Label>
            <Input
              value={values.right || ""}
              onChange={(e) => onChange(`${baseProperty}Right`, e.target.value)}
              placeholder={defaultValue}
              size="sm"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Bottom</Label>
            <Input
              value={values.bottom || ""}
              onChange={(e) => onChange(`${baseProperty}Bottom`, e.target.value)}
              placeholder={defaultValue}
              size="sm"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Left</Label>
            <Input
              value={values.left || ""}
              onChange={(e) => onChange(`${baseProperty}Left`, e.target.value)}
              placeholder={defaultValue}
              size="sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}
