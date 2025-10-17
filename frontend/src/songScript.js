let currentSongIndex = 0; // Indice della canzone attualmente selezionata
let isPlaying = false;
let songs = [];

const audioPlayer = document.getElementById('audio-player');
const source = audioPlayer.querySelector('source');
const thumbnail = document.getElementById('thumbnail');
const songName = document.getElementById('songName');

const pauseIcon = document.getElementById('pause');
const startIcon = document.getElementById('start');

const playButton = document.getElementById('play');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');

const progressBarFill = document.getElementById('progress-fill');
const progressBar = document.getElementById('progress');

const volumeBar = document.getElementById('volume');

const currentTime = document.getElementById('current-time');
const totalTime = document.getElementById('duration');

const baseURL = "http://localhost:3000";

async function fetchSongsMap() {
    const response = await fetch('http://localhost:3000/api/songs', {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'}
    });
    if (!response.ok) {
        throw new Error('Could not fetch songs.json');
    }
    const songs = await response.json();
    return songs;
}

async function InizializeFirstSong(index) {
    songs = await fetchSongsMap();
    if (!songs || songs.length === 0) return;

    source.src = getSongURL(index);
    thumbnail.src = getThumbnailURL(index);
    songName.innerHTML = getName(currentSongIndex);
    audioPlayer.load();
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) {
        return '00:00';
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

const getSongURL = (index) => {
    const songData = songs[index];
    return new URL(songData.songSrc, baseURL).href;
}

const getThumbnailURL = (index) => {
    const songData = songs[index];
    return new URL(songData.thumbnailSrc, baseURL).href;
}

const getName = (index) => {
    const songData = songs[index];
    return songData.name;
}

InizializeFirstSong(currentSongIndex);

playButton.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        pauseIcon.classList.add('hidden');
        startIcon.classList.remove('hidden');
    } else {
        audioPlayer.play();
        pauseIcon.classList.remove('hidden');
        startIcon.classList.add('hidden');
    }
    isPlaying = !isPlaying;
});

nextButton.addEventListener('click', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0; // Torna alla prima canzone
    }

    thumbnail.src = getThumbnailURL(currentSongIndex);
    source.src = getSongURL(currentSongIndex);
    songName.innerHTML = getName(currentSongIndex);
    audioPlayer.load();
    audioPlayer.play();
});

previousButton.addEventListener('click', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = songs.length - 1; // Vai all'ultima canzone
    }

    thumbnail.src = getThumbnailURL(currentSongIndex);
    source.src = getSongURL(currentSongIndex);
    songName.innerHTML = getName(currentSongIndex);
    audioPlayer.load();
    audioPlayer.play();
});

audioPlayer.addEventListener('timeupdate', () => {
    progressBarFill.style.width = (audioPlayer.currentTime / audioPlayer.duration) * 100 + '%';

    currentTime.innerHTML = formatTime(audioPlayer.currentTime);
    totalTime.innerHTML = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0;
    }
    thumbnail.src = getThumbnailURL(currentSongIndex);
    source.src = getSongURL(currentSongIndex);
    songName.innerHTML = (path.parse(songs[index].songSrc).name).split('-').join(' ');
    songName.innerHTML = getName(currentSongIndex);
    audioPlayer.load();
    audioPlayer.play();
})

progressBar.addEventListener('click', (event) => {
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left; // x relativo al contenitore
    const percent = (x / rect.width) * 100;
    audioPlayer.currentTime = (percent * audioPlayer.duration) / 100;
    audioPlayer.volume = x / rect.width;
});

volumeBar.addEventListener('input', (event) => {
    audioPlayer.volume = event.target.value / 100;
});

audioPlayer.addEventListener('playing', () => {
    isPlaying = true;
    pauseIcon.classList.remove('hidden');
    startIcon.classList.add('hidden');
});
audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    pauseIcon.classList.add('hidden');
    startIcon.classList.remove('hidden');
});