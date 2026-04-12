import React, { useEffect, useMemo, useRef, useState } from "react"
import "./TeammatePicker.scss"
import { teamService } from "../../services"
import type { TeamMember } from "../../services/team/team.types"
import { useAuth } from "../../auth/AuthContext"

/**
 * Searchable teammate picker (combobox).
 *
 * Loads team members from `teamService` on mount. Users with
 * `team.view.all` see members from all homes in their scope;
 * everyone else sees only their own team.
 *
 * A hidden `<input name={name}>` carries the selected member's id
 * so the form can read it via `FormData.get(name)`.
 */

type Props = {
  /** Form field name — value is the selected member's id. */
  name: string
  label: string
  required?: boolean
  /** Pre-selected teammate id. */
  defaultValue?: string
  /** Hint text below the input. */
  hint?: string
  /** When true, loads the wider home-scope list (for managers). */
  wide?: boolean
}

const TeammatePicker: React.FC<Props> = ({
  name,
  label,
  required,
  defaultValue,
  hint,
  wide,
}) => {
  const { user, scope, can } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(defaultValue ?? "")
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const shouldWiden = wide ?? can("team.view.all")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      let list: TeamMember[]
      if (shouldWiden) {
        // Managers/leads see everyone across their homes
        const all = await Promise.all(
          scope.homes.map((h) => teamService.listMembers({ home: h }))
        )
        list = all.flat()
      } else {
        list = await teamService.listMembers({ teamId: user.teamId })
      }
      // Remove self from the list
      list = list.filter((m) => m.id !== `tm-${user.id.replace("u-", "")}`)
      if (!cancelled) setMembers(list)
    }
    void load()
    return () => { cancelled = true }
  }, [shouldWiden, scope.homes, user.teamId, user.id])

  // Resolve default display name
  useEffect(() => {
    if (defaultValue && members.length > 0) {
      const match = members.find((m) => m.id === defaultValue)
      if (match) setQuery(match.name)
    }
  }, [defaultValue, members])

  const filtered = useMemo(() => {
    if (!query.trim()) return members
    const needle = query.toLowerCase()
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(needle) ||
        m.role.toLowerCase().includes(needle) ||
        m.home.toLowerCase().includes(needle)
    )
  }, [members, query])

  const selectMember = (m: TeamMember) => {
    setSelectedId(m.id)
    setQuery(m.name)
    setOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="teammate-picker" ref={wrapRef}>
      <label className="form-field">
        <span className="form-field__label">
          {label}
          {required && <span className="datetime-field__required"> *</span>}
        </span>
        <input type="hidden" name={name} value={selectedId} />
        <input
          type="text"
          className="form-field__control"
          placeholder="Search by name or role…"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedId("")
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {hint && <span className="form-field__hint">{hint}</span>}
      </label>
      {open && filtered.length > 0 && (
        <ul className="teammate-picker__list" role="listbox">
          {filtered.map((m) => (
            <li
              key={m.id}
              role="option"
              aria-selected={m.id === selectedId}
              className={`teammate-picker__option ${m.id === selectedId ? "is-selected" : ""}`}
              onClick={() => selectMember(m)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <span className="teammate-picker__avatar">{m.initials}</span>
              <div className="teammate-picker__info">
                <span className="teammate-picker__name">{m.name}</span>
                <span className="teammate-picker__role">{m.role} · {m.home}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && filtered.length === 0 && (
        <div className="teammate-picker__empty">No matches</div>
      )}
    </div>
  )
}

export default TeammatePicker
