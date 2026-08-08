const PALETTE = ["#d4af37", "#ec5a9c", "#8a8f98", "#b5762a", "#4a4f58"];

export function initialsAvatarDataUri(name: string): string {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const color = PALETTE[hash % PALETTE.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" rx="120" fill="${color}"/><text x="120" y="136" font-family="Georgia, 'Times New Roman', serif" font-size="86" font-weight="700" fill="#0a0a0a" text-anchor="middle">${initials}</text></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
