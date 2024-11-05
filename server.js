require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Client, Intents, MessageAttachment } = require('discord.js');
const axios = require('axios');
const express = require('express');
const moment = require('moment');

// Token Bot Telegram dan Discord
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; // Discord webhook URL
const BRIDGE_MODE = process.env.BRIDGE_MODE || 'client'; // 'client' or 'webhook'

const bot = new Telegraf(TELEGRAM_TOKEN);
const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const app = express();
const PORT = process.env.PORT || 3000;

let fileTransferData = []; // Array to store file transfer information

discordClient.once('ready', () => {
  console.log(`Discord bot logged in as ${discordClient.user.tag}`);
});

// Function to download file as buffer
async function downloadFileToBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
}

// Function to send message using Discord client
async function sendWithClient(content, buffer, fileName) {
  const discordChannel = await discordClient.channels.fetch(DISCORD_CHANNEL_ID);
  await discordChannel.send({ content, files: buffer ? [new MessageAttachment(buffer, fileName)] : [] });
}

// Function to send message using Discord webhook
async function sendWithWebhook(content, buffer, fileName) {
  const form = new FormData();
  form.append('content', content);
  if (buffer && fileName) {
    form.append('file', buffer, fileName);
  }

  await axios.post(DISCORD_WEBHOOK_URL, form, {
    headers: form.getHeaders()
  });
}

// Telegram bot - forward messages to Discord
bot.on('channel_post', async (ctx) => {
  const message = ctx.channelPost;
  console.log("Menerima pesan dari channel announcement:", message);

  try {
    let fileName = "";
    let caption = message.caption ? message.caption : "";

    let buffer = null;

    if (message.text) {
      // Send text message
      if (BRIDGE_MODE === 'client') {
        await sendWithClient(message.text, null, null);
      } else {
        await sendWithWebhook(message.text, null, null);
      }
    } else if (message.photo) {
      // Send photo
      const fileId = message.photo[message.photo.length - 1].file_id;
      const fileUrl = await bot.telegram.getFileLink(fileId);
      buffer = await downloadFileToBuffer(fileUrl);
      fileName = 'photo.jpg';

      if (BRIDGE_MODE === 'client') {
        await sendWithClient(caption, buffer, fileName);
      } else {
        await sendWithWebhook(caption, buffer, fileName);
      }
    } else if (message.video) {
      // Send video
      const fileId = message.video.file_id;
      const fileUrl = await bot.telegram.getFileLink(fileId);
      buffer = await downloadFileToBuffer(fileUrl);
      fileName = 'video.mp4';

      if (BRIDGE_MODE === 'client') {
        await sendWithClient(caption, buffer, fileName);
      } else {
        await sendWithWebhook(caption, buffer, fileName);
      }
    } else if (message.document) {
      // Send document
      const fileId = message.document.file_id;
      const fileUrl = await bot.telegram.getFileLink(fileId);
      buffer = await downloadFileToBuffer(fileUrl);
      fileName = message.document.file_name;

      if (BRIDGE_MODE === 'client') {
        await sendWithClient(caption, buffer, fileName);
      } else {
        await sendWithWebhook(caption, buffer, fileName);
      }
    } else {
      console.log("Pesan tipe lain diterima dari Telegram dan tidak di-forward.");
      return;
    }

    // Log file transfer information
    fileTransferData.push({
      fileName,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      caption
    });
  } catch (error) {
    console.error("Error saat mem-forward pesan ke Discord:", error);
  }
});

// Express endpoint to display file transfer information
app.get('/transfers', (req, res) => {
  res.send(`
    <h1>File Transfers</h1>
    <table border="1">
      <tr>
        <th>File Name</th>
        <th>Timestamp</th>
        <th>Caption</th>
      </tr>
      ${fileTransferData.map(data => `
        <tr>
          <td>${data.fileName}</td>
          <td>${data.timestamp}</td>
          <td>${data.caption}</td>
        </tr>
      `).join('')}
    </table>
  `);
});

// Start Telegram bot, Discord client, and Express server
bot.launch();

if (BRIDGE_MODE === 'client') {
  discordClient.login(DISCORD_TOKEN);
}

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
