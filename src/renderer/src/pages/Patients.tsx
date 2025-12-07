import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, Edit } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog'

// Definimos la forma de nuestros datos
interface Patient {
  id?: number
  name: string
  dni: string
  phone: string
  email: string
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    email: '',
    address: '',
    medical_notes: ''
  })

  // 1. Cargar pacientes al iniciar
  const loadPatients = async () => {
    try {
      const data = await window.api.getPatients()
      setPatients(data)
    } catch (error) {
      console.error('Error cargando pacientes:', error)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  // 2. Manejar el guardado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await window.api.addPatient(formData)
      setIsDialogOpen(false) // Cerrar modal
      setFormData({ name: '', dni: '', phone: '', email: '', address: '', medical_notes: '' }) // Limpiar form
      loadPatients() // Recargar lista
    } catch (error) {
      console.error('Error guardando:', error)
    }
  }

  // 3. Manejar eliminación
  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
      await window.api.deletePatient(id)
      loadPatients()
    }
  }

  // Filtro de búsqueda local
  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni?.includes(searchTerm)
  )

  return (
    <div className="p-6 space-y-6">
      {/* HEADER: Título y Botón Agregar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pacientes</h2>
          <p className="text-slate-500">Gestión de historias clínicas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dni" className="text-right">
                  DNI
                </Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <Button type="submit" className="ml-auto bg-blue-600 text-white">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-md px-3 py-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          className="flex-1 bg-transparent outline-none text-sm"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLA DE PACIENTES */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Nombre</TableHead>
              <TableHead className="font-bold text-slate-700">DNI</TableHead>
              <TableHead className="font-bold text-slate-700">Contacto</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium text-slate-900">{patient.name}</TableCell>
                  <TableCell>{patient.dni || '-'}</TableCell>
                  <TableCell>{patient.phone || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => patient.id && handleDelete(patient.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  No se encontraron pacientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
