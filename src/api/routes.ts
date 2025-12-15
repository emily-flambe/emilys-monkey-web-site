import { Hono } from 'hono';
import type { Env } from '../types';

const api = new Hono<{ Bindings: Env }>();

// Generate a random session ID
function generateSessionId(): string {
  return 'ses_' + crypto.randomUUID().slice(0, 8);
}

// Generate trial pairings (23 pairs from 46 faces, randomized)
function generateTrials(): { left: string; right: string }[] {
  const faces = Array.from({ length: 46 }, (_, i) =>
    `face_${String(i + 1).padStart(2, '0')}`
  );

  // Shuffle faces
  for (let i = faces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [faces[i], faces[j]] = [faces[j], faces[i]];
  }

  // Create 23 pairs
  const trials: { left: string; right: string }[] = [];
  for (let i = 0; i < 46; i += 2) {
    // Randomly assign left/right
    if (Math.random() < 0.5) {
      trials.push({ left: faces[i], right: faces[i + 1] });
    } else {
      trials.push({ left: faces[i + 1], right: faces[i] });
    }
  }

  return trials;
}

// POST /api/sessions - Create a new session
api.post('/sessions', async (c) => {
  const sessionId = generateSessionId();
  const trials = generateTrials();

  await c.env.DB.prepare(
    'INSERT INTO sessions (id) VALUES (?)'
  ).bind(sessionId).run();

  return c.json({
    session_id: sessionId,
    trials: trials,
    total_trials: trials.length
  });
});

// POST /api/responses - Record a trial response
api.post('/responses', async (c) => {
  const body = await c.req.json();
  const { session_id, trial_number, left_face, right_face, selected_face, response_time_ms } = body;

  if (!session_id || trial_number === undefined || !left_face || !right_face || !selected_face) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  // Insert trial record
  await c.env.DB.prepare(`
    INSERT INTO trials (session_id, trial_number, left_face, right_face, selected_face, response_time_ms)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(session_id, trial_number, left_face, right_face, selected_face, response_time_ms || null).run();

  // Update face stats for both faces
  const notSelected = selected_face === left_face ? right_face : left_face;

  await c.env.DB.batch([
    c.env.DB.prepare(`
      UPDATE face_stats
      SET times_shown = times_shown + 1, times_selected = times_selected + 1
      WHERE face_id = ?
    `).bind(selected_face),
    c.env.DB.prepare(`
      UPDATE face_stats
      SET times_shown = times_shown + 1
      WHERE face_id = ?
    `).bind(notSelected)
  ]);

  return c.json({ success: true });
});

// POST /api/sessions/:id/complete - Mark session complete and calculate score
api.post('/sessions/:id/complete', async (c) => {
  const sessionId = c.req.param('id');

  // Get all trials for this session
  const trials = await c.env.DB.prepare(`
    SELECT selected_face FROM trials WHERE session_id = ?
  `).bind(sessionId).all();

  // Get face stats to calculate agreement score
  const stats = await c.env.DB.prepare(`
    SELECT face_id, times_shown, times_selected FROM face_stats
  `).all();

  const statsMap = new Map(
    stats.results.map((s: any) => [s.face_id, s.times_selected / Math.max(s.times_shown, 1)])
  );

  // Calculate agreement score (how often user picked the more popular face)
  let agreements = 0;
  for (const trial of trials.results as any[]) {
    const popularity = statsMap.get(trial.selected_face) || 0.5;
    if (popularity >= 0.5) agreements++;
  }
  const agreementScore = trials.results.length > 0
    ? Math.round((agreements / trials.results.length) * 100)
    : 0;

  // Update session
  await c.env.DB.prepare(`
    UPDATE sessions SET completed_at = datetime('now'), agreement_score = ? WHERE id = ?
  `).bind(agreementScore, sessionId).run();

  return c.json({
    session_id: sessionId,
    agreement_score: agreementScore,
    completed: true
  });
});

// GET /api/sessions/:id - Get session results
api.get('/sessions/:id', async (c) => {
  const sessionId = c.req.param('id');

  const session = await c.env.DB.prepare(`
    SELECT * FROM sessions WHERE id = ?
  `).bind(sessionId).first();

  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }

  const trials = await c.env.DB.prepare(`
    SELECT * FROM trials WHERE session_id = ? ORDER BY trial_number
  `).bind(sessionId).all();

  return c.json({
    session,
    trials: trials.results
  });
});

// GET /api/stats - Get aggregate face statistics
api.get('/stats', async (c) => {
  const stats = await c.env.DB.prepare(`
    SELECT
      face_id,
      times_shown,
      times_selected,
      CASE WHEN times_shown > 0
        THEN ROUND(CAST(times_selected AS REAL) / times_shown * 100, 1)
        ELSE 0
      END as niceness_pct
    FROM face_stats
    ORDER BY niceness_pct DESC
  `).all();

  return c.json({
    faces: stats.results,
    total_sessions: (await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM sessions WHERE completed_at IS NOT NULL'
    ).first() as any)?.count || 0
  });
});

// GET /api/leaderboard - Get leaderboard of sessions by agreement score
api.get('/leaderboard', async (c) => {
  const leaderboard = await c.env.DB.prepare(`
    SELECT
      id,
      agreement_score,
      completed_at
    FROM sessions
    WHERE completed_at IS NOT NULL AND agreement_score IS NOT NULL
    ORDER BY agreement_score DESC
    LIMIT 100
  `).all();

  return c.json({
    entries: leaderboard.results
  });
});

export default api;
