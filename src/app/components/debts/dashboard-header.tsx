import { Button } from '@/components/ui/button'
import { Plus, RotateCcw } from 'lucide-react'

export function DashboardHeader() {
    return (
        <section className="flex flex-col gap-4 md:gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Control de deudas
                </h1>
                <p className="text-sm text-muted-foreground">
                    Administra pagos mensuales, progreso por cuotas y estado del mes
                    actual.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva deuda
                </Button>

                <Button variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reiniciar mes
                </Button>
            </div>
        </section>
    )
}
