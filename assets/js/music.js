// Background audio playback and short interaction chimes.
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playChimeNote(freq, duration = 0.85) {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    // Ignore audio errors if blocked
  }
}

// Set the background track in the audio source element in index.html.
const BACKGROUND_MUSIC_START_SECONDS = 50;
let backgroundMusic = null;
let musicRequest = 0;

function syncMusicControls() {
  const playing = appState.musicPlaying;
  const eq = document.getElementById('musicEq');
  if (eq) {
    eq.classList.toggle('hidden', !playing);
    eq.classList.toggle('flex', playing);
  }
  const statusText = document.getElementById('musicStatusText');
  if (statusText) statusText.textContent = playing ? 'Đang phát' : 'Nhạc nền';
  const button = document.getElementById('btnToggleMusic');
  if (button) {
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền');
  }
}

async function toggleMusicBox() {
  const request = ++musicRequest;
  if (!backgroundMusic) {
    backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic) return;
    backgroundMusic.loop = true;
    backgroundMusic.preload = 'metadata';
    backgroundMusic.volume = 0.65;
    // Apply the initial offset after metadata is available; resuming keeps the current position.
    backgroundMusic.addEventListener('loadedmetadata', () => {
      backgroundMusic.currentTime = BACKGROUND_MUSIC_START_SECONDS;
    }, { once: true });
    if (backgroundMusic.readyState >= 1) {
      backgroundMusic.currentTime = BACKGROUND_MUSIC_START_SECONDS;
    }
  }
  if (appState.musicPlaying) {
    backgroundMusic.pause();
    appState.musicPlaying = false;
    syncMusicControls();
    showToast('Đã tạm dừng nhạc nền', '🔇');
    return;
  }
  appState.musicPlaying = true;
  syncMusicControls();
  try {
    await backgroundMusic.play();
    if (request !== musicRequest) return;
    showToast('Đã bật giai điệu hộp nhạc tình yêu 🎵', '🎶');
  } catch {
    if (request !== musicRequest) return;
    appState.musicPlaying = false;
    syncMusicControls();
    showToast('Chưa phát được nhạc, hãy thử bật lại nhé!', '🎵');
  }
}
