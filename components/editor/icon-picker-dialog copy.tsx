"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Star,
  Heart,
  Home,
  User,
  Settings,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Music,
  Video,
  Download,
  Upload,
  Search,
  Bell,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Edit,
  Trash,
  Plus,
  Minus,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"


// Lista de ícones disponíveis
export const availableIcons = {
  star: Star,
  heart: Heart,
  home: Home,
  user: User,
  settings: Settings,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  mapPin: MapPin,
  camera: Camera,
  music: Music,
  video: Video,
  download: Download,
  upload: Upload,
  search: Search,
  bell: Bell,
  lock: Lock,
  unlock: Unlock,
  eye: Eye,
  eyeOff: EyeOff,
  edit: Edit,
  trash: Trash,
  plus: Plus,
  minus: Minus,
  check: Check,
  x: X,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
}


interface IconPickerDialogProps {
  selectedIcon: string
  onIconSelect: (iconName: string) => void
  children: React.ReactNode
}

export function IconPickerDialog({ selectedIcon, onIconSelect, children }: IconPickerDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)

  const filteredIcons = Object.entries(availableIcons).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="grid grid-cols-8 gap-2 max-h-96 overflow-auto">
            {filteredIcons.map(([name, IconComponent]) => (
              <Button
                key={name}
                variant={selectedIcon === name ? "default" : "outline"}
                size="sm"
                className="h-12 w-12 p-2"
                onClick={() => handleIconSelect(name)}
                title={name}
              >
                <IconComponent className="w-6 h-6" />
              </Button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="text-center text-gray-500 py-8">No icons found matching "{searchTerm}"</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
