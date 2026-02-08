import { Link } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConversationEmptyState } from './ai-elements/conversation'

export function NotFound() {
    return (
        <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center p-4">
            <ConversationEmptyState
                title="404 - Página no encontrada"
                description="Lo sentimos, el recurso legal o la página que buscas no se encuentra disponible."
                icon={<FileQuestion className="size-12 text-muted-foreground/50" />}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-muted/50 flex size-20 items-center justify-center rounded-full">
                        <FileQuestion className="text-muted-foreground/90 size-10" />
                    </div>
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-bold tracking-tight">Página no encontrada</h2>
                        <p className="text-muted-foreground max-w-[300px] text-sm leading-relaxed">
                            Parece que la ruta a la que intentas acceder no existe en nuestro sistema legal.
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                        <Link to="/">Volver al Asistente</Link>
                    </Button>
                </div>
            </ConversationEmptyState>
        </div>
    )
}
