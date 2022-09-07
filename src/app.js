const axios = require('axios');
const datefns = require("date-fns");
const TelegramBot = require('node-telegram-bot-api');
const Process = require("process");
require('dotenv').config()

const TELEGRAM_TOKEN = Process.env["BOT_TOKEN"];
const EXECUTION_INTERVAL = 60000;
const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

bot.on('message', (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, "started to check for OCD places")

    setInterval(() => {
        bot.sendMessage(msg.chat.id, "im alive")
    }, 7200000)

    setInterval(() => {
        let today = new Date()
        let index;
        let dayToCheck;
        const hours = ["1845", "2130"]
        for (index = 1; index < 120; index++) {
            dayToCheck = datefns.addDays(today, index)
            dayToCheck = dayToCheck.toISOString().split('T')[0].split('-').join("")
            bot.sendMessage(chatId, dayToCheck)

            axios.post('https://ontopo.co.il/api/availability/searchAvailability',
                {
                    "slug": "88542392",
                    "locale": "he",
                    "criteria": {"size": "3", "date": dayToCheck, "time": hours[0]}
                }).then(res => {
                if (res.data.method == "seat") {
                    bot.sendMessage(chatId, "found in " + dayToCheck + " at 18:45")
                }
            })
            axios.post('https://ontopo.co.il/api/availability/searchAvailability',
                {
                    "slug": "88542392",
                    "locale": "he",
                    "criteria": {"size": "3", "date": dayToCheck, "time": hours[1]}
                }).then(res => {
                if (res.data.method == "seat") {
                    bot.sendMessage(chatId, "found in " + dayToCheck + " at 21:30")
                }
            })
        }
    }, 2000);
})