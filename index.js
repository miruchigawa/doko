import facebook from "fb-chat-api"
import fs from "fs"
import './commands-settings.js'
import processCommand, {
  getPrefixList } from './system/command-process.js'
import { NlpManager } from "node-nlp"
import { addExp, updateUserMoney, getEvent, checkEvent, checkUserEvent, updateAvatar, updateHeader, delEvent, reduceUserMoney, addChatCount, getUser, updateShiri, updateReqShiri, restartShiri } from './plugin/economy.js'
import { download } from './plugin/tools.js'
import deepboru from "./plugin/deepboru.js"


// Connection api
facebook({appState: JSON.parse(fs.readFileSync("./session/cookie.json"))}, async (err, api) => {
  if (err) throw console.error(err);
  
  // api options
  api.setOptions({logLevel: "info", listenEvents: true, autoReconnect: true, forceLogin: true})
  
  // Listen event
  api.listen(async (err, event) => {
    
    // Close process when disconnected
    if (err) {
      console.log(err)
      return process.exit()
    }
    
    // Mark as read all message
   // api.markAsReadAll()
    
    // Debugging Event Type
    //console.log(event)
    
    switch(event.type) {
      
      // Recived a message
      case "message": case "message_reply":

        console.log(`Get message from room ${event.threadID}: ${event.body}`)

        const prefix = getPrefixList()
        const { senderID, isGroup } = event
        const chat = event.body.toLowerCase()
        const { shiritori, name } = getUser(senderID)
        const en = JSON.parse(fs.readFileSync("./database/shiritori/en.json"))
        const groupList = fs.readFileSync("./database/group.json")
        const isRegis = groupList.includes(event.threadID)
        
        if (event.attachments.length >= 1 && event.attachments[0].type === "photo" && checkEvent(senderID) ){
          
          const url = event.attachments[0].url
          let path, downloaded
          
          switch(checkUserEvent(senderID)){
            case "setav":
              path = `./database/user/avatar/${senderID}.png`
              const avdownloaded = await download(url, path)
              if (avdownloaded){
                delEvent(senderID, "setav")
                updateAvatar(senderID, path)
                api.sendMessage("Your status profile image successfully changed.", event.threadID)
              }else{
                delEvent(senderID, "setav")
                api.sendMessage("Failed update status profile image, Try again.", event.threadID)
              }
              break
            case "setbg":
              path = `./database/user/header/${senderID}.png`
              const bgdownloaded = await download(url, path)
              if (bgdownloaded){
                delEvent(senderID, "setbg")
                updateHeader(senderID, path)
                api.sendMessage("Your status profile header successfully changed.", event.threadID)
              }else{
                delEvent(senderID, "setbg")
                api.sendMessage("Failed update status profile header, Try again.", event.threadID)
              }
              break
            case "wfi":
              path = `./assets/images/wfi_sys_${Date.now()}.png`
              const wfdownloaded = await download(url, path)
              if (wfdownloaded){
                delEvent(senderID, "wfi")
                const res = await deepboru(path)
                const data = res.data[0].confidences.map(v => v.label)
                api.sendMessage(`Waifu interrogate\nTag:\n${data.join(", ").replaceAll("_", " ")}`, event.threadID)
                fs.unlinkSync(path)
              }else{
                delEvent(senderID, "wfi")
                api.sendMessage("Failed update status profile header, Try again.", event.threadID)
              }
              break
          }
        }
        
        if (isRegis && event.body.toLowerCase().startsWith("miru")) {
          let text = event.body.trim().split(/ +/).slice(1).join(" ")
          let manager = new NlpManager()
          manager.load()
          let res = await manager.process(text||"hi")
          if (!res.answer){
            return api.sendMessage("Aaa, Miru didn't understand (╯•﹏•╰)", event.threadID)
          }
          return api.sendMessage(res.answer, event.threadID)
        }

        
        else if (prefix.includes(event.body[0]) && isGroup){
          await processCommand(api, event, senderID).catch(async e =>{
            console.log(e)
            api.sendMessage(`0x0f1: Application error\n0x0f2: ${e}`, event.threadID)
          })
        }else if (shiritori.isGame && event.isGroup == false){
          if (shiritori.request >= 1){
            if (chat.startsWith(shiritori.word) && en.includes(chat) ){
              const word = en[Math.floor(Math.random() * en.length - 1)]
              updateShiri(senderID, {word: word[0]})
              return api.sendMessage(`Point: ${shiritori.cout +1} EN\nNext word: ${word}`, event.threadID)
            }else{
              updateReqShiri(senderID)
              return api.sendMessage(`The word you pick is not exists. Try another word.\n- Attempt: ${shiritori.request}/3`, event.threadID)
            }
          }else{
            addExp(senderID, 20*shiritori.cout / 2)
            updateUserMoney(senderID, 0.2 * shiritori.cout)
            api.sendMessage(`𝗦𝗵𝗶𝗿𝗶𝘁𝗼𝗿𝗶 ends. You've got ${shiritori.cout} points and ${(0.2 * shiritori.cout).toFixed(2)}¥ Yen and ${20*shiritori.cout/2} experience points.`, senderID)
            
            
            api.sendMessage(`${name} English Shiritori's ended and got ${shiritori.cout} points with ${(0.2 * shiritori.cout).toFixed(2)}¥ Yen and ${20*shiritori.cout/2} experience points.`, shiritori.room)
            return restartShiri(senderID)
          }
        }else{
          const random = Math.floor(Math.random() * (50 - 0.32) + 0.32)
          addExp(senderID, random)
          addChatCount(senderID)
        }
        break
      
      // Recived a event like someone joined to group
      case "event":
        console.log(event)
        switch(event.logMessageType){
          
          // Someone join to the group
          case "log:subscribe":
            api.sendMessage("Welcome to our grpup", event.threadID)
            break
          
          // Someone leave to group
          case "log:unsubscribe":
            api.sendMessage(`${event.logMessageBody}\nBeristirahatlah dalam damai.`, event.threadID)
            break
        }
        break
   }
  })
})