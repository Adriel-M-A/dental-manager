import { ipcMain } from 'electron'
import * as repo from '../database/clinicalRepo'

export function setupClinicalHandlers() {
  ipcMain.handle('get-clinical-records', (_, patientId: number) => {
    return repo.getRecordsByPatient(patientId)
  })

  ipcMain.handle('add-clinical-record', (_, record: repo.ClinicalRecord) => {
    return repo.addClinicalRecord(record)
  })

  ipcMain.handle('delete-clinical-record', (_, id: number) => {
    return repo.deleteClinicalRecord(id)
  })
}
