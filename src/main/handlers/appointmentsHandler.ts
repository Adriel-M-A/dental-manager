import { ipcMain } from 'electron'
import * as repo from '../database/appointmentsRepo'

export function setupAppointmentsHandlers() {
  // Obtener turnos (recibe fecha inicio y fin)
  ipcMain.handle('get-appointments', (_, { startDate, endDate }) => {
    return repo.getAppointments(startDate, endDate)
  })

  // Crear turno
  ipcMain.handle('add-appointment', (_, appointment: repo.Appointment) => {
    return repo.addAppointment(appointment)
  })

  // Cambiar estado (ej: de pendiente a completado)
  ipcMain.handle('update-appointment-status', (_, { id, status }) => {
    return repo.updateAppointmentStatus(id, status)
  })

  // Eliminar turno
  ipcMain.handle('delete-appointment', (_, id: number) => {
    return repo.deleteAppointment(id)
  })
}
