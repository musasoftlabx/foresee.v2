export default function hexToRGB(hex: string) {
  return [
    (<any>`0x${hex[1]}${hex[2]}`) | 0,
    (<any>`0x${hex[3]}${hex[4]}`) | 0,
    (<any>`0x${hex[5]}${hex[6]}`) | 0,
  ];
}
