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
}

const label = {
  color: '#777777',
  fontSize: '12px',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
}
const value = { color: '#2b2b2b', fontSize: '15px', margin: '0 0 14px' }

export function VolunteerNotification({
  name = 'A neighbor',
  email = 'unknown@example.com',
  zipCode = '',
  mobile = '',
  zone = '',
  helpWith = [],
}: VolunteerNotificationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`New volunteer signup: ${name}`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '32px 28px', maxWidth: '560px', borderTop: '6px solid #FDCD01' }}>
          <Heading style={{ color: '#58150C', fontSize: '22px', margin: '0 0 4px', letterSpacing: '0.02em' }}>
            New volunteer signup
          </Heading>
          <Text style={{ color: '#58150C', fontSize: '14px', margin: '0 0 16px' }}>
            {name} &lt;{email}&gt;
          </Text>
          <Hr style={{ borderColor: '#FDCD01', borderWidth: '2px' }} />
          <Text style={label}>Zip code</Text>
          <Text style={value}>{zipCode || '—'}</Text>
          <Text style={label}>Mobile</Text>
          <Text style={value}>{mobile || '—'}</Text>
          <Text style={label}>Zone</Text>
          <Text style={value}>{zone || '—'}</Text>
          <Text style={label}>Wants to help with</Text>
          <Text style={value}>{helpWith.length ? helpWith.join(', ') : '—'}</Text>
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
    `New volunteer signup: ${data['name'] ?? 'the campaign site'}`,
  to: 'ask@saqeeb.org',
  previewData: {
    name: 'Dan Alvarez',
    email: 'dan@example.com',
    zipCode: '08816',
    mobile: '732-555-0134',
    zone: 'Churchill',
    helpWith: ['Knock doors', 'Request a yard sign'],
  },
} satisfies TemplateEntry
