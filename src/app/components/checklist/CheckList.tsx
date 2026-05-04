'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field'

export function CheckList() {
    return (
        <FieldGroup className="max-w-sm">
            <FieldLabel>
                <Field orientation="horizontal">
                    <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
                    <FieldContent>
                        <FieldTitle>Pasar 600€ a Fausto</FieldTitle>
                        <FieldDescription>
                            You can enable or disable notifications at any time.
                        </FieldDescription>
                    </FieldContent>
                </Field>
            </FieldLabel>
            <FieldLabel>
                <Field orientation="horizontal">
                    <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
                    <FieldContent>
                        <FieldTitle>Pasar 530€ a Openbank cuotas</FieldTitle>
                        <FieldDescription>
                            You can enable or disable notifications at any time.
                        </FieldDescription>
                    </FieldContent>
                </Field>
            </FieldLabel>
        </FieldGroup>
    )
}
