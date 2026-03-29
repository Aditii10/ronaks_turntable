import { useCallback, useEffect, useRef } from 'react'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/** Pointer angle (rad): 0 at 12 o'clock, increases clockwise (screen coords). */
function pointerAngleRad(clientX, clientY, cx, cy) {
  return Math.atan2(clientX - cx, cy - clientY)
}

function VolumeKnob({ volume, setVolume }) {
  const knobRef = useRef(null)
  const dragRef = useRef(null)

  const rotationDeg = -130 + volume * 260

  const endDrag = useCallback(() => {
    dragRef.current = null
  }, [])

  useEffect(() => {
    const end = () => {
      dragRef.current = null
    }
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }, [])

  const onPointerDown = useCallback(
    (e) => {
      const el = knobRef.current
      if (!el || !setVolume) return
      el.setPointerCapture(e.pointerId)
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      dragRef.current = {
        angle: pointerAngleRad(e.clientX, e.clientY, cx, cy),
        volume,
      }
    },
    [volume, setVolume],
  )

  const onPointerMove = useCallback(
    (e) => {
      const state = dragRef.current
      const el = knobRef.current
      if (!state || !el || !setVolume) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const angle = pointerAngleRad(e.clientX, e.clientY, cx, cy)
      let delta = angle - state.angle
      if (delta > Math.PI) delta -= 2 * Math.PI
      if (delta < -Math.PI) delta += 2 * Math.PI
      const fullSweep = 1.35 * Math.PI
      const next = clamp(state.volume + delta / fullSweep, 0, 1)
      setVolume(next)
      dragRef.current = { angle, volume: next }
    },
    [setVolume],
  )

  const onPointerUp = useCallback(
    (e) => {
      if (knobRef.current?.hasPointerCapture?.(e.pointerId)) {
        knobRef.current.releasePointerCapture(e.pointerId)
      }
      endDrag()
    },
    [endDrag],
  )

  return (
    <div className="volume-knob-wrap">
      <div
        ref={knobRef}
        className="volume-knob-pro"
        style={{ '--knob-needle-rotate': `${rotationDeg}deg` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
        tabIndex={0}
      >
        <span className="volume-knob-rim" aria-hidden="true" />
        <span className="volume-knob-teeth" aria-hidden="true" />
        <span className="volume-knob-cap" aria-hidden="true" />
        <span className="volume-knob-hub" aria-hidden="true" />
        <span className="volume-knob-needle" aria-hidden="true" />
      </div>
    </div>
  )
}

export default VolumeKnob
