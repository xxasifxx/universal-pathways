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
import { DONATION } from '../campaign'

interface ContributionConfirmationProps {
  name?: string
  amount?: number
  method?: string
}

const labelStyle = {
  color: '#777777',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  margin: '0 0 2px',
}
const valueStyle = {
  color: '#2b2b2b',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 14px',
}

export function ContributionConfirmation({
  name = 'there',
  amount = 0,
  method = 'bank_transfer',
}: ContributionConfirmationProps) {
  const formatted = `$${amount.toLocaleString('en-US')}`
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>How to send your contribution to the campaign</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '32px 28px', maxWidth: '560px', borderTop: '6px solid #0E351A' }}>
          <Heading style={{ color: '#0E351A', fontSize: '22px', margin: '0 0 16px', letterSpacing: '0.02em' }}>
            Thank you, {name}.
          </Heading>
          <Text style={{ color: '#2b2b2b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 22px' }}>
            You told us you&apos;d like to give {formatted}. Contributions go straight to the
            campaign account — no processing service takes a cut. Here&apos;s how to send it.
          </Text>

          {method === 'bank_transfer' ? (
            <Section>
              <Text style={labelStyle}>Bank</Text>
              <Text style={valueStyle}>{DONATION.bank.name}</Text>
              <Text style={labelStyle}>Account name</Text>
              <Text style={valueStyle}>{DONATION.bank.accountName}</Text>
              <Text style={labelStyle}>Routing number</Text>
              <Text style={valueStyle}>{DONATION.bank.routingNumber}</Text>
              <Text style={labelStyle}>Account number</Text>
              <Text style={valueStyle}>{DONATION.bank.accountNumber}</Text>
            </Section>
          ) : null}

          {method === 'check' ? (
            <Section>
              <Text style={labelStyle}>Make the check payable to</Text>
              <Text style={valueStyle}>{DONATION.checkPayableTo}</Text>
              <Text style={labelStyle}>Mail it to</Text>
              <Text style={valueStyle}>{DONATION.mailingAddress.join(', ')}</Text>
            </Section>
          ) : null}

          <Hr style={{ borderColor: '#eeeeee' }} />
          <Text style={{ color: '#777777', fontSize: '12px', lineHeight: '1.6', margin: '16px 0 0' }}>
            We already have the contributor details required for the campaign&apos;s NJ ELEC
            report, so there&apos;s nothing else for you to fill in. Contributions to a candidate
            committee are not tax deductible.
          </Text>
          <Text style={{ color: '#777777', fontSize: '12px', margin: '10px 0 0' }}>
            {DONATION.committeeName}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContributionConfirmation,
  displayName: 'Contribution instructions (to donor)',
  subject: 'How to send your contribution — Saqeeb for East Brunswick BOE',
  previewData: { name: 'Priya', amount: 250, method: 'bank_transfer' },
} satisfies TemplateEntry