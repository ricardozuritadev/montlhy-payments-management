import { db } from '@/db/client'

export async function toggleDebtPaidThisMonth(debtId: string): Promise<void> {
    await db.execute({
        sql: `
      UPDATE debts
      SET is_paid_this_month = CASE
        WHEN is_paid_this_month = 1 THEN 0
        ELSE 1
      END
      WHERE id = ?
    `,
        args: [debtId],
    })
}
