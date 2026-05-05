'use server'

import { revalidatePath } from 'next/cache'

import { createChecklistItem } from '@/db/queries/create-checklist-item'
import { checklistItemCreateSchema } from '@/schemas/checklist.schema'

type CreateChecklistItemActionResult =
    | { success: true }
    | { success: false; error: string }

export async function createChecklistItemAction(
    rawTitle: string,
): Promise<CreateChecklistItemActionResult> {
    const parsed = checklistItemCreateSchema.safeParse({ title: rawTitle })

    if (!parsed.success) {
        const first = parsed.error.issues[0]
        return {
            success: false,
            error: first?.message ?? 'Título inválido.',
        }
    }

    try {
        await createChecklistItem(parsed.data.title)
        revalidatePath('/checklist')

        return { success: true }
    } catch (error: unknown) {
        console.error('Error creating checklist item:', error)

        return {
            success: false,
            error: 'No se pudo crear la tarea.',
        }
    }
}
