/**
 * Parses ISO 8601 duration string (e.g. "PT1H23M45S") to total seconds.
 */
function parseISO8601Duration(duration) {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0, 10);
    const minutes = parseInt(match[2] || 0, 10);
    const seconds = parseInt(match[3] || 0, 10);
    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats total seconds to H:MM:SS or M:SS string.
 */
function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) {
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Formats total seconds to a verbose string like "2 hrs 34 min 12 sec".
 */
function formatDurationVerbose(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h} hr${h !== 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} min`);
    if (s > 0 || parts.length === 0) parts.push(`${s} sec`);
    return parts.join(' ');
}

module.exports = { parseISO8601Duration, formatDuration, formatDurationVerbose };
