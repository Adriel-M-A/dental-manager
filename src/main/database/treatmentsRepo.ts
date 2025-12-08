import { db } from '../db'
import { RunResult } from 'better-sqlite3'

export interface Treatment {
  id?: number
  name: string
  default_price: number
}

export function getTreatments(): Treatment[] {
  return db.prepare('SELECT * FROM treatments ORDER BY name ASC').all() as Treatment[]
}

export function addTreatment(treatment: Treatment): RunResult {
  return db
    .prepare('INSERT INTO treatments (name, default_price) VALUES (@name, @default_price)')
    .run(treatment)
}

export function updateTreatment(treatment: Treatment): RunResult {
  return db
    .prepare('UPDATE treatments SET name = @name, default_price = @default_price WHERE id = @id')
    .run(treatment)
}

export function deleteTreatment(id: number): RunResult {
  return db.prepare('DELETE FROM treatments WHERE id = ?').run(id)
}
