import { Hono } from 'hono';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// HTML template with HTMX from CDN
const htmlTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script>
        // Basic HTMX-like functionality for demo
        document.addEventListener('DOMContentLoaded', function() {
            async function makeRequest(element, method = 'GET') {
                const url = element.getAttribute(method === 'POST' ? 'hx-post' : 'hx-get');
                const target = document.querySelector(element.getAttribute('hx-target'));
                const indicator = document.querySelector(element.getAttribute('hx-indicator'));
                
                if (indicator) indicator.classList.add('loading');
                
                try {
                    const response = await fetch(url, { method });
                    const html = await response.text();
                    if (target) target.innerHTML = html;
                } finally {
                    if (indicator) indicator.classList.remove('loading');
                }
            }
            
            document.querySelectorAll('[hx-get]').forEach(el => {
                el.addEventListener('click', () => makeRequest(el, 'GET'));
            });
            
            document.querySelectorAll('[hx-post]').forEach(el => {
                el.addEventListener('click', () => makeRequest(el, 'POST'));
            });
        });
    </script>
    <!-- HTMX CDN (for production use when CDN is accessible) -->
    <!-- <script src="https://unpkg.com/htmx.org@1.9.6"></script> -->
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .monkey-title {
            color: #8B4513;
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #45a049;
        }
        .response {
            margin-top: 20px;
            padding: 10px;
            background: #e7f3ff;
            border-radius: 4px;
            border-left: 4px solid #2196F3;
        }
        .htmx-indicator {
            display: none;
        }
        .htmx-indicator.loading {
            display: block;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="monkey-title">🐵 Emily's Monkey Web Site</h1>
        <p>Resurrected for the modern era with Cloudflare Workers, TypeScript, and HTMX!</p>
        ${content}
    </div>
</body>
</html>`;

// Root route - main page
app.get('/', (c) => {
  const content = `
    <div>
        <h2>Welcome to the Monkey Zone!</h2>
        <p>This legendary site is now powered by:</p>
        <ul>
            <li>🚀 Cloudflare Workers</li>
            <li>📝 TypeScript</li>
            <li>🔥 Hono Framework</li>
            <li>⚡ HTMX for interactivity</li>
            <li>💾 D1 Database (ready to use)</li>
        </ul>
        
        <div>
            <h3>Try some HTMX magic:</h3>
            <button 
                hx-get="/api/monkey-fact" 
                hx-target="#fact-container"
                hx-indicator="#loading">
                Get Random Monkey Fact
            </button>
            
            <button 
                hx-post="/api/counter" 
                hx-target="#counter-container"
                hx-indicator="#loading">
                Increment Counter
            </button>
            
            <div id="loading" class="htmx-indicator">Loading...</div>
            
            <div id="fact-container" class="response"></div>
            <div id="counter-container" class="response"></div>
        </div>
    </div>
  `;

  return c.html(htmlTemplate("Emily's Monkey Web Site", content));
});

// API endpoint for monkey facts
app.get('/api/monkey-fact', (c) => {
  const facts = [
    '🐵 Monkeys can live up to 50 years in captivity!',
    "🙊 A group of monkeys is called a 'troop' or 'barrel'",
    '🍌 Not all monkeys eat bananas - some prefer leaves and insects',
    '🐒 Monkeys have opposable thumbs, just like humans',
    '🌳 Some monkeys can swing from branch to branch at 35 mph',
    '🧠 Monkeys can learn to use simple tools',
    '👁️ Monkeys have excellent color vision',
    '🎯 Capuchin monkeys can be trained to help disabled individuals',
  ];

  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  return c.html(`<p><strong>Monkey Fact:</strong> ${randomFact}</p>`);
});

// API endpoint with D1 database example (counter)
let counter = 0; // In-memory counter for demo (in production, use D1)

app.post('/api/counter', async (c) => {
  counter++;

  // Example D1 database usage (commented out until database is set up)
  /*
  try {
    const { results } = await c.env.DB.prepare(
      "INSERT INTO counters (count, timestamp) VALUES (?, ?) RETURNING *"
    ).bind(counter, new Date().toISOString()).run();
    
    return c.html(`<p>Counter: ${counter} (saved to database)</p>`);
  } catch (error) {
    return c.html(`<p>Counter: ${counter} (database not configured yet)</p>`);
  }
  */

  return c.html(`<p>🔢 Counter: ${counter} (in-memory)</p>`);
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'emilys-monkey-web-site',
  });
});

// API info endpoint
app.get('/api', (c) => {
  return c.json({
    name: "Emily's Monkey Web Site API",
    version: '2.0.0',
    description: 'Resurrected for the modern era',
    endpoints: [
      'GET /',
      'GET /api/monkey-fact',
      'POST /api/counter',
      'GET /health',
      'GET /api',
    ],
  });
});

export default app;
