import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object;
  keywords?: string[];
}

export function SEOHead({
  title = "CodeResite — AI Tools, Automation, Web Development & Cybersecurity",
  description = "CodeResite by Sanskar Dubey — practical AI generators, developer tools and step-by-step guides. Try PPT, resume & report generators.",
  canonical = "https://coderesite.com/",
  ogImage = "https://coderesite.com/assets/og-image.jpg",
  ogType = "website",
  jsonLd,
  keywords = []
}: SEOHeadProps) {
  const baseJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://coderesite.com/#org",
        "name": "CodeResite",
        "url": "https://coderesite.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://coderesite.com/assets/images/logo.png"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://coderesite.com/#website",
        "url": "https://coderesite.com/",
        "name": "CodeResite",
        "publisher": { "@id": "https://coderesite.com/#org" },
        "inLanguage": "en-US"
      },
      {
        "@type": "Person",
        "@id": "https://coderesite.com/#person",
        "name": "Sanskar Dubey",
        "url": "https://coderesite.com/about/",
        "sameAs": [
          "https://www.linkedin.com/in/sanskardev",
          "https://github.com/dubeysanskar",
          "https://x.com/DubeySansk48167"
        ],
        "jobTitle": "Founder & Author",
        "image": "https://coderesite.com/assets/images/sanskar-photo.jpg"
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="canonical" href={canonical} />
      
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#00ff00" />
      
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <meta name="author" content="Sanskar Dubey" />
      
      {/* OpenGraph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@DubeySansk48167" />
      <meta name="twitter:creator" content="@DubeySansk48167" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Performance: preload hero fo */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" 
        as="style" 
      />
      
      {/* Favicon & Web App Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png" />
      <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
      
      {/* Web App Manifest */}
      <link rel="manifest" href="/assets/site.webmanifest" />
      
      {/* JSON-LD base schema */}
      <script type="application/ld+json">
        {JSON.stringify(baseJsonLd)}
      </script>
      
      {/* Additional JSON-LD if provided */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
