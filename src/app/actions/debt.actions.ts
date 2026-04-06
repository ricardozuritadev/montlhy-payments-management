'use server'

import { revalidatePath } from 'next/cache'

import { debtSchema } from '@/schemas/debt.schema'

import { createDebt, deleteDebt, updateDebt } from '@/db/queries/debt.queries'

export async function createDebtAction(data: unknown) {
    const parsed = debtSchema.parse(data)

    await createDebt(parsed)

    revalidatePath('/')
}

export async function updateDebtAction(id: string, data: unknown) {
    const parsed = debtSchema.parse(data)

    await updateDebt({
        id,
        ...parsed,
    })

    revalidatePath('/')
}

export async function deleteDebtAction(id: string) {
    await deleteDebt(id)

    revalidatePath('/')
}
