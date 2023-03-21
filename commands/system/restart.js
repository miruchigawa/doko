export default async function({bot, event}){
  await bot.sendMessage("Restarting all process please wait..", event.threadID)
  return await process.exit()
}