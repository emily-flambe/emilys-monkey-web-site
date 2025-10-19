// Cloudflare Workers environment bindings
export interface Env {
  // D1 Database binding
  DB: D1Database;

  // Add other bindings here as needed (KV, R2, etc.)
}

// Extend the global Env type for Cloudflare Workers
declare global {
  const DB: D1Database;
}
