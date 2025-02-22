const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/search", async (req, res) => {
    const movieName = req.query.q;
    if (!movieName) return res.json({ error: "No movie name provided!" });

    try {
        const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movieName)}&s=tt&ref_=fn_al_tt_mr`;
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const movies = [];

        $('.ipc-metadata-list-summary-item__t').each((i, element) => {
            const title = $(element).text().trim();
            const href = $(element).closest('a').attr('href');
            // Extract IMDB ID using regex
            const imdbId = href.match(/tt\d+/)?.[0];
            
            if (title && imdbId) {
                movies.push({ title, imdbId });
            }
        });

        console.log('Found movies:', movies);
        res.json(movies);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Failed to fetch movies", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));