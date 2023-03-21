import {readdirSync as readdir} from 'fs'
import fs from "fs"
import { getUser, updateUser } from "../plugin/economy.js"


// Listing all commands
const commands = readdir('./commands', {withFileTypes:true}).map(item=>{
  if (item.isDirectory()) {
    const group = {group:item.name, items:[]}
    readdir('./commands/'+item.name, {withFileTypes:true}).forEach(subitem=>{
      if (subitem.isDirectory()) return
      if (subitem.name.startsWith('*')) return
      if (!subitem.name.endsWith('.js')) return
      group.items.push(subitem.name.slice(0,-3))
    })
    return group
  } else {
    if (item.name.startsWith('*')) return
    if (item.name.endsWith('.js')) return item.name.slice(0,-3)
  }
}).filter(x=>x)


const settings = {}
export const setCommandsSettings = function (newSettings) {
  Object.assign(settings, newSettings)
}

export const getPrefixList = function () {
  return settings.prefix_list || []
}

export const getOwnerID = function () {
  return settings.owner_id || []
}

export const getBannedID = function () {
  return settings.banned_all || []
}


function getMenuText(p) {
  return [
    settings.menu_header,
    ...commands.map(item=>{
      if (typeof item === 'string') return fillFormat(settings.item_format, item, p)
      return [
        fillFormat(settings.group_format, item.group, p),
        ...item.items.map(i=>fillFormat(settings.item_format, i, p))
      ]
    }),
    settings.menu_footer,
  ].join('\n').replaceAll(/\n{3,}/g,'\n\n')
}


function fillFormat(str, name, prefix) {
  return str.replaceAll('(name)',name).replaceAll('(prefix)',prefix)
}


export default async function (bot, event, sender) {
  
  const owner = getOwnerID()
  const banned = getBannedID()
  const groupList = fs.readFileSync("./database/group.json")
  const isOwner = owner.includes(sender)
  const isBan = banned.includes(sender)
  const isRegis = groupList.includes(event.threadID)
  
  const text = event.body
  if (!text) return
  if (text.length <= 1) return
  
  const prefix = text[0]
  const {
    prefix_list, menu_command, command_not_found, show_typing, group_only_commands,
    group_only_message, admin_only_commands, admin_only_message, owner_only_commands, owner_only_message, banned_all, banned_oj, banned_message, banned_word
  } = settings
  if (!prefix_list.includes(prefix)) return

  const [_, c, p] = text.match(/.[ \n]*([\S]+)(?:[ \n]+([\S\s]+))?/) || []
  const commandName = c.toLowerCase()
  const parameters = p?.split(' ') || []
  const word = parameters.map(v => v.toLowerCase())
  
  if (show_typing) await bot.sendTypingIndicator(event.threadID)
  
  console.log(isRegis, isOwner)
  if (!isRegis && !isOwner) return
  
  if (menu_command.includes(commandName)) return bot.sendMessage(getMenuText(prefix), event.threadID)
  
  if (!commandExists(commandName)) {
    if (command_not_found) await bot.sendMessage(fillFormat(command_not_found, commandName, prefix), event.threadID)
    return
  }
  
  const user = getUser(sender)
  const getCooldown = user.cooldown.find(data => data.name === commandName)
  const now = Date.now()
  
  console.log(getCooldown)

  
  if (getCooldown){
    if(getCooldown.isCooldown && (now - getCooldown.time) < getCooldown.duration) {
      if (getCooldown.isCooldown && getCooldown.attempt > 1) return
      getCooldown.attempt += 1
      updateUser(sender, user)
      return bot.sendMessage("Slow down.. (>~< \")", event.threadID)
    }else{
      addCooldown(sender, Date.now(), commandName)
    } 
  }else{
    addCooldown(sender, Date.now(), commandName)
  }
  
  
  if (banned_word.includes(commandName) || word.map(v => banned_word.includes(v)).includes(true)){
    if (event.isGroup === true) {
      bot.removeUserFromGroup(event.senderID, event.threadID)
      return bot.sendMessage("Perintah kamu mengandung kata terlarang!", event.senderID)
    }
    return bot.sendMessage("Perintah kamu mengandung kata terlarang operasi dibatalkan!", event.threadID)
  }
   
  
  if (owner_only_commands.includes(commandName) && !isOwner) return bot.sendMessage(owner_only_message, event.threadID)
  
  if (commandName == "oj" && banned_oj.includes(sender) ) return bot.sendMessage(banned_message, event.threadID)
  
  if (isBan) return bot.sendMessage(banned_message, event.threadID)
  
  
  const {default: runScript} = await import (getCommandPath(commandName))
  return runScript({bot, prefix, event, parameters, sender, banned, isOwner, banned_word})
  
}

function commandExists(cmd) {
  return commands.some(item=>item===cmd||item.items?.includes(cmd))
}

function getCommandPath(cmd) {
  const cmdItem = commands.find(item=>item===cmd||item.items?.includes(cmd))
  const path = typeof cmdItem == 'string' 
    ? cmdItem + '.js' 
    : cmdItem.group + '/' + cmd + '.js'
  return '../commands/' + path
}

function addCooldown(sender, time, command){
  const times = time + 20000
  let user = getUser(sender)
  const getCooldown = user.cooldown.find(data => data.name === command)
  console.log(getCooldown)
  if (getCooldown){
    getCooldown.duration= 20000,
    getCooldown.time= time + 20000,
    getCooldown.isCooldown= true,
    getCooldown.attempt= 1
  }else{
    user.cooldown.push({
      name: command,
      duration: 20000,
      isCooldown: false,
      attempt: 1
    })
    updateUser(sender, user)
    return addCooldown(sender, time, command)
  }
  updateUser(sender, user)
}
