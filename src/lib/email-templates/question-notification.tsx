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

interface QuestionNotificationProps {
  name?: string
  email?: string
  message?: string
}

export function QuestionNotification({
  name = 'A neighbor',
  email = 'unknown@example.com',
  message = '(no message)',
}: QuestionNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New question from ${name}`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Lato, Arial, sans-serif' }}>
        <Container style={{ padding: '24px', maxWidth: '560px' }}>
          <Heading
            style={{
              color: '#58150C',
              fontSize: '22px',
              margin: '0 0 4px',
              letterSpacing: '0.02em',
            }}
          >
            New question from the campaign site
          </Heading>
          <Text style={{ color: '#58150C', fontSize: '14px', margin: '0 0 16px' }}>
            {name} &lt;{email}&gt;
          </Text>
          <Hr style={{ borderColor: '#FDCD01', borderWidth: '2px' }} />
          <Section>
            <Text style={{ color: '#2b2b2b', fontSize: '16px', lineHeight: '24px', whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
          </Section>
          <Hr style={{ borderColor: '#eeeeee' }} />
          <Text style={{ color: '#777777', fontSize: '12px' }}>
            Reply directly to this email to answer {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: QuestionNotification,
  displayName: 'Question notification',
  subject: (data: Record<string, any>) =>
    `New question from ${data['name'] ?? 'the campaign site'}`,
  to: 'ask@saqeeb.org',
  previewData: {
    name: 'Priya Raman',
    email: 'priya@example.com',
    message: 'How would you improve special education staffing at Churchill?',
  },
} satisfies TemplateEntry