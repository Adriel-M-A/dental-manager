import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, FileText, Trash2, CheckCircle, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewAppointmentDialog } from '@/components/appointments/NewAppointmentDialog'

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<any[]>([])

  const loadAppointments = async () => {
    if (!date) return
    const dateStr = format(date, 'yyyy-MM-dd')
    try {
      const data = await window.api.getAppointments({
        startDate: dateStr,
        endDate: dateStr
      })
      setAppointments(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [date])

  const handleStatusChange = async (id: number, status: string) => {
    await window.api.updateAppointmentStatus(id, status)
    loadAppointments()
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Cancelar este turno?')) {
      await window.api.deleteAppointment(id)
      loadAppointments()
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      {/* HEADER SUPERIOR */}
      <div className="px-8 py-6 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Agenda</h2>
          <div className="flex items-center text-slate-500 mt-1 gap-2">
            <CalendarIcon className="w-4 h-4" />
            <p className="capitalize">
              {date
                ? format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
                : 'Seleccione fecha'}
            </p>
          </div>
        </div>
        <NewAppointmentDialog onAppointmentSaved={loadAppointments} />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* IZQUIERDA: CALENDARIO (Centrado) */}
        <div className="flex-1 p-8 flex justify-center items-center overflow-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-4"
              locale={es}
              classNames={{
                month: 'space-y-6',
                caption: 'flex justify-center pt-2 relative items-center text-xl font-medium',
                head_cell: 'text-slate-500 rounded-md w-14 font-normal text-[1rem]',
                cell: 'h-14 w-14 text-center text-lg p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-14 w-14 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors',
                day_selected:
                  'bg-slate-900 text-white hover:bg-slate-900 hover:text-white focus:bg-slate-900 focus:text-white',
                day_today: 'bg-slate-100 text-slate-900 font-bold'
              }}
            />
          </div>
        </div>

        {/* DERECHA: LISTA DE TURNOS (Ancho aumentado a 500px) */}
        <div className="w-[500px] border-l border-slate-200 bg-white h-full flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Turnos ({appointments.length})
            </h3>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {appointments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm text-center px-8">
                  No hay pacientes agendados para este día.
                </p>
              </div>
            ) : (
              appointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="border shadow-none hover:border-slate-300 transition-colors group"
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {/* Hora */}
                      <div className="flex flex-col items-center justify-center bg-slate-100 rounded px-2 min-w-[3.5rem] h-14">
                        <span className="font-bold text-slate-900 text-sm">{apt.time}</span>
                      </div>

                      {/* Datos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-slate-900 truncate pr-2">
                            {apt.patient_name}
                          </h4>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              apt.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : apt.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {apt.status === 'completed'
                              ? 'OK'
                              : apt.status === 'pending'
                                ? 'Pend'
                                : 'Canc'}
                          </span>
                        </div>

                        {apt.notes && (
                          <p className="text-xs text-slate-500 truncate mt-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {apt.notes}
                          </p>
                        )}

                        {/* Botones */}
                        <div className="flex gap-1 mt-2 justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {apt.status === 'pending' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleStatusChange(apt.id, 'completed')}
                              title="Completar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(apt.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
