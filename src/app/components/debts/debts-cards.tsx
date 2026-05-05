import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Debt } from '@/app/types/debt'
import { TogglePaidButton } from './toggle-paid-button'

type DebtsCardsProps = {
    debts: Debt[]
}

export function DebtsCards({ debts }: DebtsCardsProps) {
    return (
        <div className="grid min-w-0 gap-4">
            {debts.map((debt) => (
                <article
                    key={debt.id}
                    className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border bg-card p-4 shadow-sm"
                >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold">
                                {debt.name}
                            </h3>
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                Banco: {debt.bank}
                            </p>
                        </div>

                        <Badge
                            className="shrink-0"
                            variant={debt.isPaidThisMonth ? 'default' : 'secondary'}
                        >
                            {debt.isPaidThisMonth ? 'Pagado' : 'Pendiente'}
                        </Badge>
                    </div>

                    <div className="mt-4 grid min-w-0 gap-3 text-sm">
                        <InfoRow
                            label="Cuota mensual"
                            value={formatMoney(debt.monthlyPayment, debt.currency)}
                        />
                        <InfoRow label="Cobro" value={debt.paymentDate} />
                        <InfoRow
                            label="Progreso"
                            value={`${debt.duesPaid}/${debt.totalDues ?? '—'}`}
                        />
                        <InfoRow
                            label="Cuotas pendientes"
                            value={`${debt.outstandingDues ?? '—'}`}
                        />
                        <InfoRow
                            label="Valor restante"
                            value={
                                debt.outstandingAmount !== null
                                    ? formatMoney(debt.outstandingAmount, debt.currency)
                                    : '—'
                            }
                        />
                        <InfoRow label="Fin" value={formatEndDate(debt.endDate)} />
                    </div>

                    <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row">
                        <Button variant="outline" className="w-full min-w-0 p-6" asChild>
                            <Link href={`/?edit=${debt.id}#new-debt-form`}>Editar</Link>
                        </Button>

                        <div className="w-full min-w-0">
                            <TogglePaidButton
                                debtId={debt.id}
                                isPaidThisMonth={debt.isPaidThisMonth}
                                className="w-full p-6"
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}

type InfoRowProps = {
    label: string
    value: string
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-0.5">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium wrap-break-word tabular-nums">
                {value}
            </span>
        </div>
    )
}

function formatMoney(amount: number, currency: 'EUR' | 'USD'): string {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
    }).format(amount)
}

function formatEndDate(endDate: string | null): string {
    if (!endDate) return 'Sin fecha'

    const [year, month, day] = endDate.split('-')
    return `${day}/${month}/${year}`
}
