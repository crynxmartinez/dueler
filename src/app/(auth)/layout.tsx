import { Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Gamepad2 className="h-10 w-10 text-primary" />
        <span className="text-3xl font-bold">Dueler</span>
      </Link>
      {children}
    </div>
  )
}
