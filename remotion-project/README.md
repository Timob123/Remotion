# Remotion Video Project

Programmatic video and motion graphics built with [Remotion](https://www.remotion.dev/). Includes Tapid product demos, AI SaaS reels, scene library, and configurable demo videos.

---

## Quick start

```bash
npm install
npm run dev
```

Remotion Studio opens at **http://localhost:3000**. Pick a composition from the dropdown and preview or render.

---

## Scripts

| Command | Description |
|--------|--------------|
| `npm run dev` | Start Remotion Studio (preview and edit) |
| `npm run build` | Bundle for production rendering |
| `npx remotion upgrade` | Upgrade Remotion packages |

---

## Main compositions

| Composition | Description |
|-------------|-------------|
| **DemoVideo** | Configurable multi-scene demo driven by `src/config/videoConfig.ts` (Hero, features, mockups, CTA, etc.) |
| **AISaaSReel** | AI SaaS product reel; full narrative with flash-cut scene transitions |
| **ImpactReel** | Impact reel composition |
| **TapidIntro** | Tapid brand intro (portrait, 15s) |
| **BookingReel** | Booking flow reel |
| **LaptopOpen** | Laptop open + screen wake + URL typing + load (standalone scene) |
| **PhoneNotification**, **PhoneTyping**, **PhoneSwipe**, etc. | Standalone phone UI scenes |
| **BoldCentre**, **CinematicText**, **WordSlam**, **FlashCut**, etc. | Standalone text/motion scenes |
| **Terminal**, **CodeEditor**, **AIStream**, **DashboardReveal**, etc. | Standalone product UI scenes |

Scene list and order for **DemoVideo** are defined in `src/config/videoConfig.ts`. Add or reorder entries there to change the demo.

---

## Project structure

```
src/
├── Root.tsx              # Composition registry (all videos listed here)
├── DemoVideo.tsx         # Multi-scene demo (uses videoConfig)
├── AISaaSReelVideo.tsx   # AI SaaS reel
├── config/
│   ├── videoConfig.ts    # Demo scene list, durations, props
│   └── theme.ts          # Shared theme (e.g. colours, fonts)
├── scenes/               # Reusable scene components
│   ├── HeroScene.tsx
│   ├── LaptopOpenScene.tsx
│   ├── Demo2Scene.tsx, Demo3Scene.tsx, Demo4Scene.tsx
│   └── ... (60+ scenes)
├── components/           # Shared UI (e.g. PhoneShell)
└── hooks/                # Animation helpers (e.g. useSceneAnimation)

assets/                   # Images, logos (e.g. Tapid1024.png)
branding.md              # Tapid brand guidelines for motion and copy
```

---

## Branding

**Tapid** visuals (colours, type, motion) follow `branding.md`:

- **Colours:** Tapid Green `#00A855`, Tapid Black `#0A0A0A`, Surface Grey `#F8FAFC`, etc.
- **Font:** Poppins (loaded via `@remotion/google-fonts` where used).
- **Motion:** Spring-style entrances, stagger, no linear easing for UI.
- **Copy:** “Rewards” not “loyalty”; product names as “Tapid”, “Tapid Rewards”, “Tapid Visits”.

Use `branding.md` when adding or editing Tapid scenes or reels.

---

## Rendering

**From Remotion Studio:** Choose composition → **Render** in the right panel (format, codec, output path).

**CLI example:**

```bash
npx remotion render src/Root.tsx AISaaSReel out/AISaaSReel.mp4
```

Swap `AISaaSReel` for any composition ID from the dropdown (e.g. `DemoVideo`, `TapidIntro`, `LaptopOpen`).

---

## Optional: GitHub Stargazer

The repo includes a **main** (Stargazer) composition that fetches GitHub stargazers and builds a short video. To use it:

1. Create a [GitHub personal access token](https://github.com/settings/personal-access-tokens/new).
2. Add a `.env` in the project root: `REMOTION_GITHUB_TOKEN=your_token`.
3. In Studio, select the **main** composition, set repo (e.g. org/name) in the right panel, then preview or render.

---

## License

Project code: **MIT**.  
[Remotion](https://www.remotion.dev/) is subject to its own license terms for commercial use.
