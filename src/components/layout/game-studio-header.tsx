"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

interface GameStudioHeaderProps {
  game: {
    id: string
    name: string
  }
}

export function GameStudioHeader({ game }: GameStudioHeaderProps) {
  const pathname = usePathname()

  const getPageTitle = () => {
    const segments = pathname.split("/")
    const lastSegment = segments[segments.length - 1]
    
    if (lastSegment === game.id) return "Overview"
    
    const titles: Record<string, string> = {
      cards: "Cards",
      effects: "Effects",
      rules: "Rules",
      board: "Board Editor",
      decks: "Decks",
      keywords: "Keywords",
      classes: "Classes",
      sets: "Card Sets",
      settings: "Settings",
      test: "Test Play",
    }
    
    return titles[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/games">Games</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/games/${game.id}`}>
              {game.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
