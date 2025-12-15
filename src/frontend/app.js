/**
 * Emily's Monkey Web Site - Frontend App
 */

const API_BASE = '/api';

// State
let sessionId = null;
let trials = [];
let currentTrialIndex = 0;
let trialStartTime = null;

// DOM Elements
const screens = {
  welcome: document.getElementById('welcome'),
  trial: document.getElementById('trial'),
  results: document.getElementById('results'),
};

const elements = {
  startBtn: document.getElementById('start-btn'),
  leftFace: document.getElementById('left-face'),
  rightFace: document.getElementById('right-face'),
  leftImg: document.getElementById('left-img'),
  rightImg: document.getElementById('right-img'),
  progressFill: document.getElementById('progress-fill'),
  progressText: document.getElementById('progress-text'),
  faceRankings: document.getElementById('face-rankings'),
  playAgainBtn: document.getElementById('play-again-btn'),
};

// Screen Management
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenName].classList.add('active');
}

// API Calls
async function createSession() {
  const res = await fetch(`${API_BASE}/sessions`, { method: 'POST' });
  return res.json();
}

async function recordResponse(trialData) {
  await fetch(`${API_BASE}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trialData),
  });
}

async function completeSession(sessionId) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, { method: 'POST' });
  return res.json();
}

async function getFaceStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

// Trial Logic
function updateProgress() {
  const progress = ((currentTrialIndex) / trials.length) * 100;
  elements.progressFill.style.width = `${progress}%`;
  elements.progressText.textContent = `${currentTrialIndex + 1} / ${trials.length}`;
}

function showTrial() {
  if (currentTrialIndex >= trials.length) {
    finishExperiment();
    return;
  }

  const trial = trials[currentTrialIndex];
  elements.leftImg.src = `/images/${trial.left}.png`;
  elements.rightImg.src = `/images/${trial.right}.png`;
  updateProgress();
  trialStartTime = Date.now();
}

async function handleFaceClick(side) {
  const trial = trials[currentTrialIndex];
  const selectedFace = side === 'left' ? trial.left : trial.right;
  const responseTime = Date.now() - trialStartTime;

  // Record response
  await recordResponse({
    session_id: sessionId,
    trial_number: currentTrialIndex + 1,
    left_face: trial.left,
    right_face: trial.right,
    selected_face: selectedFace,
    response_time_ms: responseTime,
  });

  currentTrialIndex++;
  showTrial();
}

// Results
async function finishExperiment() {
  showScreen('results');

  // Complete session
  await completeSession(sessionId);

  // Load face rankings
  await loadFaceRankings();
}

async function loadFaceRankings() {
  try {
    const data = await getFaceStats();
    const faces = data.faces || [];

    if (faces.length === 0 || faces.every(f => f.times_shown === 0)) {
      elements.faceRankings.innerHTML = '<div class="loading">No data yet - you\'re the first!</div>';
      return;
    }

    let html = '';
    faces.forEach((face, index) => {
      const label = index === 0 ? 'Nicest' : index === faces.length - 1 ? 'Meanest' : '';
      html += `
        <div class="face-rank-item">
          <span class="rank">#${index + 1}</span>
          <img src="/images/${face.face_id}.png" alt="Monkey ${index + 1}">
          <span class="pct">${face.niceness_pct}%</span>
          ${label ? `<span class="label">${label}</span>` : ''}
        </div>
      `;
    });

    elements.faceRankings.innerHTML = html;
  } catch (err) {
    elements.faceRankings.innerHTML = '<div class="loading">Failed to load rankings</div>';
  }
}

// Start Experiment
async function startExperiment() {
  try {
    const session = await createSession();
    sessionId = session.session_id;
    trials = session.trials;
    currentTrialIndex = 0;

    showScreen('trial');
    showTrial();
  } catch (err) {
    alert('Failed to start experiment. Please try again.');
    console.error(err);
  }
}

// Reset
function resetExperiment() {
  sessionId = null;
  trials = [];
  currentTrialIndex = 0;
  showScreen('welcome');
}

// Event Listeners
elements.startBtn.addEventListener('click', startExperiment);
elements.leftFace.addEventListener('click', () => handleFaceClick('left'));
elements.rightFace.addEventListener('click', () => handleFaceClick('right'));
elements.playAgainBtn.addEventListener('click', resetExperiment);

// Initialize
showScreen('welcome');
