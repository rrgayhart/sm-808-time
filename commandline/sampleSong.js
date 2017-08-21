var Song = require('../lib/Song.js');

var song = new Song();
song.title = 'Animal Rights';
song.bpm = 128;
song.addPattern({name: 'kick', pattern: 'x...x...'});
song.addPattern({name: 'snare', pattern: '....x...'});
song.addPattern({name: 'hihat', pattern: '..x...x.'});

module.exports = song;
