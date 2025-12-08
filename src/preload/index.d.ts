import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getPatients: () => Promise<any[]>
      addPatient: (patient: any) => Promise<any>
      updatePatient: (patient: any) => Promise<any>
      deletePatient: (id: number) => Promise<any>
      getPatientByDNI: (dni: string) => Promise<any>
    }
  }
}
