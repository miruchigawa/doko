import { addEvent, reduceUserMoney } from '../../plugin/economy.js'

export default async function({bot, event, sender}){
  const pay = reduceUserMoney(sender, 3)
  if(!pay) return bot.sendMessage("Uang kamu kurang, Lakukan daily setiap hari.", event.threadID)
  addEvent(sender, "setav")
  return bot.sendMessage("You can now upload your image for your profile.", event.threadID)
}