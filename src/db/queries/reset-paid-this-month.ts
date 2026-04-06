import { db } from '@/db/client'

export async function resetPaidThisMonth(): Promise<void> {
    await db.execute(`
    UPDATE debts
    SET is_paid_this_month = 0
  `)
}
