/** Part definitions + camera anchors for Ferrari 458 showroom. */

export const PAINT_COLORS = [
  { id: 'rosso', label: 'Rosso Corsa', hex: '#c40000' },
  { id: 'giallo', label: 'Giallo Modena', hex: '#f0c400' },
  { id: 'nero', label: 'Nero Daytona', hex: '#1a1a1a' },
  { id: 'argento', label: 'Argento Nurburgring', hex: '#c5c8cc' },
  { id: 'blu', label: 'Blu Tour de France', hex: '#1c3a6e' },
  { id: 'verde', label: 'Verde British', hex: '#1f4d3a' },
  { id: 'bianco', label: 'Bianco Avus', hex: '#f2f0ea' },
  { id: 'arancio', label: 'Arancio Atlas', hex: '#e85a1c' },
];

export const DETAILS_COLORS = [
  { id: 'silver', label: 'Polished Silver', hex: '#d8d8d8' },
  { id: 'black', label: 'Piano Black', hex: '#111111' },
  { id: 'gold', label: 'Champagne', hex: '#c4a574' },
  { id: 'gun', label: 'Gunmetal', hex: '#5a5e66' },
];

export const CALIPER_COLORS = [
  { id: 'rosso', label: 'Rosso', hex: '#d10000' },
  { id: 'giallo', label: 'Giallo', hex: '#efc200' },
  { id: 'nero', label: 'Nero', hex: '#1a1a1a' },
  { id: 'blu', label: 'Blu', hex: '#1e4fd6' },
];

export const GLASS_COLORS = [
  { id: 'clear', label: 'Clear', hex: '#ffffff', transmission: 1 },
  { id: 'smoke', label: 'Smoke', hex: '#8899aa', transmission: 0.85 },
  { id: 'bronze', label: 'Bronze', hex: '#c4a070', transmission: 0.8 },
  { id: 'dark', label: 'Privacy', hex: '#334455', transmission: 0.55 },
];

export const LEATHER_COLORS = [
  { id: 'rosso', label: 'Rosso', hex: '#8b1a1a' },
  { id: 'nero', label: 'Nero', hex: '#1c1c1c' },
  { id: 'cuoio', label: 'Cuoio', hex: '#8a5a3a' },
  { id: 'crema', label: 'Crema', hex: '#d9c8a8' },
];

/**
 * Camera positions are world-space relative to a car centered at origin,
 * roughly 4.5m long Ferrari scale from the three.js example.
 */
export const VIEW_PRESETS = [
  {
    id: 'hero',
    label: 'Hero',
    position: [4.25, 1.4, -4.5],
    target: [0, 0.55, 0],
  },
  {
    id: 'front',
    label: 'Front',
    position: [0.15, 1.05, -5.2],
    target: [0, 0.55, -0.4],
  },
  {
    id: 'side',
    label: 'Profile',
    position: [6.2, 1.1, 0.2],
    target: [0, 0.55, 0],
  },
  {
    id: 'rear',
    label: 'Rear',
    position: [0.4, 1.2, 5.4],
    target: [0, 0.65, 0.6],
  },
  {
    id: 'top',
    label: 'Top',
    position: [0.2, 7.5, 0.1],
    target: [0, 0.2, 0],
  },
  {
    id: 'interior',
    label: 'Interior',
    position: [0.35, 1.15, 0.55],
    target: [0.05, 0.85, -0.35],
  },
];

