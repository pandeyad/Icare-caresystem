/**
 * SwapSvc types. Swaps are peer-to-peer: the requester offers a shift to
 * a counterparty, the counterparty accepts or declines. Managers see the
 * activity feed but cannot approve or decline — that's handled by the
 * Manage hub's swap panel via `manageService.listSwaps`.
 */
import type { SwapActivity } from "../manage/manage.mock"
import type { MyRequest } from "../me/me.mock"

export type CreateSwapRequest = {
  /** ISO local datetime of the original shift the requester wants to give up. */
  fromStart: string
  /** ISO local datetime of the replacement shift being offered in return. */
  toStart: string
  /** Counterparty teammate id (the person being asked). */
  counterpartyId: string
  /** Free-text note attached to the swap request. */
  note?: string
}

export type SwapsFilter = "open" | "all"

export type { SwapActivity, MyRequest }
