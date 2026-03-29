import { useEffect, useRef, useState } from 'react'
import Record from './Record'
import Sleeve from './Sleeve'
import Tonearm from './Tonearm'
import VolumeKnob from './VolumeKnob'
import tracks from '../data/tracks'
import '../styles/player.css'

function VinylPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(1)
  const [theme, setTheme] = useState('dark')
  const audioRef = useRef(null)
  const resumeAfterTrackChangeRef = useRef(false)

  const track = tracks[currentTrack] ?? null
  const coverSrc = track?.cover ?? ''

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    audio.load()
    audio.volume = volume
    if (resumeAfterTrackChangeRef.current) {
      resumeAfterTrackChangeRef.current = false
      void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) {
      return
    }

    setIsPlaying((wasPlaying) => {
      if (wasPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((err) => console.log(err))
      }
      return !wasPlaying
    })
  }

  const goToNextTrack = (resumePlayback) => {
    if (tracks.length === 0) {
      return
    }
    audioRef.current?.pause()
    resumeAfterTrackChangeRef.current = resumePlayback
    setCurrentTrack((i) => (i + 1) % tracks.length)
  }

  const nextTrack = () => goToNextTrack(isPlaying)

  const handleEnded = () => goToNextTrack(true)

  const setVolume = (value) => {
    setVolumeState(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }

  if (!track) {
    return <div className="player-container">No tracks found.</div>
  }

  return (
    <main className="player-container">
      <header className="player-header">
        <h1 className="player-title">How the turntables</h1>
      </header>

      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        aria-label="Toggle dark and light mode"
      >
        {theme === 'dark' ? '☾' : '☀'}
      </button>

      <section className="turntable-card">
        <div className="deck-area">
          <Record
            isPlaying={isPlaying}
            onClick={togglePlay}
            labelGradient={track.labelGradient}
          />
          <Tonearm isPlaying={isPlaying} />
          <Sleeve
            key={currentTrack}
            cover={coverSrc}
            title={track.title}
            artist={track.artist}
            subtext={track.subtext}
            coverObjectPosition={track.coverObjectPosition}
            onClick={nextTrack}
          />
          <VolumeKnob volume={volume} setVolume={setVolume} />
        </div>
      </section>

      <div className="player-hints">
        <p className="player-hint">
          <span className="player-hint-strong">Tap the record</span>
          <span className="player-hint-normal"> to play/pause</span>
        </p>
        <p className="player-hint">
          <span className="player-hint-strong">Tap the sleeve</span>
          <span className="player-hint-normal"> to skip track</span>
        </p>
      </div>

      <audio
        key={currentTrack}
        ref={audioRef}
        src={tracks[currentTrack].audio}
        onEnded={handleEnded}
      />
    </main>
  )
}

export default VinylPlayer
