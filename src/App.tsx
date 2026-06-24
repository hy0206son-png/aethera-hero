import { useEffect, useRef } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

const FADE_DURATION = 0.5 // seconds for fade-in / fade-out

const NAV_ITEMS = [
  { label: 'Home', active: true },
  { label: 'Studio', active: false },
  { label: 'About', active: false },
  { label: 'Journal', active: false },
  { label: 'Reach Us', active: false },
]

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Continuously monitor currentTime/duration to drive the fade.
    const tick = () => {
      const { currentTime, duration } = video

      if (duration && !Number.isNaN(duration)) {
        let opacity = 1

        if (currentTime < FADE_DURATION) {
          // Fade in over the first 0.5s
          opacity = currentTime / FADE_DURATION
        } else if (currentTime > duration - FADE_DURATION) {
          // Fade out over the last 0.5s
          opacity = Math.max(0, (duration - currentTime) / FADE_DURATION)
        }

        video.style.opacity = String(opacity)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    // Seamless manual loop: hide, reset, replay after a short beat.
    const handleEnded = () => {
      video.style.opacity = '0'
      window.setTimeout(() => {
        video.currentTime = 0
        void video.play()
      }, 100)
    }

    video.addEventListener('ended', handleEnded)
    void video.play().catch(() => {
      /* autoplay may be blocked until interaction — ignore */
    })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* ── Background video layer (z-0) ───────────────────────── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute h-full w-full object-cover"
          style={{ inset: 'auto 0 0 0', top: '300px', opacity: 0 }}
          src={VIDEO_URL}
          muted
          playsInline
          autoPlay
          preload="auto"
        />
        {/* Gradient overlays over the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* ── Navigation bar (z-10) ──────────────────────────────── */}
      <nav className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <a
            href="#"
            className="font-display text-3xl tracking-tight text-ink"
            style={{ color: '#000000' }}
          >
            Aethera
            <sup className="text-base align-super">®</sup>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className="font-body text-sm transition-colors hover:text-ink"
                  style={{ color: item.active ? '#000000' : '#6F6F6F' }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="rounded-full px-6 py-2.5 font-body text-sm text-white transition-transform duration-200 hover:scale-[1.03]"
            style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
          >
            Begin Journey
          </button>
        </div>
      </nav>

      {/* ── Hero section (z-10) ────────────────────────────────── */}
      <section
        className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1
          className="animate-fade-rise max-w-7xl font-display text-5xl font-normal sm:text-7xl md:text-8xl"
          style={{
            color: '#000000',
            lineHeight: 0.95,
            letterSpacing: '-2.46px',
          }}
        >
          Beyond <em style={{ color: '#6F6F6F' }}>silence,</em> we build{' '}
          <em style={{ color: '#6F6F6F' }}>the eternal.</em>
        </h1>

        <p
          className="animate-fade-rise-delay mt-8 max-w-2xl font-body text-base leading-relaxed sm:text-lg"
          style={{ color: '#6F6F6F' }}
        >
          Building platforms for brilliant minds, fearless makers, and thoughtful
          souls. Through the noise, we craft digital havens for deep work and pure
          flows.
        </p>

        <button
          className="animate-fade-rise-delay-2 mt-12 rounded-full px-14 py-5 font-body text-base text-white transition-transform duration-200 hover:scale-[1.03]"
          style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
        >
          Begin Journey
        </button>
      </section>
    </div>
  )
}

export default App
