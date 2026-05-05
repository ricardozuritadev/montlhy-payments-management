'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { updateChecklistItemCompletedAction } from '@/app/actions/update-checklist-item-completed-action'
import type { ChecklistItem } from '@/app/types/checklist'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field'

type CheckListProps = {
    items: ChecklistItem[]
}

function ChecklistItemRow({ item }: { item: ChecklistItem }) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [checked, setOptimisticChecked] = useOptimistic(
        item.isCompleted,
        (_prev, next: boolean) => next,
    )

    return (
        <FieldLabel>
            <Field orientation="horizontal">
                <Checkbox
                    id={`checklist-item-${item.id}`}
                    name={`checklist-item-${item.id}`}
                    checked={checked}
                    disabled={isPending}
                    onCheckedChange={(value) => {
                        if (value === 'indeterminate') return
                        const next = value === true
                        setError(null)

                        startTransition(async () => {
                            setOptimisticChecked(next)
                            const result = await updateChecklistItemCompletedAction(
                                item.id,
                                next,
                            )
                            if (!result.success) {
                                setError(result.error)
                                router.refresh()
                                return
                            }
                            router.refresh()
                        })
                    }}
                />
                <FieldContent>
                    <FieldTitle>{item.title}</FieldTitle>
                    {error ? <p className="text-destructive text-xs">{error}</p> : null}
                </FieldContent>
            </Field>
        </FieldLabel>
    )
}

export function CheckList({ items }: CheckListProps) {
    if (items.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">
                No hay tareas en el checklist.
            </p>
        )
    }

    return (
        <FieldGroup className="max-w-sm">
            {items.map((item) => (
                <ChecklistItemRow key={item.id} item={item} />
            ))}
        </FieldGroup>
    )
}
