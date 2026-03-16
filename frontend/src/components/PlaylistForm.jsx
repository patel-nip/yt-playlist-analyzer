import { useState } from 'react';

function PlaylistForm({ onSubmit, loading }) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        onSubmit(url.trim());
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
        } catch {
            /* clipboard permission denied */
        }
    };

    return (
        <section className="form-section">
            <form className="playlist-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <span className="input-group__icon">🔗</span>
                    <input
                        className="input-group__field"
                        type="url"
                        placeholder="https://www.youtube.com/playlist?list=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                        aria-label="YouTube Playlist URL"
                        required
                    />
                    <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={handlePaste}
                        disabled={loading}
                        title="Paste from clipboard"
                    >
                        📋 Paste
                    </button>
                </div>
                <button
                    type="submit"
                    className={`btn btn--primary ${loading ? 'btn--loading' : ''}`}
                    disabled={loading || !url.trim()}
                >
                    {loading ? 'Analyzing…' : '▶ Analyze Playlist'}
                </button>
            </form>

            <p className="form-hint">
                Works with public playlists. Example:{' '}
                <button
                    className="link-btn"
                    onClick={() =>
                        setUrl('https://www.youtube.com/playlist?list=PLWKjhJtqVAbnRT_hue-3zyiuOYmmXjrMI')
                    }
                >
                    Try a sample playlist
                </button>
            </p>
        </section>
    );
}

export default PlaylistForm;
