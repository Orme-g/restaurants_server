const cors = require("cors");
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const restaurantRoutes = require("./api/routes/restaurant-routes");
const donerRoutes = require("./api/routes/doner-routes");
const commentRoutes = require("./api/routes/comment-routes");
const reviewRoutes = require("./api/routes/review-routes");
const userRoutes = require("./api/routes/user-routes");
const eventRoutes = require("./api/routes/event-routes");
const blogRoutes = require("./api/routes/blog-routes");

// const PORT = 4000;
const PORT = 5500; // For NAS
// const URL = "mongodb://localhost:27017/restaurants_db";
const URL = "mongodb://192.168.31.198:27017/restaurants_db"; // NAS Database

const app = express();
app.use(
    cors({
        // origin: "https://weats.ru", // Web Server
        // origin: "https://192.168.31.198:7000", // For NAS
        origin: "http://localhost:5173", // Local development server
        // origin: "http://localhost:4173", // Local production server
        // methods: ["GET", "POST"]       // Какие запросы разрешены
    })
);

// app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(restaurantRoutes);
app.use(donerRoutes);
app.use(commentRoutes);
app.use(reviewRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(blogRoutes);

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, "certificate", "key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "certificate", "certificate.pem")),
    },
    app
);

mongoose
    .connect(URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`DB connection failed: ${err}`));

sslServer.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Secure server listening port ${PORT}`);
});
// app.listen(PORT, (err) => {
//     err ? console.log(err) : console.log(`Listening port ${PORT}`);
// });
