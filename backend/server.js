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

    let imageFound = false;

    let playlist = filteredSongs.map(song => {
        for (let image of filteredImages) {
            if (image.includes(path.parse(song).name)) {
                imageFound = true;
                return {
                    songSrc: path.join('assets', 'songs', song),
                    thumbnailSrc: path.join('assets', 'images', image)
                }
            }
        };
        if (!imageFound) {
            return {
                songSrc: path.join('assets', 'songs', song),
                thumbnailSrc: path.join('assets', 'images', 'default.png')
            }
        }
        imageFound = false;
        })
    return JSON.stringify(playlist);
}

app.get('/api/songs', async (req, res) => {
    const songs = await fetchSongs();
    res.setHeader('Content-Type', 'application/json');
    res.status(200)
    res.send(songs);
    console.log('Served song list');
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    const songs = await fetchSongs();
    console.log(songs);
})