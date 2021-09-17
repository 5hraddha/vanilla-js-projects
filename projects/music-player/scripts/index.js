import Track from "./Track.js"
import songs from "./songs.js";

// General Elements
const playAllBtn              = document.querySelector(".music-player__play-all");

// Elements from Individual Song Tracks
const tracksContainer         = document.querySelector(".tracks");

// Elements from Play All Popup
const playAllPopup                      = document.querySelector(".popup");
const closePopupBtn                     = playAllPopup.querySelector(".popup__close-btn");
const popupMusicPlayerContainer         = playAllPopup.querySelector(".music-player-all");
const popupPlayBtn                      = popupMusicPlayerContainer.querySelector(".music-player-all__button-play");
const popupPreviousBtn                  = popupMusicPlayerContainer.querySelector(".music-player-all__button-previous");
const popupNextBtn                      = popupMusicPlayerContainer.querySelector(".music-player-all__button-next");
const popupAudioElement                 = popupMusicPlayerContainer.querySelector(".song__audio");
const popupSliderContainer              = popupMusicPlayerContainer.querySelector(".song__slider-container");
const popupSliderElement                = popupSliderContainer.querySelector(".song__slider");
const popupSongLapsedDuration           = popupMusicPlayerContainer.querySelector(".song__duration-lapsed");
const popupSongTotalDuration            = popupMusicPlayerContainer.querySelector(".song__duration-total");
const popupSongTitle                    = popupMusicPlayerContainer.querySelector(".music-player-all__title");
const popupSongArtist                   = popupMusicPlayerContainer.querySelector(".music-player-all__artist");

// Current song index
let currentSongIndex = 0;

// Song cover's overlay gradient
const songCoverOverlay = `linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0% 100%)`;

// Load song after popup is opened
const loadSong = song => {
  popupSongTitle.textContent                      = song.title;
  popupSongArtist.textContent                     = song.artist;
  popupMusicPlayerContainer.style.backgroundImage = `${songCoverOverlay}, url(${song.cover})`;
  popupAudioElement.src                           = song.url;
}

// Convert seconds to minutes
const convertSecToMin = (secs) => {
  return (secs / 60 ).toFixed(2);
}

// Play a song
const playSong = (playBtn, audioElement) => {
  playBtn.classList.add("js-play");
  playBtn.style.backgroundImage = `url(./images/pause.svg)`;
  audioElement.play();
}

// Pause a song
const pauseSong = (playBtn, audioElement)=> {
  playBtn.classList.remove("js-play");
  playBtn.style.backgroundImage = `url(./images/play.svg)`;
  audioElement.pause();
}

// Get song's total duration after the it's metadata is loaded
const handleLoadedAudioMetadata = (e, songTotalDurationElement) => {
  const songDurationInSecs              = e.target.duration;
  songTotalDurationElement.textContent  = convertSecToMin(songDurationInSecs);
}

// Close the popup
const handleClosePopup = () => {
  playAllPopup.classList.remove("popup_opened");
  pauseSong(popupPlayBtn, popupAudioElement);
  currentSongIndex = 0;
}

// Open the popup when play all button is clicked
const handlePlayAll = () => {
  playAllPopup.classList.add("popup_opened");
  loadSong(songs[currentSongIndex]);
  popupSliderElement.style.width = `0%`;
}

// Play or pause the song whenever the play button is clicked
const handlePlayButton = (playBtn, audioElement) => {
  const isSongPlaying = playBtn.classList.contains("js-play");
  (isSongPlaying) ? pauseSong(playBtn, audioElement) : playSong(playBtn, audioElement);
}

// Go to the previous song whenever the previous button is clicked
const handlePreviousBtn = () => {
  currentSongIndex--;
  if (currentSongIndex < 0){
    currentSongIndex = songs.length - 1;
  }
  loadSong(songs[currentSongIndex]);
  playSong(popupPlayBtn, popupAudioElement);
}

// Go to the next song whenever the previous button is clicked
const handleNextBtn = () => {
  currentSongIndex++;
  if (currentSongIndex == songs.length){
    currentSongIndex = 0;
  }
  loadSong(songs[currentSongIndex]);
  playSong(popupPlayBtn, popupAudioElement);
}

// Update the width of the slider element when the song is playing
const handleUpdateProgress = (e, songLapsedDurationElement, sliderElement) => {
  const { currentTime, duration }         = e.target;
  songLapsedDurationElement.textContent   = convertSecToMin(currentTime);
  const progressPrecent                   = ( currentTime / duration ) * 100;
  sliderElement.style.width               = `${progressPrecent}%`;
}

// Set the width of the slider element when the user jump to a certain time
const handleSetProgress = (e, audioElement) => {
  const widthSliderContainer  = e.target.clientWidth;
  const clickX                = e.offsetX;
  audioElement.currentTime    = parseFloat(( clickX / widthSliderContainer ) * audioElement.duration);
}

// Play the next song when the current song has ended
const handleCurrentSongEnded = () => {
  handleNextBtn();
}

const addTrackElement = song => {
  const track = new Track(song, "#track-template");
  tracksContainer.append(track.generateSong());
}

// Load all the songs when the page loads
songs.forEach(song => addTrackElement(song));

// Add Event Listeners
playAllBtn.addEventListener("click", handlePlayAll);
closePopupBtn.addEventListener("click", handleClosePopup);
popupPlayBtn.addEventListener("click", () => handlePlayButton(popupPlayBtn, popupAudioElement));
popupPreviousBtn.addEventListener("click", handlePreviousBtn);
popupNextBtn.addEventListener("click", handleNextBtn);
popupAudioElement.addEventListener("timeupdate", (e) => {
  handleUpdateProgress(e, popupSongLapsedDuration, popupSliderElement)
});
popupSliderContainer.addEventListener("click", (e) => {
  handleSetProgress(e, popupAudioElement);
});
popupAudioElement.addEventListener("ended", handleCurrentSongEnded);

popupAudioElement.onloadedmetadata = e => handleLoadedAudioMetadata(e, popupSongTotalDuration);