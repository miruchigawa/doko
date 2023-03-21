import { createCanvas, loadImage } from "canvas";

export default async function ({name, version, memoryData, changelog}) {
  
  const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

  const memoryUsage = {
    rss: formatMemoryUsage(memoryData.rss),
    heapTotal: formatMemoryUsage(memoryData.heapTotal),
    heapUsed: formatMemoryUsage(memoryData.heapUsed),
    external: formatMemoryUsage(memoryData.external),
  };

  let result
  // Dimensions for the image
  const width = 1200;
  const height = 627;
  
  const date = new Date()
  
  const post = {
    head : "Information Project",
    name : `Name: ${name}`,
    version: `Version: ${version}`,
    author: "Author: Axuint",
    developer: "Developer: Rexuint Inc.",
    head1 : "Information Server",
    rss : `Rss: ${memoryUsage.rss}`,
    heapusg : `Heap Used: ${memoryUsage.heapUsed}`,
    external : `Memory External: ${memoryUsage.external}`,
    head2: "Changelog",
    changelog: changelog,
    copy: "Rexuint Inc."
  }
  
  // Instantiate the canvas object
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  
  
  await loadImage("./assets/background.jpg").then((image) => {
    context.drawImage(image, 0, 0, width, height)
    
    context.strokeStyle = "rgba(50, 50, 50, 1)";
    context.fillStyle = "rgba(50, 50, 50, 0.8)";
    context.beginPath();
    context.roundRect(50, 50, 540, 310, 20);
    context.stroke();
    context.fill()
    
    context.font = "bold 30pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#fff";
    
    context.fillText(post.head, 70, 100);
    
    context.font = "bold 20pt 'PT Sans'";
    
    context.fillText(post.name, 70, 180);
    context.fillText(post.version, 70, 230);
    context.fillText(post.author, 70, 280);
    context.fillText(post.developer, 70, 330);
    
    context.strokeStyle = "rgba(50, 50, 50, 1)";
    context.fillStyle = "rgba(50, 50, 50, 0.8)";
    context.beginPath();
    context.roundRect(620, 50, 510, 310, 20);
    context.stroke();
    context.fill()
    
    context.font = "bold 30pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#fff";
    
    context.fillText(post.head1, 650, 100);
    
    context.font = "bold 20pt 'PT Sans'";
    
    context.fillText(post.rss, 650, 180);
    context.fillText(post.heapusg, 650, 230);
    context.fillText(post.external, 650, 280);
    
    context.strokeStyle = "rgba(50, 50, 50, 1)";
    context.fillStyle = "rgba(50, 50, 50, 0.8)";
    context.beginPath();
    context.roundRect(50, 400, 1090, 200, 20);
    context.stroke();
    context.fill()
    
    context.font = "bold 30pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#fff";
    
    context.fillText(post.head2, 70, 450);
    
    context.font = "bold 20pt 'PT Sans'";
    
    context.fillText(post.changelog, 70, 500);
    
    context.font = "bold 10pt 'PT Sans'";
    context.textAlign = "center";
    
    context.fillText(post.copy, 600, 620);
    
    const buffer = canvas.toBuffer("image/png");
    result = buffer
  })
  return result
}