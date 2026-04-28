import { cn } from '@/lib/utils'

type StatsCardsProps = {
    totalMonthly: number
    totalDebts: number
    paidThisMonth: number
    totalOutstandingDues: number
}

export function StatsCards({
    totalMonthly,
    totalDebts,
    paidThisMonth,
    totalOutstandingDues,
}: StatsCardsProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                title="Pago mensual total"
                value={`€${totalMonthly.toFixed(2)}`}
                helper="Suma de cuotas activas"
            />

            <StatCard
                title="Deudas activas"
                value={String(totalDebts)}
                helper="Registros visibles"
            />

            <StatCard
                title="Pagadas este mes"
                value={String(paidThisMonth)}
                helper="Marcadas como completadas"
                valueColor="text-green-700"
            />

            <StatCard
                title="Cuotas pendientes"
                value={String(totalOutstandingDues)}
                helper="Suma de cuotas por pagar"
                valueColor="text-red-700"
            />
        </section>
    )
}

type StatCardProps = {
    title: string
    value: string
    helper: string
    valueColor?: string
}

function StatCard({ title, value, helper, valueColor }: StatCardProps) {
    return (
        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p
                className={cn(
                    'mt-2 text-2xl font-semibold tracking-tight sm:text-3xl',
                    valueColor,
                )}
            >
                {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
        </div>
    )
}
