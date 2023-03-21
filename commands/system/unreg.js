import fs from "fs"

export default async function({bot, event}){
  const db = JSON.parse(fs.readFileSync("./database/group.json"))
  
  const index = db.findIndex(data => data === event.threadID)
  
  if (index !== -1){
    db.splice(index, 1)
  }else{
    return bot.sendMessage("Group not registered!", event.threadID)
  }
  
  fs.writeFileSync("./database/group.json", JSON.stringify(db))
  return bot.sendMessage("Group has been unregistered!", event.threadID)
}