import { Space_Grotesk, DM_Sans } from "next/font/google";

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