
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/custom.scss';

import LayoutCmp from "@/components/layouts/LayoutCmp";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Eureka: lee, mira y debate sobre libros, películas y documentales en línea',
  description: 'Descubre, experimente y debate sobre libros, películas y documentales sobre temas que le interesen. ¡Únase a Eureka para formar parte de la comunidad de libros más grande del mundo!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
          <LayoutCmp>
          {children}
          </LayoutCmp>
      </body>
    </html>
  )
}

