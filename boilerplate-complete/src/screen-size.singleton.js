export const SCREEN_SIZE = {
  DESKTOP_LG: 'DESKTOP_LG',
  DESKTOP_MD: 'DESKTOP_MD',
  DESKTOP_SM: 'DESKTOP_SM',
  TABLET_LG: 'TABLET_LG',
  TABLET_MD: 'TABLET_MD',
  TABLET_SM: 'TABLET_SM',
  PHONE_LG: 'PHONE_LG',
  PHONE_MD: 'PHONE_MD',
  PHONE_SM: 'PHONE_SM',
  SMALLEST: 'SMALLEST', // from zero till first threshold
}

// dont include limits (smallest)
const THRESHOLDS_CONFIG = {
  [SCREEN_SIZE.DESKTOP_LG]: 1600,
  [SCREEN_SIZE.DESKTOP_MD]: 1400,
  [SCREEN_SIZE.DESKTOP_SM]: 1200,
  [SCREEN_SIZE.TABLET_LG]: 1100,
  [SCREEN_SIZE.TABLET_MD]: 900,
  [SCREEN_SIZE.TABLET_SM]: 700,
  [SCREEN_SIZE.PHONE_LG]: 400,
  [SCREEN_SIZE.PHONE_MD]: 360,
  [SCREEN_SIZE.PHONE_SM]: 300
}

// @todo put in utils.js
class Emitter {
  constructor() { this.handlers = [] }
  subscribe(handler) { this.handlers.push(handler) }
  emit(result) { this.handlers.forEach(handler => handler(result)) }
}

// @todo put in utils.js
const kv = obj => Object.keys(obj).map(k => ({ k, v: obj[k] }))

const thresholds = kv(THRESHOLDS_CONFIG)
  .map(({ k:size, v:minWidth }) => ({ size, minWidth }))
  .filter(({ size }) => size !== SCREEN_SIZE.SMALLEST)
  .map(({ size, minWidth }) => ({
    size, 
    minWidth,
    query: window.matchMedia(`only screen and (min-width: ${minWidth}px)`)
  }))

const broadcaster = { 
  currentSize: null, 
  emitter: new Emitter(),
  isBiggerOrEqualTo: size => {
    if (!SCREEN_SIZE[size]) throw new Error('invalid size: ' + size)
    if (broadcaster.currentSize === SCREEN_SIZE.SMALLEST) return true
    const currentWidth = THRESHOLDS_CONFIG[broadcaster.currentSize]
    const requestWidth = THRESHOLDS_CONFIG[size]
    return currentWidth >= requestWidth
  }
}

const update = () => {
  const largestMatched = thresholds.reduce((largestMatched, t) => {
    if (!t.query.matches) return largestMatched
    if (!largestMatched || largestMatched.minWidth < t.minWidth) return t
    return largestMatched
  }, null)

  if (!largestMatched) {
    if (broadcaster.currentSize !== SCREEN_SIZE.SMALLEST) {
      broadcaster.currentSize = SCREEN_SIZE.SMALLEST
      broadcaster.emitter.emit(broadcaster.currentSize)  
    }
  } else {
    if (!broadcaster.currentSize || largestMatched.size !== broadcaster.currentSize) {
      broadcaster.currentSize = largestMatched.size
      broadcaster.emitter.emit(broadcaster.currentSize)  
    }
  } 
}

thresholds.forEach(t => t.query.addListener(update))
update()

export const screenSize = broadcaster