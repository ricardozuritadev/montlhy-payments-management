'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Plus, RotateCcw } from 'lucide-react'
import { resetPaidThisMonthAction } from '@/app/actions/reset-paid-this-month-action'

export function DashboardHeader() {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleScrollToForm = (): void => {
        const formSection = document.getElementById('new-debt-form')

        if (!formSection) return

        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    const handleResetMonth = (): void => {
        setError(null)

        startTransition(async () => {
            const result = await resetPaidThisMonthAction()

            if (!result.success) {
                setError(result.error)
            }
        })
    }

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

                {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                    type="button"
                    onClick={handleScrollToForm}
                    className="p-6 cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva deuda
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            type="button"
                            className="p-6 cursor-pointer"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reiniciar mes
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                ¿Reiniciar estado mensual?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Todas las deudas se marcarán como pendientes nuevamente.
                                Esta acción no elimina datos ni cuotas pagadas, solo
                                reinicia el estado del mes actual.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>

                            <AlertDialogAction
                                onClick={handleResetMonth}
                                disabled={isPending}
                            >
                                {isPending ? 'Reiniciando...' : 'Confirmar'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </section>
    )
}
