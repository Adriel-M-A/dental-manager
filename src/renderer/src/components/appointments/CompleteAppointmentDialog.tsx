import { useState } from 'react'
import { CheckCircle, Loader2, DollarSign, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'

interface CompleteAppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  appointment: any // Recibimos el turno entero
}

export function CompleteAppointmentDialog({
  isOpen,
  onClose,
  onSuccess,
  appointment
}: CompleteAppointmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')

  // Si el turno ya traía notas, las sugerimos en la descripción
  // (Puedes quitar esto si prefieres que empiece vacío)
  useState(() => {
    if (appointment?.notes) {
      setDescription(appointment.notes)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointment) return

    setLoading(true)
    try {
      // 1. Crear la Evolución (Historia Clínica)
      await window.api.addClinicalRecord({
        patient_id: appointment.patient_id,
        description: description || 'Consulta realizada', // Texto por defecto si lo deja vacío
        cost: Number(cost) || 0
      })

      // 2. Marcar el Turno como Completado
      await window.api.updateAppointmentStatus(appointment.id, 'completed')

      onSuccess()
      onClose()
      setDescription('')
      setCost('')
    } catch (error) {
      console.error('Error al completar turno:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" /> Completar Turno
          </DialogTitle>
          <DialogDescription>
            Registra el tratamiento realizado para la historia clínica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-100 mb-2">
            <p className="text-sm font-medium text-slate-700">
              Paciente: {appointment?.patient_name}
            </p>
            <p className="text-xs text-slate-500">Horario: {appointment?.time} hs</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Tratamiento Realizado / Evolución
            </Label>
            <Textarea
              placeholder="Ej: Caries en pieza 24, obturación con composite..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-base"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Costo del Tratamiento
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar y Finalizar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
