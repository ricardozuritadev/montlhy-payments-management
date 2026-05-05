'use client'

import { type FormEvent, useOptimistic, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { createChecklistItemAction } from '@/app/actions/create-checklist-item-action'
import { updateChecklistItemCompletedAction } from '@/app/actions/update-checklist-item-completed-action'
import type { ChecklistItem } from '@/app/types/checklist'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type CheckListProps = {
    items: ChecklistItem[]
}

function ChecklistAddForm() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault()
        setError(null)
        if (!title.trim()) return

        startTransition(async () => {
            const result = await createChecklistItemAction(title)
            if (!result.success) {
                setError(result.error)
                return
            }
            setTitle('')
            router.refresh()
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-2">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Label htmlFor="checklist-new-title">Nuevo item</Label>
                    <Input
                        id="checklist-new-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Describe el item…"
                        disabled={isPending}
                        maxLength={500}
                        autoComplete="off"
                    />
                </div>
                <Button
                    type="submit"
                    className="shrink-0"
                    disabled={isPending || !title.trim()}
                >
                    {isPending ? 'Guardando…' : 'Añadir'}
                </Button>
            </div>
            {error ? <p className="text-destructive text-xs">{error}</p> : null}
        </form>
    )
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
    return (
        <div className="flex max-w-sm flex-col gap-6">
            <ChecklistAddForm />
            {items.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                    No hay items en el checklist.
                </p>
            ) : (
                <FieldGroup>
                    {items.map((item) => (
                        <ChecklistItemRow key={item.id} item={item} />
                    ))}
                </FieldGroup>
            )}
        </div>
    )
}
