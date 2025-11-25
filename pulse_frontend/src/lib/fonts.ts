import { Space_Grotesk, DM_Sans, Playfair_Display, Arvo, Lato } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
    weight: ["400", "500", "700"], // Add desired font weights
    display: "swap",
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export const dmSans = DM_Sans({
    weight: ["400", "500", "700"], // Add desired font weights
    display: "swap",
    subsets: ["latin"],
    variable: "--font-dm-sans",
});

export const playfairDisplay = Playfair_Display({ subsets: ['latin'] });

export const arvo = Arvo({
    weight: ["400", "700"], // Add desired font weights
    display: "swap",
    subsets: ["latin"],
    variable: "--font-arvo",
});

export const lato = Lato({
    weight: ["300", "400", "700", "100", "900"], // Add desired font weights
    display: "swap",
    subsets: ["latin"],
    variable: "--font-lato",
});