import { db } from '../db'
import { RunResult } from 'better-sqlite3'

export interface Appointment {
  id?: number
  patient_id: number
  date: string
  time: string
  status: 'pending' | 'completed' | 'cancelled' | 'absent'
  notes?: string
  patient_name?: string
}

export function getAppointments(startDate: string, endDate: string): Appointment[] {
  return db
    .prepare(
      `
    SELECT a.*, (p.first_name || ' ' || p.last_name) as patient_name 
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    WHERE a.date BETWEEN @startDate AND @endDate
    ORDER BY a.date ASC, a.time ASC
  `
    )
    .all({ startDate, endDate }) as Appointment[]
}

export function addAppointment(appt: Appointment): RunResult {
  const stmt = db.prepare(`
    INSERT INTO appointments (patient_id, date, time, status, notes)
    VALUES (@patient_id, @date, @time, @status, @notes)
  `)
  return stmt.run(appt)
}

export function updateAppointmentStatus(id: number, status: string): RunResult {
  return db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, id)
}

export function deleteAppointment(id: number): RunResult {
  return db.prepare('DELETE FROM appointments WHERE id = ?').run(id)
}
