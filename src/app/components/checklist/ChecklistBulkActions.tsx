'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { markAllChecklistCompletedAction } from '@/app/actions/mark-all-checklist-completed-action'
import { resetAllChecklistCompletedAction } from '@/app/actions/reset-all-checklist-completed-action'
import { Button } from '@/components/ui/button'

type ChecklistBulkActionsProps = {
    hasItems: boolean
}

export function ChecklistBulkActions({ hasItems }: ChecklistBulkActionsProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const run = (
        action: () => Promise<
            { success: true } | { success: false; error: string }
        >,
    ): void => {
        setError(null)
        startTransition(async () => {
            const result = await action()
            if (!result.success) {
                setError(result.error)
                return
            }
            router.refresh()
        })
    }

    return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full touch-manipulation sm:w-auto"
                    disabled={!hasItems || isPending}
                    onClick={() => run(resetAllChecklistCompletedAction)}
                >
                    {isPending ? 'Aplicando…' : 'Resetear items'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full touch-manipulation sm:w-auto"
                    disabled={!hasItems || isPending}
                    onClick={() => run(markAllChecklistCompletedAction)}
                >
                    {isPending ? 'Aplicando…' : 'Marcar todos'}
                </Button>
            </div>
            {error ? <p className="text-destructive text-sm sm:text-end">{error}</p> : null}
        </div>
    )
}
