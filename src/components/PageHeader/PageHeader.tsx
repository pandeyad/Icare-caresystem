import React from "react"
import "./PageHeader.scss"

/**
 * PageHeader — the consistent hero used at the top of every page inside
 * the shell. Prevents copy/paste drift on title/subtitle/actions layout.
 *
 * Keep it *information-dense but visually quiet*. No gradients, no big
 * backgrounds — the page shell already provides the frame. The header's
 * job is just to anchor the page in the nav hierarchy.
 */

type Props = {
  /** Optional uppercase eyebrow (breadcrumb / section). */
  eyebrow?: string
  title: string
  subtitle?: string
  /** Right-aligned call-to-action area (buttons, filters, etc.). */
  actions?: React.ReactNode
}

const PageHeader: React.FC<Props> = ({ eyebrow, title, subtitle, actions }) => (
  <header className="page-header">
    <div className="page-header__text">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="page-header__actions">{actions}</div>}
  </header>
)

export default PageHeader
