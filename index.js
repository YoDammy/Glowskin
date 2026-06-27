const {Telegraf} = require('telegraf')
const OpenAI = require('openai')

require('dotenv').config()


const bot = new Telegraf(process.env.BOT_TOKEN)
const ai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

const chatHistory = {}
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
    .then((response)=>{
        const reply = response.choices[0].message.content
        chatHistory[userId].push({
            role:'assistant', content: reply
        })
        ctx.reply(reply)

        if(userMessage.includes('@') && userMessage.includes('.')){
            console.log(`NEW LEAD - USER ID: ${userId}, Email: ${userMessage} `)
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