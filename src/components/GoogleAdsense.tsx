import Script from 'next/script'

export const GoogleAdsense = () => {
    if (process.env.NODE_ENV !== 'production') {
        return null
    }

    return (
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    )
}
