function Tonearm({ isPlaying }) {
  return (
    <div className="tonearm-mount" aria-hidden="true">
      <div className={`tonearm-swing ${isPlaying ? 'tonearm-swing--playing' : 'tonearm-swing--rest'}`}>
        <div className="tonearm-arm" />
        <div className="tonearm-head">
          <span className="tonearm-lift-knob" />
        </div>
      </div>
    </div>
  )
}

export default Tonearm
