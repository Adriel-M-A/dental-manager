import { useState } from 'react'
import { Plus, Loader2, DollarSign, CreditCard, Banknote, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface AddPaymentDialogProps {
  patientId: number
  onPaymentSaved: () => void
}

export function AddPaymentDialog({ patientId, onPaymentSaved }: AddPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('Efectivo')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return

    setLoading(true)
    try {
      await window.api.addPayment({
        patient_id: patientId,
        amount: Number(amount),
        method,
        notes
      })

      setOpen(false)
      setAmount('')
      setNotes('')
      setMethod('Efectivo')
      onPaymentSaved()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Registrar Pago
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" /> Registrar Ingreso
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Monto ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 text-lg font-bold"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Método de Pago</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Efectivo">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" /> Efectivo
                  </div>
                </SelectItem>
                <SelectItem value="Tarjeta Débito">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Tarjeta Débito
                  </div>
                </SelectItem>
                <SelectItem value="Tarjeta Crédito">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Tarjeta Crédito
                  </div>
                </SelectItem>
                <SelectItem value="Transferencia">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4" /> Transferencia
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notas (Opcional)</Label>
            <Textarea
              placeholder="Comprobante, detalles..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || !amount}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
