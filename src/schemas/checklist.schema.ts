import { z } from 'zod'

export const checklistItemCreateSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'El título es obligatorio')
        .max(500, 'El título es demasiado largo'),
})

export type ChecklistItemCreateValues = z.infer<typeof checklistItemCreateSchema>
