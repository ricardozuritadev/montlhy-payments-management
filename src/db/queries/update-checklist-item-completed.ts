import { db } from '@/db/client'

export async function updateChecklistItemCompleted(
    itemId: string,
    isCompleted: boolean,
): Promise<void> {
    const result = await db.execute({
        sql: `
      UPDATE checklist
      SET
        is_completed = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `,
        args: [isCompleted ? 1 : 0, itemId],
    })

    if (result.rowsAffected === 0) {
        throw new Error('Checklist item not found')
    }
}
