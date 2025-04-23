import { Charm } from "../types/charmsTypes";

import { createCanvas, loadImage } from "canvas";
import { AttachmentBuilder } from "discord.js";

const BG_COLOUR = "#252428";
const PAD = 10;

export async function generateLoadoutImage(charms: Charm[]) {
  const loadedImages = await Promise.all(charms.map((charm) => loadImage(charm.imageUrl)));

  const maxHeight = Math.max(...loadedImages.map((img) => img.height));

  const totalWidth = loadedImages.reduce(
    (sum, img, i) => sum + img.width + (i < loadedImages.length - 1 ? PAD : 0),
    PAD * 2
  );

  const canvas = createCanvas(totalWidth, maxHeight + PAD * 2);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each charm image
  let currentX = PAD;
  loadedImages.forEach((img) => {
    const { width, height } = img;
    const y = PAD + (maxHeight - height) / 2;
    ctx.drawImage(img, currentX, y, width, height);

    currentX += width + PAD;
  });

  const buffer = canvas.toBuffer("image/png");

  return new AttachmentBuilder(buffer, { name: "charm-loadout.png" });
}
