import { NextResponse } from 'next/server'

import { getAllDebts } from '@/db/queries/debt.queries'

export async function GET() {
    const debts = await getAllDebts()

    return NextResponse.json(debts)
}
