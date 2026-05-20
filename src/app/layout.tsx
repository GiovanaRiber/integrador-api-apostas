import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FightBet Hub',
  description: 'Integrador de APIs para Apostadores, Lutadores e Lutas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
