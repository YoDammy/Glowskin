# GlowSkin AI Customer Support Bot

A Telegram bot powered by GPT-4o-mini that handles customer 
enquiries for GlowSkin, a premium skincare brand. Built as a 
portfolio project demonstrating AI-powered customer support automation.

## Live Demo
Find the bot on Telegram: @@glowSkinstore_bot

## What it does
- Answers customer questions about products, ingredients, 
  shipping, and returns
- Stays on topic — politely redirects off-topic questions
- Offers human follow-up when it cannot answer a question
- Captures and logs customer emails for the support team
- Remembers full conversation context across messages
- /reset command to start a fresh conversation

## Tech stack
- Node.js
- Telegraf — Telegram bot framework
- OpenAI API (GPT-4o-mini)
- Deployed on Railway

## Key concepts demonstrated
- AI integration with custom system prompts
- Conversation history management
- Lead capture via email detection
- Webhook deployment on Railway
- Environment variable management

## How it works
When a customer sends a message, the bot forwards it to 
GPT-4o-mini along with the full conversation history and a 
system prompt that defines GlowSkin's brand, products, and 
policies. The AI generates a response and the bot delivers 
it back to the customer in Telegram.

If the customer asks something outside GlowSkin's scope, 
the bot politely redirects. If it cannot help, it offers 
to collect the customer's email for human follow-up.

## Setup
1. Clone the repo
2. Run npm install
3. Create a .env file with BOT_TOKEN and OPENAI_API_KEY
4. Run node index.js

## Built by
Dammy — AI automation specialist and bot developer
[LinkedIn] www.linkedin.com/in/oluwadamilolaodunlami | [GitHub](https://github.com/YoDammy)