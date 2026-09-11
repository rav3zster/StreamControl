# StreamControl — Premium Esports Broadcast Overlay Pack

An ultra-premium, modular broadcast graphics & overlay control suite built for competitive esports streams, tournament broadcasts, and content creators. Designed with real-time OBS browser source synchronization, customizable layouts, responsive widgets, and brand personalization.

---

## ⚡ Key Features

- **Freely Moveable & Resizable Widgets**: Drag and resize any overlay widget (scoreboard, VTuber/webcam, sponsor reels, social rotators, goal bars, chat) with 1:1 cursor glue across any canvas scaling.
- **Magnetic Snapping System**: Built-in 8px grid snapping, horizontal/vertical center guidelines, and parallel alignment against screen bounds and neighbouring elements.
- **4-Tier Layer Stacking (Z-Index)**: Choose layer hierarchy for any widget with a single click:
  - `Extreme Top` (z-index: 50)
  - `Top` (z-index: 35)
  - `Bottom` (z-index: 15)
  - `Extreme Bottom` (z-index: 5)
- **Local Brand / Logo Upload**: Upload custom high-resolution team, sponsor, or personal logos directly from your device with live client-side scaling and instant SVG/PNG transparency rendering.
- **Dynamic Layout Collapse**: Collapses empty side rails (e.g. in *Live Gameplay*) when chat/goals are disabled, letting gameplay expand to true full-width 1080p while cameras float freely.
- **Real-Time Cross-Window OBS Sync**: Instant multi-window synchronization via `BroadcastChannel` and `localStorage` — adjust settings or move widgets in the control studio while your OBS browser source updates seamlessly with zero stream latency.
- **Clean Outside-Canvas Edit Controls**: Edit toolbar and status badges remain cleanly outside the 16:9 broadcast stage, keeping program output pristine.
- **Multiple Curated Esports Scenes**:
  - Starting Soon
  - Live Gameplay (Full-width / Split camera)
  - Intermission & Analyst Desk
  - Bracket & Tournament Matchups
  - Stream Ending

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🎥 OBS Studio Integration

1. In OBS Studio, add a new **Browser Source**.
2. Set the URL to your deployed URL or local server (e.g., `http://localhost:5173`).
3. Set Width to `1920` and Height to `1080`.
4. Open the control panel in your browser, arrange your widgets, toggle scenes, or upload your logo — your OBS output will update in real time!