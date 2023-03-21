import { claimDailyReward } from '../../plugin/economy.js'

export default async function({bot, sender, event}){
  return bot.sendMessage(claimDailyReward(sender), event.threadID)
}