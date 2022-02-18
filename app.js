//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const https = require("https");
const alert = require("alert");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_prathamesh:1210Nanu@cluster0.hm590.mongodb.net/weatherDB");

//create userData schema
const userDataSchema = {
    email: String,
    password: String,
    isLogin: Boolean,
    home: String,
    favourites: []
};

//create model/collection for userData
const userData = mongoose.model("userData", userDataSchema);



const arr1 = ["Mumbai", "Hyderabad", "Kanpur", "Lucknow", "Agra", "Ranchi"];
const arr2 = ["Delhi", "Ahmedabad", "Chennai", "Kolkata", "Bangalore", "Patna"];
const arr3 = ["Pune", "Surat", "Nagpur", "Manali", "Jammu", "Jaipur"];

app.get("/", function (req, res) {

    const apiKey = process.env.SECRET;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + "Panvel" + "&appid=" + apiKey + "&units=" + unit + "#";
    var newUrl = url;


    highlightedCity = [];
    var randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr1[randomNum]);
    randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr2[randomNum]);
    randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr3[randomNum]);

    const highlightedCityTemp = [];
    const highlightedCityFeelsLike = [];

    for (var i = 0; i < highlightedCity.length; i++) {

        newUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + highlightedCity[i] + "&appid=" + apiKey + "&units=" + unit + "#";

        https.get(newUrl, function (response) {
            console.log(response.statusCode);

            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                console.log(weatherData.main.temp);
                highlightedCityTemp.push(weatherData.main.temp);
                highlightedCityFeelsLike.push(weatherData.main.feels_like);

            });

        });

    }


    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const tempData = weatherData.main.temp;
            const feels_like = weatherData.main.feels_like;
            const image = weatherData.weather[0].icon;
            const wind = weatherData.wind.speed;
            const gust = weatherData.wind.gust;
            const humidity = weatherData.main.humidity;
            const description = weatherData.weather[0].main;
            const imageUrl = "http://openweathermap.org/img/wn/" + image + "@2x.png";


            res.render("home", {
                city: "Panvel",
                imageUrl: imageUrl,
                tempData: tempData,
                feels_like: feels_like,
                wind: wind,
                gust: gust,
                humidity: humidity,
                description: description,

                randomCity1: highlightedCity[0],
                randomCity1_temp: highlightedCityTemp[0],
                randomCity1_feelsLike: highlightedCityFeelsLike[0],

                randomCity2: highlightedCity[1],
                randomCity2_temp: highlightedCityTemp[1],
                randomCity2_feelsLike: highlightedCityFeelsLike[1],

                randomCity3: highlightedCity[2],
                randomCity3_temp: highlightedCityTemp[2],
                randomCity3_feelsLike: highlightedCityFeelsLike[2]

            });

        });


    });

});



app.post("/", function (req, res) {
    const city = _.capitalize(req.body.searchData);

    const apiKey = process.env.SECRET;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit + "#";
    var newUrl = url;

    highlightedCity = [];
    var randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr1[randomNum]);
    randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr2[randomNum]);
    randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr3[randomNum]);

    const highlightedCityTemp = [];
    const highlightedCityFeelsLike = [];



    for (var i = 0; i < highlightedCity.length; i++) {

        newUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + highlightedCity[i] + "&appid=" + apiKey + "&units=" + unit + "#";

        https.get(newUrl, function (response) {
            console.log(response.statusCode);

            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                highlightedCityTemp.push(weatherData.main.temp);
                highlightedCityFeelsLike.push(weatherData.main.feels_like);

            });

        });

    }

    console.log(highlightedCity);
    console.log(highlightedCityTemp);
    console.log(highlightedCityFeelsLike);

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const tempData = weatherData.main.temp;
            const feels_like = weatherData.main.feels_like;
            const image = weatherData.weather[0].icon;
            const wind = weatherData.wind.speed;
            const gust = weatherData.wind.gust;
            const humidity = weatherData.main.humidity;
            const description = weatherData.weather[0].main;
            const imageUrl = "http://openweathermap.org/img/wn/" + image + "@2x.png";


            res.render("home", {
                city: city,
                imageUrl: imageUrl,
                tempData: tempData,
                feels_like: feels_like,
                wind: wind,
                gust: gust,
                humidity: humidity,
                description: description,

                randomCity1: highlightedCity[0],
                randomCity1_temp: highlightedCityTemp[0],
                randomCity1_feelsLike: highlightedCityFeelsLike[0],

                randomCity2: highlightedCity[1],
                randomCity2_temp: highlightedCityTemp[1],
                randomCity2_feelsLike: highlightedCityFeelsLike[1],

                randomCity3: highlightedCity[2],
                randomCity3_temp: highlightedCityTemp[2],
                randomCity3_feelsLike: highlightedCityFeelsLike[2]

            });

        });


    });

});

