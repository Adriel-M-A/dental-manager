import { useEffect, useState } from 'react'
import { ArrowLeft, User, FileText, CreditCard, Activity, Trash2, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { AddEvolutionDialog } from '@/components/patients/AddEvolutionDialog'

interface PatientDetailProps {
  patientId: number
  onBack: () => void
}

export default function PatientDetail({ patientId, onBack }: PatientDetailProps) {
  const [patient, setPatient] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const patientData = await window.api.getPatientById(patientId)
      setPatient(patientData)

      const recordsData = await window.api.getClinicalRecords(patientId)
      setRecords(recordsData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [patientId])

  const handleDeleteRecord = async (id: number) => {
    if (confirm('¿Borrar este registro?')) {
      await window.api.deleteClinicalRecord(id)
      loadData() // Recargar lista
    }
  }

  if (loading)
    return <div className="p-8 flex justify-center text-slate-500">Cargando ficha...</div>
  if (!patient) return <div className="p-8 text-red-500">Paciente no encontrado</div>

  return (
    <div className="flex flex-col h-full bg-slate-50/30 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <Button
          variant="ghost"
          className="mb-2 pl-0 text-slate-500 hover:text-slate-800 hover:bg-transparent -ml-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al listado
        </Button>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              {patient.name}
              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                Ficha #{patient.id}
              </span>
            </h1>
            <div className="flex gap-6 mt-3 text-slate-600 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" /> {patient.dni || 'Sin DNI'}
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-400" /> {patient.phone || 'Sin teléfono'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="flex-1 p-8 overflow-hidden">
        <Tabs defaultValue="evolution" className="h-full flex flex-col">
          <TabsList className="w-fit bg-slate-100 p-1">
            <TabsTrigger
              value="evolution"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="w-4 h-4" /> Evolución
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <User className="w-4 h-4" /> Datos Personales
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CreditCard className="w-4 h-4" /> Pagos
            </TabsTrigger>
          </TabsList>

          <Separator className="my-4 bg-slate-200" />

          {/* CONTENIDO 1: HISTORIA CLÍNICA */}
          <TabsContent
            value="evolution"
            className="flex-1 border border-slate-200 rounded-xl bg-white flex flex-col shadow-sm mt-0 h-full overflow-hidden"
          >
            {/* Header de la Pestaña */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-700">Historial de Tratamientos</h3>
              <AddEvolutionDialog patientId={patient.id} onRecordSaved={loadData} />
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-auto p-6">
              {records.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <FileText className="w-8 h-8 opacity-20" />
                  </div>
                  <p>Aún no hay registros de evolución.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
                  {records.map((record) => (
                    <div key={record.id} className="relative pl-10 group">
                      {/* Punto en la línea de tiempo */}
                      <div className="absolute left-0 top-1.5 w-10 h-10 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white shadow-sm z-10"></div>
                      </div>

                      {/* Tarjeta del registro */}
                      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="capitalize">
                              {record.date
                                ? format(parseISO(record.date), "EEEE d 'de' MMMM, yyyy", {
                                    locale: es
                                  })
                                : 'Fecha desconocida'}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span>
                              {record.date
                                ? format(parseISO(record.date), 'HH:mm', { locale: es })
                                : ''}{' '}
                              hs
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        <p className="text-slate-800 text-base whitespace-pre-wrap leading-relaxed">
                          {record.description}
                        </p>

                        {record.cost > 0 && (
                          <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-md border border-green-100">
                            Costo: ${record.cost.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* CONTENIDO 2: DATOS PERSONALES */}
          <TabsContent
            value="general"
            className="flex-1 border border-slate-200 rounded-xl bg-white p-8 shadow-sm mt-0 h-full overflow-auto"
          >
            <div className="max-w-2xl grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
                  Dirección
                </h3>
                <p className="text-slate-600 p-3 bg-slate-50 rounded-md border border-slate-100">
                  {patient.address || 'No registrada'}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
                  Notas Médicas / Alergias
                </h3>
                <p className="text-slate-600 p-3 bg-amber-50/50 rounded-md border border-amber-100 text-amber-900">
                  {patient.medical_notes || 'Sin notas médicas.'}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
                  Email
                </h3>
                <p className="text-slate-600 p-3 bg-slate-50 rounded-md border border-slate-100">
                  {patient.email || 'No registrado'}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* CONTENIDO 3: PAGOS */}
          <TabsContent
            value="payments"
            className="flex-1 border border-slate-200 rounded-xl bg-white p-6 shadow-sm mt-0 h-full"
          >
            <p className="text-slate-400 text-center mt-10">Módulo de pagos próximamente...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
