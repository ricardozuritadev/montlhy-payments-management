import { getAllDebts } from '@/db/queries/debt.queries'

export default async function Page() {
    const debts = await getAllDebts()

    console.log(debts)

    return (
        <div>
            {debts.map((debt) => (
                <div key={debt.id}>{debt.name}</div>
            ))}
        </div>
    )
}
