import fs from "fs"
const db = JSON.parse(fs.readFileSync("./database/user.json"))
const newData = db.map((obj) => ({...obj, cooldown: []}))
fs.writeFileSync("./database/user.json", JSON.stringify(newData))