import Canvas from 'canvas';
import fs from "fs"

export async function createCard(user, money, chat, gacha, level, exp) {
  
  const config = JSON.parse(fs.readFileSync("./database/user/flags/config.json"))
  const flag = config.find(data => data.name === user.flag)
  
  
  let PATH_AVATAR = user.av
  let PATH_HEADER = user.bg
  let PATH_FLAGS = flag.img
  
  Canvas.registerFont("./assets/fonts/keifont.ttf", {family: 'keifont'})
  const canvas = Canvas.createCanvas(1280, 988);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#36393f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const template = await Canvas.loadImage("./assets/images/template.png");
  const bg = await Canvas.loadImage(PATH_HEADER);
  const flags = await Canvas.loadImage(PATH_FLAGS);
  ctx.drawImage(bg, 0, 0, 1280, 560);
  ctx.drawImage(template, 0, 0, 1280, 988);
  ctx.filter = 'none';
  
  // Draw user name with glow effect
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 50px keifont';
  ctx.drawImage(flags, 400, 420, 32, 32);
  ctx.fillText(user.name, 400, 500);
  
  // Draw level text with border
  ctx.fillStyle = 'white';
  ctx.font = 'bold 36px keifont';
  ctx.fillText(`Level ${level}`, 530, 660);
  
  ctx.globalAlpha = 0.6;
  const idText = `#${user.id}`;
  const idTextWidth = ctx.measureText(idText).width;
  ctx.fillText(idText, 1200 - idTextWidth/2, 500);
  ctx.globalAlpha = 1;
  
  // Draw exp text
  ctx.fillStyle = 'white';
  ctx.font = '15px keifont';
  ctx.fillText(`${user.exp} Experience`, 530, 730);
  
  // Draw yen text
  ctx.fillStyle = 'white';
  ctx.font = '30px keifont';
  const yenText = `${money} ¥`;
  const yenTextWidth = ctx.measureText(yenText).width;
  ctx.fillText(yenText, 530 - yenTextWidth/2, 820);
  
  const chatText = `${chat}`;
  const chatTextWidth = ctx.measureText(chatText).width;
  ctx.fillText(chatText, 800 - chatTextWidth/2, 820);
  
  const gachaText = `${gacha}`;
  const gachaTextWidth = ctx.measureText(gachaText).width;
  ctx.fillText(gachaText, 1070 - gachaTextWidth/2, 820);

  ctx.globalAlpha = 0.4;
  ctx.font = '15px keifont';
  ctx.fillText("Rexuint APP", 600, 970);
  ctx.globalAlpha = 1;
  
  // Draw sliderbar exp with gradient color
  const sliderbarWidth = 680, sliderbarHeight = 15;
  const sliderbarX = 530, sliderbarY = 690;
  const gradient = ctx.createLinearGradient(sliderbarX, sliderbarY, sliderbarX + sliderbarWidth, sliderbarY);
  gradient.addColorStop(0, '#2980b9'); // warna biru ke tua
  gradient.addColorStop(1, '#3fea95'); // warna biru muda
  ctx.fillStyle = '#2f302f';
  ctx.fillRect(sliderbarX, sliderbarY, sliderbarWidth, sliderbarHeight);
  ctx.fillStyle = gradient;
  ctx.fillRect(sliderbarX, sliderbarY, sliderbarWidth * (exp / 100), sliderbarHeight);

  
  // Draw avatar with border
  
  const avatarSize = 300;
  const avatarX = 50, avatarY = 350;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.clip();
  const avatar = await Canvas.loadImage(PATH_AVATAR);
  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 10;
  ctx.stroke();
  
  return canvas;
};