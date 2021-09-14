import Track from "./Track.js"
import songs from "./songs.js";

const tracksContainer = document.querySelector(".tracks");

const addTrackElement = song => {
  const track = new Track(song, "#track-template");
  tracksContainer.append(track.generateSong());
}

songs.forEach(song => addTrackElement(song));