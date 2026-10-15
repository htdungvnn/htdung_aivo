import { AuthProvider } from "@/components/auth";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Script to prevent theme flash on load
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('aivo_theme_preference') || 'system';
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
        document.documentElement.setAttribute('data-theme', resolved);
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#087A55" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
