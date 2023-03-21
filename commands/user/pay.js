import { payUser, reduceUserMoney } from '../../plugin/economy.js'

export default async function({bot, event, sender, parameters}){
  const id = Number(parameters[0])
  const money = Number(parameters[1])
  const pay = reduceUserMoney(sender, money)
  if(!pay) return bot.sendMessage("Uang kamu kurang, Lakukan daily setiap hari.", event.threadID)
  if (id && money){
    return bot.sendMessage(payUser(id, sender, money), event.threadID)
  }else{
    return bot.sendMessage("Invalid argument\n!pay <id> <money>", event.threadID)
  }
}