import fs from "fs"

export default async function({bot, event, sender, parameters}){
  const input = parameters[0]
  const db = insert()
  switch(input){
    case "create":
      const name = parameters.slice(0).join(" ") || "No Name";
      const indexID = db.findIndex(data => data.id === event.threadID)
      const indexC = db.findIndex(data => data.name === name)
      if (indexID !== -1 || indexID !== -1){
        return bot.sendMessage("Failed, Group or nickname has been registered!", event.threadID)
      }else{
        db.push({id: event.threadID, name: name, member: [sender], allowJoin: true})
        commit(db)
        return bot.sendMessage("Guild creation successful!", event.threadID)
      }
      break;
    case "info":
      const group = db.find(data => data.id === event.threadID)
      return bot.sendMessage(`Status: ${group ? "Register":"No Guild found in this group"}`, event.threadID)
    default:
      return bot.sendMessage("Command for create and delete guild\nPrice: 50¥ Yen\n.guild create <name guild>\n.guild delete", event.threadID)
  }
  
}

function insert(){
  return JSON.parse(fs.readFileSync("./database/guild.json"))
}
function commit(data){
  return fs.writeFileSync("./database/guild.json", JSON.stringify(data))
}