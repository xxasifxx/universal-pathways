import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface VolunteerConfirmationProps {
  name?: string
  helpWith?: string[]
}

export function VolunteerConfirmation({
  name = 'there',
  helpWith = [],
}: VolunteerConfirmationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Thanks for signing up to help</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '32px 28px', maxWidth: '560px', borderTop: '6px solid #0E351A' }}>
          <Heading style={{ color: '#0E351A', fontSize: '22px', margin: '0 0 16px', letterSpacing: '0.02em' }}>
            Thanks, {name}!
          </Heading>
          <Text style={{ color: '#2b2b2b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
            Your signup came through. Someone from the campaign will reach out with next
            steps and timing.
          </Text>
          {helpWith.length ? (
            <Text style={{ color: '#2b2b2b', fontSize: '15px', lineHeight: '1.6', borderLeft: '3px solid #0E351A', paddingLeft: '14px', margin: '0 0 24px' }}>
              You said you can help with: {helpWith.join(', ')}.
            </Text>
          ) : null}
          <Hr style={{ borderColor: '#eeeeee' }} />
          <Text style={{ color: '#777777', fontSize: '12px', margin: '16px 0 0' }}>
            Muhammad Saqeeb for East Brunswick Board of Education
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: VolunteerConfirmation,
  displayName: 'Volunteer confirmation (to volunteer)',
  subject: 'Thanks for signing up — Saqeeb for East Brunswick BOE',
  previewData: {
    name: 'Dan',
    helpWith: ['Knock doors', 'Request a yard sign'],
  },
} satisfies TemplateEntry
