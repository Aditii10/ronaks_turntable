function Record({ isPlaying, onClick, labelGradient }) {
  const recordClassName = isPlaying ? 'record is-spinning' : 'record'

  return (
    <button type="button" className={recordClassName} onClick={onClick} aria-label="Play or pause">
      <span className="record-grooves" aria-hidden="true" />
      <div className="record-label" style={{ '--label-gradient': labelGradient }}>
        <span className="record-dot" />
      </div>
    </button>
  )
}

export default Record
