'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import {
    debtSchema,
    type DebtFormInput,
    type DebtFormValues,
} from '@/schemas/debt.schema'
import { useState } from 'react'
import { createDebtAction } from '@/app/actions/create-debt-action'

export function DebtForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<DebtFormInput, unknown, DebtFormValues>({
        resolver: zodResolver(debtSchema),
        defaultValues: {
            name: '',
            bank: '',
            currency: 'EUR',
            monthlyPayment: 0,
            totalDues: null,
            duesPaid: 0,
            paymentDate: '',
            endDate: '',
            totalAmount: null,
            outstandingAmount: null,
            isPaidThisMonth: false,
        },
    })

    const [serverError, setServerError] = useState<string | null>(null)
    const [serverSuccess, setServerSuccess] = useState<string | null>(null)

    const isPaidThisMonth = watch('isPaidThisMonth')
    const selectedCurrency = watch('currency')

    const onSubmit = async (values: DebtFormValues): Promise<void> => {
        setServerError(null)
        setServerSuccess(null)

        const result = await createDebtAction(values)

        if (!result.success) {
            setServerError(result.error)
            return
        }

        reset({
            name: '',
            bank: '',
            currency: 'EUR',
            monthlyPayment: 0,
            totalDues: null,
            duesPaid: 0,
            paymentDate: '',
            endDate: '',
            totalAmount: null,
            outstandingAmount: null,
            isPaidThisMonth: false,
        })

        setServerSuccess('Deuda guardada correctamente.')
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                    Añadir nueva financiación o suscripción
                </p>
                <h2 className="text-xl font-semibold">Nueva deuda</h2>
                <p className="text-sm text-muted-foreground">
                    Registra una nueva financiación, cuota o deuda mensual.
                </p>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        placeholder="Ej. Amazon - Cofidis (ASUS TUF)"
                        {...register('name')}
                    />
                    {errors.name ? (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    ) : null}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bank">Banco</Label>
                    <Input id="bank" placeholder="Ej. OPENBANK" {...register('bank')} />
                    {errors.bank ? (
                        <p className="text-sm text-destructive">{errors.bank.message}</p>
                    ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="currency">Moneda</Label>
                        <Select
                            defaultValue="EUR"
                            onValueChange={(value: 'EUR' | 'USD') => {
                                setValue('currency', value, { shouldValidate: true })
                            }}
                        >
                            <SelectTrigger id="currency">
                                <SelectValue placeholder="Selecciona una moneda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.currency ? (
                            <p className="text-sm text-destructive">
                                {errors.currency.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyPayment">
                            Cuota mensual ({selectedCurrency})
                        </Label>
                        <Input
                            id="monthlyPayment"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('monthlyPayment')}
                        />
                        {errors.monthlyPayment ? (
                            <p className="text-sm text-destructive">
                                {errors.monthlyPayment.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="totalDues">Total cuotas</Label>
                        <Input
                            id="totalDues"
                            type="number"
                            placeholder="Ej. 30"
                            {...register('totalDues')}
                        />
                        {errors.totalDues ? (
                            <p className="text-sm text-destructive">
                                {errors.totalDues.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="duesPaid">Cuotas pagadas</Label>
                        <Input
                            id="duesPaid"
                            type="number"
                            placeholder="Ej. 28"
                            {...register('duesPaid')}
                        />
                        {errors.duesPaid ? (
                            <p className="text-sm text-destructive">
                                {errors.duesPaid.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="paymentDate">Fecha de cobro</Label>
                        <Input
                            id="paymentDate"
                            placeholder="Ej. 02 de cada mes"
                            {...register('paymentDate')}
                        />
                        {errors.paymentDate ? (
                            <p className="text-sm text-destructive">
                                {errors.paymentDate.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="endDate">Fecha fin de pago</Label>
                        <Input
                            id="endDate"
                            placeholder="YYYY-MM-DD"
                            {...register('endDate')}
                        />
                        {errors.endDate ? (
                            <p className="text-sm text-destructive">
                                {errors.endDate.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="totalAmount">Valor total</Label>
                        <Input
                            id="totalAmount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('totalAmount')}
                        />
                        {errors.totalAmount ? (
                            <p className="text-sm text-destructive">
                                {errors.totalAmount.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="outstandingAmount">Valor restante</Label>
                        <Input
                            id="outstandingAmount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('outstandingAmount')}
                        />
                        {errors.outstandingAmount ? (
                            <p className="text-sm text-destructive">
                                {errors.outstandingAmount.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border p-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Pagado este mes</p>
                        <p className="text-xs text-muted-foreground">
                            Marca si esta deuda ya fue pagada en el mes actual.
                        </p>
                    </div>

                    <Switch
                        checked={isPaidThisMonth}
                        onCheckedChange={(checked: boolean) => {
                            setValue('isPaidThisMonth', checked, { shouldValidate: true })
                        }}
                        aria-label="Pagado este mes"
                    />
                </div>

                {serverError ? (
                    <p className="text-sm text-destructive">{serverError}</p>
                ) : null}

                {serverSuccess ? (
                    <p className="text-sm text-green-600">{serverSuccess}</p>
                ) : null}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar deuda'}
                </Button>
            </form>
        </div>
    )
}
