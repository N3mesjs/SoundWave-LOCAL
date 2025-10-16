const fs = require('node:fs/promises');
const path = require('path');

let songs = [];

const songsFilePath = path.join(__dirname, 'assets', 'songs');
const imagesFilePath = path.join(__dirname, 'assets', 'images');

async function fetchSongs() {
    const filesSongs = await fs.readdir(songsFilePath);
    const filesImages = await fs.readdir(imagesFilePath);

    let filteredImages = filesImages.filter(file => {
        return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    });
    let filteredSongs = filesSongs.filter(file => {
        return file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg')
    });

    let playlist = filteredSongs.map(song => {
        
    })

    songs.push({
        thumbnailSrc: path.join('..', 'assets', 'images', filteredImages[0]),
        songSrc: path.join('..', 'assets', 'songs', filteredSongs[0]),
    })
}

fetchSongs();
