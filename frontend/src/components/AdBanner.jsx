import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function AdBanner({ slot, format = 'auto', responsive = true, style = {} }) {
    const adRef = useRef(null);
    const pushed = useRef(false);

    useEffect(() => {
        if (!pushed.current && adRef.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                pushed.current = true;
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }
    }, []);

    return (
        <div className="ad-container">
            <p className="ad-label">Advertisement</p>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive.toString()}
            />
        </div>
    );
}

AdBanner.propTypes = {
    slot: PropTypes.string.isRequired,
    format: PropTypes.string,
    responsive: PropTypes.bool,
    style: PropTypes.object,
};

export default AdBanner;
