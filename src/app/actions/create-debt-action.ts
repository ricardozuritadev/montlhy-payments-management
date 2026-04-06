'use server'

import { revalidatePath } from 'next/cache'

import { createDebt } from '@/db/queries/create-debt'
import { debtSchema, type DebtFormValues } from '@/schemas/debt.schema'

type CreateDebtActionResult = { success: true } | { success: false; error: string }

export async function createDebtAction(
    values: DebtFormValues,
): Promise<CreateDebtActionResult> {
    const parsed = debtSchema.safeParse(values)

    if (!parsed.success) {
        return {
            success: false,
            error: 'Datos inválidos. Revisa el formulario.',
        }
    }

    try {
        await createDebt(parsed.data)
        revalidatePath('/')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error creating debt:', error)

        return {
            success: false,
            error: 'No se pudo guardar la deuda.',
        }
    }
}
