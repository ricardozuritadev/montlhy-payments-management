import { db } from '@/db/client'

/** Marca todas las tareas como completadas. */
export async function markAllChecklistCompleted(): Promise<void> {
    await db.execute(`
    UPDATE checklist
    SET
      is_completed = 1,
      updated_at = datetime('now')
  `)
}
