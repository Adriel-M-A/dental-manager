import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TreatmentDialog } from '@/components/treatments/TreatmentDialog'

export default function Treatments() {
  const [treatments, setTreatments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<any | null>(null)

  const loadTreatments = async () => {
    try {
      const data = await window.api.getTreatments()
      setTreatments(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadTreatments()
  }, [])

  const handleCreate = () => {
    setEditingTreatment(null) // Limpiar para crear uno nuevo
    setIsModalOpen(true)
  }

  const handleEdit = (t: any) => {
    setEditingTreatment(t) // Cargar datos
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este tratamiento de la lista?')) {
      await window.api.deleteTreatment(id)
      loadTreatments()
    }
  }

  const filtered = treatments.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tratamientos</h2>
          <p className="text-slate-500">Lista de precios y catálogo de servicios</p>
        </div>
        <Button onClick={handleCreate} className="bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Tratamiento
        </Button>
      </div>

      {/* BUSCADOR */}
      <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-md px-3 py-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <Input
          className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0 placeholder:text-slate-400"
          placeholder="Buscar servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-700 w-2/3">
                Servicio / Tratamiento
              </TableHead>
              <TableHead className="font-semibold text-slate-700">Precio Base</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <TableRow key={t.id} className="group">
                  <TableCell className="font-medium text-slate-900 flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-md text-slate-500">
                      <Tag className="w-4 h-4" />
                    </div>
                    {t.name}
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    $ {t.default_price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                        <Edit className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-slate-500">
                  {searchTerm ? 'No se encontraron resultados.' : 'Aún no cargaste tratamientos.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL (Compartido para Crear y Editar) */}
      <TreatmentDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadTreatments}
        treatmentToEdit={editingTreatment}
      />
    </div>
  )
}
