interface CompressOptions {
  maxWidth?: number;
  quality?: number;
}

export async function compressImage(
  file: File,
  { maxWidth = 1000, quality = 0.8 }: CompressOptions = {}
): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  const imageBitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxWidth / imageBitmap.width);
  const targetWidth = Math.round(imageBitmap.width * scale);
  const targetHeight = Math.round(imageBitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return file;
  }
  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  const blob: Blob | null = await new Promise(resolve =>
    canvas.toBlob(resolve, 'image/webp', quality)
  );

  if (!blob) {
    return file;
  }

  const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], newName, { type: 'image/webp' });
}

export async function compressImages(
  files: File[],
  options?: CompressOptions
): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file, options)));
}