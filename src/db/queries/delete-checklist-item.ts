import { db } from '@/db/client'

export async function deleteChecklistItem(itemId: string): Promise<void> {
    const result = await db.execute({
        sql: `DELETE FROM checklist WHERE id = ?`,
        args: [itemId],
    })

    if (result.rowsAffected === 0) {
        throw new Error('Checklist item not found')
    }
}
