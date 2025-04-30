# smtp-hooker - The Email Server That Accepts Everything

Welcome to **smtp-hooker**—a Node.js app that runs an SMTP server with the security of a paper umbrella. It takes any email sent its way (no authentication, no encryption, no questions asked) and forwards it to a webhook URL you choose. Great for enabling dumb smart-devices, or tempting your fate. 

**Warning:** This server is as picky as a raccoon in a dumpster. Use it in controlled environments only!

## Features

- **Accepts all emails**: No credentials? No problem! It’s an equal-opportunity email catcher.
- **Webhook forwarding**: Sends parsed email data (sender, subject, body, etc.) to your specified URL via POST.
- **Easy config**: Just a couple of environment variables and you’re good to go.
- **Docker-ready**: Because containers make everything cooler.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later) or
- [Docker](https://www.docker.com/) (for container fans)
- A webhook URL to catch the email chaos

### Installation

1. **Clone the repo**:
   ```bash
   git clone https://github.com/helv-io/smtp-hooker.git
   cd smtp-hooker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build it**:
   ```bash
   npm run build
   ```

### Configuration

Set these environment variables to tell the server what to do. Use a `.env` file or set them directly—your call!

| Variable      | Description                                           | Default |
|---------------|-------------------------------------------------------|---------|
| `PORT`        | The port your SMTP server listens on.                 | `25`    |
| `WEBHOOK_URL` | Where to send the emails (required, no default).      | N/A     |

**Example `.env`**:
```env
PORT=2525
WEBHOOK_URL=http://example.com/webhook
```

### Running It

#### Locally
1. Set your environment variables.
2. Fire it up:
   ```bash
   npm start
   ```

#### With Docker
1. Build the image:
   ```bash
   docker build -t smtp-hooker .
   ```
2. Run it:
   ```bash
   docker run -p 2525:2525 -e PORT=2525 -e WEBHOOK_URL=http://example.com/webhook smtp-hooker
   ```

### Usage

Send an email to the server’s port, and it’ll forward the details to your `WEBHOOK_URL`. You’ll get a JSON payload like this:

```json
{
  "from": "sender@example.com",
  "to": [{"name": "You", "address": "you@example.com"}],
  "subject": "Test Email",
  "text": "Hi there!",
  "html": "<p>Hi there!</p>",
  "attachments": [],
  "receivedAt": "2023-10-01T12:34:56.789Z"
}
```

## Security Note

This server has no locks, no gates, no bouncer. It’s **not secure** and shouldn’t face the wild internet. Keep it local or behind a firewall, unless you enjoy spam more than we do.

## Contributing

Got a wild idea or a bug fix? Open an issue or pull request. We’d love to hear from fellow email enthusiasts (or masochists).

## License

Licensed under the [GNU License](LICENSE)

---

**Fun Fact:** This server’s so open, it’d probably accept an email from your grandma’s typewriter if she could figure out SMTP.