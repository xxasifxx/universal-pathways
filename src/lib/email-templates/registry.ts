import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
import { template as questionNotification } from './question-notification'
import { template as questionConfirmation } from './question-confirmation'
import { template as volunteerNotification } from './volunteer-notification'
import { template as volunteerConfirmation } from './volunteer-confirmation'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'question-notification': questionNotification,
  'question-confirmation': questionConfirmation,
  'volunteer-notification': volunteerNotification,
  'volunteer-confirmation': volunteerConfirmation,
}
