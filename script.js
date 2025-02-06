const video = document.getElementById('videoPlayer');
const playerContainer = document.getElementById('playerContainer');
const mainControls = document.getElementById('mainControls');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeElement = document.getElementById('currentTime');
const durationElement = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const speedBtn = document.getElementById('speedBtn');
const volumePercentage = document.querySelector('.volume-percentage');

let controlsTimeout;

// 初始化显示控制栏
mainControls.classList.remove('hidden');

// 重置隐藏计时
function resetControlsTimer() {
    clearTimeout(controlsTimeout);
    mainControls.classList.remove('hidden');
    controlsTimeout = setTimeout(() => {
        mainControls.classList.add('hidden');
    }, 5000);
}

// 事件监听
playerContainer.addEventListener('mousemove', resetControlsTimer);
video.addEventListener('play', resetControlsTimer);
video.addEventListener('pause', resetControlsTimer);

// 播放控制
playPauseBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

function togglePlay() {
    video.paused ? video.play() : video.pause();
    resetControlsTimer();
}

// 进度条控制
video.addEventListener('timeupdate', updateProgress);

progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
    resetControlsTimer();
});

function updateProgress() {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeElement.textContent = formatTime(video.currentTime);
}

// 音量控制
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    video.muted = false;
    updateVolumeIcon();
    volumePercentage.textContent = `${Math.round(video.volume * 100)}%`;
});

muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    updateVolumeIcon();
    volumePercentage.textContent = video.muted ? '0%' : `${Math.round(video.volume * 100)}%`;
    resetControlsTimer();
});

// 全屏控制
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
    resetControlsTimer();
});

// 倍数播放控制
const speeds = [1, 1.5, 2];
let speedIndex = 0;
speedBtn.addEventListener('click', () => {
    speedIndex = (speedIndex + 1) % speeds.length;
    video.playbackRate = speeds[speedIndex];
    speedBtn.textContent = `${speeds[speedIndex]}x`;
});

// 工具函数
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updatePlayButton() {
    playPauseBtn.innerHTML = video.paused ?
        '<i class="fas fa-play"></i>' :
        '<i class="fas fa-pause"></i>';
}

function updateVolumeIcon() {
    const iconClass = video.muted || video.volume === 0 ?
        'fa-volume-mute' :
        video.volume > 0.5 ? 'fa-volume-up' : 'fa-volume-down';
    muteBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
    volumeSlider.value = video.muted ? 0 : video.volume;
}

// 事件监听
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('loadedmetadata', () => {
    durationElement.textContent = formatTime(video.duration);
});

// 初始化计时器
resetControlsTimer();