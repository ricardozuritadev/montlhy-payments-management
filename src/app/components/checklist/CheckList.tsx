'use client'

import { type FormEvent, useOptimistic, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { createChecklistItemAction } from '@/app/actions/create-checklist-item-action'
import { deleteChecklistItemAction } from '@/app/actions/delete-checklist-item-action'
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
import { X } from 'lucide-react'

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
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [isDeletePending, startDeleteTransition] = useTransition()
    const [checked, setOptimisticChecked] = useOptimistic(
        item.isCompleted,
        (_prev, next: boolean) => next,
    )

    const busy = isPending || isDeletePending

    return (
        <div className="flex w-full items-start gap-1">
            <FieldLabel className="min-w-0 flex-1">
                <Field orientation="horizontal">
                    <Checkbox
                        id={`checklist-item-${item.id}`}
                        name={`checklist-item-${item.id}`}
                        checked={checked}
                        disabled={busy}
                        onCheckedChange={(value) => {
                            if (value === 'indeterminate') return
                            const next = value === true
                            setError(null)
                            setDeleteError(null)

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
                        {error ? (
                            <p className="text-destructive text-xs">{error}</p>
                        ) : null}
                        {deleteError ? (
                            <p className="text-destructive text-xs">{deleteError}</p>
                        ) : null}
                    </FieldContent>
                </Field>
            </FieldLabel>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 touch-manipulation text-muted-foreground hover:text-destructive sm:size-8"
                aria-label={`Eliminar «${item.title}»`}
                disabled={busy}
                onClick={() => {
                    setError(null)
                    setDeleteError(null)
                    startDeleteTransition(async () => {
                        const result = await deleteChecklistItemAction(item.id)
                        if (!result.success) {
                            setDeleteError(result.error)
                            return
                        }
                        router.refresh()
                    })
                }}
            >
                <X className="size-4" aria-hidden />
            </Button>
        </div>
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
