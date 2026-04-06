export type Currency = 'EUR' | 'USD'

export interface Debt {
    id: string

    name: string
    currency: Currency

    monthly_payment: number

    total_dues: number | null
    dues_paid: number

    outstanding_dues: number | null

    payment_date: string

    end_date: string | null

    total_amount: number | null
    outstanding_amount: number | null

    bank: string

    is_paid_this_month: 0 | 1

    created_at: string
}

export type CreateDebtInput = Omit<Debt, 'id' | 'created_at' | 'outstanding_dues'>

export type UpdateDebtInput = Partial<CreateDebtInput> & {
    id: string
}
