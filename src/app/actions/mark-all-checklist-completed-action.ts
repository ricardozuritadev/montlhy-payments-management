'use server'

import { revalidatePath } from 'next/cache'

import { markAllChecklistCompleted } from '@/db/queries/mark-all-checklist-completed'

type MarkAllChecklistCompletedActionResult =
    | { success: true }
    | { success: false; error: string }

export async function markAllChecklistCompletedAction(): Promise<MarkAllChecklistCompletedActionResult> {
    try {
        await markAllChecklistCompleted()
        revalidatePath('/checklist')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error marking all checklist items:', error)

        return {
            success: false,
            error: 'No se pudieron marcar todos los items.',
        }
    }
}
