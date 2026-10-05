# Media pipeline - hero video and photo (Phase 12)

The site ships with **no video and no portrait**. Add your own files and the hero picks them up on the next build. Remove the files and the hero reverts. Nothing is generated, upscaled or retouched: your footage and photo are only scaled and compressed, so your face is never altered.

## Photo
Put your own photo at `public/images/abhishek.webp` (or `.jpg`, `.jpeg`, `.png`). The hero shows it at 4:5 (`next/image`, served as WebP; AVIF is deliberately disabled - see SECURITY_NOTES.md, GHSA-2xp9-vwfh-vxw4). `grayscale contrast-110` in `components/Hero.tsx` is display styling only; delete it for full colour. Use a sharp original at least ~1000 px wide. Image-optimisation quotas on Vercel Hobby were not checked here - verify before using many large images.

## Video (background loop)
1. Install ffmpeg (it includes ffprobe) and make sure both are on your PATH.
2. Trim your clip to a **6-12 second loop**. A 4K original is fine as the *input*.
3. Run: `npm run media:optimize -- path/to/original.mp4` (add `--max-height 720` for smaller files).
4. Rebuild / redeploy. To remove the video, delete `public/videos/hero/`.

Output in `public/videos/hero/`: 1080p, 720p and 480p H.264 MP4; 1080p and 720p VP9 WebM; a poster (`hero-poster.webp`); and `manifest.json`. Audio is stripped. The script warns if a 1080p file passes 4 MB or the clip is longer than 15 s.

**Why not ship 4K?** A looping background behind text gains nothing visible from 2160p but costs ~4x the bytes. 1080p is the default cap; `--max-height 2160` exists if you really want it, but the player is only designed to choose among whatever the manifest lists.

### What visitors get (policy in `lib/media-policy.ts`, unit-tested)
| Situation | Behaviour |
|---|---|
| Server HTML | `<video poster=...>` with **no `src`**: first paint never waits for video |
| Phone (< 768 px wide) | poster only, **no video downloaded** |
| `prefers-reduced-motion`, Save-Data, 2g/3g | poster only |
| Desktop/tablet, good connection | after the browser is idle, the smallest file that still covers the screen (width x pixel ratio, max 2x); at equal width the smaller file by bytes wins; WebM or MP4 depending on browser support |
| Scrolled out of view / tab hidden | paused (saves CPU and battery) |
| Always | visible Pause/Play button (WCAG 2.2.2), keyboard accessible, `aria-pressed`; video is decorative (`aria-hidden`) and muted |

The video component is code-split: with no video the home bundle is unchanged (19.0 kB route JS, 125 kB first-load).

## Measured with a synthetic 4K test clip (a test pattern, NOT real footage - sandbox only, not in your zip)
- 39.3 MB 4K source, 4 s -> 1080p MP4 0.80 MB, 1080p WebM 1.10 MB, 720p MP4 0.30 MB, 720p WebM 0.28 MB, 480p MP4 0.12 MB, poster 43 KB. Encoding took about 63 s on a single CPU core. **A test pattern compresses far better than real footage; expect several times larger files and check the script's size warnings.** The VP9 setting (`-crf 34`) is not calibrated to match the H.264 setting (`-crf 24`); for this clip WebM came out larger, which is why selection is by actual file size, not by codec.
- Lighthouse mobile profile: only the poster (43 KB) was requested; no video. Desktop profile: poster + 1080p WebM (about 1 MB).
- Browser checks: desktop 1440 chose the 1080p file and played; 768 chose 720p; 375 and reduced-motion fetched no video; keyboard pause/resume worked; axe-core found 0 violations while the video played; the pause button sits inside the first screen at 1440x900, 1280x720 and 768x1024.
- **Cost:** with the test video, desktop Lighthouse performance read 91 versus 100 without it (lab, noisy sandbox). A hero video is a trade-off; the default is no video.

## Hosting limits to know about
Files in `public/` are served from Vercel's CDN, but Hobby plan bandwidth and file-size limits were not verified here. GitHub rejects files over 100 MB (check current docs); keep hero files to a few MB each. If you ever need large video, host it elsewhere and change the manifest URLs.

## Not done
No video lives in the repo (you have not provided clips). The two WhatsApp reference reels you uploaded were used only for design inspiration and are not used or redistributed. Captions/transcripts are not needed for a muted decorative loop; if you add a video with meaningful content or sound, it needs captions and an alternative.
