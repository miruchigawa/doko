import fs from "fs"


import { getUser, updateUser, reduceUserMoney } from '../../plugin/economy.js'

export default async function({bot, event, parameters, sender}){
  const input = parameters.join(" ").toLowerCase()
  let flag
  if (!input) return bot.sendMessage("Invalid input\n.setf <new flag>", event.threadID)
  //const pay = reduceUserMoney(sender, 3)
  //if (!pay) return bot.sendMessage("Uang kamu kurang. dibutuhkan 3¥ untuk mengubah nama\nLakukan daily setiap hari agar uang kamu bertambah", event.threadID)
  const user = getUser(sender)
  
  switch(input){
    case "us":
      flag = "us"
      break
    case "id":
      flag = "id"
      break
    case "kr":
      flag = "kr"
      break
    case "jp":
      flag = "jp"
      break
    default:
      return bot.sendMessage(`Flag not found!\nList all flag: us, id, kr, jp.`, event.threadID)
  }
  
  user.flag = flag
  updateUser(sender, user)
  
  bot.sendMessage(`Sukses mengubah bendera menjadi ${flag}.`, event.threadID)
}