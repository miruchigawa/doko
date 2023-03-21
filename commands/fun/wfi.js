import { addEvent, reduceUserMoney } from '../../plugin/economy.js'

export default async function({bot, event, sender}){
  const pay = reduceUserMoney(sender, 1)
  if(!pay) return api.sendMessage("Uang kamu kurang, Lakukan daily setiap hari.", event.threadID)
  addEvent(sender, "wfi")
  return bot.sendMessage("You can upload images for interrogate tags.", event.threadID)
}