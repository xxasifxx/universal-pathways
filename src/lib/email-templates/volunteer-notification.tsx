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

interface VolunteerNotificationProps {
  name?: string
  email?: string
  zipCode?: string
  mobile?: string
  zone?: string
  helpWith?: string[]
  helpDetails?: Record<string, any>
}

const label = {
  color: '#777777',
  fontSize: '12px',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
}
const value = { color: '#2b2b2b', fontSize: '15px', margin: '0 0 14px' }

function describe(details: Record<string, any>): { title: string; body: string }[] {
  const rows: { title: string; body: string }[] = []
  const sign = details['yardSign']
  if (sign) {
    rows.push({
      title: 'Yard sign',
      body: [sign.address, sign.placementNotes].filter(Boolean).join(' — ') || '—',
    })
  }
  const canvass = details['canvassing']
  if (canvass) {
    rows.push({
      title: 'Canvassing availability',
      body:
        [
          Array.isArray(canvass.days) && canvass.days.length ? canvass.days.join(', ') : null,
          canvass.canDrive ? `Can drive: ${canvass.canDrive}` : null,
        ]
          .filter(Boolean)
          .join(' · ') || '—',
    })
  }
  const phone = details['phoneBank']
  if (phone) {
    rows.push({
      title: 'Phone / text bank',
      body:
        [
          phone.mobile,
          Array.isArray(phone.times) && phone.times.length ? phone.times.join(', ') : null,
          phone.channel ? `Prefers: ${phone.channel}` : null,
        ]
          .filter(Boolean)
          .join(' · ') || '—',
    })
  }
  if (details['notes']) rows.push({ title: 'Notes', body: String(details['notes']) })
  return rows
}

export function VolunteerNotification({
  name = 'A neighbor',
  email = 'unknown@example.com',
  zipCode = '',
  mobile = '',
  zone = '',
  helpWith = [],
  helpDetails = {},
}: VolunteerNotificationProps) {
  const detailRows = describe(helpDetails ?? {})
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`New volunteer signup: ${name}`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '32px 28px', maxWidth: '560px', borderTop: '6px solid #0E351A' }}>
          <Heading style={{ color: '#0E351A', fontSize: '22px', margin: '0 0 4px', letterSpacing: '0.02em' }}>
            New volunteer signup
          </Heading>
          <Text style={{ color: '#0E351A', fontSize: '14px', margin: '0 0 16px' }}>
            {name} &lt;{email}&gt;
          </Text>
          <Hr style={{ borderColor: '#0E351A', borderWidth: '2px' }} />
          <Text style={label}>Zip code</Text>
          <Text style={value}>{zipCode || '—'}</Text>
          <Text style={label}>Mobile</Text>
          <Text style={value}>{mobile || '—'}</Text>
          <Text style={label}>Zone</Text>
          <Text style={value}>{zone || '—'}</Text>
          <Text style={label}>Wants to help with</Text>
          <Text style={value}>{helpWith.length ? helpWith.join(', ') : '—'}</Text>
          {detailRows.map((row) => (
            <div key={row.title}>
              <Text style={label}>{row.title}</Text>
              <Text style={value}>{row.body}</Text>
            </div>
          ))}
          <Hr style={{ borderColor: '#eeeeee' }} />
          <Text style={{ color: '#777777', fontSize: '12px' }}>
            Reply directly to this email to reach {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: VolunteerNotification,
  displayName: 'Volunteer signup notification',
  subject: (data: Record<string, any>) =>
    `[Volunteer] ${data['name'] ?? 'the campaign site'}`,
  to: 'ask@saqeeb.org',
  previewData: {
    name: 'Dan Alvarez',
    email: 'dan@example.com',
    zipCode: '08816',
    mobile: '732-555-0134',
    zone: 'Churchill',
    helpWith: ['Request a yard sign', 'Join a canvassing day'],
    helpDetails: {
      yardSign: { address: '12 Cranbury Rd, East Brunswick', placementNotes: 'Near the driveway' },
      canvassing: { days: ['Saturday morning', 'Sunday morning'], canDrive: 'Yes' },
    },
  },
} satisfies TemplateEntry
