'use server'

import { revalidatePath } from 'next/cache'

import { deleteChecklistItem } from '@/db/queries/delete-checklist-item'

type DeleteChecklistItemActionResult =
    | { success: true }
    | { success: false; error: string }

function isValidChecklistId(id: string): boolean {
    return /^\d+$/.test(id.trim())
}

export async function deleteChecklistItemAction(
    itemId: string,
): Promise<DeleteChecklistItemActionResult> {
    const trimmed = itemId.trim()
    if (!isValidChecklistId(trimmed)) {
        return {
            success: false,
            error: 'El id del item es inválido.',
        }
    }

    try {
        await deleteChecklistItem(trimmed)
        revalidatePath('/checklist')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error deleting checklist item:', error)

        return {
            success: false,
            error: 'No se pudo eliminar el item.',
        }
    }
}
