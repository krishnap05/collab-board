import { useState } from 'react'

export function useEditNote() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const startEditing = (id: number) => setEditingId(id)
  const stopEditing = () => setEditingId(null)

  return {
    editingId,
    startEditing,
    stopEditing,
  }
}