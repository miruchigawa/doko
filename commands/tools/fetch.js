export default async function ({event, bot, parameters}){
  let url = parameters.join(" ")
  let response
  try{
    response = await fetch(url)
    if (!response.ok) throw `${response.statusText} (${response.status})`
  }catch{(e) => {
    return bot.sendMessage(`Can\'t fetch ${e}`, event.threadID)
  }}
  const data = await response.text()
  try{
    return bot.sendMessage(data, event.threadID)
  }catch{}
}