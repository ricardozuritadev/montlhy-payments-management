import { db } from '@/db/client'

type DebtRow = {
    id: string
    total_dues: number | null
    dues_paid: number
    total_amount: number | null
    monthly_payment: number
    is_paid_this_month: number
}

export async function toggleDebtPaidThisMonth(debtId: string): Promise<void> {
    const result = await db.execute({
        sql: `
      SELECT
        id,
        total_dues,
        dues_paid,
        total_amount,
        monthly_payment,
        is_paid_this_month
      FROM debts
      WHERE id = ?
      LIMIT 1
    `,
        args: [debtId],
    })

    if (result.rows.length === 0) {
        throw new Error('Debt not found')
    }

    const row = result.rows[0] as unknown as DebtRow

    const isCurrentlyPaid = row.is_paid_this_month === 1
    const nextIsPaidThisMonth = isCurrentlyPaid ? 0 : 1

    const nextDuesPaid = isCurrentlyPaid
        ? Math.max(row.dues_paid - 1, 0)
        : row.total_dues !== null
          ? Math.min(row.dues_paid + 1, row.total_dues)
          : row.dues_paid

    const nextOutstandingAmount =
        row.total_amount !== null
            ? Math.max(row.total_amount - row.monthly_payment * nextDuesPaid, 0)
            : null

    await db.execute({
        sql: `
      UPDATE debts
      SET
        is_paid_this_month = ?,
        dues_paid = ?,
        outstanding_amount = ?
      WHERE id = ?
    `,
        args: [nextIsPaidThisMonth, nextDuesPaid, nextOutstandingAmount, debtId],
    })
}
