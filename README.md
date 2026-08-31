# Sivan Amram — Portfolio

Personal portfolio site. Static HTML/CSS/JS, no build step.

**Live:** https://sivanam21.github.io

## Structure

```
index.html    all content, both languages (data-he / data-en attributes)
styles.css    design system + layout
script.js     language toggle, sticky nav, scroll reveal
assets/       project screenshots + CV
```

## Editing

- **Text:** every bilingual element carries `data-he` and `data-en`. Update both.
  The visible text in the HTML is the Hebrew default.
- **A new project:** copy an existing `<article class="case">` block.
  Alternate `case-alt` for the reversed layout.
- **CV:** replace `assets/Sivan-Amram-CV.pdf`, keep the filename.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Push to `main`. GitHub Pages serves the repository root.
