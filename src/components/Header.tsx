import { ThemeToggle } from "./ThemeToggle"

export default function Header() {
  return (
    <header className="flex h-14 items-center border-b px-4 justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold">El Abogado AI</h1>
        <span className="ml-2 text-sm text-muted-foreground">Asistente Legal Mexicano</span>
      </div>
      <ThemeToggle />
    </header>
  )
}
