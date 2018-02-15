
//grabbing all the needed packages ==>
var fs = require("fs");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var Omdb = require("omdb");
var keys = require("./keys.js");
fs.readFile("./random.txt");



//___________________________________
//grabbing the variables i need from user
var spotify = new Spotify({
    id: '69218d7657b44d5c8a309ad8e1b30cab',
    secret: 'ccae76e4b78f4deebb1c70ea502f46aa'
});

var type = process.argv[2];
var name = '';
if (process.argv.length>3){
    for (var i=3;i<process.argv.length;i++){
        name = name + process.argv[i] + ' ';
    }

}
var accept_args = ['my-tweets','spotify-this-song','movie-this','do-what-it-says'];

//____________________________________

function spotify_call(name){
    params = name;
    spotify.search({ type: "track", query: params }, function(err, data) {
        if(!err) {
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                        console.log("Artist: " + songInfo[i].artists[0].name);
                        console.log("Song: " + songInfo[i].name);
                        console.log("Album: " + songInfo[i].album.name);
                        console.log("Preview Url: " + songInfo[i].preview_url);

                }
            }
        }   else {
            console.log(err);
            return;
        }
    });
}

function twitter_call(){
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
    });
    var twitterUsername = process.argv[3];
    if(!twitterUsername){
        twitterUsername = "for_the_api";
    }
    params = {screen_name: twitterUsername};
    client.get("statuses/user_timeline/", params, function(error, data, response){
        if (!error) {
            for(var i = 0; i < data.length; i++) {
                   console.log( "@" + data[i].user.screen_name + ": " + data[i].text);
                    console.log(data[i].created_at);
            }
        }  else {
            console.log("Error :"+ error);
        }
    });
}


function omdb_call(movie_name){
    Omdb.search(movie_name, function(err, movies) {
        if(err) {
            return console.error(err);
        }
        if(movie_name === null || movie_name ===undefined){
            movie_name = 'mr nobody';
        }

        if(movies.length < 1) {
            return console.log('No movies were found!');
        }

        movies.forEach(function(movie) {
            console.log('______________________');
            console.log(movie.title);
            console.log(movie.year);
            console.log(movie.country);
            console.log(movie.language);
            console.log(movie.actors);
            console.log('______________________')

        });
    });

}
function play_default_song(){
    console.log("hello!!!!");
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
            var default_function_input ='';
            var default_song = data.split(",");
            default_song = default_song[1];
            spotify_call(default_song);
        } else {
            console.log("Error occurred" + error);
        }
    });
}

//___________________________________
function main(){
    switch(type){
        case 'my-tweets':
            twitter_call();
            break;
        case'movie-this':
            omdb_call(name);
            break;
        case'spotify-this-song':
            spotify_call(name);
            break;
        case 'do-what-it-says':
            play_default_song();
            break;
        default:
            console.log("ERR: One or more arguments incorrect or undefined");
            break;
        }

}
main();