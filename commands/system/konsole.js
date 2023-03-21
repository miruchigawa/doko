import {exec} from "child_process"

export default async function({bot, event, parameters}){
  let text = parameters.join(" ")
  return exec(text, (err, sdout) => {
    if (err) return bot.sendMessage(err.toString(), event.threadID)
    bot.sendMessage(sdout||"None", event.threadID)
  })
}