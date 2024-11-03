# Telegram to Discord Forwarder with Express

This project sets up a bot to forward messages from a Telegram announcement channel to a specified Discord channel. It also includes an Express.js server to display information about forwarded files, including file name, timestamp, and caption.

## Features

- Forwards text, photos, videos, and documents from Telegram to Discord.
- Displays information about transferred files via a web interface.
- Logs timestamp, file name, and caption for each forwarded message.

## Prerequisites

- Node.js installed
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
PORT=3000 # Optional, defaults to 3000 if not specified
```
3. **run program** 
    ```bash
    npm start
    ```
