// Muted emerald, warm ivory, and champagne accents.
const emeraldPalette = {
  50: '#f3f6f2', 100: '#e4ece5', 200: '#cbdccf',
  300: '#a5c1b0', 400: '#739c87', 500: '#376f59',
  600: '#245740', 700: '#1b4635', 800: '#173b2e',
  900: '#123025', 950: '#0b211a'
};
tailwind.config = {
  theme: {
    extend: {
      colors: {
        green: emeraldPalette,
        emerald: emeraldPalette,
        champagne: {
          50: '#faf7ef', 100: '#f2ead7', 200: '#e4d4af',
          300: '#d2bb88', 400: '#b99c60', 500: '#a18449',
          600: '#846b38', 700: '#69542f', 800: '#514229',
          900: '#403523', 950: '#282117'
        }
      }
    }
  }
};
