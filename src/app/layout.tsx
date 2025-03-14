// app/layout.tsx

import './globals.css';
import NavBar from './components/NavBar';
import HeadComponent from './components/HeadComponen';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadComponent title="Denso Dashboard" description="Manage and monitor your machines" />
      </head>
      <body className="flex">
        <div className="flex-1">
          <NavBar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
