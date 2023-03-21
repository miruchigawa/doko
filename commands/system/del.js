export default async function({bot, event}){
  if (!event.messageReply) return
  try{
    bot.unsendMessage(event.messageReply.messageID)
  }catch(e){
    bot.sendMessage(`Failed to delete message\n${e}`, event.threadID)
  }
}