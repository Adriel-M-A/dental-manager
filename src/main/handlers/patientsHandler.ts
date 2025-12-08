import { ipcMain } from 'electron'
import * as repo from '../database/patientsRepo'

export function setupPatientsHandlers() {
  ipcMain.handle('get-patients', () => {
    return repo.getPatients()
  })

  ipcMain.handle('add-patient', (_, patient: repo.Patient) => {
    return repo.addPatient(patient)
  })

  ipcMain.handle('update-patient', (_, patient: repo.Patient) => {
    return repo.updatePatient(patient)
  })

  ipcMain.handle('delete-patient', (_, id: number) => {
    return repo.deletePatient(id)
  })

  ipcMain.handle('get-patient-by-dni', (_, dni: string) => {
    return repo.getPatientByDNI(dni)
  })
}
