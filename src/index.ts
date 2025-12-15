/**
 * Emily's Monkey Web Site - Modern Edition
 *
 * A recreation of the 2014 PhD research study on face-based trait judgments,
 * now as a fun public web app with a leaderboard.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import api from './api/routes';

const app = new Hono<{ Bindings: Env }>();

// CORS for public access
app.use('*', cors({
  origin: '*',
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Monkey API is running'
  });
});

// Mount API routes
app.route('/api', api);

// 404 handler for API routes
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
