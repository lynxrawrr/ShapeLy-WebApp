import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initCone({ mountEl, onExampleChange }) {
  /* Scene */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(3, 2.5, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  mountEl.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
  gridHelper.position.y = -2;
  scene.add(gridHelper);

  /* Params */
  let radius = 1;
  let height = 2;
  const segments = 25;

  /* Materials */
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2,
    transparent: true,
    opacity: 1,
  });

  /* Groups */
  const coneGroup = new THREE.Group();
  const sectorGroup = new THREE.Group();
  scene.add(coneGroup, sectorGroup);
  sectorGroup.visible = false;

  /* State */
  let slices = [];
  let baseCap = null;

  let sectorMesh = null;
  let sectorWire = null;
  let sectorBase = null;
  let sectorBaseWire = null;

  let animating = false;
  let targetProgress = 0;
  let progress = 0;
  let unfolded = false;

  const animationSpeed = 2;
  let raf = 0;
  let lastTime = 0;

  /* Info labels */
  let showInfo = false;
  const infoLabels = [];

  function createInfoLabel(text) {
    const el = document.createElement("div");
    el.className = "info-label";
    el.textContent = text;
    el.style.display = "none";
    mountEl.appendChild(el);
    return el;
  }

  const apexLabel = createInfoLabel("Puncak (apex)");
  const slantLabel = createInfoLabel("Garis pelukis (s)");
  const baseLabel = createInfoLabel("Alas (lingkaran)");

  function updateInfoLabels() {
    if (!showInfo || unfolded) {
      infoLabels.forEach((l) => (l.element.style.display = "none"));
      return;
    }

    const rect = mountEl.getBoundingClientRect();

    infoLabels.forEach((label) => {
      const world = label.getWorldPos().clone();
      const v = world.project(camera);

      const x = (v.x * 0.5 + 0.5) * rect.width;
      const y = (v.y * -0.5 + 0.5) * rect.height;

      label.element.style.left = `${x + label.offset.x}px`;
      label.element.style.top = `${y + label.offset.y}px`;
      label.element.style.display = "block";
    });
  }

  /* Example */
  function emitExample() {
    const r = radius * 10;
    const h = height * 10;
    const s = Math.sqrt(r ** 2 + h ** 2);
    const v = (1 / 3) * Math.PI * r ** 2 * h;
    const a = Math.PI * r * (r + s);

    onExampleChange?.({
      lines: [
        `r = ${r.toFixed(0)} cm, h = ${h.toFixed(0)} cm`,
        `s = √(${r.toFixed(0)}² + ${h.toFixed(0)}²) = ${s.toFixed(2)} cm`,
        `V = (1/3)πr²h = ${v.toFixed(2)} cm³`,
        `A = πr(r + s) = ${a.toFixed(2)} cm²`,
      ],
    });
  }

  /* Builders */
  function clearGroup(g) {
    while (g.children.length) {
      const c = g.children[0];
      g.remove(c);
      c.traverse?.((o) => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material) o.material.dispose?.();
      });
    }
  }

  function buildCone() {
    clearGroup(coneGroup);
    slices = [];
    baseCap = null;

    const angleStep = (2 * Math.PI) / segments;

    for (let i = 0; i < segments; i++) {
      const theta1 = i * angleStep;
      const theta2 = (i + 1) * angleStep;

      const geom = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0,
        height / 2,
        0,
        Math.cos(theta1) * radius,
        -height / 2,
        Math.sin(theta1) * radius,
        Math.cos(theta2) * radius,
        -height / 2,
        Math.sin(theta2) * radius,
      ]);
      geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      geom.setIndex([0, 1, 2]);
      geom.computeVertexNormals();

      const mesh = new THREE.Mesh(geom, baseMaterial.clone());
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        edgeMaterial.clone(),
      );

      const pivot = new THREE.Group();
      pivot.position.set(0, height / 2, 0);
      mesh.position.sub(pivot.position);
      edges.position.copy(mesh.position);
      pivot.add(mesh);
      pivot.add(edges);

      pivot.userData.sliceIndex = i;
      slices.push(pivot);
      coneGroup.add(pivot);
    }

    const baseCircleGeom = new THREE.CircleGeometry(radius, segments);
    baseCap = new THREE.Group();

    const baseMesh = new THREE.Mesh(baseCircleGeom, baseMaterial.clone());
    baseMesh.rotation.x = -Math.PI / 2;

    const baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(baseCircleGeom),
      edgeMaterial.clone(),
    );
    baseEdges.rotation.x = -Math.PI / 2;

    baseCap.add(baseMesh, baseEdges);
    baseCap.position.y = -height / 2;
    coneGroup.add(baseCap);

    infoLabels.length = 0;
    infoLabels.push(
      {
        element: apexLabel,
        offset: { x: 10, y: -10 },
        getWorldPos: () => new THREE.Vector3(0, height / 2, 0),
      },
      {
        element: slantLabel,
        offset: { x: 10, y: 0 },
        getWorldPos: () => new THREE.Vector3(radius * 0.6, 0, 0),
      },
      {
        element: baseLabel,
        offset: { x: 10, y: 10 },
        getWorldPos: () => new THREE.Vector3(0, -height / 2, 0),
      },
    );

    emitExample();
  }

  function buildSector() {
    clearGroup(sectorGroup);

    const slantHeight = Math.sqrt(radius ** 2 + height ** 2);
    const unfoldAngle = (2 * Math.PI * radius) / slantHeight;
    const angleStep = (2 * Math.PI) / segments;

    const sectorGeometry = new THREE.BufferGeometry();
    const verts = [0, 0, 0];

    for (let i = 0; i <= segments; i++) {
      const theta = i * angleStep * (unfoldAngle / (2 * Math.PI));
      const x = Math.cos(theta) * slantHeight;
      const z = Math.sin(theta) * slantHeight;
      verts.push(x, 0, z);
    }

    const indices = [];
    for (let i = 0; i < segments; i++) indices.push(0, i + 1, i + 2);

    sectorGeometry.setIndex(indices);
    sectorGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(verts, 3),
    );
    sectorGeometry.computeVertexNormals();

    sectorMesh = new THREE.Mesh(
      sectorGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      }),
    );

    sectorWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(sectorGeometry),
      edgeMaterial.clone(),
    );
    sectorWire.material.opacity = 0;

    sectorGroup.add(sectorMesh);
    sectorGroup.add(sectorWire);

    const baseGeom = new THREE.CircleGeometry(radius, segments);
    sectorBase = new THREE.Mesh(baseGeom, baseMaterial.clone());
    sectorBase.material.opacity = 0;
    sectorBase.rotation.x = -Math.PI / 2;
    sectorBase.position.set(0, 0, -slantHeight * 0.55);

    sectorBaseWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(baseGeom),
      edgeMaterial.clone(),
    );
    sectorBaseWire.material.opacity = 0;
    sectorBaseWire.rotation.x = -Math.PI / 2;
    sectorBaseWire.position.copy(sectorBase.position);

    sectorGroup.add(sectorBase);
    sectorGroup.add(sectorBaseWire);
  }

  function rebuildAll() {
    buildCone();
    buildSector();
    applyProgress(progress);
  }

  /* Unfold */
  function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
  }

  function applyProgress(p) {
    const eased = easeInOutQuint(p);

    const slantHeight = Math.sqrt(radius ** 2 + height ** 2);
    const unfoldAngle = (2 * Math.PI * radius) / slantHeight;

    for (let i = 0; i < slices.length; i++) {
      const t = i / segments;

      const delay = i * 0.008;
      const duration = 0.85;
      const local = (p - delay) / duration;
      const localP = THREE.MathUtils.clamp(local, 0, 1);
      const localE = easeInOutQuint(localP);

      const rotY = (unfoldAngle / 2 - t * unfoldAngle) * localE;
      const rotX = (-Math.PI / 2) * localE;

      slices[i].rotation.set(rotX, rotY, 0);

      slices[i].children.forEach((child) => {
        if (child.material) child.material.opacity = 1 - eased;
      });
    }

    if (baseCap) {
      const startY = -height / 2;
      const endY = 0;
      const endZ = -slantHeight * 0.55;

      baseCap.position.y = THREE.MathUtils.lerp(startY, endY, eased);
      baseCap.position.z = THREE.MathUtils.lerp(0, endZ, eased);

      baseCap.children.forEach((c) => {
        c.rotation.x = -Math.PI / 2;
        if (c.material) c.material.opacity = 1 - eased;
      });
    }

    if (sectorMesh) sectorMesh.material.opacity = eased;
    if (sectorWire) sectorWire.material.opacity = eased;
    if (sectorBase) sectorBase.material.opacity = eased;
    if (sectorBaseWire) sectorBaseWire.material.opacity = eased;
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
  rebuildAll();

  /* Loop */
  function animate(time = 0) {
    raf = requestAnimationFrame(animate);

    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0);
    lastTime = time;

    if (animating) {
      progress = THREE.MathUtils.damp(
        progress,
        targetProgress,
        animationSpeed,
        dt,
      );

      if (Math.abs(progress - targetProgress) < 0.0008) {
        progress = targetProgress;
        animating = false;
        unfolded = targetProgress > 0.5;

        if (unfolded) {
          coneGroup.visible = false;
          sectorGroup.visible = true;
        } else {
          coneGroup.visible = true;
          sectorGroup.visible = false;
        }
      }

      coneGroup.visible = true;
      sectorGroup.visible = true;

      applyProgress(progress);
    }

    controls.update();
    renderer.render(scene, camera);
    updateInfoLabels();
  }
  animate();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  /* Controls API */
  function unfold() {
    targetProgress = 1;
    animating = true;
    unfolded = true;
    if (showInfo) {
      showInfo = false;
      updateInfoLabels();
    }
  }

  function fold() {
    targetProgress = 0;
    animating = true;
    unfolded = false;
    if (showInfo) {
      showInfo = false;
      updateInfoLabels();
    }
  }

  function toggleInfo() {
    if (unfolded) return;
    showInfo = !showInfo;
    updateInfoLabels();
  }

  function zoomIn() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, 0.5);
    controls.update();
  }

  function zoomOut() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, -0.5);
    controls.update();
  }

  function addSize() {
    if (radius >= 2.5) return;
    radius += 0.1;
    height += 0.2;

    progress = 0;
    targetProgress = 0;
    animating = false;
    unfolded = false;
    showInfo = false;
    updateInfoLabels();

    sectorGroup.visible = false;
    coneGroup.visible = true;

    rebuildAll();
  }

  function reduceSize() {
    if (radius <= 0.3) return;
    radius -= 0.1;
    height = Math.max(0.6, height - 0.2);

    progress = 0;
    targetProgress = 0;
    animating = false;
    unfolded = false;
    showInfo = false;
    updateInfoLabels();

    sectorGroup.visible = false;
    coneGroup.visible = true;

    rebuildAll();
  }

  function resetView() {
    camera.position.set(3, 2.5, 4);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  /* Cleanup */
  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);

    infoLabels.forEach((l) => l.element.remove());
    clearGroup(coneGroup);
    clearGroup(sectorGroup);

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