import { getUser } from '../../plugin/economy.js'
import { createCard } from '../../plugin/user_canvas.js'
import fs from 'fs'

export default async function({ bot, event, sender }) {
  
  const path = `./assets/images/status_sys_${Date.now()}.jpeg`
  const { name, idVirtual, money, chat, gacha, level, exp, pp, bg, flag } = getUser(sender);
  const nextLevelExp = Math.floor(100 * Math.pow(level, 1.2))
  const expPercentage = Math.floor((exp / nextLevelExp) * 100);
  const user = { name: name, id: idVirtual, exp: exp, av:pp, bg:bg, flag:flag }
  const card = await createCard(user, Math.floor(money), chat, gacha, level, expPercentage)
  
  try{
    await fs.writeFileSync(path, card.toBuffer('image/jpeg'))
    await bot.sendMessage({attachment: fs.createReadStream(path)}, event.threadID)
    await fs.unlinkSync(path)
  }catch(e){console.error(e)}
}