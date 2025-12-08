import { useEffect, useState } from 'react'
import { ArrowLeft, User, FileText, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

interface PatientDetailProps {
  patientId: number
  onBack: () => void
}

export default function PatientDetail({ patientId, onBack }: PatientDetailProps) {
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await window.api.getPatientById(patientId)
        setPatient(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [patientId])

  if (loading) return <div className="p-8">Cargando ficha...</div>
  if (!patient) return <div className="p-8">Paciente no encontrado</div>

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* HEADER: Botón volver y Datos Clave */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al listado
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
            <div className="flex gap-4 mt-2 text-slate-500 text-sm">
              <span>DNI: {patient.dni || '-'}</span>
              <span>•</span>
              <span>{patient.phone || 'Sin teléfono'}</span>
              <span>•</span>
              <span>{patient.email || 'Sin email'}</span>
            </div>
          </div>
          {/* Aquí podríamos poner un botón "Editar" o "Nueva Evolución" */}
        </div>
      </div>

      {/* CONTENIDO CON PESTAÑAS */}
      <div className="flex-1 p-8 overflow-hidden">
        <Tabs defaultValue="evolution" className="h-full flex flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="evolution" className="gap-2">
              <FileText className="w-4 h-4" /> Evolución
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <User className="w-4 h-4" /> Datos Generales
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" /> Pagos
            </TabsTrigger>
          </TabsList>

          <Separator className="my-4" />

          {/* PESTAÑA EVOLUCIÓN (Aquí irá el historial clínico) */}
          <TabsContent
            value="evolution"
            className="flex-1 border rounded-lg bg-white p-4 border-slate-200 shadow-sm mt-0 h-full"
          >
            <div className="text-center text-slate-400 mt-10">
              <p>Aquí cargaremos el historial de tratamientos...</p>
            </div>
          </TabsContent>

          {/* PESTAÑA DATOS GENERALES */}
          <TabsContent
            value="general"
            className="flex-1 border rounded-lg bg-white p-4 border-slate-200 shadow-sm mt-0 h-full"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Dirección</h3>
                <p className="text-slate-600">{patient.address || '-'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Notas Médicas / Alergias</h3>
                <p className="text-slate-600">{patient.medical_notes || 'Ninguna'}</p>
              </div>
            </div>
          </TabsContent>

          {/* PESTAÑA PAGOS */}
          <TabsContent
            value="payments"
            className="flex-1 border rounded-lg bg-white p-4 border-slate-200 shadow-sm mt-0 h-full"
          >
            <p className="text-slate-400">Próximamente...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
