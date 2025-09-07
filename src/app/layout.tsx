import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export const metadata: Metadata = {
  title: 'BizHome',
  description: 'Welcome to BizHome, your partner in success.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;700&family=IBM+Plex+Sans:wght@400;700&family=Inter:wght@400;700&family=Poppins:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ProgressBar
          height="4px"
          color="#FFD139"
          options={{ showSpinner: false }}
          shallowRouting
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
