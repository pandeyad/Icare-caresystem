import { useEffect, useState } from "react"

const COLLAPSED_KEY = "icare.sidebar.collapsed"

export const useCollapsed = (): [boolean, () => void] => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem(COLLAPSED_KEY) === "1"
  })

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-sidebar",
      collapsed ? "collapsed" : "expanded"
    )
    try {
      window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0")
    } catch {
      /* ignore */
    }
  }, [collapsed])

  return [collapsed, () => setCollapsed((c) => !c)]
}
