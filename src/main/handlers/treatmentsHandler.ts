import { ipcMain } from 'electron'
import * as repo from '../database/treatmentsRepo'

export function setupTreatmentsHandlers() {
  ipcMain.handle('get-treatments', () => repo.getTreatments())

  ipcMain.handle('add-treatment', (_, t: repo.Treatment) => repo.addTreatment(t))

  ipcMain.handle('update-treatment', (_, t: repo.Treatment) => repo.updateTreatment(t))

  ipcMain.handle('delete-treatment', (_, id: number) => repo.deleteTreatment(id))
}
