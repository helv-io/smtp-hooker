import { SMTPServer } from 'smtp-server'
import { simpleParser, AddressObject } from 'mailparser'
import axios from 'axios'
import { config } from './config'

// Helper function to extract addresses
function extractAddresses(field: AddressObject | AddressObject[] | undefined) {
  if (!field) return []
  if (Array.isArray(field)) {
    return field.flatMap(obj => obj.value)
  }
  return field.value
}

// Initialize SMTP server with logging
const server = new SMTPServer({
  authOptional: true,
  hideSTARTTLS: true,
  onConnect: (session, callback) => {
    console.log(`Client connected: ${session.remoteAddress}`)
    callback()
  },
  onAuth: (auth, session, callback) => {
    console.log(`Authentication attempt: ${auth.username}`)
    callback(null, { user: auth.username })
  },
  onData: async (stream, session, callback) => {
    try {
      console.log(`Receiving email from: ${session.remoteAddress}`)
      const parsed = await simpleParser(stream)
      const emailData = {
        from: extractAddresses(parsed.from),
        to: extractAddresses(parsed.to),
        cc: extractAddresses(parsed.cc),
        bcc: extractAddresses(parsed.bcc),
        subject: parsed.subject ?? '',
        text: parsed.text ?? '',
        html: parsed.html ?? '',
        attachments: parsed.attachments.map(att => ({
          filename: att.filename ?? 'unnamed',
          contentType: att.contentType ?? 'application/octet-stream',
          size: att.size ?? 0,
          content: att.content.toString('base64')
        })),
        headers: Object.fromEntries(parsed.headers.entries()),
        receivedAt: new Date().toISOString()
      }

      await axios.post(config.webhookUrl, emailData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      })
      console.log('Email forwarded successfully')
      callback()
    } catch (error) {
      console.error('Error processing email:', error)
      callback(error instanceof Error ? error : new Error('Unknown error'))
    }
  },
  onClose: (session) => {
    console.log(`Client disconnected: ${session.remoteAddress}`)
  }
})

// Start the server
server.listen(config.port, () => {
  console.log(`SMTP server listening on port ${config.port}`)
})

server.on('error', (err) => {
  console.error('SMTP server error:', err)
})