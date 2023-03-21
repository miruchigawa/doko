import fs from "fs"

export default async function({bot, event}){
  const db = JSON.parse(fs.readFileSync("./database/group.json"))
  
  db.push(event.threadID)
  fs.writeFileSync("./database/group.json", JSON.stringify(db))
  return bot.sendMessage("Group registered!", event.threadID)
}