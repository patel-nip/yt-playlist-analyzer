import { Helmet } from 'react-helmet-async';

function SEO({ title, description, url, image }) {
    const siteName = 'YouTube Playlist Analyzer';
    const defaultDesc = 'Calculate the total duration, video count, average length, longest and shortest videos of any YouTube playlist instantly.';
    const finalTitle = title ? `${title} | ${siteName}` : siteName;
    const finalDesc = description || defaultDesc;
    const finalUrl = url || 'https://yourdomain.com';
    const finalImage = image || 'https://yourdomain.com/og-image.png';

    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: siteName,
        url: finalUrl,
        description: finalDesc,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };

    return (
        <Helmet>
            {/* ── Standard ── */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDesc} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content="Your Name" />
            <link rel="canonical" href={finalUrl} />

            {/* ── Open Graph (Facebook, WhatsApp, LinkedIn) ── */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:image" content={finalImage} />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDesc} />
            <meta name="twitter:image" content={finalImage} />

            {/* ── Structured Data ── */}
            <script type="application/ld+json">
                {JSON.stringify(schemaMarkup)}
            </script>
        </Helmet>
    );
}

export default SEO;
