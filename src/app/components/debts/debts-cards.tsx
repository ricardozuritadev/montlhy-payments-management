import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Debt } from '@/app/types/debt'

type DebtsCardsProps = {
    debts: Debt[]
}

export function DebtsCards({ debts }: DebtsCardsProps) {
    return (
        <div className="grid gap-4">
            {debts.map((debt) => (
                <article
                    key={debt.id}
                    className="rounded-2xl border bg-card p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">
                                {debt.name}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Banco: {debt.bank}
                            </p>
                        </div>

                        <Badge variant={debt.isPaidThisMonth ? 'default' : 'secondary'}>
                            {debt.isPaidThisMonth ? 'Pagado' : 'Pendiente'}
                        </Badge>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm">
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

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" className="w-full">
                            Editar
                        </Button>
                        <Button className="w-full">Marcar pagado</Button>
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
        <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
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
