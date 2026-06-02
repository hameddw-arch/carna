// Max 3 cars to compare
const KEY = 'carna_compare'
const MAX = 3

export function getCompare(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

export function addToCompare(id: string): boolean {
  const list = getCompare()
  if (list.includes(id)) return true
  if (list.length >= MAX) return false
  localStorage.setItem(KEY, JSON.stringify([...list, id]))
  window.dispatchEvent(new Event('compare-change'))
  return true
}

export function removeFromCompare(id: string) {
  const list = getCompare().filter(x => x !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('compare-change'))
}

export function clearCompare() {
  localStorage.setItem(KEY, '[]')
  window.dispatchEvent(new Event('compare-change'))
}

export function isInCompare(id: string): boolean {
  return getCompare().includes(id)
}
