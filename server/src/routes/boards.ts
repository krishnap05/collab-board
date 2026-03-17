import { Router, Request, Response } from 'express'
import pool from '../db'

const router = Router()

// get the most recent board
router.get('/latest', async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM boards ORDER BY updated_at DESC LIMIT 1')
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'No boards found' })
    return
  }
  const row = result.rows[0]
  res.json({
    id: row.id,
    name: row.name,
    ...row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })
})

// get a board by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await pool.query('SELECT * FROM boards WHERE id = $1', [id])
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Board not found' })
    return
  }
  const row = result.rows[0]
  res.json({
    id: row.id,
    name: row.name,
    ...row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })
})

// create a new board
router.post('/', async (req: Request, res: Response) => {
  const name = req.body.name || 'Untitled Board'
  const state = {
    notes: req.body.notes || [],
    arrows: req.body.arrows || [],
    textBoxes: req.body.textBoxes || [],
  }
  const result = await pool.query(
    'INSERT INTO boards (name, state) VALUES ($1, $2) RETURNING *',
    [name, JSON.stringify(state)]
  )
  const row = result.rows[0]
  res.status(201).json({
    id: row.id,
    name: row.name,
    ...row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })
})

// update an existing board
router.put('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  const { name, notes, arrows, textBoxes } = req.body

  // get existing state first
  const existing = await pool.query('SELECT * FROM boards WHERE id = $1', [id])
  if (existing.rows.length === 0) {
    res.status(404).json({ error: 'Board not found' })
    return
  }

  const oldState = existing.rows[0].state
  const newState = {
    notes: notes ?? oldState.notes,
    arrows: arrows ?? oldState.arrows,
    textBoxes: textBoxes ?? oldState.textBoxes,
  }
  const newName = name ?? existing.rows[0].name

  const result = await pool.query(
    'UPDATE boards SET name = $1, state = $2, updated_at = now() WHERE id = $3 RETURNING *',
    [newName, JSON.stringify(newState), id]
  )
  const row = result.rows[0]
  res.json({
    id: row.id,
    name: row.name,
    ...row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })
})

export default router