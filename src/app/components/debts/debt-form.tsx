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

/** Valores de inputs numéricos en RHF pueden ser unknown hasta validar. */
function parseNumericInput(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : null
}

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
            isPaidThisMonth: false,
        },
    })

    const [serverError, setServerError] = useState<string | null>(null)
    const [serverSuccess, setServerSuccess] = useState<string | null>(null)

    const isPaidThisMonth = watch('isPaidThisMonth')
    const selectedCurrency = watch('currency')
    const totalDues = watch('totalDues')
    const duesPaid = watch('duesPaid')
    const totalAmount = watch('totalAmount')
    const monthlyPayment = watch('monthlyPayment')

    const totalDuesNum = parseNumericInput(totalDues)
    const duesPaidNum = parseNumericInput(duesPaid) ?? 0
    const totalAmountNum = parseNumericInput(totalAmount)
    const monthlyPaymentNum = parseNumericInput(monthlyPayment) ?? 0

    const calculatedOutstandingDues =
        totalDuesNum !== null ? Math.max(totalDuesNum - duesPaidNum, 0) : null

    const calculatedOutstandingAmount =
        totalAmountNum !== null
            ? Math.max(totalAmountNum - monthlyPaymentNum * duesPaidNum, 0)
            : null

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

                {calculatedOutstandingDues !== null ? (
                    <p className="text-sm text-muted-foreground">
                        Cuotas restantes: <strong>{calculatedOutstandingDues}</strong>
                    </p>
                ) : null}

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

                <div className="grid gap-4">
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

                    {calculatedOutstandingAmount !== null ? (
                        <div className="rounded-xl border bg-muted/40 p-4">
                            <p className="text-sm font-medium">
                                Valor restante calculado
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: selectedCurrency,
                                }).format(calculatedOutstandingAmount)}
                            </p>
                        </div>
                    ) : null}
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

                <Button
                    type="submit"
                    className="w-full p-6 cursor-pointer"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar deuda'}
                </Button>
            </form>
        </div>
    )
}
