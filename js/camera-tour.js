import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { VIEW_PRESETS, findPart, findView } from './parts.js';

CameraControls.install({ THREE });

export function createCameraTour(camera, domElement) {
  const controls = new CameraControls(camera, domElement);
  controls.dollyToCursor = true;
  controls.infinityDolly = false;
  controls.minDistance = 1.2;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.smoothTime = 0.45;
  controls.draggingSmoothTime = 0.15;
  controls.setTarget(0, 0.55, 0, false);
  controls.setPosition(4.25, 1.4, -4.5, false);

  const clock = new THREE.Clock();

  async function goTo(position, target, enableTransition = true) {
    const [px, py, pz] = position;
    const [tx, ty, tz] = target;
    return controls.setLookAt(px, py, pz, tx, ty, tz, enableTransition);
  }

  async function focusPart(partId) {
    const part = findPart(partId);
    if (!part) return null;
    await goTo(part.position, part.target, true);
    return part;
  }

  async function focusView(viewId) {
    const view = findView(viewId);
    await goTo(view.position, view.target, true);
    return view;
  }

  async function reset() {
    return focusView('hero');
  }

  function update() {
    const delta = clock.getDelta();
    const moved = controls.update(delta);
    return { delta, moved };
  }

  return {
    controls,
    goTo,
    focusPart,
    focusView,
    reset,
    update,
    presets: VIEW_PRESETS,
  };
}
