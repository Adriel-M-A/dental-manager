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
      getPatientById: (id: number) => Promise<any>
      getClinicalRecords: (patientId: number) => Promise<any[]>
      addClinicalRecord: (record: any) => Promise<any>
      deleteClinicalRecord: (id: number) => Promise<any>
      getTreatments: () => Promise<any[]>
      addTreatment: (t: any) => Promise<any>
      updateTreatment: (t: any) => Promise<any>
      deleteTreatment: (id: number) => Promise<any>
      getPayments: (patientId: number) => Promise<any[]>
      addPayment: (payment: any) => Promise<any>
      deletePayment: (id: number) => Promise<any>
    }
  }
}
