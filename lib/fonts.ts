import { Libre_Caslon_Text, Work_Sans } from 'next/font/google';

// Matches the brand typography specified in the design mockups:
//   Libre Caslon Text -> headlines & display type (editorial serif)
//   Work Sans         -> body copy & labels (clean sans)
export const libreCaslonText = Libre_Caslon_Text({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-caslon-text',
  display: 'swap',
});

export const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const allFontVariables = [libreCaslonText.variable, workSans.variable].join(' ');
