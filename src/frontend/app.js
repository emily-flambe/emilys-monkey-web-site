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
  scoreValue: document.getElementById('score-value'),
  scoreValueText: document.getElementById('score-value-text'),
  leaderboard: document.getElementById('leaderboard'),
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

async function getLeaderboard() {
  const res = await fetch(`${API_BASE}/leaderboard`);
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

  // Complete session and get score
  const result = await completeSession(sessionId);
  const score = result.agreement_score;

  elements.scoreValue.textContent = score;
  elements.scoreValueText.textContent = score;

  // Load leaderboard and face rankings
  await Promise.all([loadLeaderboard(), loadFaceRankings()]);
}

async function loadLeaderboard() {
  try {
    const data = await getLeaderboard();
    const entries = data.entries || [];

    if (entries.length === 0) {
      elements.leaderboard.innerHTML = '<div class="loading">No entries yet. You could be first!</div>';
      return;
    }

    let html = '';
    entries.forEach((entry, index) => {
      const isMe = entry.id === sessionId;
      html += `
        <div class="leaderboard-entry ${isMe ? 'highlight' : ''}">
          <span class="leaderboard-rank">#${index + 1}</span>
          <span class="leaderboard-id">${entry.id}${isMe ? ' (you)' : ''}</span>
          <span class="leaderboard-score">${entry.agreement_score}%</span>
        </div>
      `;
    });

    elements.leaderboard.innerHTML = html;
  } catch (err) {
    elements.leaderboard.innerHTML = '<div class="loading">Failed to load leaderboard</div>';
  }
}

async function loadFaceRankings() {
  try {
    const data = await getFaceStats();
    const faces = data.faces || [];

    if (faces.length === 0) {
      elements.faceRankings.innerHTML = '<div class="loading">No data yet</div>';
      return;
    }

    let html = '';
    faces.slice(0, 20).forEach((face, index) => {
      html += `
        <div class="face-rank-item">
          <img src="/images/${face.face_id}.png" alt="${face.face_id}">
          <div class="rank">#${index + 1}</div>
          <div class="pct">${face.niceness_pct}%</div>
        </div>
      `;
    });

    elements.faceRankings.innerHTML = html;
  } catch (err) {
    elements.faceRankings.innerHTML = '<div class="loading">Failed to load rankings</div>';
  }
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const tabId = btn.dataset.tab + '-tab';
    document.getElementById(tabId).classList.add('active');
  });
});

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
