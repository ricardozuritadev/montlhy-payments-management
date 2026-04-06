import type { Debt } from '@/app/types/debt'
import { DebtsTable } from './debts-table'
import { DebtsCards } from './debts-cards'
import { DebtForm } from './debt-form'
import { StatsCards } from './stats-cards'
import { DashboardHeader } from './dashboard-header'

type DebtsDashboardProps = {
    debts: Debt[]
}

export function DebtsDashboard({ debts }: DebtsDashboardProps) {
    const totalMonthly = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
    const paidThisMonth = debts.filter((debt) => debt.isPaidThisMonth).length
    const totalOutstandingDues = debts.reduce(
        (sum, debt) => sum + (debt.outstandingDues ?? 0),
        0,
    )

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-3 sm:p-4 md:gap-6 md:p-6">
            <DashboardHeader />

            <StatsCards
                totalMonthly={totalMonthly}
                totalDebts={debts.length}
                paidThisMonth={paidThisMonth}
                totalOutstandingDues={totalOutstandingDues}
            />

            <section className="space-y-6">
                <div className="rounded-2xl border bg-card shadow-sm">
                    <div className="border-b p-4 md:p-6">
                        <h2 className="text-lg font-semibold">Tus deudas</h2>
                        <p className="text-sm text-muted-foreground">
                            Vista general para revisar cuotas, cobros y estado del mes
                            actual.
                        </p>
                    </div>

                    <div className="p-4 md:hidden">
                        <DebtsCards debts={debts} />
                    </div>

                    <div className="hidden md:block">
                        <DebtsTable debts={debts} />
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
                    <div className="mx-auto w-full max-w-2xl">
                        <DebtForm />
                    </div>
                </div>
            </section>
        </main>
    )
}
