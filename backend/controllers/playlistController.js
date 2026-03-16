const {
    extractPlaylistId,
    fetchAllPlaylistItems,
    fetchVideoDurations,
} = require('../utils/youtubeApi');

const {
    parseISO8601Duration,
    formatDuration,
    formatDurationVerbose,
} = require('../utils/durationParser');

async function getPlaylistStats(req, res) {
    try {
        const { url } = req.query;

        if (!url || url.trim() === '') {
            return res.status(400).json({ error: 'Playlist URL is required.' });
        }

        const playlistId = extractPlaylistId(url.trim());
        if (!playlistId) {
            return res.status(400).json({
                error: 'Could not extract a playlist ID from the provided URL. Make sure it contains a "list=" parameter.',
            });
        }

        // Step 1: Get all video IDs from playlist
        const { videoIds, videoMeta } = await fetchAllPlaylistItems(playlistId);

        if (videoIds.length === 0) {
            return res.status(404).json({
                error: 'No videos found. The playlist may be empty or private.',
            });
        }

        // Step 2: Get durations for all videos (batched)
        const durations = await fetchVideoDurations(videoIds);

        // Step 3: Build video array with parsed durations
        const videos = videoIds.map((id, index) => {
            const iso = durations[id] || 'PT0S';
            const secs = parseISO8601Duration(iso);
            return {
                id,
                index: index + 1,
                title: videoMeta[id]?.title || 'Unknown',
                thumbnail: videoMeta[id]?.thumbnail || '',
                durationISO: iso,
                durationSeconds: secs,
                durationFormatted: formatDuration(secs),
            };
        });

        // Step 4: Calculate stats
        const totalSeconds = videos.reduce((sum, v) => sum + v.durationSeconds, 0);
        const averageSeconds = Math.floor(totalSeconds / videos.length);

        const longestVideo = [...videos].sort((a, b) => b.durationSeconds - a.durationSeconds)[0];
        const shortestVideo = [...videos].sort((a, b) => a.durationSeconds - b.durationSeconds)[0];

        return res.json({
            playlistId,
            totalVideos: videos.length,
            totalDuration: formatDuration(totalSeconds),
            totalDurationVerbose: formatDurationVerbose(totalSeconds),
            totalSeconds,
            averageDuration: formatDuration(averageSeconds),
            averageDurationVerbose: formatDurationVerbose(averageSeconds),
            averageSeconds,
            longestVideo: {
                id: longestVideo.id,
                title: longestVideo.title,
                thumbnail: longestVideo.thumbnail,
                duration: longestVideo.durationFormatted,
                durationSeconds: longestVideo.durationSeconds,
            },
            shortestVideo: {
                id: shortestVideo.id,
                title: shortestVideo.title,
                thumbnail: shortestVideo.thumbnail,
                duration: shortestVideo.durationFormatted,
                durationSeconds: shortestVideo.durationSeconds,
            },
            videos,
        });
    } catch (err) {
        console.error('[PlaylistController Error]', err.message);

        // YouTube API error passthrough
        const ytError = err.response?.data?.error?.message;
        if (ytError) {
            return res.status(400).json({ error: `YouTube API Error: ${ytError}` });
        }

        return res.status(500).json({ error: 'Failed to analyze playlist. Please try again.' });
    }
}

module.exports = { getPlaylistStats };
