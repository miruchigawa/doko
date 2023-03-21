import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';


export async function canvas(item, user, path){
  // Register the font
  registerFont("./assets/fonts/keifont.ttf", { family: 'keifont' });
  
  // Load the images
  const image = await loadImage(item.img);
  const template = await loadImage('./assets/images/gfl/template.png');
  
  // Define the desired canvas dimensions
  const canvasWidth = 1075;
  const canvasHeight = 1280;
  
  // Create a canvas with the desired dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight);
  
  // Resize the image and draw it onto the canvas
  const resizedImage = resize(image, canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#F1F1F1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 400, 0, resizedImage.width, resizedImage.height);
  ctx.drawImage(template, 0, 0, canvasWidth, canvasHeight);
  
  // Draw a smaller version of the image with transparency
  const smallImageWidth = 300;
  const smallImageHeight = 500;
  const smallImageResized = resize(image, smallImageWidth, smallImageHeight);
  ctx.globalAlpha = 0.5;
  ctx.drawImage(image, 80, 190, smallImageResized.width, smallImageResized.height);
  ctx.globalAlpha = 1;
  
  // Draw text on the canvas
  ctx.fillStyle = 'white';
  ctx.font = `30px keifont`;
  ctx.textAlign = 'center';
  
  const itm = `${item.name}`;
  const id_item = `#${item.id}`;
  const rate = `Rate: ${item.rate}`;
  const text = `Owned by`;
  const playerID = `#${user.id}`;
  
  const itemTextWidth = ctx.measureText(itm).width;
  const id_itemTextWidth = ctx.measureText(id_item).width;
  const rateTextWidth = ctx.measureText(rate).width;
  const textTextWidth = ctx.measureText(text).width;
  const playerIDTextWidth = ctx.measureText(playerID).width;
  
  ctx.fillText(itm, 279 - itemTextWidth / 2, 800);
  ctx.fillText(id_item, 230 - id_itemTextWidth / 2, 890);
  ctx.fillText(rate, 270 - rateTextWidth / 2, 970);
  ctx.fillText(text, 290 - textTextWidth / 2, 1060);
  ctx.fillText(playerID, 230 - playerIDTextWidth / 2, 1100);
  
  // Convert the canvas to a buffer and write it to a file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path, buffer);
}

function resize(image, width, height){
  const aspectRatio = image.width / image.height;
  if (width / aspectRatio > height) {
    width = height * aspectRatio;
  } else {
    height = width / aspectRatio;
  }
  return {width, height}
}