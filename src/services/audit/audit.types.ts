/**
 * AuditSvc types. Read-only event stream and evidence-pack export.
 * Filters mirror the chips on the Audit page so the page-level filter
 * state can be passed straight through as a query.
 */
import type {
  AuditChannel,
  AuditDomain,
  AuditEvent,
  AuditSeverity,
} from "./audit.mock"

export type ListAuditEventsQuery = {
  domain?: AuditDomain
  channel?: AuditChannel
  severity?: AuditSeverity
  /**
   * Restrict to events produced by these team-member ids. Used by
   * callers that only have `audit.view` (base) — they pass in their own
   * same-team member list so the service filters to peer activity only.
   * Leave empty to disable the actor filter entirely (home-wide view).
   */
  actorIds?: string[]
  /** Filter by home — typically `useAuth().user.homes`. */
  homes?: string[]
  /** ISO date — inclusive lower bound. */
  from?: string
  /** ISO date — inclusive upper bound. */
  to?: string
  /** Free-text search across actor / action / target. */
  q?: string
  /** 1-based page number (default 1). */
  page?: number
  /** Rows per page (default 25). */
  pageSize?: number
}

export type PaginatedAuditEvents = {
  items: AuditEvent[]
  total: number
  page: number
  pageSize: number
}

export type ExportRequest = {
  /** Same filter shape as `listEvents` — pack export honours the same scope. */
  filter?: ListAuditEventsQuery
  /** Optional human label for the resulting evidence pack. */
  label?: string
}

export type ExportJob = {
  jobId: string
  status: "queued" | "running" | "ready" | "failed"
  downloadUrl?: string
}

export type { AuditChannel, AuditDomain, AuditEvent, AuditSeverity }
