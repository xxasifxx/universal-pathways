import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface QuestionConfirmationProps {
  name?: string
  message?: string
}

export function QuestionConfirmation({
  name = 'there',
  message = '',
}: QuestionConfirmationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Saqeeb got your question</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '32px 28px', maxWidth: '560px', borderTop: '6px solid #FDCD01' }}>
          <Heading style={{ color: '#58150C', fontSize: '22px', margin: '0 0 16px', letterSpacing: '0.02em' }}>
            Thanks, {name} — your question is in.
          </Heading>
          <Text style={{ color: '#2b2b2b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px' }}>
            Muhammad reads these himself and will get back to you at this address.
          </Text>
          {message ? (
            <Section>
              <Text style={{ color: '#777777', fontSize: '12px', margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                What you asked
              </Text>
              <Text style={{ color: '#2b2b2b', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const, borderLeft: '3px solid #FDCD01', paddingLeft: '14px', margin: '0 0 24px' }}>
                {message}
              </Text>
            </Section>
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
  component: QuestionConfirmation,
  displayName: 'Question confirmation (to asker)',
  subject: 'Thanks for your question — Saqeeb for East Brunswick BOE',
  previewData: {
    name: 'Priya',
    message: 'How would you improve special education staffing at Churchill?',
  },
} satisfies TemplateEntry
