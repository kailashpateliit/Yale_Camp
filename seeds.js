const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");


mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Database Conneted");
});

const seedDB = async () => {
    await Campground.deleteMany({});
    camp = new Campground({
        author: "61e80066dd816545a884795e",
        title: "Wadi al Gamal Nature Reserve",
        description: "High waterless mountains, a wadi alternately dry and flash-flooded, a beach with crabs scuttling in the waves,an offshore island",
        location: "Red Sea Governorate, Egypt",
        price: Math.floor(Math.random() * 20) + 10,
        images: [
            {
                url: 'https://www.abughosoun.org/wp-content/uploads/2019/04/04-Robin-Utrecht-1.jpg',
                filename: 'YelpCamp/irbzpzjaivkdz9gliivf1'
            }
        ]
    })
    await camp.save();
    camp = new Campground({
        author: "61e80066dd816545a884795e",
        title: "Momba camp",
        description: "Situated just off the northern tip of Chief’s Island in its own concession in the Moremi Game Reserve.",
        location: "Botswana",
        price: Math.floor(Math.random() * 20) + 10,
        images: [
            {
                url: "https://www.moremi.com/assets/img/luxury-safari-little-mombo-camp-pool.jpg",
                filename: 'YelpCamp/irbzpzjaivkdz9gliivf2'
            }
        ]
    })
    await camp.save();
    camp = new Campground({
        author: "61e80066dd816545a884795e",
        title: "Otter Creek",
        description: "It cannot really get more private and picturesque than camping in a tent. There are three tents available, all nestled amongst coconut trees.",
        location: "Lonavala,Maharashtra",
        price: Math.floor(Math.random() * 20) + 10,
        images: [
            {
                url: "https://www.gannett-cdn.com/-mm-/2fc35cafde829c78e9920811e1e60f280645d4c5/c=0-243-2592-1701/local/-/media/Louisville/2014/03/25/titleottercreek.jpg?width=2592&height=1458&fit=crop&format=pjpg&auto=webp",
                filename: 'YelpCamp/irbzpzjaivkdz9gliivf3'
            }
        ]

    })
    await camp.save();
    camp = new Campground({
        author: "61e80066dd816545a884795e",
        title: "La Rosa Campsite",
        description: "The sheer eccentricity of the site adds entertainment to the camping adventure, with the abundance of trinkets lying around.",
        location: "Skegness PE24 5RJ, United Kingdom",
        price: Math.floor(Math.random() * 20) + 10,
        images: [
            {
                url: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
                filename: 'YelpCamp/irbzpzjaivkdz9gliivf4'
            }
        ]
    })
    await camp.save();
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })