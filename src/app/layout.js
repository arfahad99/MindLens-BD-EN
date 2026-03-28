import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-bengali",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "ব্যক্তিত্ব পরীক্ষা | Personality Test — 16 Personalities",
  description:
    "Discover your personality type with our MBTI-inspired bilingual test. Available in Bangla and English. আপনার ব্যক্তিত্বের ধরন আবিষ্কার করুন।",
  keywords: "MBTI, personality test, 16 personalities, Bangla, Bengali, ব্যক্তিত্ব পরীক্ষা",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoBengali.variable}`}>
      <body
        style={{
          fontFamily: `var(--font-inter), var(--font-noto-bengali), sans-serif`,
        }}
      >
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
