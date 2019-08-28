require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var clear = require("clear");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var liriCmd = process.argv[2];
var qryItem = process.argv[3];

runLIRI(liriCmd);

function runLIRI(cmd){
    switch(cmd){
        case "concert-this":
            var bandsInTownURL = "https://rest.bandsintown.com/artists/" + qryItem + "/events?app_id=codingbootcamp";
            clear();
            findStuff(bandsInTownURL, "event");
            break;

        case "spotify-this-song":
            spotArtist();
            break;

        case "movie-this":
            if(qryItem === "" || !qryItem)
                qryItem = "Mr. Nobody"
            var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + qryItem;
            clear();
            findStuff(movieURL, "movie");
            break;
            
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function(error, data) {
                if (error) {
                    return console.log(error);
                }

                var dataArr = data.split(",");
                qryItem = dataArr[1];
                runLIRI(dataArr[0]);
            });
            
            break;
        default:
            console.log("Error: LIRI does not understand your command");
    }
}

function findStuff(URL, type){
    

        axios.get(URL).then(resp => {
            printStuff(resp, type);
        });
}

function printStuff(resp, type){
             
                if(type === "event"){
                    clear();
                    var text = "\n***|UPCOMING EVENTS: " + qryItem + "|***\n";
                    // console.log(resp.data[0])
                    resp.data.forEach(item => {        
                        text += "\nVenue: " + item.venue.name +
                                    "\nLocation: " + item.venue.city + ", " + item.venue.region + " " + item.venue.country +
                                    "\nDate: " + moment(item.datetime).format("MM/DD/YYYY") +
                                    "\n";
                        
                    });
                    console.log(text);
                    appendLog(text);
                }

                if(type === "movie"){
                    clear();
                    var rtScore;
                    var text = "\n***|MOVIE INFO: " + qryItem + "|***";
                    for(var rating in resp.data.Ratings){
                        if(resp.data.Ratings[rating].Source === "Rotten Tomatoes"){
                            rtScore =  resp.data.Ratings[rating].Value;
                            break;
                        }
                        else    
                            rtScore =  "No Score Available"
                    }
                    text +=  "\n Title: " + resp.data.Title +
                                "\n Year: " + resp.data.Year +
                                "\n IMDB Rating: " + resp.data.imdbRating +
                                "\n Rotten Tomato Rating: " + rtScore +
                                "\n Country: " + resp.data.Country +
                                "\n Plot: " + resp.data.Plot +
                                "\n Actors: " + resp.data.Actors +
                                "\n\n";
                    console.log(text);
                    appendLog(text);
                }

                if(type === "spot"){
                    clear();
                    var text = "\n***|TOP 5 RESULTS FOR " + qryItem + "|***\n";
                    for(var i = 0; i < 5; ++i){
                        var artists = "";
                        resp.tracks.items[i].album.artists.forEach(artist => artists += artist.name)
                        //console.log(data.tracks.items[i].album)
                        text += "\nArtist(s): " + artists +
                                    "\nTrack Name: " + resp.tracks.items[i].name +
                                    "\nPreview Link: " + resp.tracks.items[i].preview_url +
                                    "\nAlbum: " + resp.tracks.items[i].album.name + 
                                    "\n";
                        
                    }
                    console.log(text);
                    appendLog(text);
                }
}

async function appendLog(text){
    fs.appendFile("log.txt", text, function(err) {
        if (err) {
          console.log(err);
        }
      });
}

function spotArtist(){
    spotify.search({
        type: "track",
        query: qryItem,
        limit: 5

    }, (err, data) => {
        if(err)
            return console.log("Error: " + err);
        
        clear();
        printStuff(data, "spot")
    });
}