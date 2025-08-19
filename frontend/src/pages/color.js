import { colornames } from "color-name-list";

const COLOR_MAP = new Map(
  colornames.map(({ name, hex }) => [name.toLowerCase(), hex])
);

export function nameToHex(name) {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  const exact = COLOR_MAP.get(key);
  if (exact) return exact;

  const partial = colornames.find((c) =>
    c.name.toLowerCase().includes(key)
  );
  return partial ? partial.hex : null;
}
