import type { ChecklistItem } from '@/app/types/checklist'
import { db } from '@/db/client'

type ChecklistRow = {
    id: number
    title: string
    is_completed: number
    sort_order: number
}

export async function getChecklistItems(): Promise<ChecklistItem[]> {
    const result = await db.execute(`
    SELECT id, title, is_completed, sort_order
    FROM checklist
    ORDER BY sort_order ASC, id ASC
  `)

    return result.rows.map((row) => {
        const r = row as unknown as ChecklistRow
        return {
            id: String(r.id),
            title: r.title,
            isCompleted: r.is_completed === 1,
            sortOrder: r.sort_order,
        }
    })
}
