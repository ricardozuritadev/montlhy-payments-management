import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Debt } from '@/app/types/debt'
import { TogglePaidButton } from './toggle-paid-button'

type DebtsTableProps = {
    debts: Debt[]
}

export function DebtsTable({ debts }: DebtsTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Deuda</TableHead>
                        <TableHead>Cuota mensual</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead>Cobro</TableHead>
                        <TableHead>Pendiente</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead>Mes actual</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {debts.map((debt) => (
                        <TableRow key={debt.id}>
                            <TableCell className="align-top">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">{debt.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Fin: {formatEndDate(debt.endDate)}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="align-top">
                                {formatMoney(debt.monthlyPayment, debt.currency)}
                            </TableCell>

                            <TableCell className="align-top">
                                <div className="flex min-w-40 flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            {debt.duesPaid}/{debt.totalDues ?? '—'}
                                        </span>
                                        <span>
                                            {getProgressLabel(
                                                debt.duesPaid,
                                                debt.totalDues,
                                            )}
                                        </span>
                                    </div>

                                    <div className="h-2 rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-primary"
                                            style={{
                                                width: `${getProgressValue(debt.duesPaid, debt.totalDues)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell className="align-top">
                                {debt.paymentDate}
                            </TableCell>

                            <TableCell className="align-top">
                                <div className="flex flex-col gap-1">
                                    <span>{debt.outstandingDues ?? '—'} cuotas</span>
                                    <span className="text-xs text-muted-foreground">
                                        {debt.outstandingAmount !== null
                                            ? formatMoney(
                                                  debt.outstandingAmount,
                                                  debt.currency,
                                              )
                                            : '—'}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="align-top">{debt.bank}</TableCell>

                            <TableCell className="align-top">
                                <Badge
                                    variant={
                                        debt.isPaidThisMonth ? 'default' : 'secondary'
                                    }
                                >
                                    {debt.isPaidThisMonth ? 'Pagado' : 'Pendiente'}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-right align-top">
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">
                                        Editar
                                    </Button>

                                    <div className="w-[140px]">
                                        <TogglePaidButton
                                            debtId={debt.id}
                                            isPaidThisMonth={debt.isPaidThisMonth}
                                        />
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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

function getProgressValue(duesPaid: number, totalDues: number | null): number {
    if (totalDues === null || totalDues <= 0) return 0
    return Math.min(Math.round((duesPaid / totalDues) * 100), 100)
}

function getProgressLabel(duesPaid: number, totalDues: number | null): string {
    if (totalDues === null || totalDues <= 0) return '—'
    return `${getProgressValue(duesPaid, totalDues)}%`
}
