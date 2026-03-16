import { useState } from 'react';
import SEO from './components/SEO';
import PlaylistForm from './components/PlaylistForm';
import StatsGrid from './components/StatsGrid';
import VideoList from './components/VideoList';
import AdBanner from './components/AdBanner';

const API_BASE = import.meta.env.VITE_API_URL;
const AD_SLOT = '2047658658';    // responsive / leaderboard unit

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`${API_BASE}/playlist/stats?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <SEO />

      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__logo">
          <img src="/logo.png" alt="YouTube" className="app-header__logo-img" />
        </div>
        <h1 className="app-header__title">YouTube Playlist Analyzer</h1>
        <p className="app-header__subtitle">
          Paste any public YouTube playlist link to get full duration stats
        </p>
      </header>

      {/* ── 3-Column Layout: Left Ad | Main | Right Ad ── */}
      <div className="page-layout">

        {/* Left Sidebar Ad */}
        <aside className="sidebar sidebar--left">
          <AdBanner
            slot={AD_SLOT}
            format="vertical"
            style={{ width: '160px', height: '600px' }}
          />
        </aside>

        {/* Main Content */}
        <main className="app-main">
          <PlaylistForm onSubmit={handleAnalyze} loading={loading} />

          {error && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon">⚠️</span>
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner" aria-label="Loading" />
              <p className="loading-state__text">Fetching playlist data…</p>
            </div>
          )}

          {data && !loading && (
            <div className="results">
              <StatsGrid data={data} />
              <VideoList videos={data.videos} />

              {/* Bottom Ad — below video list */}
              <AdBanner
                slot={AD_SLOT}
                format="auto"
                responsive={true}
                style={{ minHeight: '90px' }}
              />
            </div>
          )}
        </main>

        {/* Right Sidebar Ad */}
        <aside className="sidebar sidebar--right">
          <AdBanner
            slot={AD_SLOT}
            format="vertical"
            style={{ width: '160px', height: '600px' }}
          />
        </aside>

      </div>

      <footer className="app-footer">
        <p>Powered by YouTube Data API v3</p>
      </footer>
    </div>
  );
}

export default App;
