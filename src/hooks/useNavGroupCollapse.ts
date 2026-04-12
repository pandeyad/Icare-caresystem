import { useCallback, useState } from "react"

const STORAGE_KEY = "icare.nav.collapsed"

/**
 * Manages which sidebar nav groups are collapsed, persisted to localStorage.
 *
 * Returns `[isCollapsed(groupId), toggle(groupId)]` — a check function and a
 * toggle function. Groups default to expanded; only explicitly collapsed IDs
 * are stored.
 */
export const useNavGroupCollapse = (): [
  (groupId: string) => boolean,
  (groupId: string) => void,
] => {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch {
      return new Set()
    }
  })

  const persist = (next: Set<string>) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
    } catch {
      /* storage denied */
    }
  }

  const isCollapsed = useCallback(
    (groupId: string) => collapsed.has(groupId),
    [collapsed]
  )

  const toggle = useCallback((groupId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      persist(next)
      return next
    })
  }, [])

  return [isCollapsed, toggle]
}
