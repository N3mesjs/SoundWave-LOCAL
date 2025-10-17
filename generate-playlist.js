const fs = require('node:fs/promises');
const path = require('path');

async function fetchSongs() {
    let songs = [];

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
        for (let image of filteredImages) {
            if (image.includes(path.parse(song).name)) {
                return {
                    songSrc: path.join('..', 'assets', 'songs', song),
                    thumbnailSrc: path.join('..', 'assets', 'images', image)
                }
            }
        }
    })
    songs.push(JSON.stringify(playlist));
    await fs.writeFile(path.join('src', 'songs.json'), songs);
}

module.exports = fetchSongs;