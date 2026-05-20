import './globals.css';

export const metadata = {
  title: 'FightBet Hub',
  description: 'Integrador de APIs para Apostadores, Lutadores e Lutas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
