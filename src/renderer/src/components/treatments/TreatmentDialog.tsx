import { useState, useEffect } from 'react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'

interface TreatmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  treatmentToEdit?: any | null // Si viene datos, es modo Edición
}

export function TreatmentDialog({
  isOpen,
  onClose,
  onSaved,
  treatmentToEdit
}: TreatmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  // Cargar datos si es edición
  useEffect(() => {
    if (treatmentToEdit) {
      setName(treatmentToEdit.name)
      setPrice(treatmentToEdit.default_price.toString())
    } else {
      setName('')
      setPrice('')
    }
  }, [treatmentToEdit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price) return

    setLoading(true)
    try {
      const data = {
        name,
        default_price: Number(price)
      }

      if (treatmentToEdit) {
        // Modo Edición
        await window.api.updateTreatment({ ...data, id: treatmentToEdit.id })
      } else {
        // Modo Creación
        await window.api.addTreatment(data)
      }

      onSaved()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{treatmentToEdit ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre del Tratamiento</Label>
            <Input
              placeholder="Ej: Limpieza profunda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Precio Base ($)</Label>
            <Input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="w-4 h-4 mr-2" /> Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
