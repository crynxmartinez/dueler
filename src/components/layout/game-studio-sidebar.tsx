"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Layers,
  Zap,
  ScrollText,
  Map,
  Package,
  Tag,
  Users,
  FolderOpen,
  Settings,
  Play,
  Save,
  Eye,
  Rocket,
  Gamepad2,
} from "lucide-react"

interface GameStudioSidebarProps {
  game: {
    id: string
    name: string
    isPublic: boolean
    _count?: {
      cards: number
      effects: number
      ruleCards: number
      decks: number
      keywords: number
      classes: number
      cardSets: number
    }
  }
}

export function GameStudioSidebar({ game }: GameStudioSidebarProps) {
  const pathname = usePathname()
  const baseUrl = `/dashboard/games/${game.id}`

  const counts = game._count || {
    cards: 0,
    effects: 0,
    ruleCards: 0,
    decks: 0,
    keywords: 0,
    classes: 0,
    cardSets: 0,
  }

  const navItems = [
    {
      title: "Cards",
      href: `${baseUrl}/cards`,
      icon: Layers,
      count: counts.cards,
      children: [
        { title: "All Cards", href: `${baseUrl}/cards` },
        { title: "Units", href: `${baseUrl}/cards?type=UNIT` },
        { title: "Spells", href: `${baseUrl}/cards?type=SPELL` },
        { title: "Heroes", href: `${baseUrl}/cards?type=HERO` },
      ],
    },
    {
      title: "Effects",
      href: `${baseUrl}/effects`,
      icon: Zap,
      count: counts.effects,
    },
    {
      title: "Rules",
      href: `${baseUrl}/rules`,
      icon: ScrollText,
      count: counts.ruleCards,
    },
    {
      title: "Board",
      href: `${baseUrl}/board`,
      icon: Map,
    },
    {
      title: "Decks",
      href: `${baseUrl}/decks`,
      icon: Package,
      count: counts.decks,
    },
  ]

  const configItems = [
    {
      title: "Keywords",
      href: `${baseUrl}/keywords`,
      icon: Tag,
      count: counts.keywords,
    },
    {
      title: "Classes",
      href: `${baseUrl}/classes`,
      icon: Users,
      count: counts.classes,
    },
    {
      title: "Sets",
      href: `${baseUrl}/sets`,
      icon: FolderOpen,
      count: counts.cardSets,
    },
    {
      title: "Settings",
      href: `${baseUrl}/settings`,
      icon: Settings,
    },
  ]

  const isActive = (href: string) => {
    if (href.includes("?")) {
      return pathname === href.split("?")[0]
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-4">
          <Link href="/dashboard/games">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary shrink-0" />
              <span className="font-semibold truncate">{game.name}</span>
            </div>
            <Badge variant={game.isPublic ? "default" : "secondary"} className="mt-1">
              {game.isPublic ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Game Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  {item.children ? (
                    <>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {item.count !== undefined && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.count}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === child.href || pathname + window.location.search === child.href}
                            >
                              <Link href={child.href}>{child.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.count !== undefined && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.count}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.count !== undefined && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.count}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href={`${baseUrl}/test`}>
                    <Play className="h-4 w-4" />
                    <span>Test Play</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Save className="h-3 w-3" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Eye className="h-3 w-3" />
            Preview
          </Button>
          <Button size="sm" className="flex-1 gap-1">
            <Rocket className="h-3 w-3" />
            Publish
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
