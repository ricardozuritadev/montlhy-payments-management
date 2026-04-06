export type Currency = 'EUR' | 'USD'

export interface Debt {
    id: string
    name: string
    currency: Currency
    monthlyPayment: number
    totalDues: number | null
    duesPaid: number
    outstandingDues: number | null
    paymentDate: string
    endDate: string | null
    totalAmount: number | null
    outstandingAmount: number | null
    bank: string
    isPaidThisMonth: boolean
}
