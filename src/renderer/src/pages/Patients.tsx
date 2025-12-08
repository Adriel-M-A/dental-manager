import { useEffect, useState } from 'react'
import { Search, Trash2, Edit, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { CreatePatientDialog } from '@/components/patients/CreatePatientDialog'

interface PatientsProps {
  onPatientClick?: (id: number) => void
}

export default function Patients({ onPatientClick }: PatientsProps) {
  const [patients, setPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const loadPatients = async () => {
    try {
      const data = await window.api.getPatients()
      setPatients(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
      await window.api.deletePatient(id)
      loadPatients()
    }
  }

  const filteredPatients = patients.filter((p) => {
    const fullName = p.name ? p.name.toLowerCase() : `${p.first_name} ${p.last_name}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase()) || (p.dni && p.dni.includes(searchTerm))
  })

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pacientes</h2>
          <p className="text-slate-500">Gestión de historias clínicas</p>
        </div>
        <CreatePatientDialog onPatientSaved={loadPatients} />
      </div>

      <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-md px-3 py-2 w-full max-w-sm shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-700 w-[30%]">Nombre</TableHead>
              <TableHead className="font-semibold text-slate-700 w-[20%]">DNI</TableHead>
              <TableHead className="font-semibold text-slate-700 w-[20%]">Contacto</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 w-[30%]">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{patient.name}</TableCell>
                  <TableCell className="text-slate-500">{patient.dni || '-'}</TableCell>
                  <TableCell className="text-slate-500">
                    {patient.phone || patient.email || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        title="Ver Historia Clínica"
                        onClick={() => onPatientClick && patient.id && onPatientClick(patient.id)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => patient.id && handleDelete(patient.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  {searchTerm ? 'No se encontraron resultados.' : 'No hay pacientes registrados.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
