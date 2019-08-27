require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");

//var spotify = new Spotify(keys.spotify);

var liriCmd = process.argv[2];

switch(liriCmd){
    case "concert-this":
        var artist = process.argv[3];
        findEvents(artist);
        break;

    case "spotify-this-song":
        break;
        
    case "monvie_this":
        break;
    case "do-what-it-says":
        break;
    default:
        console.log("Error: LIRI does not understand your command");
}

function findEvents(artist){
    var bandsInTownURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        axios.get(bandsInTownURL).then(resp => {
            console.log("\n\n***|UPCOMING EVENTS: " + artist + "|***");
            resp.data.forEach(event => {                
                console.log(
                    "\nVenue: " + event.venue.name +
                    "\nLocation: " + event.venue.city + ", " + event.venue.state + 
                    "\nDate: " + moment(event.datetime).format("MM/DD/YYYY")
                );
            });
            console.log("\n\n");
        });
}