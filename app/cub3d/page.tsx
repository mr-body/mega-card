"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Player {
  x: number
  y: number
  dirX: number
  dirY: number
  planeX: number
  planeY: number
}

interface RaycastHit {
  distance: number
  side: number
  wallX: number
}

export default function RaycastingEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Screen dimensions
  const SCREEN_WIDTH = 640
  const SCREEN_HEIGHT = 480

  // Map dimensions
  const MAP_WIDTH = 24
  const MAP_HEIGHT = 24

  // Game map (1 = wall, 0 = empty)
  const worldMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]

  const [player, setPlayer] = useState<Player>({
    x: 22,
    y: 12,
    dirX: -1,
    dirY: 0,
    planeX: 0,
    planeY: 0.66,
  })

  const [keys, setKeys] = useState<Set<string>>(new Set())

  // DDA Raycasting algorithm
  const castRay = useCallback(
    (rayDirX: number, rayDirY: number): RaycastHit => {
      // Current position
      let mapX = Math.floor(player.x)
      let mapY = Math.floor(player.y)

      // Length of ray from current position to x or y side
      const deltaDistX = Math.abs(1 / rayDirX)
      const deltaDistY = Math.abs(1 / rayDirY)

      let stepX: number
      let stepY: number
      let sideDistX: number
      let sideDistY: number

      // Calculate step and initial sideDist
      if (rayDirX < 0) {
        stepX = -1
        sideDistX = (player.x - mapX) * deltaDistX
      } else {
        stepX = 1
        sideDistX = (mapX + 1.0 - player.x) * deltaDistX
      }

      if (rayDirY < 0) {
        stepY = -1
        sideDistY = (player.y - mapY) * deltaDistY
      } else {
        stepY = 1
        sideDistY = (mapY + 1.0 - player.y) * deltaDistY
      }

      // Perform DDA
      let hit = 0
      let side = 0 // 0 for x-side, 1 for y-side

      while (hit === 0) {
        // Jump to next map square, either in x-direction, or in y-direction
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX
          mapX += stepX
          side = 0
        } else {
          sideDistY += deltaDistY
          mapY += stepY
          side = 1
        }

        // Check if ray has hit a wall
        if (worldMap[mapX][mapY] > 0) hit = 1
      }

      // Calculate distance
      let perpWallDist: number
      if (side === 0) {
        perpWallDist = (mapX - player.x + (1 - stepX) / 2) / rayDirX
      } else {
        perpWallDist = (mapY - player.y + (1 - stepY) / 2) / rayDirY
      }

      // Calculate where exactly the wall was hit
      let wallX: number
      if (side === 0) {
        wallX = player.y + perpWallDist * rayDirY
      } else {
        wallX = player.x + perpWallDist * rayDirX
      }
      wallX -= Math.floor(wallX)

      return {
        distance: perpWallDist,
        side,
        wallX,
      }
    },
    [player],
  )

  // Render the scene
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear screen
    ctx.fillStyle = "#87CEEB" // Sky blue
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2)
    ctx.fillStyle = "#654321" // Brown floor
    ctx.fillRect(0, SCREEN_HEIGHT / 2, SCREEN_WIDTH, SCREEN_HEIGHT / 2)

    // Cast rays for each column
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      // Calculate ray position and direction
      const cameraX = (2 * x) / SCREEN_WIDTH - 1 // x-coordinate in camera space
      const rayDirX = player.dirX + player.planeX * cameraX
      const rayDirY = player.dirY + player.planeY * cameraX

      const hit = castRay(rayDirX, rayDirY)

      // Calculate height of line to draw on screen
      const lineHeight = Math.floor(SCREEN_HEIGHT / hit.distance)

      // Calculate lowest and highest pixel to fill in current stripe
      let drawStart = -lineHeight / 2 + SCREEN_HEIGHT / 2
      if (drawStart < 0) drawStart = 0
      let drawEnd = lineHeight / 2 + SCREEN_HEIGHT / 2
      if (drawEnd >= SCREEN_HEIGHT) drawEnd = SCREEN_HEIGHT - 1

      // Choose wall color based on wall type and side
      const mapX = Math.floor(player.x + hit.distance * rayDirX)
      const mapY = Math.floor(player.y + hit.distance * rayDirY)
      const wallType = worldMap[mapX][mapY]

      let color: string
      switch (wallType) {
        case 1:
          color = "#FF0000"
          break // Red
        case 2:
          color = "#00FF00"
          break // Green
        case 3:
          color = "#0000FF"
          break // Blue
        case 4:
          color = "#FFFF00"
          break // Yellow
        case 5:
          color = "#FF00FF"
          break // Magenta
        default:
          color = "#FFFFFF"
          break // White
      }

      // Make y-sides darker
      if (hit.side === 1) {
        const rgb = color.match(/\w\w/g)
        if (rgb) {
          const r = Math.floor(Number.parseInt(rgb[0], 16) * 0.7)
          const g = Math.floor(Number.parseInt(rgb[1], 16) * 0.7)
          const b = Math.floor(Number.parseInt(rgb[2], 16) * 0.7)
          color = `rgb(${r}, ${g}, ${b})`
        }
      }

      // Draw the wall stripe
      ctx.fillStyle = color
      ctx.fillRect(x, drawStart, 1, drawEnd - drawStart)
    }
  }, [player, castRay])

  // Handle movement
  const updatePlayer = useCallback(() => {
    const moveSpeed = 0.05
    const rotSpeed = 0.03

    setPlayer((prevPlayer) => {
      const newPlayer = { ...prevPlayer }

      // Move forward/backward
      if (keys.has("w") || keys.has("ArrowUp")) {
        const newX = newPlayer.x + newPlayer.dirX * moveSpeed
        const newY = newPlayer.y + newPlayer.dirY * moveSpeed
        if (worldMap[Math.floor(newX)][Math.floor(newPlayer.y)] === 0) newPlayer.x = newX
        if (worldMap[Math.floor(newPlayer.x)][Math.floor(newY)] === 0) newPlayer.y = newY
      }
      if (keys.has("s") || keys.has("ArrowDown")) {
        const newX = newPlayer.x - newPlayer.dirX * moveSpeed
        const newY = newPlayer.y - newPlayer.dirY * moveSpeed
        if (worldMap[Math.floor(newX)][Math.floor(newPlayer.y)] === 0) newPlayer.x = newX
        if (worldMap[Math.floor(newPlayer.x)][Math.floor(newY)] === 0) newPlayer.y = newY
      }

      // Strafe left/right
      if (keys.has("a")) {
        const newX = newPlayer.x - newPlayer.planeX * moveSpeed
        const newY = newPlayer.y - newPlayer.planeY * moveSpeed
        if (worldMap[Math.floor(newX)][Math.floor(newPlayer.y)] === 0) newPlayer.x = newX
        if (worldMap[Math.floor(newPlayer.x)][Math.floor(newY)] === 0) newPlayer.y = newY
      }
      if (keys.has("d")) {
        const newX = newPlayer.x + newPlayer.planeX * moveSpeed
        const newY = newPlayer.y + newPlayer.planeY * moveSpeed
        if (worldMap[Math.floor(newX)][Math.floor(newPlayer.y)] === 0) newPlayer.x = newX
        if (worldMap[Math.floor(newPlayer.x)][Math.floor(newY)] === 0) newPlayer.y = newY
      }

      // Rotate left/right
      if (keys.has("z")) {
        const oldDirX = newPlayer.dirX
        newPlayer.dirX = newPlayer.dirX * Math.cos(rotSpeed) - newPlayer.dirY * Math.sin(rotSpeed)
        newPlayer.dirY = oldDirX * Math.sin(rotSpeed) + newPlayer.dirY * Math.cos(rotSpeed)
        const oldPlaneX = newPlayer.planeX
        newPlayer.planeX = newPlayer.planeX * Math.cos(rotSpeed) - newPlayer.planeY * Math.sin(rotSpeed)
        newPlayer.planeY = oldPlaneX * Math.sin(rotSpeed) + newPlayer.planeY * Math.cos(rotSpeed)
      }
      if (keys.has("c")) {
        const oldDirX = newPlayer.dirX
        newPlayer.dirX = newPlayer.dirX * Math.cos(-rotSpeed) - newPlayer.dirY * Math.sin(-rotSpeed)
        newPlayer.dirY = oldDirX * Math.sin(-rotSpeed) + newPlayer.dirY * Math.cos(-rotSpeed)
        const oldPlaneX = newPlayer.planeX
        newPlayer.planeX = newPlayer.planeX * Math.cos(-rotSpeed) - newPlayer.planeY * Math.sin(-rotSpeed)
        newPlayer.planeY = oldPlaneX * Math.sin(-rotSpeed) + newPlayer.planeY * Math.cos(-rotSpeed)
      }

      return newPlayer
    })
  }, [keys])

  // Game loop
  const gameLoop = useCallback(() => {
    updatePlayer()
    render()
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [updatePlayer, render])

  // Keyboard event handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys((prev) => new Set(prev).add(e.key.toLowerCase()))
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys((prev) => {
      const newKeys = new Set(prev)
      newKeys.delete(e.key.toLowerCase())
      return newKeys
    })
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop])

  return (
    <div className="flex flex-col items-center gap-4 p-4">
          <canvas
            ref={canvasRef}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            className="border border-gray-300 bg-black"
            tabIndex={0}
          />
    </div>
  )
}
