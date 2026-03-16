function StatCard({ icon, label, value, sub, highlight }) {
    return (
        <div className={`stat-card ${highlight ? 'stat-card--highlight' : ''}`}>
            <div className="stat-card__icon">{icon}</div>
            <div className="stat-card__body">
                <p className="stat-card__label">{label}</p>
                <p className="stat-card__value">{value}</p>
                {sub && <p className="stat-card__sub">{sub}</p>}
            </div>
        </div>
    );
}

function VideoHighlight({ label, icon, video }) {
    return (
        <div className="video-highlight">
            <div className="video-highlight__header">
                <span>{icon}</span>
                <span className="video-highlight__label">{label}</span>
                <span className="video-highlight__duration">{video.duration}</span>
            </div>
            <div className="video-highlight__body">
                {video.thumbnail && (
                    <img
                        className="video-highlight__thumb"
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                    />
                )}
                <a
                    className="video-highlight__title"
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {video.title}
                </a>
            </div>
        </div>
    );
}

function StatsGrid({ data }) {
    return (
        <section className="stats-section">
            <h2 className="section-title">📊 Playlist Statistics</h2>

            <div className="stats-grid">
                <StatCard
                    icon="⏱️"
                    label="Total Duration"
                    value={data.totalDuration}
                    sub={data.totalDurationVerbose}
                    highlight
                />
                <StatCard
                    icon="🎬"
                    label="Total Videos"
                    value={data.totalVideos.toLocaleString()}
                />
                <StatCard
                    icon="📐"
                    label="Average Duration"
                    value={data.averageDuration}
                    sub={data.averageDurationVerbose}
                />
            </div>

            <div className="highlights-grid">
                <VideoHighlight
                    label="Longest Video"
                    icon="🏆"
                    video={data.longestVideo}
                />
                <VideoHighlight
                    label="Shortest Video"
                    icon="⚡"
                    video={data.shortestVideo}
                />
            </div>
        </section>
    );
}

export default StatsGrid;
