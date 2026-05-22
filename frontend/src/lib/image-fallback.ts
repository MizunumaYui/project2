export function placeholderDataUrl(text: string, width = 400, height = 400) {
  const safeText = encodeURIComponent(text || 'No Image');
  return `https://placehold.co/${width}x${height}/f3f4f6/374151?text=${safeText}`;
}
