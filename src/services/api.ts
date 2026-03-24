import type { StickyNote, Arrow, TextBox } from '../types'

const BASE_URL = 'http://localhost:3001/api'


export async function createBoard(name: string, userId: string) {
  const res = await fetch(`${BASE_URL}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ name, notes: [] }),
  });
  return res.json();
}


export async function getLatestBoard(userId: string) {
  const res = await fetch(`${BASE_URL}/boards/latest`, {
    headers: {
      'x-user-id': userId,
    },
  });
  if (!res.ok) return null;
  return res.json();
}


export async function getBoard(id: string, userId: string) {
  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    headers: {
      'x-user-id': userId,
    },
  });
  return res.json();
}


export async function saveBoard(
  id: string,
  notes: StickyNote[],
  arrows: Arrow[],
  textBoxes: TextBox[],
  userId: string
) {
  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ notes, arrows, textBoxes }),
  });
  return res.json();
}
