import { db } from '../db'
import { RunResult } from 'better-sqlite3'

export interface Patient {
  id?: number
  name: string
  dni?: string
  phone?: string
  email?: string
  address?: string
  birth_date?: string
  medical_notes?: string
}

export function getPatients(): Patient[] {
  return db.prepare('SELECT * FROM patients ORDER BY name ASC').all() as Patient[]
}

export function addPatient(patient: Patient): RunResult {
  const stmt = db.prepare(`
    INSERT INTO patients (name, dni, phone, email, address, birth_date, medical_notes)
    VALUES (@name, @dni, @phone, @email, @address, @birth_date, @medical_notes)
  `)
  return stmt.run(patient)
}

export function updatePatient(patient: Patient): RunResult {
  const stmt = db.prepare(`
    UPDATE patients SET 
      name = @name, dni = @dni, phone = @phone, email = @email, 
      address = @address, birth_date = @birth_date, medical_notes = @medical_notes
    WHERE id = @id
  `)
  return stmt.run(patient)
}

export function deletePatient(id: number): RunResult {
  return db.prepare('DELETE FROM patients WHERE id = ?').run(id)
}

export function getPatientByDNI(dni: string): Patient | undefined {
  return db.prepare('SELECT * FROM patients WHERE dni = ?').get(dni) as Patient | undefined
}

export function getPatientById(id: number): Patient | undefined {
  return db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as Patient | undefined
}
