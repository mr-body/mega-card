"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2 } from "lucide-react"

interface ColorStop {
  color: string
  position: number
}

interface GradientPickerProps {
  value: string
  onChange: (gradient: string) => void
}

export function GradientPicker({ value, onChange }: GradientPickerProps) {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [angle, setAngle] = useState(90)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#ff0000", position: 0 },
    { color: "#0000ff", position: 100 },
  ])

  const generateGradient = () => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ")

    const gradient =
      gradientType === "linear" ? `linear-gradient(${angle}deg, ${stops})` : `radial-gradient(circle, ${stops})`

    onChange(gradient)
  }

  const addColorStop = () => {
    const newPosition = colorStops.length > 0 ? Math.max(...colorStops.map((s) => s.position)) + 10 : 50
    setColorStops([...colorStops, { color: "#ffffff", position: Math.min(newPosition, 100) }])
  }

  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index))
    }
  }

  const updateColorStop = (index: number, field: keyof ColorStop, value: string | number) => {
    const updated = colorStops.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop))
    setColorStops(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Background Gradient</Label>
        <Button variant="ghost" size="sm" onClick={() => onChange("")} className="h-6 w-6 p-0">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-gray-500">Type</Label>
          <Select value={gradientType} onValueChange={(value: "linear" | "radial") => setGradientType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {gradientType === "linear" && (
          <div>
            <Label className="text-xs text-gray-500">Angle</Label>
            <Input type="number" value={angle} onChange={(e) => setAngle(Number(e.target.value))} min="0" max="360" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">Color Stops</Label>
          <Button variant="ghost" size="sm" onClick={addColorStop} className="h-6 w-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {colorStops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="color"
              value={stop.color}
              onChange={(e) => updateColorStop(index, "color", e.target.value)}
              className="w-12 h-8 p-1"
            />
            <div className="flex-1">
              <Slider
                value={[stop.position]}
                onValueChange={([value]) => updateColorStop(index, "position", value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <span className="text-xs text-gray-500 w-8">{stop.position}%</span>
            {colorStops.length > 2 && (
              <Button variant="ghost" size="sm" onClick={() => removeColorStop(index)} className="h-6 w-6 p-0">
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button onClick={generateGradient} className="w-full" size="sm">
        Apply Gradient
      </Button>

      {value && <div className="w-full h-12 rounded border" style={{ background: value }} title={value} />}
    </div>
  )
}
