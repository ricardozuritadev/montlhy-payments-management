import { db } from '@/db/client'
import { mapDebtRowToDebt } from '@/lib/mappers/debt-mapper'
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

export async function getDebts(): Promise<Debt[]> {
    const result = await db.execute(`
    SELECT
      id,
      name,
      currency,
      monthly_payment,
      total_dues,
      dues_paid,
      outstanding_dues,
      payment_date,
      end_date,
      total_amount,
      outstanding_amount,
      bank,
      is_paid_this_month
    FROM debts
    ORDER BY created_at DESC
  `)

    return result.rows.map((row) => mapDebtRowToDebt(row as unknown as DebtRow))
}
