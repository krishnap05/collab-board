import { Router, Request, Response } from 'express'
import pool from '../db'

const router = Router()

// get the most recent board for a specific user
router.get('/latest', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const result = await pool.query(
    'SELECT * FROM boards WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
    [userId]
  )
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

// get a board by id, only if it belongs to the user
router.get('/:id', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const result = await pool.query(
    'SELECT * FROM boards WHERE id = $1 AND user_id = $2',
    [req.params.id, userId]
  )
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

// create a new board for a specific user
router.post('/', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const name = req.body.name || 'Untitled Board'
  const state = {
    notes: req.body.notes || [],
    arrows: req.body.arrows || [],
    textBoxes: req.body.textBoxes || [],
  }

  const result = await pool.query(
    'INSERT INTO boards (name, state, user_id) VALUES ($1, $2, $3) RETURNING *',
    [name, JSON.stringify(state), userId]
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

// update a board, only if it belongs to the user
router.put('/:id', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const { name, notes, arrows, textBoxes } = req.body

  const existing = await pool.query(
    'SELECT * FROM boards WHERE id = $1 AND user_id = $2',
    [req.params.id, userId]
  )
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
    'UPDATE boards SET name = $1, state = $2, updated_at = now() WHERE id = $3 AND user_id = $4 RETURNING *',
    [newName, JSON.stringify(newState), req.params.id, userId]
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