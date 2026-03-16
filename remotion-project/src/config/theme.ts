import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: displayFont } = loadPoppins();
const bodyFont = displayFont; // Use Poppins for both — Apple-style consistency

export const theme = {
  colors: {
    bg: '#F7F6F3',
    surface: '#FFFFFF',
    text: '#111110',
    textMuted: '#6B6963',
    accent: '#6366F1',
    accentLight: '#EEF2FF',
    success: '#16A34A',
    successLight: '#F0FDF4',
    danger: '#DC2626',
    dangerLight: '#FEF2F2',
    border: '#E4E2DC',
  },
  font: {
    display: displayFont,
    body: bodyFont,
    sizes: { xs: 14, sm: 18, md: 24, lg: 36, xl: 56, xxl: 84 },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 900 },
  },
  radii: { sm: 8, md: 14, lg: 22, full: 9999 },
  shadow: '0 4px 32px rgba(0,0,0,0.07)',
  shadowLg: '0 16px 64px rgba(0,0,0,0.12)',
  spacing: 8,
} as const;
