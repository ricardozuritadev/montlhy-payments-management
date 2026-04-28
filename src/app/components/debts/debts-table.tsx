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
                        <TableHead className="max-w-44 whitespace-normal">
                            Deuda
                        </TableHead>
                        <TableHead className="max-w-32 whitespace-normal">
                            Cuota mensual
                        </TableHead>
                        <TableHead className="max-w-26 whitespace-normal">
                            Progreso
                        </TableHead>
                        <TableHead className="max-w-20 whitespace-normal">
                            Cobro
                        </TableHead>
                        <TableHead>Pendiente</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead>Mes actual</TableHead>
                        <TableHead className="w-[1%] min-w-30 text-right whitespace-normal">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {debts.map((debt) => (
                        <TableRow key={debt.id}>
                            <TableCell className="max-w-44 align-top whitespace-normal">
                                <div className="flex flex-col gap-1 wrap-break-word">
                                    <span className="font-medium leading-snug">
                                        {debt.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Fin: {formatEndDate(debt.endDate)}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="max-w-32 align-top whitespace-normal">
                                <span className="inline-block tabular-nums leading-snug">
                                    {formatMoney(debt.monthlyPayment, debt.currency)}
                                </span>
                            </TableCell>

                            <TableCell className="max-w-26 align-top whitespace-normal">
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-1 gap-y-0.5 text-xs text-muted-foreground">
                                        <span className="tabular-nums">
                                            {debt.duesPaid}/{debt.totalDues ?? '—'}
                                        </span>
                                        <span className="tabular-nums">
                                            {getProgressLabel(
                                                debt.duesPaid,
                                                debt.totalDues,
                                            )}
                                        </span>
                                    </div>

                                    <div className="h-2 min-w-0 rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-primary"
                                            style={{
                                                width: `${getProgressValue(debt.duesPaid, debt.totalDues)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell className="max-w-20 align-top whitespace-normal">
                                <span className="block wrap-break-word leading-snug">
                                    {debt.paymentDate}
                                </span>
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

                            <TableCell className="w-[1%] min-w-30 align-top whitespace-normal">
                                <div className="flex flex-col items-stretch gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full cursor-pointer"
                                    >
                                        Editar
                                    </Button>
                                    <TogglePaidButton
                                        debtId={debt.id}
                                        isPaidThisMonth={debt.isPaidThisMonth}
                                    />
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
