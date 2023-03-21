import { updateUserUsername, reduceUserMoney } from '../../plugin/economy.js'

export default async function({bot, event, parameters, sender}){
  const input = parameters.join(" ")
  if (!input) return bot.sendMessage("Invalid input\n.setn <new name>", event.threadID)
  const pay = reduceUserMoney(sender, 3)
  if (!pay) return bot.sendMessage("Uang kamu kurang. dibutuhkan 3¥ untuk mengubah nama\nLakukan daily setiap hari agar uang kamu bertambah", event.threadID)
  bot.sendMessage(`Sukses mengubah username menjadi ${input}!`, event.threadID)
  return updateUserUsername(sender, input)
}