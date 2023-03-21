import { resetEvent } from '../../plugin/economy.js'

export default async function({bot, event, sender}){
  resetEvent(sender)
  return bot.sendMessage("Your current task successfully canceled.", event.threadID)
}