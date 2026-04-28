import { DebtsDashboard } from '@/app/components/debts/debts-dashboard'
import { getDebts } from '@/db/queries/get-debts'

type PageProps = {
    searchParams: Promise<{ edit?: string }>
}

export default async function Page({ searchParams }: PageProps) {
    const debts = await getDebts()
    const params = await searchParams
    const editId = typeof params.edit === 'string' ? params.edit.trim() : ''
    const debtToEdit = editId ? (debts.find((d) => d.id === editId) ?? null) : null

    return <DebtsDashboard debts={debts} debtToEdit={debtToEdit} />
}
