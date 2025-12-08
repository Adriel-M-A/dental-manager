import { useState } from 'react'
import { Plus, Loader2, Stethoscope, DollarSign } from 'lucide-react'
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

interface AddEvolutionDialogProps {
  patientId: number
  onRecordSaved: () => void
}

export function AddEvolutionDialog({ patientId, onRecordSaved }: AddEvolutionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description) return

    setLoading(true)
    try {
      await window.api.addClinicalRecord({
        patient_id: patientId,
        description: description,
        cost: Number(cost) || 0
      })

      setOpen(false)
      setDescription('')
      setCost('')
      onRecordSaved()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" /> Nueva Evolución
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Tratamiento / Evolución</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Descripción del Tratamiento
            </Label>
            <Textarea
              placeholder="Ej: Extracción muela del juicio, limpieza profunda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-base"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Costo (Opcional)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="pl-7"
              />
            </div>
            <p className="text-xs text-slate-400">
              Este valor se guardará en la cuenta corriente del paciente.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading || !description}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Registro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
