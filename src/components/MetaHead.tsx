
import { Helmet } from "react-helmet";

function MetaHead() {
  return (
    <Helmet>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://www.coderesite.com" />

      {/* Favicon & Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon_io/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon_io/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon_io/favicon-16x16.png" />
      <link rel="manifest" href="/assets/favicon_io/site.webmanifest" />

      {/* Bing Site Verification (optional) */}
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />

      {/* Title */}
      <title>CodeResite – AI Tools, Automation, Web Development & Cybersecurity</title>

      {/* Meta Description & Keywords */}
      <meta
        name="description"
        content="CodeResite is an AI-powered platform offering cutting-edge tools like PPT generators, report creators, and lead generation. We also provide services in AI automation, web/app development, and cybersecurity for students, developers, and businesses."
      />
      <meta
        name="keywords"
        content="CodeResite, Codify Club, AI Tools, PPT Generator, Report Generator, Lead Generation, Automation, Web Development, App Development, Cybersecurity, Signature Tools, Student Tools"
      />
      <meta name="author" content="Sanskar Dubey" />

      {/* Open Graph */}
      <meta property="og:title" content="CodeResite – AI Tools & Services" />
      <meta
        property="og:description"
        content="Explore AI automation, cybersecurity, website & app development, and intelligent tools like the PPT builder. Ideal for students, creators, and startups."
      />
      <meta property="og:url" content="https://www.coderesite.com" />
      <meta property="og:image" content="https://www.coderesite.com/assets/og-image.jpg" />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@CodeResite" />
      <meta name="twitter:title" content="CodeResite – AI Automation, Web Development & More" />
      <meta
        name="twitter:description"
        content="Join CodeResite to explore powerful AI tools, cybersecurity solutions, and development services."
      />
      <meta name="twitter:image" content="https://www.coderesite.com/assets/og-image.jpg" />
      <meta
        name="twitter:hashtags"
        content="CodeResite,AIPlatform,Automation,WebDev,AppDev,CyberSecurity,StudentTools,PPTGenerator,CodifyClub"
      />

      {/* Remix Icon */}
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
        rel="stylesheet"
      />

      {/* Main CSS */}
      <link rel="stylesheet" href="/styles.css" />
    </Helmet>
  );
}

export default MetaHead;
