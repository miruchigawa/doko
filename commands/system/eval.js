import util from "util"
import fs from "fs"

export default async function ({bot, prefix, event, parameters, sender, isOwner, banned, banned_word}) {
  let text = parameters.join(" ")
  let evaled = eval(text)
  if (typeof evaled !== 'string') evaled = util.inspect(evaled)
  return bot.sendMessage(evaled, event.threadID)
}
