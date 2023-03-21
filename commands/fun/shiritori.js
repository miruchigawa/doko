import fs from 'fs';
import { getUser, addSesionShiri } from "../../plugin/economy.js"

export default async function({bot, event, sender, parameters}){
  const en = JSON.parse(fs.readFileSync("./database/shiritori/en.json"))
  if (!parameters[0]) return bot.sendMessage("Invalid key\n!shiritori en", event.threadID);
  const { name } = getUser(sender);
  switch(parameters[0]){
    case 'en':
      const start = en[Math.floor(Math.random() * en.length - 1)]
      bot.sendMessage(`${name} session started. Check your DM to start playing.`, event.threadID)
      addSesionShiri(sender, {isGame: true, room: event.threadID, word: start[0]})
      bot.sendMessage(`#Shiritori EN\nWord: ${start}`, sender)
      break;
  }
}