export async function compressToDataUrl(
  file: File,
  options: { maxDimension?: number; quality?: number; maxBytes?: number } = {},
): Promise<string> {
  const { maxDimension = 1200, quality = 0.72, maxBytes = 850_000 } = options;

  if (file.type === "application/pdf") {
    if (file.size > maxBytes) {
      throw new Error("PDF is too large. Please upload a file under 800 KB or send it on WhatsApp.");
    }
    return readAsDataUrl(file);
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a JPG, PNG or PDF file.");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read this image."));
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not process this image.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let result = canvas.toDataURL("image/jpeg", quality);
  let attempts = 0;
  while (result.length > maxBytes * 1.35 && attempts < 3) {
    attempts += 1;
    result = canvas.toDataURL("image/jpeg", Math.max(0.4, quality - attempts * 0.12));
  }

  if (result.length > maxBytes * 1.4) {
    throw new Error("This image is too large even after compression. Please use a smaller photo or send it on WhatsApp.");
  }

  return result;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}
