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

interface ContributionNotificationProps {
  name?: string
  email?: string
  phone?: string
  addressLine1?: string
  city?: string
  state?: string
  zipCode?: string
  occupation?: string
  employer?: string
  amount?: number
  method?: string
  note?: string
}

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Bank transfer (ACH)',
  zelle: 'Zelle',
  check: 'Check by mail',
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

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <>
      <Text style={labelStyle}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </>
  )
}

export function ContributionNotification({
  name = '',
  email = '',
  phone = '',
  addressLine1 = '',
  city = '',
  state = '',
  zipCode = '',
  occupation = '',
  employer = '',
  amount = 0,
  method = '',
  note = '',
}: ContributionNotificationProps) {
  const formatted = `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`New contribution pledge: ${formatted} from ${name}`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '32px 28px', maxWidth: '560px', borderTop: '6px solid #FDCD01' }}>
          <Heading style={{ color: '#58150C', fontSize: '22px', margin: '0 0 6px', letterSpacing: '0.02em' }}>
            {formatted} pledged
          </Heading>
          <Text style={{ color: '#777777', fontSize: '13px', margin: '0 0 24px' }}>
            Sending by {METHOD_LABELS[method] ?? method}. Watch for the funds, then mark it received.
          </Text>

          <Field label="Name" value={name} />
          <Field label="Email" value={email} />
          <Field label="Phone" value={phone} />
          <Field
            label="Address"
            value={[addressLine1, [city, state].filter(Boolean).join(', '), zipCode]
              .filter(Boolean)
              .join(' — ')}
          />
          <Field label="Occupation" value={occupation} />
          <Field label="Employer" value={employer} />
          <Field label="Note" value={note} />

          <Hr style={{ borderColor: '#eeeeee' }} />
          <Text style={{ color: '#777777', fontSize: '12px', margin: '16px 0 0' }}>
            Occupation and employer are captured for NJ ELEC reporting. The donor certified the
            funds are their own and that they are a US citizen or lawful permanent resident.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContributionNotification,
  displayName: 'Contribution pledge (to campaign)',
  subject: (data: Record<string, any>) =>
    `New contribution pledge — $${Number(data['amount'] ?? 0).toLocaleString('en-US')} from ${data['name'] ?? 'a supporter'}`,
  previewData: {
    name: 'Priya Raman',
    email: 'priya@example.com',
    phone: '732-555-0142',
    addressLine1: '12 Cranbury Rd',
    city: 'East Brunswick',
    state: 'NJ',
    zipCode: '08816',
    occupation: 'Pharmacist',
    employer: 'Rutgers Health',
    amount: 250,
    method: 'zelle',
    note: 'Happy to host a coffee too.',
  },
} satisfies TemplateEntry