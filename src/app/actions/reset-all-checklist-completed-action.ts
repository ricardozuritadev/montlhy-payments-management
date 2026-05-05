'use server'

import { revalidatePath } from 'next/cache'

import { resetAllChecklistCompleted } from '@/db/queries/reset-all-checklist-completed'

type ResetAllChecklistCompletedActionResult =
    | { success: true }
    | { success: false; error: string }

export async function resetAllChecklistCompletedAction(): Promise<ResetAllChecklistCompletedActionResult> {
    try {
        await resetAllChecklistCompleted()
        revalidatePath('/checklist')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error resetting checklist items:', error)

        return {
            success: false,
            error: 'No se pudieron resetear los items.',
        }
    }
}
