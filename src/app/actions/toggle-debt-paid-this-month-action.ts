'use server'

import { revalidatePath } from 'next/cache'
import { toggleDebtPaidThisMonth } from '@/db/queries/toggle-debt-paid-this-month'

type ToggleDebtPaidThisMonthActionResult =
    | { success: true }
    | { success: false; error: string }

export async function toggleDebtPaidThisMonthAction(
    debtId: string,
): Promise<ToggleDebtPaidThisMonthActionResult> {
    if (!debtId.trim()) {
        return {
            success: false,
            error: 'El id de la deuda es inválido.',
        }
    }

    try {
        await toggleDebtPaidThisMonth(debtId)
        revalidatePath('/')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error toggling debt paid state:', error)

        return {
            success: false,
            error: 'No se pudo actualizar el estado de la deuda.',
        }
    }
}
