import { DebtsDashboard } from '@/app/components/debts/debts-dashboard'
import { getDebts } from '@/db/queries/get-debts'

export default async function Page() {
    const debts = await getDebts()

    return <DebtsDashboard debts={debts} />
}
