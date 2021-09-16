class Track {
  constructor(song, trackSelector) {
    this._songTitle     = song.title;
    this._songArtist    = song.artist;
    this._songUrl       = song.url;
    this._trackSelector = trackSelector;
  }

  _getTemplate() {
    this._trackElement = document
      .querySelector(this._trackSelector)
      .content
      .querySelector(".track")
      .cloneNode(true);
  }

  _getTrackComponents() {
    this._trackTitle            = this._trackElement.querySelector(".track__title");
    this._trackArtist           = this._trackElement.querySelector(".track__artist");
    this._trackTotalDuration    = this._trackElement.querySelector(".song__duration-total");
    this._trackLapsedDuration   = this._trackElement.querySelector(".song__duration-lapsed");
    this._trackPlayBtn          = this._trackElement.querySelector(".track__play");
    this._trackPlayBtnImage     = this._trackElement.querySelector(".track__play-img");
    this._trackAudioElement     = this._trackElement.querySelector(".song__audio");
    this._trackSliderContainer  = this._trackElement.querySelector(".song__slider-container");
    this._trackSliderElement    = this._trackElement.querySelector(".song__slider");
  }

  _removePlayFromAllSongs() {
    document.querySelectorAll(".js-play").forEach(trackPlayBtn => {
      if(trackPlayBtn.classList.contains("js-play")){
        trackPlayBtn.classList.remove("js-play");
        trackPlayBtn.querySelector(".track__play-img").src = "./images/play.svg";
        const trackAudio = trackPlayBtn.closest(".track__controllers").querySelector(".song__audio");
        trackAudio.pause();
        trackAudio.currentTime = 0;
      }
    });
  }

  _convertSecToMin(secs) {
    return (secs / 60 ).toFixed(2);
  }

  _playSong() {
    this._removePlayFromAllSongs();
    this._trackPlayBtn.classList.add("js-play");
    this._trackPlayBtnImage.src = "./images/pause.svg";
    this._trackAudioElement.play();
  }

  _pauseSong() {
    this._trackPlayBtn.classList.remove("js-play");
    this._trackPlayBtnImage.src = "./images/play.svg";
    this._trackAudioElement.pause();
  }

  _handleLoadedAudioMetadata(e) {
    this._trackDurationInSecs = e.target.duration;
    this._trackTotalDuration.textContent = this._convertSecToMin(this._trackDurationInSecs);
  }

  _handlePlayButton() {
    const isSongPlaying = this._trackPlayBtn.classList.contains("js-play");
    (isSongPlaying) ? this._pauseSong() : this._playSong();
  }

  _handleUpdateProgress(e) {
    const { currentTime }                   = e.target;
    this._trackLapsedDuration.textContent   = this._convertSecToMin(currentTime);
    const progressPrecent                   = ( currentTime / this._trackDurationInSecs ) * 100;
    this._trackSliderElement.style.width    = `${progressPrecent}%`;
  }

  _handleAudioEnded(e) {
    e.target.currentTime = 0;
    this._pauseSong();
  }

  _handleSetProgress(e) {
    const widthSliderContainer  = e.target.clientWidth;
    const clickX                = e.offsetX;
    this._trackAudioElement.currentTime = parseFloat(( clickX / widthSliderContainer ) * this._trackDurationInSecs);
  }

  _setEventListeners() {
    // this._trackAudioElement.addEventListener("onloadedmetadata", (e) => this._handleLoadedAudioMetadata(e));
    this._trackAudioElement.onloadedmetadata = (e) => this._handleLoadedAudioMetadata(e);
    this._trackPlayBtn.addEventListener("click", () => this._handlePlayButton());
    this._trackAudioElement.addEventListener("timeupdate", (e) => this._handleUpdateProgress(e));
    this._trackAudioElement.addEventListener("ended", (e) => this._handleAudioEnded(e));
    this._trackSliderContainer.addEventListener("click", (e) => this._handleSetProgress(e));
  }

  generateSong() {
    this._getTemplate();
    this._getTrackComponents();
    this._setEventListeners();

    this._trackTitle.textContent          = this._songTitle;
    this._trackArtist.textContent         = this._songArtist;
    this._trackAudioElement.src           = this._songUrl;

    return this._trackElement;
  }
}

export default Track;