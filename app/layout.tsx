import type {Metadata} from 'next';
import { Caveat, Patrick_Hand, Quicksand } from 'next/font/google';
import './globals.css'; // Global styles

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick-hand',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'My Comfort Corner — Scrapbook',
  description: 'A cozy, intimate space made to make you smile after a long and difficult day.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Comfort Corner',
  },
  icons: {
    apple: '/images/pwa_icon.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html 
      lang="en" 
      className={`${caveat.variable} ${patrickHand.variable} ${quicksand.variable}`}
    >
      <body suppressHydrationWarning className="bg-[#FCF8F2] text-stone-800 selection:bg-[#7D1201]/10 selection:text-[#7D1201]">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('Comfort SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.warn('Comfort SW registration skipped:', err);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}

