import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';

export default async function(path, user, data) {
  const width = 1080; // Lebar canvas
  const height = 610; // Tinggi canvas
  
  
  registerFont("./assets/fonts/keifont.ttf", { family: 'keifont' });
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height + 10);
  gradient.addColorStop(0, '#101010');
  gradient.addColorStop(1, '#1d1d1d');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  
  context.fillStyle = '#fff';
  context.font = `30px keifont`;
  context.fillText(`Inventory Of ${user}'s`,40, 70);
  
  
  const cardWidth = 150; // Lebar kartu
  const cardHeight = 200; // Tinggi kartu
  
  const cardsPerRow = 6; // Jumlah kartu per baris
  const topRowY = 130; // Y posisi untuk baris atas
  const bottomRowY = 350; // Y posisi untuk baris bawah
  
  // Daftar kartu yang dimiliki pengguna
  
  // Hitung jumlah kartu yang akan ditampilkan
  const numberOfCards = Math.min(data.length, 12);
  
  // Loop melalui kartu yang akan ditampilkan
  for (let i = 0; i < numberOfCards; i++) {
    const row = Math.floor(i / cardsPerRow); // Hitung baris kartu
    const col = i % cardsPerRow; // Hitung kolom kartu
    
    // Tentukan posisi x dan y untuk kartu
    const x = col * (cardWidth + 20) + 40; // Tambahkan jarak 20 px ke posisi x
    const y = row < 1 ? topRowY : bottomRowY;
    
    // Tentukan warna latar belakang untuk kartu
    const card = data[i];
    let cardColor = '#9a9a9a';
    switch (card.rarity) {
      case 1:
        cardColor = '#9a9a9a';
        break;
      case 2:
        cardColor = '#44af0c';
        break;
      case 3:
        cardColor = '#2020d2';
        break;
      case 4:
        cardColor = '#ef720a';
        break;
      default:
        break;
    }
    context.fillStyle = cardColor;
    
    const image = await loadImage(card.img);
    
    
    // Gambar kartu ke canvas
    context.fillRect(x, y, cardWidth, cardHeight);
    context.drawImage(image, x + 20, y, cardWidth -50, cardHeight);
    // Tambahkan nama kartu di atas kartu
    context.fillStyle = '#fff';
    context.font = '12px keifont';
    context.fillText(`#${card.id}`, x + 10, y + 20);
  }
  
  
  // Simpan canvas ke file gambar JPEG
  fs.writeFileSync(path, canvas.toBuffer('image/jpeg'));
}