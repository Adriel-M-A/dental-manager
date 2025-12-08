import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// API personalizada para el dentista
const dentalAPI = {
  // --- PACIENTES ---
  getPatients: () => ipcRenderer.invoke('get-patients'),
  addPatient: (patient: any) => ipcRenderer.invoke('add-patient', patient),
  updatePatient: (patient: any) => ipcRenderer.invoke('update-patient', patient),
  deletePatient: (id: number) => ipcRenderer.invoke('delete-patient', id),

  // --- AGENDA (NUEVO) ---
  getAppointments: (range: { startDate: string; endDate: string }) =>
    ipcRenderer.invoke('get-appointments', range),

  addAppointment: (appt: any) => ipcRenderer.invoke('add-appointment', appt),

  updateAppointmentStatus: (id: number, status: string) =>
    ipcRenderer.invoke('update-appointment-status', { id, status }),

  deleteAppointment: (id: number) => ipcRenderer.invoke('delete-appointment', id),

  getPatientByDNI: (dni: string) => ipcRenderer.invoke('get-patient-by-dni', dni),

  getPatientById: (id: number) => ipcRenderer.invoke('get-patient-by-id', id),

  getClinicalRecords: (patientId: number) => ipcRenderer.invoke('get-clinical-records', patientId),
  addClinicalRecord: (record: any) => ipcRenderer.invoke('add-clinical-record', record),
  deleteClinicalRecord: (id: number) => ipcRenderer.invoke('delete-clinical-record', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', dentalAPI) // Exponemos nuestra API
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = dentalAPI
}
