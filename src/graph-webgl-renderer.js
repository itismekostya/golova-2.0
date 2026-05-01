const DEFAULT_TEXTURE_CACHE_LIMIT = 180;
const DEFAULT_PIXEL_RATIO_CAP = 1.5;
const VIEW_PADDING_WORLD = 500;

function getThree() {
  return typeof window !== "undefined" ? window.THREE : null;
}

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

function intersectsView(item, bounds) {
  const halfW = Math.max(1, Number(item.width) || 1) * 0.5;
  const halfH = Math.max(1, Number(item.height) || 1) * 0.5;
  return (
    item.x + halfW >= bounds.minX &&
    item.x - halfW <= bounds.maxX &&
    item.y + halfH >= bounds.minY &&
    item.y - halfH <= bounds.maxY
  );
}

function createRoundedImageMaterial(ThreeLib, texture) {
  const material = new ThreeLib.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      map: { value: texture },
      radiusUv: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float radiusUv;
      varying vec2 vUv;

      float roundedRectAlpha(vec2 uv, float radius) {
        if (radius <= 0.0001) {
          return 1.0;
        }
        vec2 q = abs(uv - 0.5) - vec2(0.5 - radius);
        float d = length(max(q, 0.0)) - radius;
        return 1.0 - smoothstep(0.0, 0.004, d);
      }

      void main() {
        vec4 color = texture2D(map, vUv);
        float cornerAlpha = roundedRectAlpha(vUv, radiusUv);
        gl_FragColor = vec4(color.rgb, color.a * cornerAlpha);
      }
    `
  });
  material.userData.texture = texture;
  return material;
}

export function createGraphWebglMediaRenderer({
  stage,
  textureCacheLimit = DEFAULT_TEXTURE_CACHE_LIMIT,
  pixelRatioCap = DEFAULT_PIXEL_RATIO_CAP
} = {}) {
  const ThreeLib = getThree();
  if (!stage || !ThreeLib?.WebGLRenderer) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "graph-webgl-media";
  canvas.setAttribute("aria-hidden", "true");
  stage.insertBefore(canvas, stage.firstChild);
  stage.classList.add("has-webgl-media");

  const renderer = new ThreeLib.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.sortObjects = false;
  if ("outputColorSpace" in renderer && ThreeLib.SRGBColorSpace) {
    renderer.outputColorSpace = ThreeLib.SRGBColorSpace;
  } else if ("outputEncoding" in renderer && ThreeLib.sRGBEncoding) {
    renderer.outputEncoding = ThreeLib.sRGBEncoding;
  }

  const scene = new ThreeLib.Scene();
  const camera = new ThreeLib.OrthographicCamera(-1, 1, -1, 1, 0.1, 2000);
  camera.position.set(0, 0, 1000);
  camera.lookAt(0, 0, 0);

  const loader = new ThreeLib.TextureLoader();
  const textureCache = new Map();
  const meshesByKey = new Map();
  let renderWidth = 0;
  let renderHeight = 0;
  let renderPixelRatio = 0;
  let disposed = false;

  function touchTexture(src) {
    const cached = textureCache.get(src);
    if (!cached) {
      return null;
    }
    textureCache.delete(src);
    textureCache.set(src, cached);
    return cached.texture;
  }

  function disposeTextureEntry(entry) {
    if (!entry) {
      return;
    }
    if (entry.texture?.dispose) {
      entry.texture.dispose();
    }
  }

  function trimTextureCache() {
    while (textureCache.size > textureCacheLimit) {
      const oldestKey = textureCache.keys().next().value;
      const oldest = textureCache.get(oldestKey);
      textureCache.delete(oldestKey);
      disposeTextureEntry(oldest);
    }
  }

  function getTexture(src) {
    if (!src || disposed) {
      return null;
    }
    const existing = touchTexture(src);
    if (existing) {
      return existing;
    }

    const texture = loader.load(
      src,
      () => {
        texture.needsUpdate = true;
      },
      undefined,
      () => {
        textureCache.delete(src);
      }
    );
    texture.generateMipmaps = false;
    texture.minFilter = ThreeLib.LinearFilter;
    texture.magFilter = ThreeLib.LinearFilter;
    texture.flipY = true;
    if ("colorSpace" in texture && ThreeLib.SRGBColorSpace) {
      texture.colorSpace = ThreeLib.SRGBColorSpace;
    } else if ("encoding" in texture && ThreeLib.sRGBEncoding) {
      texture.encoding = ThreeLib.sRGBEncoding;
    }
    textureCache.set(src, { texture });
    trimTextureCache();
    return texture;
  }

  function resize(width, height) {
    const nextWidth = Math.max(1, Math.round(Number(width) || stage.clientWidth || window.innerWidth || 1));
    const nextHeight = Math.max(1, Math.round(Number(height) || stage.clientHeight || window.innerHeight || 1));
    const nextPixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    if (nextWidth === renderWidth && nextHeight === renderHeight && Math.abs(nextPixelRatio - renderPixelRatio) < 0.01) {
      return;
    }
    renderWidth = nextWidth;
    renderHeight = nextHeight;
    renderPixelRatio = nextPixelRatio;
    renderer.setPixelRatio(nextPixelRatio);
    renderer.setSize(nextWidth, nextHeight, false);
  }

  function updateCamera({ width, height, viewX, viewY, viewZoom }) {
    const safeZoom = Math.max(0.0001, Number(viewZoom) || 1);
    const halfW = Math.max(1, Number(width) || renderWidth || 1) / (2 * safeZoom);
    const halfH = Math.max(1, Number(height) || renderHeight || 1) / (2 * safeZoom);
    camera.left = viewX - halfW;
    camera.right = viewX + halfW;
    // CSS graph coordinates grow downward on Y; Three.js camera coordinates grow upward.
    camera.top = -viewY + halfH;
    camera.bottom = -viewY - halfH;
    camera.updateProjectionMatrix();
    return {
      minX: camera.left - VIEW_PADDING_WORLD,
      maxX: camera.right + VIEW_PADDING_WORLD,
      minY: camera.top - VIEW_PADDING_WORLD,
      maxY: camera.bottom + VIEW_PADDING_WORLD
    };
  }

  function createMesh(item, texture) {
    const geometry = new ThreeLib.PlaneGeometry(1, 1);
    const material = createRoundedImageMaterial(ThreeLib, texture);
    const mesh = new ThreeLib.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = Number.isFinite(item.order) ? item.order : 0;
    scene.add(mesh);
    return mesh;
  }

  function updateMesh(mesh, item, texture, viewZoom) {
    const width = Math.max(1, Number(item.width) || 1);
    const height = Math.max(1, Number(item.height) || 1);
    mesh.position.set(Number(item.x) || 0, -(Number(item.y) || 0), 0);
    mesh.scale.set(width, height, 1);
    mesh.rotation.z = Number(item.rotation) || 0;
    mesh.renderOrder = Number.isFinite(item.order) ? item.order : mesh.renderOrder;
    if (mesh.material?.uniforms?.map?.value !== texture) {
      mesh.material.uniforms.map.value = texture;
    }
    const screenRadius = Math.max(0, Number(item.radiusPx) || 0);
    const radiusWorld = screenRadius / Math.max(0.0001, Number(viewZoom) || 1);
    const radiusUv = item.rounded ? Math.min(0.5, radiusWorld / Math.max(1, Math.min(width, height))) : 0;
    if (mesh.material?.uniforms?.radiusUv) {
      mesh.material.uniforms.radiusUv.value = radiusUv;
    }
  }

  function removeUnusedMeshes(activeKeys) {
    for (const [key, mesh] of meshesByKey.entries()) {
      if (activeKeys.has(key)) {
        continue;
      }
      scene.remove(mesh);
      if (mesh.geometry?.dispose) {
        mesh.geometry.dispose();
      }
      if (mesh.material?.dispose) {
        mesh.material.dispose();
      }
      meshesByKey.delete(key);
    }
  }

  function update({ width, height, viewX, viewY, viewZoom, items = [] } = {}) {
    if (disposed) {
      return;
    }
    resize(width, height);
    const bounds = updateCamera({
      width: renderWidth,
      height: renderHeight,
      viewX: Number(viewX) || 0,
      viewY: Number(viewY) || 0,
      viewZoom: Number(viewZoom) || 1
    });

    const activeKeys = new Set();
    for (const item of items) {
      if (!item?.key || !item.src || !isFiniteNumber(item.x) || !isFiniteNumber(item.y) || !intersectsView(item, bounds)) {
        continue;
      }
      const texture = getTexture(item.src);
      if (!texture) {
        continue;
      }
      activeKeys.add(item.key);
      let mesh = meshesByKey.get(item.key);
      if (!mesh) {
        mesh = createMesh(item, texture);
        meshesByKey.set(item.key, mesh);
      }
      updateMesh(mesh, item, texture, viewZoom);
    }
    removeUnusedMeshes(activeKeys);
    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    for (const mesh of meshesByKey.values()) {
      scene.remove(mesh);
      mesh.geometry?.dispose?.();
      mesh.material?.dispose?.();
    }
    meshesByKey.clear();
    for (const entry of textureCache.values()) {
      disposeTextureEntry(entry);
    }
    textureCache.clear();
    renderer.dispose();
    canvas.remove();
    stage.classList.remove("has-webgl-media");
  }

  canvas.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
    },
    false
  );

  return {
    canvas,
    update,
    dispose
  };
}
