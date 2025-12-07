import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react' // Agregamos icono de carga
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface CreatePatientDialogProps {
  onPatientSaved: () => void
}

export function CreatePatientDialog({ onPatientSaved }: CreatePatientDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    email: '',
    address: '',
    medical_notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await window.api.addPatient(formData)

      // Limpiar y cerrar
      setFormData({ name: '', dni: '', phone: '', email: '', address: '', medical_notes: '' })
      setOpen(false)

      // Refrescar lista
      onPatientSaved()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nuevo Paciente
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
          <DialogDescription>
            Complete los datos básicos para abrir una nueva historia clínica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nombre */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Juan Pérez"
                required
              />
            </div>

            {/* DNI */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dni" className="text-right">
                DNI
              </Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={handleChange}
                className="col-span-3"
                placeholder="12345678"
              />
            </div>

            {/* Teléfono */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Teléfono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
                placeholder="+54 9 11..."
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                placeholder="juan@mail.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Guardando...' : 'Guardar Paciente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
