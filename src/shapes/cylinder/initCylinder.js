import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initCylinder({ mountEl, onExampleChange }) {
  /* Scene */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(5, 4, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  mountEl.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
  gridHelper.position.y = -2.5;
  scene.add(gridHelper);

  /* Params */
  let radius = 1.5;
  let height = 3;
  const segments = 72;

  /* Objects */
  let panels = [];
  let topCap = null;
  let bottomCap = null;
  let cylinderGroup = null;

  /* State */
  const state = {
    progress: 0,
    target: 0,
    animating: false,
    showInfo: false,
  };

  /* Labels (DOM) */
  const labels = [];

  function createInfoLabel(text) {
    const label = document.createElement("div");
    label.className = "info-label";
    label.textContent = text;
    label.style.display = "none";
    mountEl.appendChild(label);
    return label;
  }

  const lblR = createInfoLabel("Jari-jari (r)");
  const lblH = createInfoLabel("Tinggi (t)");
  const lblTop = createInfoLabel("Tutup");

  labels.push(
    { el: lblR, id: "r" },
    { el: lblH, id: "h" },
    { el: lblTop, id: "top" },
  );

  /* Example */
  function updateFormulas() {
    const rReal = radius * 10;
    const hReal = height * 10;

    const V = Math.PI * rReal * rReal * hReal;
    const A = 2 * Math.PI * rReal * (rReal + hReal);

    onExampleChange?.({
      lines: [
        `r = ${rReal.toFixed(0)} cm, h = ${hReal.toFixed(0)} cm`,
        `V = πr²h = ${V.toFixed(0)} cm³`,
        `A = 2πr(r + h) = ${A.toFixed(0)} cm²`,
      ],
    });
  }

  /* Easing */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* Build */
  function createGeometry() {
    // cleanup old
    if (cylinderGroup) {
      cylinderGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material) o.material.dispose?.();
      });
      scene.remove(cylinderGroup);
    }

    cylinderGroup = new THREE.Group();
    cylinderGroup.position.y = 0.5;
    scene.add(cylinderGroup);

    panels = [];

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const borderMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const faintLineMat = new THREE.LineBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.4,
    });

    const segmentWidth = (2 * Math.PI * radius) / segments;

    // selimut (panel)
    for (let i = 0; i < segments; i++) {
      const geom = new THREE.PlaneGeometry(segmentWidth, height);
      const mesh = new THREE.Mesh(geom, material.clone());

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom), faintLineMat.clone());
      mesh.add(edges);

      // border atas/bawah
      const borderGeom = new THREE.BufferGeometry();
      const hw = segmentWidth / 2;
      const hh = height / 2;

      const vertices = new Float32Array([
        -hw, hh, 0,  hw, hh, 0,
        -hw, -hh, 0, hw, -hh, 0,
      ]);

      borderGeom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const borderLines = new THREE.LineSegments(borderGeom, borderMat.clone());
      mesh.add(borderLines);

      const group = new THREE.Group();
      group.add(mesh);

      const centeredIndex = i - segments / 2;
      const angle = (centeredIndex * 2 * Math.PI) / segments;

      group.userData = { angle, index: centeredIndex, width: segmentWidth };

      panels.push(group);
      cylinderGroup.add(group);
    }

    // caps
    const circleGeom = new THREE.CircleGeometry(radius, 64);
    const circleBorder = new THREE.EdgesGeometry(circleGeom);

    topCap = new THREE.Group();
    const topMesh = new THREE.Mesh(circleGeom, material.clone());
    const topLine = new THREE.LineSegments(circleBorder, borderMat.clone());
    topCap.add(topMesh, topLine);
    topMesh.position.y = radius;
    topLine.position.y = radius;
    cylinderGroup.add(topCap);

    bottomCap = new THREE.Group();
    const botMesh = new THREE.Mesh(circleGeom, material.clone());
    const botLine = new THREE.LineSegments(circleBorder, borderMat.clone());
    bottomCap.add(botMesh, botLine);
    botMesh.position.y = -radius;
    botLine.position.y = -radius;
    cylinderGroup.add(bottomCap);

    updateMeshPositions(0);
    updateFormulas();
    updateLabelsPositions();
  }

  /* Layout (fold <-> unfold) */
  function updateMeshPositions(t) {
    panels.forEach((p) => {
      const angle = p.userData.angle;
      const flatX = p.userData.index * p.userData.width;

      const cylX = Math.sin(angle) * radius;
      const cylZ = Math.cos(angle) * radius;
      const cylRot = angle;

      p.position.x = THREE.MathUtils.lerp(cylX, flatX, t);
      p.position.z = THREE.MathUtils.lerp(cylZ, 0, t);
      p.rotation.y = THREE.MathUtils.lerp(cylRot, 0, t);
    });

    const centerPanel = panels.find((p) => p.userData.index === 0);
    if (centerPanel) {
      const hingeX = centerPanel.position.x;
      const hingeZ = centerPanel.position.z;

      topCap.position.set(hingeX, height / 2, hingeZ);
      topCap.rotation.y = centerPanel.rotation.y;
      topCap.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2, 0, t);

      bottomCap.position.set(hingeX, -height / 2, hingeZ);
      bottomCap.rotation.y = centerPanel.rotation.y;
      bottomCap.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, 0, t);
    }
  }

  /* Labels */
  function updateLabelsPositions() {
    if (!state.showInfo) {
      labels.forEach((l) => (l.el.style.display = "none"));
      return;
    }

    // info only when folded (opsional)
    if (state.progress > 0.5) {
      labels.forEach((l) => (l.el.style.display = "none"));
      return;
    }

    const isUnfolded = state.progress > 0.5;
    let posR, posH, posTop;

    if (isUnfolded) {
      // net mode
      posH = new THREE.Vector3(radius * Math.PI, 0, 0);
      posR = new THREE.Vector3(0, height / 2 + radius, 0);
      posTop = new THREE.Vector3(0, height / 2 + 2 * radius, 0);
    } else {
      // cylinder mode
      posH = new THREE.Vector3(radius, 0, 0);
      posR = new THREE.Vector3(radius / 2, height / 2, 0);
      posTop = new THREE.Vector3(0, height / 2, 0);
    }

    const positions = { r: posR, h: posH, top: posTop };
    const rect = mountEl.getBoundingClientRect();

    labels.forEach((l) => {
      const localPos = positions[l.id];
      if (!localPos) return;

      const worldPos = localPos.clone().applyMatrix4(cylinderGroup.matrixWorld);
      const v = worldPos.project(camera);

      if (v.z > 1) {
        l.el.style.display = "none";
        return;
      }

      const x = (v.x * 0.5 + 0.5) * rect.width;
      const y = (v.y * -0.5 + 0.5) * rect.height;

      l.el.style.left = `${x + 15}px`;
      l.el.style.top = `${y - 15}px`;
      l.el.style.display = "block";
    });
  }

  /* Resize */
  function resize() {
    const w = mountEl.clientWidth || 1;
    const h = mountEl.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  resize();
  createGeometry();

  /* Loop */
  let raf = 0;
  function animate() {
    raf = requestAnimationFrame(animate);

    if (state.animating) {
      if (Math.abs(state.progress - state.target) > 0.001) {
        state.progress += (state.target - state.progress) * 0.03; // keep
      } else {
        state.progress = state.target;
        state.animating = false;
      }

      const t = easeInOutCubic(state.progress);
      updateMeshPositions(t);
    }

    controls.update();
    updateLabelsPositions();
    renderer.render(scene, camera);
  }
  animate();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  /* API */
  function unfold() {
    state.target = 1;
    state.animating = true;
  }

  function fold() {
    state.target = 0;
    state.animating = true;
  }

  function toggleInfo() {
    state.showInfo = !state.showInfo;
    updateLabelsPositions();
  }

  function resetView() {
    camera.position.set(5, 4, 10);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function zoomIn() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, 1);
    controls.update();
  }

  function zoomOut() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, -1);
    controls.update();
  }

  function addSize() {
    if (radius < 2.5) {
      radius += 0.2;
      height += 0.4;
      createGeometry();
      updateMeshPositions(state.progress); // keep
    }
  }

  function reduceSize() {
    if (radius > 0.5) {
      radius -= 0.2;
      height -= 0.4;
      createGeometry();
      updateMeshPositions(state.progress); // keep
    }
  }

  /* Cleanup */
  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);

    labels.forEach((l) => l.el.remove());

    if (cylinderGroup) {
      cylinderGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material) o.material.dispose?.();
      });
      scene.remove(cylinderGroup);
    }

    renderer.dispose();
    mountEl.removeChild(renderer.domElement);
  }

  return {
    unfold,
    fold,
    toggleInfo,
    zoomIn,
    zoomOut,
    addSize,
    reduceSize,
    resetView,
    destroy,
  };
}