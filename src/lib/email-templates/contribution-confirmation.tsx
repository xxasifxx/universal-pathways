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

interface ContributionConfirmationProps {
  name?: string
  amount?: number
}

export function ContributionConfirmation({ name = 'there', amount = 0 }: ContributionConfirmationProps) {
  const formatted = `$${amount.toLocaleString('en-US')}`
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Thank you for supporting the campaign</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '32px 28px', maxWidth: '560px', borderTop: '6px solid #0E351A' }}>
          <Heading style={{ color: '#0E351A', fontSize: '22px', margin: '0 0 16px', letterSpacing: '0.02em' }}>
            Thank you, {name}.
          </Heading>
          <Text style={{ color: '#2b2b2b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 22px' }}>
            We received your ${formatted} contribution information. Secure contributions are handled
            through ActBlue.
          </Text>
          <Hr style={{ borderColor: '#eeeeee' }} />
          <Text style={{ color: '#777777', fontSize: '12px', lineHeight: '1.6', margin: '16px 0 0' }}>
            Contributions to a candidate committee are not tax deductible.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContributionConfirmation,
  displayName: 'Contribution confirmation (to donor)',
  subject: 'Thank you for supporting Saqeeb for East Brunswick BOE',
  previewData: { name: 'Priya', amount: 250 },
} satisfies TemplateEntry