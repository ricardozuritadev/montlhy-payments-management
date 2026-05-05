import { db } from '@/db/client'

/** Pone todas las tareas como no completadas. */
export async function resetAllChecklistCompleted(): Promise<void> {
    await db.execute(`
    UPDATE checklist
    SET
      is_completed = 0,
      updated_at = datetime('now')
  `)
}
