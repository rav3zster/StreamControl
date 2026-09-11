import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


import fs from 'fs'
import type { Plugin } from 'vite'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Live state synchronization bridge between Chrome editor and OBS Studio CEF
function broadcastStatePlugin(): Plugin {
  const stateFile = path.resolve(__dirname, '.broadcast-state.json')
  let currentState: any = null
  try {
    if (fs.existsSync(stateFile)) {
      currentState = JSON.parse(fs.readFileSync(stateFile, 'utf-8'))
    }
  } catch {
    // ignore
  }

  const clients = new Set<any>()

  const handler = (req: any, res: any, next: any) => {
    const rawUrl = req.url || ''
    const parsed = new URL(rawUrl, 'http://localhost')

    if (parsed.pathname === '/api/state') {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

      if (req.method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
        return
      }

      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(currentState || {}))
        return
      }

      if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk: any) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            currentState = JSON.parse(body)
            fs.writeFileSync(stateFile, JSON.stringify(currentState, null, 2), 'utf-8')
            const msg = `data: ${JSON.stringify(currentState)}\n\n`
            for (const client of clients) {
              try {
                client.write(msg)
              } catch {
                clients.delete(client)
              }
            }
          } catch {
            // ignore
          }
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
        })
        return
      }
    }

    if (parsed.pathname === '/api/state-events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      })
      res.write(':\n\n')
      clients.add(res)

      if (currentState) {
        res.write(`data: ${JSON.stringify(currentState)}\n\n`)
      }

      req.on('close', () => {
        clients.delete(res)
      })
      return
    }

    next()
  }

  return {
    name: 'broadcast-state-bridge',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    broadcastStatePlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
