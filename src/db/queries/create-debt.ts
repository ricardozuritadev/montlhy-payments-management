import { db } from '@/db/client'
import type { DebtFormValues } from '@/schemas/debt.schema'

export async function createDebt(values: DebtFormValues): Promise<void> {
    const outstandingAmount =
        values.totalAmount !== null
            ? Math.max(values.totalAmount - values.monthlyPayment * values.duesPaid, 0)
            : null

    await db.execute({
        sql: `
      INSERT INTO debts (
        name,
        currency,
        monthly_payment,
        total_dues,
        dues_paid,
        payment_date,
        end_date,
        total_amount,
        outstanding_amount,
        bank,
        is_paid_this_month
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        args: [
            values.name,
            values.currency,
            values.monthlyPayment,
            values.totalDues,
            values.duesPaid,
            values.paymentDate,
            values.endDate,
            values.totalAmount,
            outstandingAmount,
            values.bank,
            values.isPaidThisMonth ? 1 : 0,
        ],
    })
}
