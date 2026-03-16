// ✅ CORRECT ORDER
const dotenv = require('dotenv');
dotenv.config(); // ← FIRST, before anything else

const express = require('express');
const cors = require('cors');
const playlistRouter = require('./routes/playlist'); // ← now API_KEY loads correctly

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/playlist', playlistRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
