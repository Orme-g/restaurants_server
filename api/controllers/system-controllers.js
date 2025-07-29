const { generateSitemap } = require("../../utils/sitemapGenerator");

let cachedSitemap = null;
let lastGenerated = null;
const ONE_DAY = 24 * 60 * 60 * 1000;

const getSitemap = async (req, res) => {
    try {
        const now = Date.now();
        if (!cachedSitemap || !lastGenerated || now - lastGenerated > ONE_DAY) {
            cachedSitemap = await generateSitemap();
            lastGenerated = now;
        }
        res.header("Content-Type", "application/xml");
        res.send(cachedSitemap);
    } catch (error) {
        res.status(500).send("Cannot generate Sitemap");
    }
};
module.exports = {
    getSitemap,
};
