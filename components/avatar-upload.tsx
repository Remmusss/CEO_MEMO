"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  initialImage?: string
  name: string
  onAvatarChange: (imageUrl: string) => void
}

export function AvatarUpload({ initialImage, name, onAvatarChange }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>(initialImage || "/placeholder.svg?height=96&width=96")
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setAvatarUrl(imageUrl)
      onAvatarChange(imageUrl)

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAvatarUrl("/placeholder.svg?height=96&width=96")
    onAvatarChange("/placeholder.svg?height=96&width=96")

    toast({
      title: "Avatar removed",
      description: "Your profile picture has been removed",
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={triggerFileInput}
      >
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div
          className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity ${isHovering ? "opacity-100" : "opacity-0"}`}
        >
          <Camera className="h-8 w-8 text-white" />
        </div>

        {avatarUrl !== "/placeholder.svg?height=96&width=96" && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveAvatar}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}
