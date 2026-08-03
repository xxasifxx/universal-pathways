// Shared brand styling for campaign auth emails.
// Burgundy #58150C, Gold #FDCD01, Lato body type.
export const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Lato, Helvetica, Arial, sans-serif',
}
export const container = {
  padding: '32px 28px',
  maxWidth: '560px',
  borderTop: '6px solid #FDCD01',
}
export const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#58150C',
  letterSpacing: '0.02em',
  margin: '0 0 20px',
}
export const text = {
  fontSize: '15px',
  color: '#2b2b2b',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
export const link = { color: '#58150C', textDecoration: 'underline' }
export const button = {
  backgroundColor: '#FDCD01',
  color: '#58150C',
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
  color: '#58150C',
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
