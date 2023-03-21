import fs, { readFileSync } from "fs"
const { version } = JSON.parse(fs.readFileSync("./package.json"))
import createCanvas from "../../plugin/canvas/information_server.js"
const changelog = readFileSync("./system/changelog.txt")

export default async function({bot, event}){
  const memoryData = process.memoryUsage();
  const path = `./assets/images_sys_${Date.now}.png`
  const name = `Miru | Rexuint (${version})`
  const images = await createCanvas({name:name, version:version, memoryData: memoryData, changelog: changelog})
  await fs.writeFileSync(path, images)
  await bot.sendMessage({attachment: fs.createReadStream(path)}, event.threadID)
  return fs.unlinkSync(path)
}