import { ipcMain } from 'electron'
import * as repo from '../database/paymentsRepo'

export function setupPaymentsHandlers() {
  ipcMain.handle('get-payments', (_, patientId: number) => {
    return repo.getPaymentsByPatient(patientId)
  })

  ipcMain.handle('add-payment', (_, payment: repo.Payment) => {
    return repo.addPayment(payment)
  })

  ipcMain.handle('delete-payment', (_, id: number) => {
    return repo.deletePayment(id)
  })
}
