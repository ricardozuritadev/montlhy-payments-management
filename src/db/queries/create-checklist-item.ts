import { db } from '@/db/client'

export async function createChecklistItem(title: string): Promise<void> {
    await db.execute({
        sql: `
      INSERT INTO checklist (title, is_completed, sort_order)
      SELECT
        ?,
        0,
        COALESCE((SELECT MAX(sort_order) FROM checklist), 0) + 10
    `,
        args: [title],
    })
}
