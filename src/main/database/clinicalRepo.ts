import { db } from '../db'
import { RunResult } from 'better-sqlite3'

export interface ClinicalRecord {
  id?: number
  patient_id: number
  date?: string
  description: string
  cost: number
  treatment_id?: number // Lo dejamos opcional por ahora
}

// Obtener historial de UN paciente ordenado por fecha (más reciente arriba)
export function getRecordsByPatient(patientId: number): ClinicalRecord[] {
  return db
    .prepare(
      `
    SELECT * FROM clinical_records 
    WHERE patient_id = ? 
    ORDER BY date DESC, id DESC
  `
    )
    .all(patientId) as ClinicalRecord[]
}

export function addClinicalRecord(record: ClinicalRecord): RunResult {
  const stmt = db.prepare(`
    INSERT INTO clinical_records (patient_id, description, cost, date)
    VALUES (@patient_id, @description, @cost, datetime('now', 'localtime'))
  `)
  return stmt.run(record)
}

export function deleteClinicalRecord(id: number): RunResult {
  return db.prepare('DELETE FROM clinical_records WHERE id = ?').run(id)
}
