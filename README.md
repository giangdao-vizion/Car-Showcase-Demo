# Atelier 458 — 3D Car Showcase

Interactive WebGL car configurator inspired by production showroom experiences such as [Koenigsegg Jesko × Loop Studio](https://loop-studio.io/jesko#live-configurator).

**Stack:** Three.js + vanilla HTML/CSS/JS (no build) · GitHub Pages ready.

## Features

- Dark **studio / gallery** showroom with reflective floor
- **Exterior paint** palette (PBR clearcoat metallic)
- Details / rim, **brake caliper**, glass tint, leather colors
- **Body Parts** menu with automotive terms (headlamp, grille, alloy wheel…) — camera focuses the selected component
- Camera presets: Hero, Front, Profile, Rear, Top, Interior
- Headlamps on/off, idle wheel spin
- Mobile drawers for Configure / Inspect

## Run locally

```bash
python3 -m http.server 8080
# open http://127.0.0.1:8080/
```

Do not open `index.html` via `file://` — GLTF/Draco need HTTP.

## Project layout

```
index.html
css/showcase.css
js/          main, showroom, car, camera-tour, parts, ui
assets/      ferrari.glb + AO shadow
vendor/draco Draco WASM decoder
docs/        research & plan
```

## Credits

- Ferrari 458 Italia model from the [three.js materials car example](https://threejs.org/examples/webgl_materials_car.html) (vicent091036)
- [three.js](https://threejs.org/) · [camera-controls](https://github.com/yomotsu/camera-controls)
- UX reference: [Loop Studio Jesko configurator](https://loop-studio.io/jesko)

## Docs

→ [docs/RESEARCH-AND-PLAN.md](docs/RESEARCH-AND-PLAN.md)
