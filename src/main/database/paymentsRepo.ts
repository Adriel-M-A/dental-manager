import { db } from '../db'
import { RunResult } from 'better-sqlite3'

export interface Payment {
  id?: number
  patient_id: number
  amount: number
  date?: string
  method: string
  notes?: string
}

export function getPaymentsByPatient(patientId: number): Payment[] {
  return db
    .prepare(
      `
    SELECT * FROM payments 
    WHERE patient_id = ? 
    ORDER BY date DESC
  `
    )
    .all(patientId) as Payment[]
}

export function addPayment(payment: Payment): RunResult {
  const stmt = db.prepare(`
    INSERT INTO payments (patient_id, amount, method, notes, date)
    VALUES (@patient_id, @amount, @method, @notes, datetime('now', 'localtime'))
  `)
  return stmt.run(payment)
}

export function deletePayment(id: number): RunResult {
  return db.prepare('DELETE FROM payments WHERE id = ?').run(id)
}
