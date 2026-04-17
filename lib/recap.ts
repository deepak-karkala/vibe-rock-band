import { getThemeById } from "@/lib/theme-data";
import type { Announcement } from "@/lib/contracts";

type RecapArgs = {
  themeId: string;
  direction: string;
  announcement: Announcement | null;
  stageImageDataUrl: string;
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

export async function exportRecapCard({
  themeId,
  direction,
  announcement,
  stageImageDataUrl,
}: RecapArgs) {
  const theme = getThemeById(themeId);
  const image = new Image();
  image.src = stageImageDataUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Stage capture could not be loaded."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Recap canvas unavailable.");
  }

  context.fillStyle = "#0b0a0a";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 0.95;
  context.drawImage(image, 40, 40, 620, 550);
  context.globalAlpha = 1;

  const gradient = context.createLinearGradient(720, 40, 1160, 590);
  gradient.addColorStop(0, "#171312");
  gradient.addColorStop(1, "#0b0a0a");
  context.fillStyle = gradient;
  context.fillRect(700, 40, 460, 550);

  context.strokeStyle = "rgba(203, 184, 157, 0.2)";
  context.strokeRect(700, 40, 460, 550);

  context.fillStyle = "#cbb89d";
  context.font = '600 14px "IBM Plex Mono"';
  context.fillText("VIBE ROCK BAND", 740, 84);

  context.fillStyle = "#f4e7d3";
  context.font = '700 58px "Fraunces"';
  context.fillText(theme.name, 740, 156);

  context.fillStyle = "rgba(244, 231, 211, 0.76)";
  context.font = '500 24px "Instrument Sans"';
  wrapText(context, theme.summary, 740, 204, 360, 34);

  context.fillStyle = "#a23621";
  context.font = '700 18px "Bricolage Grotesque"';
  context.fillText("YOUR DIRECTION", 740, 320);

  context.fillStyle = "#f4e7d3";
  context.font = '500 28px "Instrument Sans"';
  wrapText(context, direction, 740, 360, 360, 38);

  if (announcement) {
    context.fillStyle = "#cbb89d";
    context.font = '700 16px "Bricolage Grotesque"';
    context.fillText(`${announcement.character} replied`, 740, 486);

    context.fillStyle = "#f4e7d3";
    context.font = '700 30px "Fraunces"';
    wrapText(context, `“${announcement.text}”`, 740, 524, 360, 34);
  }

  const dataUrl = canvas.toDataURL("image/png");
  downloadDataUrl(
    dataUrl,
    `vibe-rock-band-${theme.id}-${Date.now().toString(36)}.png`,
  );
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = `${line}${word} `;
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      context.fillText(line.trim(), x, currentY);
      line = `${word} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    context.fillText(line.trim(), x, currentY);
  }
}
