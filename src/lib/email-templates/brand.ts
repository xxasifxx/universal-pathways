// Shared brand styling for campaign auth emails.
// Sign green #0E351A, warm cream #F5F0E6, Lato body type.
export const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Lato, Helvetica, Arial, sans-serif',
}
export const container = {
  padding: '32px 28px',
  maxWidth: '560px',
  borderTop: '6px solid #0E351A',
}
export const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0E351A',
  letterSpacing: '0.02em',
  margin: '0 0 20px',
}
export const text = {
  fontSize: '15px',
  color: '#2b2b2b',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
export const link = { color: '#0E351A', textDecoration: 'underline' }
export const button = {
  backgroundColor: '#0E351A',
  color: '#F5F0E6',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '6px',
  padding: '13px 22px',
  textDecoration: 'none',
  display: 'inline-block',
}
export const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: '#0E351A',
  letterSpacing: '0.12em',
  margin: '0 0 30px',
}
export const footer = {
  fontSize: '12px',
  color: '#777777',
  borderTop: '1px solid #eeeeee',
  paddingTop: '16px',
  margin: '30px 0 0',
}
