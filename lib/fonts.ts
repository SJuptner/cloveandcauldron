import localFont from 'next/font/local';

// Your six fonts, loaded locally via next/font for optimal performance.
// Role assignments (see chat for reasoning -- happy to remap any of these):
//   Blacksword        -> large display headlines (hero, section titles)
//   Plain Black Wide  -> body copy and paragraph text (the plainest/most legible of the six)
//   Jim Nightshade    -> nav links and small uppercase labels (short strings, tolerates character)
//   Perrygot, Homemade Apple, Butterfly Kids -> reserved as utility classes for
//     decorative moments (pull quotes, handwritten captions, playful accents)
export const blacksword = localFont({
  src: '../public/fonts/Blacksword.otf',
  variable: '--font-blacksword',
  display: 'swap',
});

export const plainBlackWide = localFont({
  src: '../public/fonts/Plain_Black_Wide.ttf',
  variable: '--font-plain-black-wide',
  display: 'swap',
});

export const jimNightshade = localFont({
  src: '../public/fonts/JimNightshade-Regular.ttf',
  variable: '--font-jim-nightshade',
  display: 'swap',
});

export const perrygot = localFont({
  src: '../public/fonts/Perrygot.ttf',
  variable: '--font-perrygot',
  display: 'swap',
});

export const homemadeApple = localFont({
  src: '../public/fonts/HomemadeApple-Regular.ttf',
  variable: '--font-homemade-apple',
  display: 'swap',
});

export const butterflyKids = localFont({
  src: '../public/fonts/ButterflyKids-Regular.ttf',
  variable: '--font-butterfly-kids',
  display: 'swap',
});

export const allFontVariables = [
  blacksword.variable,
  plainBlackWide.variable,
  jimNightshade.variable,
  perrygot.variable,
  homemadeApple.variable,
  butterflyKids.variable,
].join(' ');
