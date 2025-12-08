import { db } from '../db'
import { RunResult } from 'better-sqlite3'

export interface Patient {
  id?: number
  first_name: string
  last_name: string
  dni?: string | null
  phone?: string
  email?: string
  address?: string
  birth_date?: string
  medical_notes?: string
  name?: string
}

const formatPatient = (row: any): Patient => ({
  ...row,
  name: `${row.first_name} ${row.last_name}`
})

export function getPatients(): Patient[] {
  const rows = db.prepare('SELECT * FROM patients ORDER BY last_name ASC, first_name ASC').all()
  return rows.map(formatPatient)
}

export function getPatientById(id: number): Patient | undefined {
  const row = db.prepare('SELECT * FROM patients WHERE id = ?').get(id)
  return row ? formatPatient(row) : undefined
}

export function getPatientByDNI(dni: string): Patient | undefined {
  const row = db.prepare('SELECT * FROM patients WHERE dni = ?').get(dni)
  return row ? formatPatient(row) : undefined
}

export function addPatient(patient: Patient): RunResult {
  const cleanPatient = {
    ...patient,
    dni: patient.dni && patient.dni.trim() !== '' ? patient.dni : null
  }

  const stmt = db.prepare(`
    INSERT INTO patients (first_name, last_name, dni, phone, email, address, birth_date, medical_notes)
    VALUES (@first_name, @last_name, @dni, @phone, @email, @address, @birth_date, @medical_notes)
  `)
  return stmt.run(cleanPatient)
}

export function updatePatient(patient: Patient): RunResult {
  const cleanPatient = {
    ...patient,
    dni: patient.dni && patient.dni.trim() !== '' ? patient.dni : null
  }

  const stmt = db.prepare(`
    UPDATE patients SET 
      first_name = @first_name, 
      last_name = @last_name, 
      dni = @dni, 
      phone = @phone, 
      email = @email, 
      address = @address, 
      birth_date = @birth_date, 
      medical_notes = @medical_notes
    WHERE id = @id
  `)
  return stmt.run(cleanPatient)
}

export function deletePatient(id: number): RunResult {
  return db.prepare('DELETE FROM patients WHERE id = ?').run(id)
}
