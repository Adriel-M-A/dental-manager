import { useState, useEffect } from 'react'
import { CheckCircle, Loader2, DollarSign, FileText, X, Stethoscope } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface CompleteAppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  appointment: any
}

export function CompleteAppointmentDialog({
  isOpen,
  onClose,
  onSuccess,
  appointment
}: CompleteAppointmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [finalCost, setFinalCost] = useState<string>('0')

  const [availableTreatments, setAvailableTreatments] = useState<any[]>([])
  const [selectedTreatments, setSelectedTreatments] = useState<any[]>([])
  const [currentSelectValue, setCurrentSelectValue] = useState<string>('')

  useEffect(() => {
    if (isOpen && appointment) {
      const init = async () => {
        try {
          const treatments = await window.api.getTreatments()
          setAvailableTreatments(treatments)

          let initialTreatments: any[] = []
          let cleanNotes = appointment.notes || ''

          const regex = /^\[(.*?)\]\s*(.*)$/s
          const match = cleanNotes.match(regex)

          if (match) {
            const preSelectedName = match[1]
            cleanNotes = match[2]

            const foundTreatment = treatments.find((t) => t.name === preSelectedName)
            if (foundTreatment) {
              initialTreatments.push(foundTreatment)
            }
          }

          setSelectedTreatments(initialTreatments)
          setNotes(cleanNotes)
        } catch (error) {
          console.error('Error cargando datos del turno', error)
        }
      }
      init()
    }
  }, [isOpen, appointment])

  useEffect(() => {
    const total = selectedTreatments.reduce((sum, item) => sum + item.default_price, 0)
    setFinalCost(total.toString())
  }, [selectedTreatments])

  const handleAddTreatment = (treatmentId: string) => {
    const treatment = availableTreatments.find((t) => t.id.toString() === treatmentId)
    if (treatment) {
      setSelectedTreatments((prev) => [...prev, treatment])
      setCurrentSelectValue('')
    }
  }

  const handleRemoveTreatment = (index: number) => {
    setSelectedTreatments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointment) return

    setLoading(true)
    try {
      let description = ''

      if (selectedTreatments.length > 0) {
        const treatmentsList = selectedTreatments.map((t) => t.name).join(', ')
        description += `Realizado: ${treatmentsList}. \n`
      }

      if (notes) {
        description += `Notas: ${notes}`
      }

      if (!description) description = 'Consulta realizada.'

      await window.api.addClinicalRecord({
        patient_id: appointment.patient_id,
        description: description,
        cost: Number(finalCost) || 0
      })

      await window.api.updateAppointmentStatus(appointment.id, 'completed')

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error al completar turno:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* CAMBIO: Aumentado de sm:max-w-[500px] a sm:max-w-[600px] */}
      <DialogContent className="sm:max-w-[600px] w-full gap-5 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" /> Completar Turno
          </DialogTitle>
          <DialogDescription>
            Confirme los tratamientos realizados y el costo final.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-100 flex justify-between items-center w-full shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-800">{appointment?.patient_name}</p>
              <p className="text-xs text-slate-500">Horario: {appointment?.time} hs</p>
            </div>
            <Badge variant="secondary" className="bg-white border-slate-200">
              Ficha #{appointment?.patient_id}
            </Badge>
          </div>

          <div className="space-y-3 w-full">
            <Label className="flex items-center gap-2 text-slate-700 font-semibold">
              <Stethoscope className="w-4 h-4" /> Tratamientos Realizados
            </Label>

            <div className="w-full">
              <Select value={currentSelectValue} onValueChange={handleAddTreatment}>
                <SelectTrigger className="bg-white border-slate-300 w-full shadow-sm">
                  <SelectValue placeholder="Agregar servicio..." />
                </SelectTrigger>

                <SelectContent className="max-h-[250px] w-[var(--radix-select-trigger-width)]">
                  {availableTreatments.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      <div className="grid grid-cols-[1fr_auto] gap-4 w-full items-center">
                        <span
                          className="truncate text-left font-medium text-slate-700"
                          title={t.name}
                        >
                          {t.name}
                        </span>
                        <span className="text-slate-500 font-normal">
                          $ {t.default_price.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden w-full">
              {selectedTreatments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 italic">
                  Ningún tratamiento seleccionado.
                </p>
              ) : (
                <div className="max-h-[140px] overflow-y-auto p-1 space-y-1 custom-scrollbar w-full">
                  {selectedTreatments.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_auto] gap-3 items-center bg-white px-3 py-2 rounded border border-slate-100 shadow-sm w-full"
                    >
                      <span
                        className="text-sm font-medium text-slate-700 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                          $ {item.default_price.toLocaleString()}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-slate-300 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveTreatment(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label className="flex items-center gap-2 font-semibold text-slate-700">
              <FileText className="w-4 h-4" /> Notas / Observaciones
            </Label>
            <Textarea
              placeholder="Detalles clínicos adicionales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-[80px] text-sm resize-none bg-white w-full border-slate-200 shadow-sm"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 w-full">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <DollarSign className="w-5 h-5 text-green-600" /> Costo Final
              </Label>
              <p className="text-[10px] text-slate-400">Se cargará a la cuenta corriente</p>
            </div>

            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                $
              </span>
              <Input
                type="number"
                value={finalCost}
                onChange={(e) => setFinalCost(e.target.value)}
                className="pl-10 h-14 text-2xl font-bold text-slate-800 bg-green-50/30 border-green-200 focus-visible:ring-green-500 text-right pr-4 w-full shadow-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 w-full">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Historia
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
