const fs = require('node:fs/promises');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));
//app.use(express.static(path.join(__dirname, '..', 'frontend', 'src')));

async function fetchSongs() {
    const songsFilePath = path.join(__dirname, 'assets', 'songs');
    const imagesFilePath = path.join(__dirname, 'assets', 'images');
    const filesSongs = await fs.readdir(songsFilePath);
    const filesImages = await fs.readdir(imagesFilePath);

    let filteredImages = filesImages.filter(file => {
        return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    });
    let filteredSongs = filesSongs.filter(file => {
        return file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg')
    });

    let playlist = filteredSongs.map(song => {
        const songName = path.parse(song).name;
        const matchingImage = filteredImages.find(image => image.includes(songName));

        if (matchingImage) {
            return {
                songSrc: `/assets/songs/${song}`,
                thumbnailSrc: `/assets/images/${matchingImage}`,
                name: songName.split('-').join(' ')
            };
        } else {
            return {
                songSrc: `/assets/songs/${song}`,
                thumbnailSrc: '/assets/images/default.png',
                name: songName.split('-').join(' ')
            };
        }
    });

    return playlist;
}

app.get('/api/songs', async (req, res) => {
    const songs = await fetchSongs();
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.json(songs);
    console.log('Served song list');
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    const songs = await fetchSongs();
    console.log(songs);
})

async function fetchData() {
    const response = await fetch('https://api-v2.soundcloud.com/search/tracks?q=club-bizarre&limit=3&client_id=zLORp7RRF8FR1UQK70cZBPDZ84u6FP2D');
    const data = await response.json();
    console.log(data.collection[0].media.transcodings[0]);
  }
  fetchData();