'use server'

import { revalidatePath } from 'next/cache'

import { updateChecklistItemCompleted } from '@/db/queries/update-checklist-item-completed'

type UpdateChecklistItemCompletedActionResult =
    | { success: true }
    | { success: false; error: string }

function isValidChecklistId(id: string): boolean {
    return /^\d+$/.test(id.trim())
}

export async function updateChecklistItemCompletedAction(
    itemId: string,
    isCompleted: boolean,
): Promise<UpdateChecklistItemCompletedActionResult> {
    const trimmed = itemId.trim()
    if (!isValidChecklistId(trimmed)) {
        return {
            success: false,
            error: 'El id de la tarea es inválido.',
        }
    }

    try {
        await updateChecklistItemCompleted(trimmed, isCompleted)
        revalidatePath('/checklist')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error updating checklist item:', error)

        return {
            success: false,
            error: 'No se pudo actualizar la tarea.',
        }
    }
}
