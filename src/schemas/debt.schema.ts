import { z } from 'zod'

export const debtSchema = z
    .object({
        name: z
            .string()
            .min(1, 'El nombre es obligatorio')
            .max(120, 'El nombre es demasiado largo'),

        bank: z
            .string()
            .min(1, 'El banco es obligatorio')
            .max(80, 'El banco es demasiado largo'),

        currency: z.enum(['EUR', 'USD'], {
            message: 'Selecciona una moneda válida',
        }),

        monthlyPayment: z.coerce.number().positive('La cuota mensual debe ser mayor a 0'),

        totalDues: z
            .union([z.coerce.number().int().positive('Debe ser mayor a 0'), z.nan()])
            .transform((value) => (Number.isNaN(value) ? null : value))
            .nullable(),

        duesPaid: z.coerce
            .number()
            .int('Debe ser un número entero')
            .min(0, 'No puede ser negativo'),

        paymentDate: z
            .string()
            .min(1, 'La fecha de cobro es obligatoria')
            .max(60, 'La fecha de cobro es demasiado larga'),

        endDate: z
            .string()
            .trim()
            .transform((value) => (value === '' ? null : value))
            .refine(
                (value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value),
                'La fecha debe tener formato YYYY-MM-DD',
            ),

        totalAmount: z
            .union([z.coerce.number().positive('Debe ser mayor a 0'), z.nan()])
            .transform((value) => (Number.isNaN(value) ? null : value))
            .nullable(),

        isPaidThisMonth: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (data.totalDues !== null && data.duesPaid > data.totalDues) {
            ctx.addIssue({
                code: 'custom',
                path: ['duesPaid'],
                message: 'Las cuotas pagadas no pueden ser mayores al total de cuotas',
            })
        }

        if (data.totalAmount !== null) {
            const paidTowardTotal = data.monthlyPayment * data.duesPaid
            if (paidTowardTotal > data.totalAmount) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['duesPaid'],
                    message:
                        'Cuota mensual × cuotas pagadas no puede superar el valor total',
                })
            }
        }
    })

/** Valores que viven en el formulario (antes de transforms / coerce). */
export type DebtFormInput = z.input<typeof debtSchema>

/** Resultado tras validar (tipos finales para enviar al servidor). */
export type DebtFormValues = z.output<typeof debtSchema>
