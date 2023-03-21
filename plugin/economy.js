import fs from 'fs';

const DB_PATH = "./database/user.json";
const GF_PATH = "./database/gacha/gfl.json"

function readData() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data));
}


export function createUser(id) {
  const db = readData();
  const idVirtual = db.length + 1;
  const dateNow = new Date()
  const user = {
    id,
    idVirtual,
    pp: "./assets/images/default.png",
    bg: "./assets/images/background_default.jpg",
    flag: "us",
    money: 10,
    level: 1,
    exp: 0,
    name: "Username",
    chat: 0,
    gacha: 0,
    redeem: [],
    cooldown: [],
    backpack: [],
    daily: {
      status: false,
      date: dateNow
    },
    shiritori: {
      gamemode: "",
      cout: 0,
      isGame: false,
      request: 3,
      word: "",
      room: ""
    },
    event: {
      event: []
    }
  };
  db.push(user);
  writeData(db);
}


export function updateUserMoney(id, moneyToAdd) {
  const db = readData();
  const user = db.find(user => user.id === id);
  if (user) {
    user.money += moneyToAdd;
    writeData(db);
  } else {
    createUser(id);
    updateUserMoney(id, moneyToAdd);
  }
}

export function updateUser(id, updatedUser) {
  const db = readData();
  const userIndex = db.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    db[userIndex] = updatedUser;
    writeData(db);
  }
}

export function addEvent(id, event){
  const user = getUser(id)
  user.event.event.push(event)
  updateUser(id, user)
}

export function updateAvatar(id, path){
  const user = getUser(id)
  user.pp = path
  updateUser(id, user)
}

export function updateHeader(id, path){
  const user = getUser(id)
  user.bg = path
  updateUser(id, user)
}

export function delEvent(id, event){
  let user = getUser(id);
  user.event.event = user.event.event.filter(data => data !== event)
  updateUser(id, user)
}

export function resetEvent(id){
  let user = getUser(id);
  user.event.event = []
  updateUser(id, user)
}

export function getEvent(id){
  const user = getUser(id)
  return user.event.event
}

export function checkEvent(id){
  let user = getUser(id);
  user = user.event.event.length >= 1
  return user
}

export function checkUserEvent(id){
  let user = getUser(id);
  user = user.event.event[0]
  return user
}

export function addChatCount(id){
  let user = getUser(id);
  user.chat += 1
  updateUser(id, user)
}

export function addGachaCount(id){
  let user = getUser(id);
  user.gacha += 1
  updateUser(id, user)
}

export function addSesionShiri(id, data){
  let user = getUser(id);
  user.shiritori.word = data.word
  user.shiritori.isGame = data.isGame
  user.shiritori.room = data.room
  updateUser(id, user)
}

export function updateShiri(id, data){
  let user = getUser(id);
  user.shiritori.cout += 1;
  user.shiritori.word = data.word
  updateUser(id, user)
}

export function updateReqShiri(id){
  let user = getUser(id);
  user.shiritori.request -= 1;
  updateUser(id, user)
}

export function restartShiri(id){
  let user = getUser(id);
  user.shiritori.word = ""
  user.shiritori.isGame = false
  user.shiritori.room = ""
  user.shiritori.request = 3
  user.shiritori.cout = 0
  updateUser(id, user)
}

export function payUser(id, usr, money) {
  if (money <= 0) return `Cannot sending money under 1 ¥`
  const db = readData();
  const userdb = db.find(user => user.idVirtual === id);
  if (!userdb) {
    return `User ID ${id} tidak ditemukan!`
  }
  const pajak = money * 0.2;
  addExp(usr, 50)
  userdb.money += money - pajak
  writeData(db)
  return `Transfer uang senilai ${money - pajak} ¥ ke ID ${id} berhasil! (20% tax).`
}

export function getUser(id) {
  const db = readData();
  let user = db.find(user => user.id === id);
  if (!user) {
    createUser(id);
    user = getUser(id);
  }
  calculateLevel(user)
  return user;
}

export function getUserByID(id) {
  const db = readData();
  let user = db.find(user => user.idVirtual === Number(id));
  if (!user) {
    return undefined
  }
  return user;
}

export function calculateLevel(user) {
  const expNeeded = Math.floor(100 * Math.pow(user.level, 1.2));
  if (user.exp >= expNeeded) {
    const levelsGained = Math.floor(user.exp / expNeeded);
    user.level += levelsGained;
    user.exp -= levelsGained * expNeeded;
    updateUser(user.id, user);
  }
}

export function refreshLevelCalculate() {
  const db = readData();
  db.forEach(user => calculateLevel(user));
}

