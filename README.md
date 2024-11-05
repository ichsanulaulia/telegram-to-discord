# Telegram-to-Discord File Forwarding Bot

This project is a flexible bot that forwards messages and media files from a Telegram channel to a Discord channel. Users can choose between forwarding messages with the **Discord Client** or a **Discord Webhook** for seamless integration and easier setup.

## Features

- **Two Modes for Forwarding**:
  - **Client Mode**: Uses a Discord Bot Client for message transfer, suitable for setups where bot presence in the Discord server is needed.
  - **Webhook Mode**: Uses a Discord Webhook to forward messages, reducing the need for a logged-in bot client.
- **Supports Various Media Types**:
  - Text messages
  - Photos, Videos, and Documents
- **Transfer Logging**:
  - Logs each file transfer with filename, timestamp, and caption.
  - Accessible via a simple web interface.

## Setup and Installation

### Prerequisites

- **Node.js** (>= 16)
- **Telegram Bot Token**: Obtain via [BotFather](https://core.telegram.org/bots#botfather) on Telegram.
- **Discord Bot Token**: Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications).
- **Discord Webhook** (optional): Can be created in the Discord channel settings for webhook-based transfer.
- A Telegram bot token
- A Discord bot token and a target channel ID

## Installation

1. **Clone the repository** and navigate to the project folder:
    ```bash
    git clone https://github.com/ichsanulaulia/telegram-to-discord.git
    cd telegram-to-discord
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory and add your Telegram and Discord credentials. See the example below.

### Example `.env` file

```plaintext
TELEGRAM_TOKEN=your_telegram_bot_token
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_discord_channel_id
DISCORD_WEBHOOK_URL=your_discord_webhook_url # Optional, only needed for webhook mode
BRIDGE_MODE=client # Use 'client' or 'webhook'
PORT=3000 # Optional, default is 3000
```
4. **Run program** 
    ```bash
    npm start
    ```
