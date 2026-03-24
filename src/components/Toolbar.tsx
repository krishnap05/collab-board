
import { UserButton } from '@clerk/clerk-react';
import type { ToolMode } from '../types';

interface Props {
  activeTool: ToolMode
  onToolChange: (tool: ToolMode) => void
  onDelete: () => void
  onSave: () => void
  canDelete: boolean
  status: 'saved' | 'saving' | 'unsaved'
}

const tools: { mode: ToolMode; label: string; icon: string }[] = [
  { mode: 'select', label: 'Select', icon: '↖' },
  { mode: 'note', label: 'Sticky Note', icon: '▢' },
  { mode: 'arrow', label: 'Arrow', icon: '→' },
  { mode: 'text', label: 'Text', icon: 'T' },
]

const btnBase: React.CSSProperties = {
  border: 'none',
  borderRadius: '8px',
  padding: '6px 14px',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'background 0.15s',
}

function Toolbar({ activeTool, onToolChange, onDelete, onSave, canDelete, status }: Props) {
  const statusColor = status === 'saved' ? '#22c55e' : status === 'saving' ? '#f59e0b' : '#888'
  const statusText = status === 'saved' ? 'Saved' : status === 'saving' ? 'Saving...' : 'Unsaved'

  return (
    <div style={{
      height: '52px',
      background: '#0f0f1a',
      borderBottom: '1px solid #2a2a4a',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '6px',
      zIndex: 10,
    }}>
      <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '15px', marginRight: '12px' }}>
        Collab Board
      </span>

      <span style={{ color: '#2a2a4a', marginRight: '6px' }}>|</span>

      {tools.map(t => (
        <button
          key={t.mode}
          onClick={() => onToolChange(t.mode)}
          style={{
            ...btnBase,
            background: activeTool === t.mode ? '#6366f1' : '#1e1e3a',
            color: activeTool === t.mode ? '#fff' : '#94a3b8',
          }}
        >
          <span style={{ fontSize: '15px' }}>{t.icon}</span>
          {t.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <button
        onClick={onSave}
        disabled={status === 'saved' || status === 'saving'}
        style={{
          ...btnBase,
          background: status === 'saved' ? '#1e1e3a' : '#6366f1',
          color: status === 'saved' ? '#555' : '#fff',
          cursor: status === 'saved' ? 'default' : 'pointer',
        }}
      >
        Save
      </button>

      <span style={{ color: statusColor, fontSize: '13px', marginRight: '12px' }}>
        {statusText}
      </span>

      {canDelete && (
        <button
          onClick={onDelete}
          style={{
            ...btnBase,
            background: '#ef4444',
            color: '#fff',
          }}
        >
          Delete
        </button>
      )}
      <div style={{ marginLeft: 16 }}>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}

export default Toolbar