export function getTopUsers() {
  const db = readData();
  const sortedUsers = db.sort((a, b) => b.level - a.level);
  return sortedUsers.slice(0, 3);
}

export function getTopUsersByMoney() {
  const db = readData();
  const sortedUsers = db.sort((a, b) => b.money - a.money);
  return sortedUsers.slice(0, 3);
}

export function claimDailyReward(id) {
  const db = readData();
  const user = db.find(user => user.id === id);
  const dateNow = new Date();
  
  if (!user) {
    return createUser(id), claimDailyReward(id)
  }

  if (user.daily.status === true && isToday(user.daily.date)) {
    return "Kamu sudah mengklaim reward harian hari ini kembali lagi esok!";
  }

  user.money += 2;
  user.exp += 1000;
  user.daily = { status: true, date: dateNow };
  updateUser(id, user);
  
  return "Sukses klaim daily harian\nYen++ 2¥\nExp++ 1000 experience";
}

function isToday(date) {
  const today = new Date();
  const last = new Date(date)
  return (
    last.getDate() === today.getDate() &&
    last.getMonth() === today.getMonth() &&
    last.getFullYear() === today.getFullYear()
  );
}


export function updateUserUsername(id, newUsername) {
  const db = readData();
  const user = db.find(user => user.id === id);
  if (user) {
    user.name = newUsername;
    writeData(db);
  } else {
    createUser(id);
    updateUserUsername(id, newUsername);
  }
}

export function reduceUserMoney(id, moneyToReduce) {
  const db = readData();
  const user = db.find(user => user.id === id);
  if (user) {
    if (user.money >= moneyToReduce) {
      user.money -= moneyToReduce;
      writeData(db);
      return true;
    } else {
      return false;
    }
  } else {
    createUser(id);
    return reduceUserMoney(id, moneyToReduce);
  }
}

export function getUserBackpackGfl(id) {
  const db = readData();
  const user = db.find(user => user.id === id);
  if (user) {
    const gflItems = user.backpack.filter(item => item.item_name === 'gfl');
    return gflItems;
  } else {
    createUser(id);
    return getUserBackpack(id);
  }
}



export function addExp(id, expToAdd) {
  const db = readData();
  const user = db.find(user => user.id === id);
  if (user) {
    user.exp += expToAdd;
    calculateLevel(user);
    updateUser(user.id, user);
  } else {
    createUser(id);
    addExp(id, expToAdd);
  }
}

export function gachaGirlFrontline(id, isOwner) {
  const db = readData();
  const user = db.find((user) => user.id === id);
  const prizePool = JSON.parse(fs.readFileSync(GF_PATH));
  if (user) {
    const random = Math.random() * 100;
    let selectedItem = null;
    if (random <= 10) {
      // 1% chance to get legendary item
      const rareItems = prizePool.filter((item) => item.rarity === 4);
      selectedItem = rareItems[Math.floor(Math.random() * rareItems.length)];
    } else if (random <= 30) {
      // 9% chance to get epic item
      const epicItems = prizePool.filter((item) => item.rarity === 3);
      selectedItem = epicItems[Math.floor(Math.random() * epicItems.length)];
    } else if (random <= 40) {
      // 10% chance to get rare item
      const rareItems = prizePool.filter((item) => item.rarity === 2);
      selectedItem = rareItems[Math.floor(Math.random() * rareItems.length)];
    } else {
      // 80% chance to get common item
      const commonItems = prizePool.filter((item) => item.rarity === 1);
      selectedItem = commonItems[Math.floor(Math.random() * commonItems.length)];
    }
    if (isOwner){
      const items = prizePool.filter((item) => item.rarity === 4);
      selectedItem = items[Math.floor(Math.random() * items.length)];
      user.backpack.push(selectedItem);
      writeData(db);
      return selectedItem
    }
    user.backpack.push(selectedItem);
    writeData(db);
    return selectedItem
  } else {
    createUser(id);
    return gachaGirlFrontline(id);
  }
}

export function sellGirlFrontline(id, itemId) {
  const db = readData();
  const user = db.find(user => user.id === id);
  if (user) {
    const itemIndex = user.backpack.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      const item = user.backpack[itemIndex];
      const itemValue = item.price || 0; // tambahkan nilai item jika item memiliki nilai
      user.money += itemValue; // tambahkan uang ke user sesuai dengan nilai item
      user.backpack.splice(itemIndex, 1); // hapus item dari backpack user
      writeData(db);
      return `You have successfully sold ${item.name} for ${itemValue} ¥!`;
    } else {
      return `Item with ID ${itemId} is not found in your backpack.`;
    }
  } else {
    createUser(id);
    return sellGirlFrontline(id, itemId);
  }
}