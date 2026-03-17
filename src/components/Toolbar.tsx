import type { ToolMode } from '../types'

interface Props {
  activeTool: ToolMode
  onToolChange: (tool: ToolMode) => void
  onDelete: () => void
  canDelete: boolean
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

function Toolbar({ activeTool, onToolChange, onDelete, canDelete }: Props) {
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
    </div>
  )
}

export default Toolbar