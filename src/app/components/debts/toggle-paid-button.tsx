'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toggleDebtPaidThisMonthAction } from '@/app/actions/toggle-debt-paid-this-month-action'
import { cn } from '@/lib/utils'

type TogglePaidButtonProps = {
    debtId: string
    isPaidThisMonth: boolean
    className?: string
}

export function TogglePaidButton({
    debtId,
    isPaidThisMonth,
    className,
}: TogglePaidButtonProps) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleClick = (): void => {
        setError(null)

        startTransition(async () => {
            const result = await toggleDebtPaidThisMonthAction(debtId)

            if (!result.success) {
                setError(result.error)
            }
        })
    }

    return (
        <div className="flex w-full flex-col gap-1">
            <Button
                type="button"
                size="sm"
                onClick={handleClick}
                disabled={isPending}
                className={cn('w-full cursor-pointer', className)}
            >
                {isPending
                    ? 'Actualizando...'
                    : isPaidThisMonth
                      ? 'Desmarcar pago'
                      : 'Marcar pagado'}
            </Button>

            {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
    )
}
