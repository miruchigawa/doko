import fs from "fs";
import { getUser, updateUser } from "../../plugin/economy.js";

export default async function ({ bot, event, sender, parameters }) {
  const input = parameters.join(" ");

  const user = getUser(sender);

  if (user.redeem.includes(input)) {
    return bot.sendMessage(
      "Kamu sudah menggunakan kode tersebut, Coba kode lain!",
      event.threadID
    );
  }

  const db = JSON.parse(fs.readFileSync("./database/codeRedeem.json"));

  const codeIndex = db.findIndex((data) => data.code === input);

  if (codeIndex === -1) {
    return bot.sendMessage("Code not found!!", event.threadID);
  }

  const codeData = db[codeIndex];

  if (codeData.stock <= 0) {
    bot.sendMessage(
      "Kode redeem telah mencapai stock yang ditentukan. Coba kode lain!",
      event.threadID
    );
    db.splice(codeIndex, 1);
  } else {
    console.log(codeData)
    codeData.stock -= 1;
    user.redeem.push(input);
    user.money += codeData.money
    user.exp += codeData.exp
    console.log(user)
    updateUser(sender, user);
  }

  fs.writeFileSync("./database/codeRedeem.json", JSON.stringify(db));

  const message = `${codeData.message}\nYou got\nYen: ${codeData.money}\nExp: ${codeData.exp}`;
  bot.sendMessage(message, event.threadID);
}
