import { useEffect, useRef, useState } from 'react'

const HOLD_DURATION = 1500 // ms the user must hold the gesture

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

// A finger is "extended" when its tip is farther from the wrist than its MCP knuckle
function isFingerExtended(kp, tipIdx, mcpIdx) {
  return dist(kp[tipIdx], kp[0]) > dist(kp[mcpIdx], kp[0]) * 1.2
}

function classifyGesture(keypoints) {
  const indexUp  = isFingerExtended(keypoints, 8,  5)
  const middleUp = isFingerExtended(keypoints, 12, 9)
  const ringUp   = isFingerExtended(keypoints, 16, 13)
  const pinkyUp  = isFingerExtended(keypoints, 20, 17)
  const count = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length

  if (count === 0) return 'rock'
  if (count >= 3)  return 'paper'
  if (indexUp && middleUp && !ringUp && !pinkyUp) return 'scissors'
  return null // ambiguous
}

// Module-level cache so the model only loads once across remounts
let detectorCache = null

async function getDetector() {
  if (detectorCache) return detectorCache
  const tf = await import('@tensorflow/tfjs')
  await tf.setBackend('webgl')
  await tf.ready()
  const { createDetector, SupportedModels } = await import('@tensorflow-models/hand-pose-detection')
  detectorCache = await createDetector(SupportedModels.MediaPipeHands, {
    runtime: 'tfjs',
    modelType: 'lite',
    maxHands: 1,
  })
  return detectorCache
}

function drawSkeleton(canvas, video, keypoints) {
  if (!canvas || !video.videoWidth) return
  canvas.width  = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Mirror to match the flipped video display
  ctx.save()
  ctx.scale(-1, 1)
  ctx.translate(-canvas.width, 0)

  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17],
  ]

  ctx.strokeStyle = 'rgba(100,220,255,0.85)'
  ctx.lineWidth = 2
  connections.forEach(([a, b]) => {
    const pa = keypoints[a], pb = keypoints[b]
    if (!pa || !pb) return
    ctx.beginPath()
    ctx.moveTo(pa.x, pa.y)
    ctx.lineTo(pb.x, pb.y)
    ctx.stroke()
  })

  keypoints.forEach(kp => {
    ctx.beginPath()
    ctx.arc(kp.x, kp.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#44aaff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  })

  ctx.restore()
}

export function useGesture({ onGestureConfirmed }) {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const frameRef   = useRef(null)
  const gestureStartRef  = useRef(null)
  const lastGestureRef   = useRef(null)
  const submittedRef     = useRef(false)
  const onConfirmedRef   = useRef(onGestureConfirmed)

  const [currentGesture, setCurrentGesture] = useState(null)
  const [holdProgress,   setHoldProgress]   = useState(0)
  const [status, setStatus] = useState('initializing') // initializing | ready | no-camera | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => { onConfirmedRef.current = onGestureConfirmed }, [onGestureConfirmed])

  useEffect(() => {
    let stream = null
    let cancelled = false
    submittedRef.current = false

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }

        const video = videoRef.current
        video.srcObject = stream
        await new Promise(resolve => { video.onloadedmetadata = resolve })
        await video.play()

        const detector = await getDetector()
        if (cancelled) return

        setStatus('ready')
        loop(detector)
      } catch (err) {
        if (cancelled) return
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
          setStatus('no-camera')
        } else {
          setStatus('error')
          setErrorMsg(err.message)
        }
      }
    }

    async function loop(detector) {
      if (cancelled) return
      try {
        const video = videoRef.current
        if (video && video.readyState >= 2) {
          const hands = await detector.estimateHands(video)
          if (cancelled) return

          if (hands.length > 0) {
            drawSkeleton(canvasRef.current, video, hands[0].keypoints)
            processGesture(classifyGesture(hands[0].keypoints))
          } else {
            clearCanvas(canvasRef.current)
            processGesture(null)
          }
        }
      } catch (_) { /* ignore intermittent detection errors */ }

      if (!cancelled) {
        frameRef.current = requestAnimationFrame(() => loop(detector))
      }
    }

    function processGesture(gesture) {
      const now = Date.now()
      if (gesture && gesture === lastGestureRef.current) {
        if (!gestureStartRef.current) gestureStartRef.current = now
        const elapsed  = now - gestureStartRef.current
        const progress = Math.min(elapsed / HOLD_DURATION, 1)
        setHoldProgress(progress)
        setCurrentGesture(gesture)

        if (elapsed >= HOLD_DURATION && !submittedRef.current) {
          submittedRef.current = true
          gestureStartRef.current = null
          lastGestureRef.current  = null
          setHoldProgress(0)
          setCurrentGesture(null)
          onConfirmedRef.current(gesture)
        }
      } else {
        lastGestureRef.current  = gesture
        gestureStartRef.current = gesture ? now : null
        setCurrentGesture(gesture)
        setHoldProgress(0)
      }
    }

    init()

    return () => {
      cancelled = true
      if (stream) stream.getTracks().forEach(t => t.stop())
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { videoRef, canvasRef, currentGesture, holdProgress, status, errorMsg }
}

function clearCanvas(canvas) {
  if (!canvas) return
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
}
