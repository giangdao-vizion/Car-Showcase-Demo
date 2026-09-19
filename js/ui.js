import {
  PAINT_COLORS,
  DETAILS_COLORS,
  CALIPER_COLORS,
  GLASS_COLORS,
  LEATHER_COLORS,
  PART_GROUPS,
  VIEW_PRESETS,
} from './parts.js';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  return node;
}

function renderSwatches(container, colors, { onSelect, glass = false, initialId }) {
  container.replaceChildren();
  let activeId = initialId || colors[0].id;

  function select(id, silent = false) {
    activeId = id;
    for (const btn of container.querySelectorAll('.swatch')) {
      btn.classList.toggle('is-active', btn.dataset.id === id);
    }
    const color = colors.find((c) => c.id === id);
    if (color && !silent) onSelect(color);
  }

  for (const color of colors) {
    const btn = el('button', `swatch${glass ? ' swatch--glass' : ''}`, {
      type: 'button',
      title: color.label,
      'aria-label': color.label,
    });
    btn.dataset.id = color.id;
    btn.style.backgroundColor = color.hex;
    if (glass) {
      btn.style.backgroundImage = `linear-gradient(135deg, rgba(255,255,255,0.4), transparent 50%), linear-gradient(${color.hex}, ${color.hex})`;
    }
    btn.addEventListener('click', () => select(color.id));
    container.appendChild(btn);
  }

  select(activeId, true);
  const initial = colors.find((c) => c.id === activeId);
  if (initial) onSelect(initial);
  return { select };
}

export function bindUI({ car, cameraTour, showroom }) {
  const statusPart = document.getElementById('status-part');
  const paintBox = document.getElementById('paint-swatches');
  const detailsBox = document.getElementById('details-swatches');
  const caliperBox = document.getElementById('caliper-swatches');
  const glassBox = document.getElementById('glass-swatches');
  const leatherBox = document.getElementById('leather-swatches');
  const partsNav = document.getElementById('parts-nav');
  const viewPresets = document.getElementById('view-presets');
  const btnReset = document.getElementById('btn-reset-cam');
  const btnEnv = document.getElementById('btn-env');
  const toggleLights = document.getElementById('toggle-headlights');
  const toggleWheels = document.getElementById('toggle-wheels');

  renderSwatches(paintBox, PAINT_COLORS, {
    initialId: 'rosso',
    onSelect: (c) => car.setBodyColor(c.hex),
  });

  renderSwatches(detailsBox, DETAILS_COLORS, {
    initialId: 'silver',
    onSelect: (c) => car.setDetailsColor(c.hex),
  });

  renderSwatches(caliperBox, CALIPER_COLORS, {
    initialId: 'rosso',
    onSelect: (c) => car.setCaliperColor(c.hex),
  });

  renderSwatches(glassBox, GLASS_COLORS, {
    glass: true,
    initialId: 'clear',
    onSelect: (c) => car.setGlassColor(c.hex, c.transmission ?? 1),
  });

  renderSwatches(leatherBox, LEATHER_COLORS, {
    initialId: 'rosso',
    onSelect: (c) => car.setLeatherColor(c.hex),
  });

  // View chips
  viewPresets.replaceChildren();
  for (const view of VIEW_PRESETS) {
    const chip = el('button', 'chip', { type: 'button', text: view.label });
    chip.dataset.view = view.id;
    chip.addEventListener('click', async () => {
      setActiveView(view.id);
      setActivePart(null);
      car.clearHighlight();
      statusPart.textContent = `${view.label} view`;
      await cameraTour.focusView(view.id);
    });
    viewPresets.appendChild(chip);
  }

  function setActiveView(id) {
    for (const chip of viewPresets.querySelectorAll('.chip')) {
      chip.classList.toggle('is-active', chip.dataset.view === id);
    }
  }

  function setActivePart(id) {
    for (const btn of partsNav.querySelectorAll('.part-btn')) {
      btn.classList.toggle('is-active', btn.dataset.part === id);
    }
  }

  // Parts menu
  partsNav.replaceChildren();
  for (const group of PART_GROUPS) {
    const wrap = el('div', 'parts-group');
    wrap.appendChild(el('div', 'parts-group__label', { text: group.label }));
    const list = el('div', 'parts-group__list');
    for (const item of group.items) {
      const btn = el('button', 'part-btn', { type: 'button' });
      btn.dataset.part = item.id;
      btn.appendChild(el('span', 'part-btn__en', { text: item.en }));
      btn.appendChild(el('span', 'part-btn__vi', { text: item.vi }));
      btn.addEventListener('click', async () => {
        setActivePart(item.id);
        setActiveView(null);
        car.highlightMeshes(item.meshes);
        statusPart.textContent = item.en;
        await cameraTour.focusPart(item.id);
      });
      list.appendChild(btn);
    }
    wrap.appendChild(list);
    partsNav.appendChild(wrap);
  }

  btnReset.addEventListener('click', async () => {
    setActiveView('hero');
    setActivePart(null);
    car.clearHighlight();
    statusPart.textContent = 'Hero view';
    await cameraTour.reset();
  });

  btnEnv.addEventListener('click', () => {
    const label = showroom.toggleEnvironment();
    btnEnv.textContent = label;
    btnEnv.classList.toggle('is-active', label === 'Gallery');
  });

  toggleLights.addEventListener('change', () => {
    car.setHeadlights(toggleLights.checked);
  });

  toggleWheels.addEventListener('change', () => {
    car.setWheelSpin(toggleWheels.checked);
  });

  // Mobile drawers
  const panelConfig = document.getElementById('panel-config');
  const panelParts = document.getElementById('panel-parts');
  const tabConfig = document.getElementById('tab-config');
  const tabParts = document.getElementById('tab-parts');

  function closePanels() {
    panelConfig.classList.remove('is-open');
    panelParts.classList.remove('is-open');
  }

  tabConfig.addEventListener('click', () => {
    const open = !panelConfig.classList.contains('is-open');
    closePanels();
    if (open) panelConfig.classList.add('is-open');
  });

  tabParts.addEventListener('click', () => {
    const open = !panelParts.classList.contains('is-open');
    closePanels();
    if (open) panelParts.classList.add('is-open');
  });

  setActiveView('hero');
}
