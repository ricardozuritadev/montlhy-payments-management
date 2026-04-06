'use server'

import { revalidatePath } from 'next/cache'
import { resetPaidThisMonth } from '@/db/queries/reset-paid-this-month'

type ResetPaidThisMonthActionResult =
    | { success: true }
    | { success: false; error: string }

export async function resetPaidThisMonthAction(): Promise<ResetPaidThisMonthActionResult> {
    try {
        await resetPaidThisMonth()
        revalidatePath('/')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error resetting monthly paid state:', error)

        return {
            success: false,
            error: 'No se pudo reiniciar el estado mensual.',
        }
    }
}