app.get("/newsletter", function (req, res) {

    res.render("newsletter", {

    });
});

app.get("/signUp", function (req, res) {

    res.render("signUp", {

    });
});

app.post("/signUp", function (req, res) {

    const email = _.lowerCase(req.body.emailInput);
    const password = req.body.passwordInput;

    userData.findOne({
        email: email
    }, function (err, foundEmail) {
        if (foundEmail) {
            res.redirect("/userExists");
        } else {
            const newUser = new userData({
                email: email,
                password: password,
                isLogin: false,
                home: "",
                favourites: []
            });
            newUser.save();
            res.redirect("/signIn");
        }

    });

});

app.get("/signIn", function (req, res) {

    res.render("signIn", {

    });
});

app.post("/signIn", function (req, res) {

    const email = _.lowerCase(req.body.emailInput);
    const password = req.body.passwordInput;

    userData.findOne({
        email: email
    }, function (err, foundEmail) {
        if (foundEmail) {

            userData.findOne({
                email: email,
                password: password
            }, function (err, foundPass) {
                if (foundPass) {

                    userData.findOneAndUpdate({
                        email: email
                    }, {
                        isLogin: true
                    }, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(data);
                        }
                    });

                    const arr = foundEmail.email.split(" ");
                    const userName = arr.join(".");

                    const apiKey = process.env.SECRET;
                    const unit = "metric";
                    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + "Panvel" + "&appid=" + apiKey + "&units=" + unit + "#";
                    var newUrl = url;


                    highlightedCity = [];
                    var randomNum = Math.floor((Math.random()) * 6);
                    highlightedCity.push(arr1[randomNum]);
                    randomNum = Math.floor((Math.random()) * 6);
                    highlightedCity.push(arr2[randomNum]);
                    randomNum = Math.floor((Math.random()) * 6);
                    highlightedCity.push(arr3[randomNum]);

                    const highlightedCityTemp = [];
                    const highlightedCityFeelsLike = [];

                    for (var i = 0; i < highlightedCity.length; i++) {

                        newUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + highlightedCity[i] + "&appid=" + apiKey + "&units=" + unit + "#";

                        https.get(newUrl, function (response) {
                            console.log(response.statusCode);

                            response.on("data", function (data) {
                                const weatherData = JSON.parse(data);
                                console.log(weatherData.main.temp);
                                highlightedCityTemp.push(weatherData.main.temp);
                                highlightedCityFeelsLike.push(weatherData.main.feels_like);

                            });

                        });

                    }


                    https.get(url, function (response) {

                        response.on("data", function (data) {
                            const weatherData = JSON.parse(data);
                            const tempData = weatherData.main.temp;
                            const feels_like = weatherData.main.feels_like;
                            const image = weatherData.weather[0].icon;
                            const wind = weatherData.wind.speed;
                            const gust = weatherData.wind.gust;
                            const humidity = weatherData.main.humidity;
                            const description = weatherData.weather[0].main;
                            const imageUrl = "http://openweathermap.org/img/wn/" + image + "@2x.png";


                            res.render("login_home", {
                                userName: userName,
                                city: "Panvel",
                                imageUrl: imageUrl,
                                tempData: tempData,
                                feels_like: feels_like,
                                wind: wind,
                                gust: gust,
                                humidity: humidity,
                                description: description,

                                randomCity1: highlightedCity[0],
                                randomCity1_temp: highlightedCityTemp[0],
                                randomCity1_feelsLike: highlightedCityFeelsLike[0],

                                randomCity2: highlightedCity[1],
                                randomCity2_temp: highlightedCityTemp[1],
                                randomCity2_feelsLike: highlightedCityFeelsLike[1],

                                randomCity3: highlightedCity[2],
                                randomCity3_temp: highlightedCityTemp[2],
                                randomCity3_feelsLike: highlightedCityFeelsLike[2]

                            });

                        });


                    });



                } else {
                    res.redirect("/incorrectPass");
                }

            });

        } else {
            res.redirect("/userNotExists");
        }
    });


});

app.get("/login_home", function (req, res) {

    res.render("login_home", {

    });
});

