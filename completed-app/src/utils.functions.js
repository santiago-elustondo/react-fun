export const doAsync = (fn, ms = 0) => setTimeout(fn, ms)
export const arrayOf = length => (new Array(length)).fill(true)