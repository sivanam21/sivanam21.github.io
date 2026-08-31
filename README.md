# Sivan Amram — Portfolio

Personal portfolio site. Static HTML/CSS/JS, no build step.

**Live:** https://sivanam21.github.io
**English:** https://sivanam21.github.io/?lang=en

## Design

Line-art aesthetic: hairline strokes, pastel washes, Frank Ruhl Libre display
type. The decorative curves are single continuous strokes generated as
Lissajous figures and damped waves; `script.js` measures each path and animates
its dash offset so the line appears to be drawn by hand.

## Structure

```
index.html    all content, both languages (data-he / data-en attributes)
              plus the inline one-line SVG artwork
styles.css    design tokens + layout
script.js     language toggle, line drawing, scroll reveal
assets/       project screenshots + CV
```

## Editing

- **Text:** every bilingual element carries `data-he` and `data-en`. Update both.
  The visible text in the HTML is the Hebrew default.
- **A new project:** copy an existing `<article class="case">` block.
  Alternate `case-alt` for the reversed layout.
- **CV:** replace `assets/Sivan-Amram-CV.pdf`, keep the filename.
- **Colours:** the pastel palette is the custom properties at the top of
  `styles.css`.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Push to `main`. GitHub Pages serves the repository root.