export const PART_GROUPS = [
  {
    id: 'exterior',
    label: 'Exterior',
    items: [
      {
        id: 'body',
        en: 'Body shell',
        vi: 'Thân xe / sơn',
        meshes: ['body'],
        position: [3.6, 1.2, -3.2],
        target: [0, 0.55, 0],
      },
      {
        id: 'grille',
        en: 'Front grille',
        vi: 'Lưới tản nhiệt',
        meshes: ['grills'],
        position: [0.4, 0.75, -3.6],
        target: [0, 0.45, -1.7],
      },
      {
        id: 'glass',
        en: 'Canopy glass',
        vi: 'Kính cabin',
        meshes: ['glass'],
        position: [2.2, 1.6, -1.4],
        target: [0, 0.85, -0.2],
      },
      {
        id: 'carbon',
        en: 'Carbon fibre',
        vi: 'Carbon fibre',
        meshes: ['carbon fibre', 'carbon_fibre_trim'],
        position: [2.8, 0.7, 2.4],
        target: [0, 0.4, 1.4],
      },
      {
        id: 'chrome',
        en: 'Chrome trim',
        vi: 'Chi tiết chrome',
        meshes: ['chrome', 'trim'],
        position: [3.4, 1.0, -1.0],
        target: [0.4, 0.55, -0.2],
      },
    ],
  },
  {
    id: 'lighting',
    label: 'Lighting',
    items: [
      {
        id: 'headlamp',
        en: 'Headlamp assembly',
        vi: 'Cụm đèn pha',
        meshes: ['lights', 'leds'],
        position: [1.6, 0.85, -3.4],
        target: [0.55, 0.55, -1.85],
      },
      {
        id: 'drl',
        en: 'Daytime running LED',
        vi: 'Đèn LED ban ngày',
        meshes: ['leds'],
        position: [1.3, 0.7, -3.2],
        target: [0.65, 0.52, -1.75],
      },
      {
        id: 'taillight',
        en: 'Taillight cluster',
        vi: 'Cụm đèn hậu',
        meshes: ['lights_red'],
        position: [1.5, 0.95, 3.6],
        target: [0.45, 0.65, 1.85],
      },
    ],
  },
  {
    id: 'cabin',
    label: 'Cabin',
    items: [
      {
        id: 'steering',
        en: 'Steering wheel',
        vi: 'Vô lăng',
        meshes: ['steering_wheel', 'steering_leather', 'steering_carbon'],
        position: [0.55, 1.15, 0.85],
        target: [0.28, 0.9, -0.15],
      },
      {
        id: 'leather',
        en: 'Leather upholstery',
        vi: 'Bọc da ghế',
        meshes: ['leather'],
        position: [1.4, 1.25, 1.1],
        target: [0.15, 0.75, 0.15],
      },
      {
        id: 'dashboard',
        en: 'Instrument panel',
        vi: 'Táp lô',
        meshes: ['interior_dark', 'interior_light', 'plastic_gray'],
        position: [0.2, 1.2, 0.35],
        target: [0, 0.85, -0.55],
      },
      {
        id: 'carpet',
        en: 'Cabin carpet',
        vi: 'Thảm sàn cabin',
        meshes: ['carpet'],
        position: [1.1, 1.0, 0.9],
        target: [0.1, 0.35, 0.1],
      },
    ],
  },
  {
    id: 'wheels',
    label: 'Wheels & Chassis',
    items: [
      {
        id: 'alloy',
        en: 'Alloy wheel',
        vi: 'Mâm hợp kim',
        meshes: ['rim_fl', 'rim_fr', 'rim_rl', 'rim_rr'],
        position: [2.6, 0.55, -2.0],
        target: [0.85, 0.32, -1.25],
      },
      {
        id: 'caliper',
        en: 'Brake caliper',
        vi: 'Heo dầu phanh',
        meshes: ['brakes', 'brake'],
        position: [2.35, 0.5, -1.85],
        target: [0.85, 0.32, -1.25],
      },
      {
        id: 'tire',
        en: 'Tire sidewall',
        vi: 'Hông lốp',
        meshes: ['tire'],
        position: [2.8, 0.55, -1.5],
        target: [0.9, 0.32, -1.2],
      },
    ],
  },
];

export function findPart(partId) {
  for (const group of PART_GROUPS) {
    const item = group.items.find((p) => p.id === partId);
    if (item) return item;
  }
  return null;
}

export function findView(viewId) {
  return VIEW_PRESETS.find((v) => v.id === viewId) || VIEW_PRESETS[0];
}
