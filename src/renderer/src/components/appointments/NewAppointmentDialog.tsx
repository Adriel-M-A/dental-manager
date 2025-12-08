import { useState, useEffect, useRef } from 'react'
import { Plus, Loader2, Search, User, Phone, Clock, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface NewAppointmentDialogProps {
  onAppointmentSaved: () => void
}

export function NewAppointmentDialog({ onAppointmentSaved }: NewAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Estado del Formulario
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [hour, setHour] = useState('09')
  const [minute, setMinute] = useState('00')
  const [notes, setNotes] = useState('')

  // Estado de Búsqueda
  const [searchDni, setSearchDni] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Referencias para el scroll automático (opcional, para mejorar UX luego)
  const hoursRef = useRef<HTMLDivElement>(null)

  const resetForm = () => {
    setDate(new Date())
    setHour('09')
    setMinute('00')
    setNotes('')
    setSearchDni('')
    setSelectedPatient(null)
    setSearchError('')
    setIsSearching(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setTimeout(() => resetForm(), 300)
    }
  }

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setSearchDni(value)
    }
  }

  const handleSearchPatient = async () => {
    if (!searchDni) return
    setIsSearching(true)
    setSearchError('')
    setSelectedPatient(null)

    try {
      const patient = await window.api.getPatientByDNI(searchDni)
      if (patient) {
        setSelectedPatient(patient)
      } else {
        setSearchError('No se encontró paciente.')
      }
    } catch (error) {
      console.error(error)
      setSearchError('Error de búsqueda.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async () => {
    if (!date || !selectedPatient) return

    setLoading(true)
    try {
      const finalTime = `${hour}:${minute}`
      await window.api.addAppointment({
        patient_id: selectedPatient.id,
        date: format(date, 'yyyy-MM-dd'),
        time: finalTime,
        status: 'pending',
        notes: notes
      })

      setOpen(false)
      onAppointmentSaved()
      resetForm()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generamos horas (08 a 22 para un horario normal de consultorio, o 00-23 si prefieres)
  const hours = Array.from({ length: 15 }, (_, i) => (i + 8).toString().padStart(2, '0'))
  // Nota: Si quieres las 24hs cambia el length a 24 y quita el +8

  // Minutos cada 5 (00, 05, 10...)
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Agendar Turno
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl">Nuevo Turno</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-[550px]">
          {/* COLUMNA 1: FECHA Y HORA */}
          <div className="w-full md:w-[380px] bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-6">
            {/* Calendario */}
            <div className="w-full flex justify-center">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={es}
                  className="rounded-md"
                  classNames={{
                    head_cell: 'text-slate-400 font-normal text-[0.8rem]',
                    cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md',
                    day_selected:
                      'bg-slate-900 text-white hover:bg-slate-900 hover:text-white focus:bg-slate-900 focus:text-white',
                    day_today: 'bg-slate-100 text-slate-900 font-bold'
                  }}
                />
              </div>
            </div>

            {/* SELECCIÓN DE HORA (LISTA VISUAL) */}
            <div className="flex-1 flex flex-col min-h-0">
              <Label className="flex items-center gap-2 text-slate-600 mb-2">
                <Clock className="w-4 h-4" /> Seleccionar Horario
              </Label>

              <div className="flex-1 flex border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                {/* Columna Horas */}
                <div className="flex-1 flex flex-col border-r border-slate-100">
                  <div className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 border-b border-slate-100">
                    HORA
                  </div>
                  <div className="overflow-y-auto p-1 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-1">
                      {hours.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHour(h)}
                          className={cn(
                            'py-2 rounded text-sm font-medium transition-colors',
                            hour === h
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100'
                          )}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Columna Minutos */}
                <div className="flex-1 flex flex-col">
                  <div className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 border-b border-slate-100">
                    MINUTOS
                  </div>
                  <div className="overflow-y-auto p-1 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-1">
                      {minutes.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMinute(m)}
                          className={cn(
                            'py-2 rounded text-sm font-medium transition-colors',
                            minute === m
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100'
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: PACIENTE Y DETALLES */}
          <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
            <div className="space-y-3">
              <Label className="text-slate-600">Buscar Paciente</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingrese DNI (Solo números)..."
                  value={searchDni}
                  onChange={handleDniChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient()}
                  autoFocus
                  className="bg-white"
                />
                <Button
                  type="button"
                  onClick={handleSearchPatient}
                  disabled={isSearching || !searchDni}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {searchError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {searchError}
                </div>
              )}

              {selectedPatient ? (
                <Card className="bg-blue-50/50 border-blue-100 shadow-none animate-in fade-in zoom-in-95 duration-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-100/50 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-blue-900 text-lg">
                          {selectedPatient.name}
                        </span>
                      </div>
                      <span className="font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm">
                        DNI: {selectedPatient.dni}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-blue-800 px-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 opacity-70" />
                        <span>{selectedPatient.phone || 'Sin teléfono'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 opacity-70" />
                        <span>{selectedPatient.email || 'Sin email'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                !searchError && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-sm bg-slate-50/30">
                    <User className="w-8 h-8 mb-2 opacity-20" />
                    <span>Ingrese DNI para buscar</span>
                  </div>
                )
              )}
            </div>

            <div className="h-px bg-slate-100 w-full" />

            <div className="space-y-2 flex-1 flex flex-col">
              <Label className="text-slate-600">Notas Adicionales</Label>
              <Textarea
                placeholder="Motivo de la consulta..."
                className="resize-none flex-1 min-h-[100px] bg-white"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !selectedPatient || !date}
                className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
