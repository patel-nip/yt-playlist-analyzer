const axios = require('axios');

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Extracts playlist ID from various YouTube URL formats.
 * Supports: ?list=, /playlist?list=, youtu.be with list param
 */
function extractPlaylistId(url) {
    try {
        const parsed = new URL(url);
        const listParam = parsed.searchParams.get('list');
        if (listParam) return listParam;
    } catch {
        // Not a valid URL, try regex fallback
    }
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Fetches ALL playlist items across all pages (max 50 per page).
 * Returns videoIds array and lookup maps for title & thumbnail.
 */
async function fetchAllPlaylistItems(playlistId) {
    const videoIds = [];
    const videoMeta = {}; // { [videoId]: { title, thumbnail } }
    let nextPageToken = null;

    do {
        const params = {
            part: 'snippet',
            playlistId,
            maxResults: 50,
            key: API_KEY,
        };
        if (nextPageToken) params.pageToken = nextPageToken;

        const { data } = await axios.get(`${BASE_URL}/playlistItems`, { params });

        for (const item of data.items) {
            const videoId = item.snippet?.resourceId?.videoId;
            if (!videoId || videoId === 'deleted video') continue;

            videoIds.push(videoId);
            videoMeta[videoId] = {
                title: item.snippet.title,
                thumbnail:
                    item.snippet.thumbnails?.medium?.url ||
                    item.snippet.thumbnails?.default?.url ||
                    '',
                position: item.snippet.position,
            };
        }

        nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);

    return { videoIds, videoMeta };
}

/**
 * Fetches contentDetails (duration) for video IDs in batches of 50.
 * Returns { [videoId]: isoDuration }
 */
async function fetchVideoDurations(videoIds) {
    const durations = {};

    for (let i = 0; i < videoIds.length; i += 50) {
        const batch = videoIds.slice(i, i + 50);
        const { data } = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'contentDetails',
                id: batch.join(','),
                key: API_KEY,
            },
        });

        for (const item of data.items) {
            durations[item.id] = item.contentDetails?.duration || 'PT0S';
        }
    }

    return durations;
}

module.exports = { extractPlaylistId, fetchAllPlaylistItems, fetchVideoDurations };
