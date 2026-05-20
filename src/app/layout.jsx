import { Inter, Oswald } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export const metadata = {
  title: 'FightBet Hub | UFC Premium',
  description: 'Painel Integrador de Apostas, Lutadores e Lutas com estilo UFC Premium',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${oswald.variable}`}>{children}</body>
    </html>
  );
}
