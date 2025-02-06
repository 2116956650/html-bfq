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
const loadingSpinner = document.getElementById('loadingSpinner');
const volumePercentage = document.querySelector('.volume-percentage');

let controlsTimeout;
let volumeHideTimeout;

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
    showVolumePercentage(e.target.value);
});

muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    updateVolumeIcon();
    showVolumePercentage(video.muted ? 0 : video.volume);
    resetControlsTimer();
});

// 显示音量百分比
function showVolumePercentage(value) {
    const percentage = Math.round(value * 100);
    volumePercentage.textContent = `${percentage}%`;
    volumePercentage.style.opacity = '1';
    clearTimeout(volumeHideTimeout);
    volumeHideTimeout = setTimeout(() => {
        volumePercentage.style.opacity = '0';
    }, 1000);
}

// 全屏控制
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        video.parentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
    resetControlsTimer();
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
video.addEventListener('waiting', () => {
    loadingSpinner.style.opacity = '1';
});
video.addEventListener('playing', () => {
    loadingSpinner.style.opacity = '0';
});

// 初始化计时器
resetControlsTimer();
