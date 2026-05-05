'use client'

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
                <FieldLabel key={item.id}>
                    <Field orientation="horizontal">
                        <Checkbox
                            id={`checklist-item-${item.id}`}
                            name={`checklist-item-${item.id}`}
                            defaultChecked={item.isCompleted}
                        />
                        <FieldContent>
                            <FieldTitle>{item.title}</FieldTitle>
                        </FieldContent>
                    </Field>
                </FieldLabel>
            ))}
        </FieldGroup>
    )
}
