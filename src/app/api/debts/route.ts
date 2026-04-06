import { NextResponse } from 'next/server'

import { createDebt } from '@/db/queries/create-debt'

export async function POST(request: Request) {
    const body = await request.json()

    const debt = await createDebt(body)

    return NextResponse.json(debt)
}
