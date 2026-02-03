import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gamepad2, Sparkles, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Dueler</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create Your Own
            <br />
            Card Games
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build, play, and share custom card games with an intuitive visual editor.
            No coding required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Start Creating
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline">
                Browse Games
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visual Effect Builder</h3>
            <p className="text-muted-foreground">
              Create complex card effects with our node-based visual editor.
              Connect triggers, actions, and conditions like building blocks.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Gamepad2 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Drag & Drop Board Editor</h3>
            <p className="text-muted-foreground">
              Design your game board with intuitive drag-and-drop zones.
              Customize layouts for any card game style.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Multiplayer</h3>
            <p className="text-muted-foreground">
              Play your games online with friends. Test your creations
              instantly with our built-in multiplayer system.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p> 2024 Dueler. Create amazing card games.</p>
        </div>
      </footer>
    </div>
  )
}
