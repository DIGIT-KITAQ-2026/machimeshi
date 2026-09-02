import './ToggleSwitch.css'

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
  label: string
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle-switch${checked ? ' toggle-switch-on' : ''}`}
      onClick={onChange}
    >
      <span className="toggle-switch-knob" />
    </button>
  )
}

export default ToggleSwitch