app.post("/login_home", function (req, res) {

    const user = req.body.userName;

    const city = _.capitalize(req.body.searchData);

    const apiKey = process.env.SECRET;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit + "#";
    var newUrl = url;

    highlightedCity = [];
    var randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr1[randomNum]);
    randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr2[randomNum]);
    randomNum = Math.floor((Math.random()) * 6);
    highlightedCity.push(arr3[randomNum]);

    const highlightedCityTemp = [];
    const highlightedCityFeelsLike = [];


    for (var i = 0; i < highlightedCity.length; i++) {

        newUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + highlightedCity[i] + "&appid=" + apiKey + "&units=" + unit + "#";

        https.get(newUrl, function (response) {

            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                highlightedCityTemp.push(weatherData.main.temp);
                highlightedCityFeelsLike.push(weatherData.main.feels_like);

            });

        });

    }

    console.log(highlightedCityTemp);

    https.get(url, function (response) {

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const tempData = weatherData.main.temp;
            const feels_like = weatherData.main.feels_like;
            const image = weatherData.weather[0].icon;
            const wind = weatherData.wind.speed;
            const gust = weatherData.wind.gust;
            const humidity = weatherData.main.humidity;
            const description = weatherData.weather[0].main;
            const imageUrl = "http://openweathermap.org/img/wn/" + image + "@2x.png";


            res.render("login_home", {
                userName: user,
                city: city,
                imageUrl: imageUrl,
                tempData: tempData,
                feels_like: feels_like,
                wind: wind,
                gust: gust,
                humidity: humidity,
                description: description,

                randomCity1: highlightedCity[0],
                randomCity1_temp: highlightedCityTemp[0],
                randomCity1_feelsLike: highlightedCityFeelsLike[0],

                randomCity2: highlightedCity[1],
                randomCity2_temp: highlightedCityTemp[1],
                randomCity2_feelsLike: highlightedCityFeelsLike[1],

                randomCity3: highlightedCity[2],
                randomCity3_temp: highlightedCityTemp[2],
                randomCity3_feelsLike: highlightedCityFeelsLike[2]

            });


        });


    });


});

app.get("/dashboard", function (req, res) {

    const actualUser = req.query.valid;
    const arr = req.query.valid2.split(",");

    const apiKey = process.env.SECRET;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + "" + "&appid=" + apiKey + "&units=" + unit + "#";
    var dashurl = url;
    let temp = [];
    let feels = [];
    let images = [];

    for (var i = 0; i < arr.length; i++) {

        dashurl = "https://api.openweathermap.org/data/2.5/weather?q=" + arr[i] + "&appid=" + apiKey + "&units=" + unit + "#";

        https.get(dashurl, function (response) {

            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                temp.push(weatherData.main.temp);
                feels.push(weatherData.weather[0].main);
                const image = weatherData.weather[0].icon;
                images.push("http://openweathermap.org/img/wn/" + image + "@2x.png");

            });

        });

    }

    https.get(url, function (response) {

        response.on("data", function (data) {

            res.render("AfterDashboard", {
                actualUser: actualUser,
                foundItems: arr,
                temp: temp,
                feels: feels,
                image: images
            });

        });

    });




});

app.post("/dashboard", function (req, res) {

    const arr = req.body.userName.split(".");
    const user = _.capitalize(arr[0]);
    const actual_user = arr.join(" ");

    userData.find({email: actual_user}, function (err, foundItem) {
        var str = encodeURIComponent(actual_user);
        res.redirect("/dashboard?valid=" + str + "&valid2=" + foundItem[0].favourites);

    });


});

app.post("/add", function (req, res) {

    const newItem = _.capitalize(req.body.newItem);
    const arr = req.body.userName.split(" ");
    const user = _.capitalize(arr[0]);
    const actual_user = arr.join(" ");

    userData.find({email: actual_user}, function (err, foundItem) {

        if (foundItem[0].favourites.length >= 5) {

            alert("Maximum 5 places can be Added");

            var str = encodeURIComponent(actual_user);
            res.redirect("/dashboard?valid=" + str + "&valid2=" + foundItem[0].favourites);

        } else {

            userData.findOneAndUpdate({email: actual_user}, {$addToSet: {favourites: newItem}}, function (err) {
                if (err) {
                    alert("Duplicate Entry");
                } else {

                    userData.find({email: actual_user}, function (err, foundItem) {

                        var str = encodeURIComponent(actual_user);
                        res.redirect("/dashboard?valid=" + str + "&valid2=" + foundItem[0].favourites);

                    });

                }

            });

        }

    });

});

app.post("/delete", function (req, res) {
    const checkedItem = req.body.checkbox;
    const userName = req.body.userName;

    userData.findOneAndUpdate({email: userName}, {$pull: {favourites: checkedItem}}, function (err) {

        console.log("Item Deleted from the list.");

        userData.find({email: userName}, function (err, foundItem) {

            var str = encodeURIComponent(userName);
            res.redirect("/dashboard?valid=" + str + "&valid2=" + foundItem[0].favourites);

        });

    });

});


app.get("/userExists", function (req, res) {

    res.render("userExists", {

    });
});

app.get("/userNotExists", function (req, res) {

    res.render("userNotExists", {

    });
});

app.get("/incorrectPass", function (req, res) {

    res.render("incorrectPass", {

    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server is up and running.");
});