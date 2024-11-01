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

// Telegram bot - forward messages to Discord
bot.on('channel_post', async (ctx) => {
  const message = ctx.channelPost;
  console.log("Menerima pesan dari channel announcement:", message);

  try {
    const discordChannel = await discordClient.channels.fetch(DISCORD_CHANNEL_ID);
    let fileName = "";
    let caption = message.caption ? message.caption : "";

    if (message.text) {
      await discordChannel.send(message.text);
    } else if (message.photo) {
      const fileId = message.photo[message.photo.length - 1].file_id;
      const fileUrl = await bot.telegram.getFileLink(fileId);
      const buffer = await downloadFileToBuffer(fileUrl);
      fileName = 'photo.jpg';
      await discordChannel.send({ content: caption, files: [new MessageAttachment(buffer, fileName)] });
    } else if (message.video) {
      const fileId = message.video.file_id;
      const fileUrl = await bot.telegram.getFileLink(fileId);
      const buffer = await downloadFileToBuffer(fileUrl);
      fileName = 'video.mp4';
      await discordChannel.send({ content: caption, files: [new MessageAttachment(buffer, fileName)] });
    } else if (message.document) {
      const fileId = message.document.file_id;
      const fileUrl = await bot.telegram.getFileLink(fileId);
      const buffer = await downloadFileToBuffer(fileUrl);
      fileName = message.document.file_name;
      await discordChannel.send({ content: caption, files: [new MessageAttachment(buffer, fileName)] });
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
discordClient.login(DISCORD_TOKEN);
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
