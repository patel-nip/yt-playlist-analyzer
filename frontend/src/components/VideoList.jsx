import { useState } from 'react';

function VideoList({ videos }) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('index');   // 'index' | 'duration' | 'title'
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(1);
    const PER_PAGE = 20;

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
        setPage(1);
    };

    const filtered = videos.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'index') cmp = a.index - b.index;
        if (sortBy === 'duration') cmp = a.durationSeconds - b.durationSeconds;
        if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const totalPages = Math.ceil(sorted.length / PER_PAGE);
    const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const SortIcon = ({ field }) => (
        <span className="sort-icon">
            {sortBy === field ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
        </span>
    );

    return (
        <section className="video-list-section">
            <div className="video-list-header">
                <h2 className="section-title">🎞️ All Videos ({videos.length})</h2>
                <input
                    className="search-input"
                    type="search"
                    placeholder="Search videos…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            <div className="table-wrapper">
                <table className="video-table">
                    <thead>
                        <tr>
                            <th className="col-num">#</th>
                            <th className="col-thumb">Thumb</th>
                            <th
                                className="col-title sortable"
                                onClick={() => toggleSort('title')}
                            >
                                Title <SortIcon field="title" />
                            </th>
                            <th
                                className="col-duration sortable"
                                onClick={() => toggleSort('duration')}
                            >
                                Duration <SortIcon field="duration" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((video) => (
                            <tr key={video.id} className="video-row">
                                <td className="col-num">{video.index}</td>
                                <td className="col-thumb">
                                    {video.thumbnail ? (
                                        <img
                                            className="video-thumb"
                                            src={video.thumbnail}
                                            alt=""
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="video-thumb video-thumb--placeholder">▶</div>
                                    )}
                                </td>
                                <td className="col-title">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="video-link"
                                    >
                                        {video.title}
                                    </a>
                                </td>
                                <td className="col-duration">
                                    <span className="duration-badge">{video.durationFormatted}</span>
                                </td>
                            </tr>
                        ))}

                        {paginated.length === 0 && (
                            <tr>
                                <td colSpan={4} className="empty-row">
                                    No videos match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn--ghost"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ← Prev
                    </button>
                    <span className="pagination__info">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="btn btn--ghost"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next →
                    </button>
                </div>
            )}
        </section>
    );
}

export default VideoList;
