document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const songList = document.getElementById('songList');
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progress = document.getElementById('progress');
    const songTitle = document.getElementById('songTitle');
    const artistName = document.getElementById('artistName');
    const albumArt = document.getElementById('albumArt');

    let currentSongIndex = 0;
    let currentPlaylist = [];

    // Handle mood selection
    moodButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const mood = button.dataset.mood;
            try {
                const response = await fetch(`recommend.php?mood=${mood}`);
                const data = await response.json();
                
                if (data.status === 'success') {
                    displayRecommendations(data.recommendations);
                } else {
                    console.error('Error fetching recommendations:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Display song recommendations
    function displayRecommendations(songs) {
        songList.innerHTML = '';
        currentPlaylist = songs;

        songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            `;
            
            songCard.addEventListener('click', () => {
                playSong(index);
            });
            
            songList.appendChild(songCard);
        });
    }

    // Play a specific song
    function playSong(index) {
        if (currentPlaylist.length === 0) return;
        
        currentSongIndex = index;
        const song = currentPlaylist[currentSongIndex];
        
        audioPlayer.src = song.url;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.albumArt;
        
        audioPlayer.play();
        updatePlayButton();
    }

    // Update play/pause button
    function updatePlayButton() {
        const icon = playBtn.querySelector('i');
        if (audioPlayer.paused) {
            icon.className = 'fas fa-play';
        } else {
            icon.className = 'fas fa-pause';
        }
    }

    // Play/Pause button click handler
    playBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
        updatePlayButton();
    });

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        if (currentPlaylist.length === 0) return;
        
        currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        playSong(currentSongIndex);
    });

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        if (currentPlaylist.length === 0) return;
        
        currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
        playSong(currentSongIndex);
    });

    // Update progress bar
    audioPlayer.addEventListener('timeupdate', () => {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = `${percent}%`;
    });

    // Handle song end
    audioPlayer.addEventListener('ended', () => {
        nextBtn.click();
    });

    // Click on progress bar to seek
    document.querySelector('.progress-bar').addEventListener('click', (e) => {
        const percent = e.offsetX / e.target.offsetWidth;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });
}); 