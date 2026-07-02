import './globals.css'
import { Providers } from './providers'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://continuum-practice.preview.emergentagent.com'),
  title: 'Kenia Navarro — Danza contemporánea y práctica de movimiento Continuum',
  description:
    'Kenia Navarro es bailarina, coreógrafa, intérprete e investigadora del movimiento. Explora la respiración, la fluidez, la percepción y la conciencia encarnada a través de la interpretación y la práctica de movimiento Continuum.',
  keywords: [
    'Kenia Navarro', 'contemporary dance', 'choreography', 'Continuum movement',
    'Emilie Conrad', 'movement research', 'somatic practice', 'performance', 'workshops'
  ],
  authors: [{ name: 'Kenia Navarro' }],
  alternates: {
    canonical: '/',
    languages: {
      es: '/?lang=es',
      en: '/?lang=en',
    },
  },
  openGraph: {
    title: 'Kenia Navarro — Danza contemporánea y Continuum',
    description:
      'Danza contemporánea, coreografía y la práctica de movimiento Continuum — explorando la respiración, la fluidez, la percepción y la conciencia encarnada.',
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="alternate" hrefLang="es" href="/?lang=es" />
        <link rel="alternate" hrefLang="en" href="/?lang=en" />
        <link rel="alternate" hrefLang="x-default" href="/?lang=es" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
