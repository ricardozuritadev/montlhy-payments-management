import { db } from '../client'
import type { Debt, CreateDebtInput, UpdateDebtInput } from '@/types/debt.types'

export async function getAllDebts(): Promise<Debt[]> {
    const result = await db.execute(`
    SELECT *
    FROM debts
    ORDER BY created_at DESC
  `)

    return result.rows as unknown as Debt[]
}

export async function getDebtById(id: string): Promise<Debt | null> {
    const result = await db.execute({
        sql: `
        SELECT *
        FROM debts
        WHERE id = ?
      `,
        args: [id],
    })

    if (result.rows.length === 0) {
        return null
    }

    return result.rows[0] as unknown as Debt
}

export async function createDebt(input: CreateDebtInput): Promise<void> {
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
            input.name,
            input.currency,
            input.monthly_payment,
            input.total_dues,
            input.dues_paid,
            input.payment_date,
            input.end_date,
            input.total_amount,
            input.outstanding_amount,
            input.bank,
            input.is_paid_this_month,
        ],
    })
}

export async function updateDebt(input: UpdateDebtInput): Promise<void> {
    const existing = await getDebtById(input.id)
    if (!existing) {
        throw new Error(`Debt not found: ${input.id}`)
    }

    const row: CreateDebtInput = {
        name: input.name ?? existing.name,
        currency: input.currency ?? existing.currency,
        monthly_payment: input.monthly_payment ?? existing.monthly_payment,
        total_dues:
            input.total_dues !== undefined ? input.total_dues : existing.total_dues,
        dues_paid: input.dues_paid ?? existing.dues_paid,
        payment_date: input.payment_date ?? existing.payment_date,
        end_date: input.end_date !== undefined ? input.end_date : existing.end_date,
        total_amount:
            input.total_amount !== undefined ? input.total_amount : existing.total_amount,
        outstanding_amount:
            input.outstanding_amount !== undefined
                ? input.outstanding_amount
                : existing.outstanding_amount,
        bank: input.bank ?? existing.bank,
        is_paid_this_month: input.is_paid_this_month ?? existing.is_paid_this_month,
    }

    await db.execute({
        sql: `
        UPDATE debts
        SET
          name = ?,
          currency = ?,
          monthly_payment = ?,
          total_dues = ?,
          dues_paid = ?,
          payment_date = ?,
          end_date = ?,
          total_amount = ?,
          outstanding_amount = ?,
          bank = ?,
          is_paid_this_month = ?
        WHERE id = ?
      `,
        args: [
            row.name,
            row.currency,
            row.monthly_payment,
            row.total_dues,
            row.dues_paid,
            row.payment_date,
            row.end_date,
            row.total_amount,
            row.outstanding_amount,
            row.bank,
            row.is_paid_this_month,
            input.id,
        ],
    })
}

export async function deleteDebt(id: string): Promise<void> {
    await db.execute({
        sql: `
        DELETE FROM debts
        WHERE id = ?
      `,
        args: [id],
    })
}
