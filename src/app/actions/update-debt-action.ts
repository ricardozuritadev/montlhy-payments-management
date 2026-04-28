'use server'

import { revalidatePath } from 'next/cache'

import { updateDebt } from '@/db/queries/update-debt'
import { debtSchema, type DebtFormValues } from '@/schemas/debt.schema'

type UpdateDebtActionResult = { success: true } | { success: false; error: string }

export async function updateDebtAction(
    debtId: string,
    values: DebtFormValues,
): Promise<UpdateDebtActionResult> {
    const parsed = debtSchema.safeParse(values)

    if (!parsed.success) {
        return {
            success: false,
            error: 'Datos inválidos. Revisa el formulario.',
        }
    }

    if (!debtId.trim()) {
        return { success: false, error: 'Identificador de deuda no válido.' }
    }

    try {
        await updateDebt(debtId, parsed.data)
        revalidatePath('/')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error updating debt:', error)

        return {
            success: false,
            error: 'No se pudo actualizar la deuda.',
        }
    }
}
