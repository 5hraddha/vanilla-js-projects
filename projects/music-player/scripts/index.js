import Track from "./Track.js"
import songs from "./songs.js";

const tracksContainer = document.querySelector(".tracks");
const playAllBtn      = document.querySelector(".music-player__play-all");
const playAllPopup    = document.querySelector(".popup");
const closePopupBtn   = playAllPopup.querySelector(".popup__close-btn");


const addTrackElement = song => {
  const track = new Track(song, "#track-template");
  tracksContainer.append(track.generateSong());
}

songs.forEach(song => addTrackElement(song));

const handlePlayAll = () => {
  playAllPopup.classList.add("popup_opened");
}

playAllBtn.addEventListener("click", handlePlayAll);

const handleClosePopup = () => {
  playAllPopup.classList.remove("popup_opened");
}

closePopupBtn.addEventListener("click", handleClosePopup);