import type { Debt } from '@/app/types/debt'

type DebtRow = {
    id: string
    name: string
    currency: 'EUR' | 'USD'
    monthly_payment: number
    total_dues: number | null
    dues_paid: number
    outstanding_dues: number | null
    payment_date: string
    end_date: string | null
    total_amount: number | null
    outstanding_amount: number | null
    bank: string
    is_paid_this_month: number
}

export function mapDebtRowToDebt(row: DebtRow): Debt {
    return {
        id: row.id,
        name: row.name,
        currency: row.currency,
        monthlyPayment: row.monthly_payment,
        totalDues: row.total_dues,
        duesPaid: row.dues_paid,
        outstandingDues: row.outstanding_dues,
        paymentDate: row.payment_date,
        endDate: row.end_date,
        totalAmount: row.total_amount,
        outstandingAmount: row.outstanding_amount,
        bank: row.bank,
        isPaidThisMonth: row.is_paid_this_month === 1,
    }
}
