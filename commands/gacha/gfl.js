import { gachaGirlFrontline, sellGirlFrontline, getUserBackpackGfl, getUser, reduceUserMoney, addGachaCount } from '../../plugin/economy.js';
import { canvas } from "../../plugin/gfl_canvas.js"
import inv from "../../plugin/inv_canvas.js"
import fs from "fs"

export default async function({ isOwner, event, parameters, sender, bot }) {
  if (!parameters[0]) return bot.sendMessage("Invalid key\n.gfl pull -> \n.gfl sell <id> \n.gfl inv", event.threadID);
  const key = parameters[0]
  const id = Number(parameters[1]);
  let path

  switch (key) {
    case "pull":
      const pay = reduceUserMoney(sender, 12)
      if(!pay) return bot.sendMessage("Uang kamu kurang, dibutuhkan 12 ¥ untuk melakukan pull.\nLakukan daily setiap hari.", event.threadID)
      addGachaCount(sender)
      path = `./assets/images/gfl_sys_${Date.now()}.jpeg`
      const gacha = await gachaGirlFrontline(sender, isOwner)
      const { idVirtual } = getUser(sender);
      const itm = { name: gacha.name, id: gacha.id, img: gacha.img, rate: gacha.rarity }
      const user = { id: idVirtual }
      await canvas(itm, user, path)
      await bot.sendMessage({attachment: fs.createReadStream(path)}, event.threadID)
      await fs.unlinkSync(path)
      break;

    case "sell":
      bot.sendMessage(sellGirlFrontline(sender, id), event.threadID);
      break;

    case "inv":
      path = `./assets/images/gfl_inv_sys_${Date.now()}.jpeg`
      const data = getUserBackpackGfl(sender);
      const { name } = getUser(sender);
      
      await inv(path, name, data)
      
      await bot.sendMessage({attachment: fs.createReadStream(path)}, event.threadID)
      await fs.unlinkSync(path)
      break;
  }
}