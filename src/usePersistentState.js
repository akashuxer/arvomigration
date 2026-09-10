import { useEffect, useRef, useState } from 'react'

/* useState, kept in localStorage.
 *
 * Everything the user does during a session is a decision they made once and
 * should not have to make again: which view they were on, which workflow was
 * selected, which sections were open, the favorites they saved, the report
 * settings they tuned. Holding that only in component state meant it lived and
 * died with the component -- closing a panel or switching a tab unmounts its
 * tree, and the next open started over from the seed data. That reads as the
 * app forgetting, which is exactly what it is.
 *
 * Persisted per key under one namespace, so a stored shape from an earlier
 * build can be dropped wholesale by bumping the version rather than migrated.
 *
 * Reads are guarded rather than trusted: storage is shared with whatever the
 * previous build wrote, and a value that no longer parses -- or parses into the
 * wrong shape -- must fall back to the default instead of taking the app down
 * on mount. Writes are guarded too, because storage throws when it is full or
 * disabled (private browsing, or a blocked third-party context), and losing
 * persistence is not a reason to lose the interaction.
 */
const NAMESPACE = 'sda.v1'

const keyFor = (key) => `${NAMESPACE}.${key}`

export function readStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(keyFor(key))
    if (raw == null) return fallback
    const value = JSON.parse(raw)
    // Null is a legitimate stored value (no panel open); undefined is not.
    return value === undefined ? fallback : value
  } catch {
    return fallback
  }
}

export function writeStored(key, value) {
  try {
    window.localStorage.setItem(keyFor(key), JSON.stringify(value))
  } catch {
    /* Storage unavailable or full -- the session continues unpersisted. */
  }
}

/* Drops everything this app has stored, and nothing else.
 *
 * Scoped to the namespace on purpose: `localStorage.clear()` would take out
 * whatever else shares this origin, which is not ours to throw away. The reload
 * is the point rather than an afterthought -- state already read into components
 * would otherwise be written straight back out on the next change, and a reset
 * that half-survives is worse than none. */
export function resetStored() {
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(`${NAMESPACE}.`))
      .forEach((key) => window.localStorage.removeItem(key))
  } catch {
    /* Nothing stored to drop. */
  }
  window.location.reload()
}

export default function usePersistentState(key, initial) {
  /* Read once, on the first render, rather than in an effect.
   *
   * An effect would paint the default first and correct it a frame later, so
   * the last view would flash the seed state on every load. The lazy initialiser
   * means the first paint is already the restored one. */
  const [value, setValue] = useState(() =>
    readStored(key, typeof initial === 'function' ? initial() : initial),
  )

  // Skips the write on mount: the value just came out of storage, and writing
  // it straight back would rewrite every key on every load for nothing.
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    writeStored(key, value)
  }, [key, value])

  return [value, setValue]
}
