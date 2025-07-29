const Restaurant = require("../api/models/restaurant");
const Doner = require("../api/models/doner");

const generateSitemap = async () => {
    const staticUrls = [
        `<url><loc>https://weats.ru</loc></url>`,
        `<url><loc>https://weats.ru/find-restaurant</loc></url>`,
        `<url><loc>https://weats.ru/best-doner</loc></url>`,
    ];
    const allRests = await Restaurant.find();
    const allDoners = await Doner.find();
    const restUrls = allRests.map(({ _id, updatedAt }) => {
        return `<url>
        <loc>https://weats.ru/restaurant/${_id}</loc>
        <lastmod>${updatedAt.toISOString()}</lastmod>
        </url>`;
    });
    const donerUrls = allDoners.map(({ _id, updatedAt }) => {
        return `<url>
            <loc>https://weats.ru/best-doner/${_id}</loc>
            <lastmod>${updatedAt.toISOString()}</lastmod>
            </url>`;
    });
    const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls.join("\n")}
    ${restUrls.join("\n")}
    ${donerUrls.join("\n")}
  </urlset>`.trim();
    return xml;
};

module.exports = {
    generateSitemap,
};
