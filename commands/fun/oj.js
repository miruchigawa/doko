import openiji from "../../plugin/openiji.js"
import { converBase64ToImage } from 'convert-base64-to-image';
import fs from "fs";

export default async function({event, bot, parameters}){
  const path = `./assets/oj_sys_${Date.now()}.png`
  
  let prompt = parameters.join(" ")
  if (!prompt) return bot.sendMessage("Masukan prompt!", event.threadID)
  bot.sendMessage("Generating images please wait.....", event.threadID)
  try{
    let data = await openiji(prompt)
    console.log(data.data)
    const base = data.data[0]
    await converBase64ToImage(base, path)
    await bot.sendMessage({attachment: fs.createReadStream(path), body: "Here we go.."}, event.threadID)
    await fs.unlinkSync(path)
  }catch{
    return bot.sendMessage("0x0f1: Hardware failure\n0x0f2: falled_to_generate", event.threadID)
  }
}