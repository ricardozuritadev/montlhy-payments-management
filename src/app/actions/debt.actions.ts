'use server'

import { revalidatePath } from 'next/cache'

import { debtSchema, type DebtFormValues } from '@/schemas/debt.schema'
import type { CreateDebtInput } from '@/types/debt.types'

import { createDebt } from '@/db/queries/create-debt'
import { deleteDebt } from '@/db/queries/delete-debt'
import { updateDebt } from '@/db/queries/update-debt'

function formValuesToCreateDebtInput(values: DebtFormValues): CreateDebtInput {
    return {
        name: values.name,
        bank: values.bank,
        currency: values.currency,
        monthly_payment: values.monthlyPayment,
        total_dues: values.totalDues,
        dues_paid: values.duesPaid,
        payment_date: values.paymentDate,
        end_date: values.endDate,
        total_amount: values.totalAmount,
        outstanding_amount: values.outstandingAmount,
        is_paid_this_month: values.isPaidThisMonth ? 1 : 0,
    }
}

export async function createDebtAction(data: unknown) {
    const parsed = debtSchema.parse(data)

    await createDebt(formValuesToCreateDebtInput(parsed))

    revalidatePath('/')
}

export async function updateDebtAction(id: string, data: unknown) {
    const parsed = debtSchema.parse(data)

    await updateDebt({
        id,
        ...formValuesToCreateDebtInput(parsed),
    })

    revalidatePath('/')
}

export async function deleteDebtAction(id: string) {
    await deleteDebt(id)

    revalidatePath('/')
}
