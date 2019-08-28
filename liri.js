require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var clear = require("clear");

var spotify = new Spotify(keys.spotify);

var liriCmd = process.argv[2];
var qryItem = process.argv[3];

switch(liriCmd){
    case "concert-this":
        var bandsInTownURL = "https://rest.bandsintown.com/artists/" + qryItem + "/events?app_id=codingbootcamp";
        clear();
        findStuff(bandsInTownURL, "event");
        break;

    case "spotify-this-song":
        spotArtist();
        break;

    case "movie-this":
        var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + qryItem;
        clear();
        findStuff(movieURL, "movie");
        break;
    case "do-what-it-says":
        break;
    default:
        console.log("Error: LIRI does not understand your command");
}

function findStuff(URL, type){
    

        axios.get(URL).then(resp => {
            printStuff(resp, type);
        });
}

function printStuff(resp, type){
             
                if(type === "event"){  
                    console.log("\n\n***|UPCOMING EVENTS: " + qryItem + "|***");  
                    resp.data.forEach(item => {           
                        console.log(
                            "\nVenue: " + item.venue.name +
                            "\nLocation: " + item.venue.city + ", " + item.venue.state + 
                            "\nDate: " + moment(item.datetime).format("MM/DD/YYYY")
                        );
                    });
                }

                if(type === "movie"){
                    var rtScore;
                    for(var rating in resp.data.Ratings){
                        if(resp.data.Ratings[rating].Source === "Rotten Tomatoes"){
                            rtScore =  resp.data.Ratings[rating].Value;
                            break;
                        }
                        else    
                            rtScore =  "No Score Available"
                    }

                    console.log(
                        "\n Title: " + resp.data.Title +
                        "\n Year: " + resp.data.Year +
                        "\n IMDB Rating: " + resp.data.imdbRating +
                        "\n Rotten Tomato Rating: " + rtScore +
                        "\n Country: " + resp.data.Country +
                        "\n Plot: " + resp.data.Plot +
                        "\n Actors: " + resp.data.Actors
                    )
                }
            console.log("\n\n");
}

function spotArtist(){
    spotify.search({
        type: "track",
        query: process.argv[3],
        limit: 5

    }, (err, data) => {
        if(err)
            return console.log("Error: " + err);
        
        clear();
        console.log("***|TOP 5 RESULTS FOR " + process.argv[3] + "|***");
        for(var i = 0; i < 5; ++i){
            var artists = "";
            data.tracks.items[i].album.artists.forEach(artist => artists += artist.name)
            //console.log(data.tracks.items[i].album)
            console.log(
                "\nArtist(s): " + artists +
                "\nTrack Name: " + data.tracks.items[i].name +
                "\nPreview Link: " + data.tracks.items[i].preview_url +
                "\nAlbum: " + data.tracks.items[i].album.name + 
                "\n"
            );
        }
    });
}