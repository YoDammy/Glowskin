const {Telegraf} = require('telegraf')
const OpenAI = require('openai')
const { google } = require('googleapis')
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
require('dotenv').config()


const bot = new Telegraf(process.env.BOT_TOKEN)
const ai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

const chatHistory = {}

async function addLeadToSheet(userId, email) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })

  const sheets = google.sheets({ version: 'v4', auth });

  const date = new Date().toLocaleDateString('en-GB');

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Sheet1!A:C',
    valueInputOption: 'RAW',
    resource: {
      values: [[date, userId.toString(), email]]
    }
  });

  console.log('Lead added to sheet:', email);
}
bot.command('start', (ctx)=>{
    ctx.reply('Welcome to Glowskin, how can i help?')
})

bot.command('reset', (ctx)=>{
    const userId = ctx.from.id
    delete chatHistory[userId]
    ctx.reply('Reset complete!')
})

bot.on('text', (ctx)=>{
    if (ctx.message.text.startsWith('/')) return
     const userId = ctx.from.id
     const userMessage = ctx.message.text
    if (!chatHistory[userId]) chatHistory[userId] = []
        chatHistory[userId].push({
            role:'user', content: userMessage
        })
    ctx.sendChatAction('typing')

    ai.chat.completions.create({
        model:'gpt-4o-mini',
        max_tokens: 500,
        messages:[
            {role: 'system', content: 'you are a friendly customer assistant for Glowskin, a premium skin care brand. Only answer questions about our products, ingredients, shipping(3-5days, free over £40)and returns (30-day policy). If a customer asks something outside of skincare or GlowSkin, politely redirect them. If you cannot answer their question, say:"I want to make sure you get the best help — could I take your email and have our team follow up with you?"'},
            ...chatHistory[userId]
        ]
    })
 .then((response) => {
    const reply = response.choices[0].message.content;
    chatHistory[userId].push({ role: 'assistant', content: reply });
    ctx.reply(reply);

    if (userMessage.includes('@') && userMessage.includes('.')) {
        console.log('NEW LEAD — User ID:', userId, '| Email:', userMessage);
        addLeadToSheet(userId, userMessage)
        .then(() => ctx.reply('Thanks! Our team will be in touch shortly.'))
        .catch((err) => console.error('Sheet error:', err.message));
    }
})
    .catch((error)=>{
        console.error('AI_Error: ', error.message)
        ctx.reply('Sorry, something went wrong. Try again')
    })
})
bot.launch({
    webhook:{
        domain: 'glowskin-production.up.railway.app',
        port: 3000
    }
})
console.log('bot is running...')