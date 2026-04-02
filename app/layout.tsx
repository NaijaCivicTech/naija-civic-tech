import { CivicModals } from "@/components/civic/CivicModals";
import { CivicSessionProvider } from "@/components/civic/CivicSessionProvider";
import { QueryProvider } from "@/components/civic/QueryProvider";
import { SiteHeader } from "@/components/civic/SiteHeader";
import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "NaijaCivicTech | Build for Nigeria",
  description:
    "A community directory of open-source tools and prototypes built by Nigerian developers to solve Nigerian problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${syne.variable} ${dmSans.variable}`}>
      <body className='min-h-dvh antialiased'>
        <QueryProvider>
          <CivicSessionProvider>
            <div className='flex min-h-dvh flex-col'>
              <SiteHeader />
              <main className='relative z-10 flex min-h-0 flex-1 flex-col'>
                {children}
              </main>
              <CivicModals />
            </div>
          </CivicSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
