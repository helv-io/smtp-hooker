require('dotenv').config()
import { cleanEnv, str, port } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port({ default: 2525, desc: 'Port for SMTP server to listen on' }),
  WEBHOOK_URL: str({ desc: 'URL to forward emails to via POST' })
})

export const config = {
  port: env.PORT,
  webhookUrl: env.WEBHOOK_URL,
}