import { useEffect, useState } from 'react'

function Sleeve({ cover, title, artist, subtext, coverObjectPosition, onClick }) {
  const [coverFailed, setCoverFailed] = useState(false)

  useEffect(() => {
    setCoverFailed(false)
  }, [cover])

  return (
    <button
      type="button"
      className="sleeve"
      onClick={onClick}
      aria-label={`Skip to next track. Current: ${title}`}
    >
      {!coverFailed && (
        <img
          key={cover}
          className="sleeve-cover"
          src={cover}
          alt=""
          style={coverObjectPosition ? { objectPosition: coverObjectPosition } : undefined}
          onError={() => setCoverFailed(true)}
        />
      )}
      <div className="sleeve-hover-gradient" aria-hidden="true" />
      <div className="sleeve-meta">
        <p className="sleeve-title">{title}</p>
        {subtext ? <p className="sleeve-subtext">{subtext}</p> : null}
        {artist ? <p className="sleeve-artist">{artist}</p> : null}
      </div>
    </button>
  )
}

export default Sleeve
