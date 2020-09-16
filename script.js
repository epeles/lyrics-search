const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const more = document.querySelector('#more');

const apiURL = 'https://api.lyrics.ovh';

//Get input from the form
form.addEventListener('submit', e => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if(!searchTerm) alert('Please type in a search term');
    else {
        form.reset();
        searchSongs(searchTerm);
    }
})

//Search by song or artist
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    showData(data);
}

//Show song and artist in DOM
function showData(data) {
    result.innerHTML = `
        ${data.data.map(song => `
            <div class="songs-list">
                <div class="img"><img class="album-cover" data-artist="${song.artist.name}" data-songtitle="${song.title}" src="${song.album.cover_medium}"></div>
                <div><strong>${song.artist.name}</strong></div>
                <div>${song.title}</div>
                <audio controls><source src="${song.preview}" type="audio/mpeg"></audio>               
            </div>`)
        .join('')}
        
    `;

    if (data.prev || data.next) {
        more.innerHTML = `
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;   
    } else {
        more.innerHTML = '';
    }
}

//Get prev and next page results
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data);
}

// Get lyrics button click
result.addEventListener('click', e => {
    const clickedEl = e.target;
  
    if (clickedEl.tagName === 'IMG') {
      const artist = clickedEl.getAttribute('data-artist');
      const songTitle = clickedEl.getAttribute('data-songtitle');
  
      getLyrics(artist, songTitle);
    }
});

// Get lyrics for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
  
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  
    result.innerHTML = `
        <h2 class="song-title-lyric"><strong>${artist}</strong> - ${songTitle}</h2>
        <span>${lyrics}</span>
    `;
  
    more.innerHTML = '';
}