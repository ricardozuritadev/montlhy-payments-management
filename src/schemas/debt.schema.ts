import { z } from 'zod'

export const debtSchema = z.object({
    name: z.string().min(1),

    currency: z.enum(['EUR', 'USD']),

    monthly_payment: z.number().positive(),

    total_dues: z.number().int().positive().nullable(),

    dues_paid: z.number().int().min(0),

    payment_date: z.string().min(3),

    end_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .nullable(),

    total_amount: z.number().positive().nullable(),

    outstanding_amount: z.number().positive().nullable(),

    bank: z.string().min(1),

    is_paid_this_month: z.union([z.literal(0), z.literal(1)]),
})

export type DebtInput = z.infer<typeof debtSchema>
