const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
    },
    short_description: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    cousine: [
        {
            type: String,
            required: true,
            lowercase: true,
        },
    ],
    rating: [Number],
    adress: {
        type: String,
        required: true,
    },
    bill: {
        type: Number,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    city: {
        type: String,
        required: true,
    },
    coordinates: { type: String, required: true },
    subway: [{ type: String }],
    events: [String],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;

// db.restaurants.insertOne({
//     name: 'БАНЩИКИ',
//     short_description: 'Ресторан "Банщики" – волшебное место, где каждый может найти себе блюдо по вкусу, или по карману.',
//     description: '',
//     images: ['','','','',''],
//     cousine: ['банная','вкусная'],
//     rating: 4.4,
//     adress: 'Ул. Куйбышевского, 34',
//     bill: 3200,
//     phone: "8-(812)-527-22-72",
//     createdAt: ISODate(),
//     title_image: 'https://banshiki.spb.ru/images/slider/1.jpg'
// })

// some: ['','','','','']
