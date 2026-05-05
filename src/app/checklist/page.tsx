import { getChecklistItems } from '@/db/queries/get-checklist'

import { CheckList } from '../components/checklist/CheckList'

export default async function ChecklistPage() {
    const items = await getChecklistItems()

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-3 sm:p-4 md:gap-6 md:p-6">
            <h1 className="text-3xl font-semibold tracking-tight">Checklist</h1>
            <CheckList items={items} />
        </main>
    )
}
