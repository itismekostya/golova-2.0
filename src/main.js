import { projects } from "./projects.js";
import { mediaManifestByName } from "./media-manifest.js";
import { mediaPreviewManifestBySrc } from "./media-preview-manifest.js";
import { mediaProxyManifestBySrc } from "./media-proxy-manifest.js";

const stage = document.getElementById("stage");
const world = document.getElementById("world");
const filtersEl = document.getElementById("filters");
const collisionToggleBtn = document.getElementById("collisionToggle");
const deepProjectBackBtn = document.getElementById("deepProjectBack");
const deepProjectInfoEl = document.getElementById("deepProjectInfo");
const headWidgetEl = document.getElementById("headWidget");
const headCanvasHostEl = document.getElementById("headCanvasHost");
const headBackdropEl = document.getElementById("headBackdrop");
const PROJECT_GRAPH_QUERY_KEY = "project";
const PROJECT_GRAPH_HASH_PREFIX = "#project/";

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.6;
const MAX_TEXT_ONLY_FOCUS_ZOOM = MAX_ZOOM;
const LOD_FAR = 0.75;
const LOD_CLOSE = 1.2;
const TITLE_CHAR_WIDTH = 8;
const FAR_MEDIA_SCALE = 0.58;
const CLOSE_MEDIA_SCALE = 1;
const DEFAULT_MENU_FILTER_TYPES = ["naming", "identity", "physical", "strategy"];
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const HOME_LOCK_ZOOM_FACTOR = 1.08;
const HOME_SNAP_ZOOM_FACTOR = 1.03;
const SPREAD_MAX = 1.7;
const DEEP_SPREAD_MAX = 1.48;
const OVERVIEW_MEDIA_LAYOUT_RELIEF_FAR = 0.42;
const OVERVIEW_MEDIA_LAYOUT_RELIEF_CLOSE = 0.14;
const OVERVIEW_MEDIA_LAYOUT_MIN_SCALE_X = 0.78;
const OVERVIEW_MEDIA_LAYOUT_MIN_SCALE_Y = 0.8;
const OVERVIEW_CONTENT_ROOT_INITIAL_RING_SCALE = 0.68;
const OVERVIEW_CONTENT_ROOT_INWARD_PULL = 0.32;
const OVERVIEW_CONTENT_ROOT_SPREAD_PULL = 0.18;
const OVERVIEW_CONTENT_ROOT_TARGET_RADIUS_RATIO = 0.54;
const OVERVIEW_CONTENT_ROOT_COLLISION_BOOST_X = 1.12;
const OVERVIEW_CONTENT_ROOT_COLLISION_BOOST_Y = 1.16;
const PHYSICAL_ITEM_MEDIA_SCALE = 0.82;
const PHYSICAL_ITEM_MEDIA_GAP_Y = 10;
const PHYSICAL_FILTER_COLLISION_BOOST_FAR_X = 1.18;
const PHYSICAL_FILTER_COLLISION_BOOST_FAR_Y = 1.24;
const PHYSICAL_FILTER_COLLISION_BOOST_CLOSE_X = 1.48;
const PHYSICAL_FILTER_COLLISION_BOOST_CLOSE_Y = 1.62;
const DESKTOP_VISUAL_CENTER_SHIFT_Y = 42;
const WHEEL_ZOOM_SENSITIVITY = 0.0007;
const TRACKPAD_PINCH_ZOOM_SENSITIVITY = 0.0034;
const CONTENT_MEDIA_GLOBAL_SCALE_BOOST = 1;
const ROOT_MEDIA_TARGET_AREA = 86000;
const ROOT_MEDIA_LOGO_TARGET_AREA = 74000;
const ROOT_MEDIA_MIN_LONG = 136;
const ROOT_MEDIA_MAX_LONG = 360;
const ROOT_MEDIA_MIN_SHORT = 66;
const ROOT_MEDIA_MAX_SHORT = 260;
const ROOT_MEDIA_LOGO_MIN_LONG = 128;
const ROOT_MEDIA_LOGO_MAX_LONG = 320;
const ROOT_MEDIA_LOGO_MIN_SHORT = 54;
const ROOT_MEDIA_LOGO_MAX_SHORT = 170;
const CONTENT_IMAGE_TARGET_AREA_SHARE = 0.34;
const CONTENT_IMAGE_MAX_WIDTH_SHARE = 0.94;
const CONTENT_IMAGE_MAX_HEIGHT_SHARE = 0.82;
const CONTENT_IMAGE_MIN_WIDTH_SHARE = 0.22;
const CONTENT_IMAGE_TARGET_AREA_SHARE_MOBILE = 0.6;
const CONTENT_IMAGE_MAX_WIDTH_SHARE_MOBILE = 1;
const CONTENT_IMAGE_MAX_HEIGHT_SHARE_MOBILE = 0.96;
const CONTENT_IMAGE_MIN_WIDTH_SHARE_MOBILE = 0.42;
const AUTO_MEDIA_BASE_HEIGHT = 170;
const AUTO_MEDIA_SAFE_PAD = 0;
const AUTO_MEDIA_GAP = 0;
const AUTO_MEDIA_ROOT_CHILD_LIMIT = 3;
const AUTO_MEDIA_NODE_CHILD_LIMIT = 2;
const AUTO_MEDIA_MAX_LEVEL = 2;
const UI_SPACE_UNIT = 30;
const UI_SPACE_HALF = UI_SPACE_UNIT / 2;
const UI_TEXT_TRIM_TOP = 5;
const UI_TEXT_TRIM_BOTTOM = 5;
const UI_TEXT_STACK_GAP = Math.max(0, UI_SPACE_UNIT - (UI_TEXT_TRIM_TOP + UI_TEXT_TRIM_BOTTOM));
const PROJECT_DETAILS_TOP_OPTICAL_GAP = Math.max(0, UI_SPACE_UNIT - UI_TEXT_TRIM_BOTTOM);
const PROJECT_DETAILS_BUTTON_GAP = Math.max(0, UI_SPACE_UNIT + UI_TEXT_TRIM_BOTTOM);
const PROJECT_DETAILS_BUTTON_HEIGHT = 40;
const PROJECT_DOT_SIZE = 7;
const PROJECT_TEXT_BOX_PAD_X = 4;
const PROJECT_TEXT_BOX_PAD_Y = 4;
const PROJECT_TEXT_BOX_HEIGHT = 20;
const PROJECT_TEXT_SAFE_PAD = 0;
const PROJECT_MEDIA_SAFE_PAD = 0;
const PROJECT_DETAILS_LEFT = PROJECT_DOT_SIZE + UI_SPACE_HALF;
const PROJECT_DETAILS_TOP_GAP = PROJECT_DETAILS_TOP_OPTICAL_GAP;
const PROJECT_DETAILS_UI_SCALE = 1;
const PROJECT_DETAILS_MEDIA_GAP = UI_SPACE_HALF;
const PROJECT_DETAILS_LAYOUT_FULL_ZOOM = 1.34;
const PROJECT_DETAILS_MAX_WIDTH = 360;
const PROJECT_DETAILS_FADE_START_T = 0.92;
const PROJECT_DETAILS_FADE_END_T = 0.985;
const PROJECT_CLOSE_BOTTOM_MEDIA_GAP = 30;
const PROJECT_CLOSE_BODY_TEXT_VERTICAL_RESERVE_FACTOR = 0.5;
const PROJECT_CLOSE_BODY_TEXT_VERTICAL_RESERVE_MAX = 72;
const MOBILE_TOUCH_PAN_SPEED = 1.55;
const MOBILE_TITLE_BREAKPOINT = 1024;
const MOBILE_DEEP_INFO_BREAKPOINT = MOBILE_TITLE_BREAKPOINT;
const MOBILE_DEEP_INFO_FULL_WIDTH_BREAKPOINT = 720;
const MOBILE_DEEP_INFO_COLLAPSED_TITLE_GAP = 90;
const MOBILE_TITLE_REVEAL_START_FACTOR = 1.08;
const MOBILE_TITLE_REVEAL_END_FACTOR = 1.22;
const MOBILE_HIDDEN_TITLE_CENTER_BIAS_PX = 18;
const MOBILE_EDGE_GESTURE_GUARD_PX = 15;
const MOBILE_HOME_PULL_DEADZONE_PX = 140;
const MOBILE_HOME_PULL_DEEP_BONUS_PX = 40;
const MOBILE_HOME_PULL_STRENGTH = 0.032;
const EMPTY_STEP_CENTER_PULL = 0.56;
const MOBILE_EMPTY_STEP_T = 0.31;
const GRAPH_DIRTY_FRAME_COUNT = 4;
const GRAPH_INITIAL_DIRTY_FRAMES = 12;
const GRAPH_CAMERA_SETTLE_EPS = 0.012;
const GRAPH_ZOOM_SETTLE_EPS = 0.00008;
const GRAPH_FRAME_CAMERA_EPS = 0.018;
const GRAPH_FRAME_ZOOM_EPS = 0.00016;
const GRAPH_LAYOUT_ZOOM_EPS = 0.00028;
const CONTENT_DETAILS_TOP_GAP = UI_SPACE_UNIT;
const CONTENT_CLUSTER_BASE_RADIUS = 132;
const CONTENT_CLUSTER_RADIUS_STEP = 52;
const CONTENT_CLUSTER_X_ASPECT = 1.16;
const CONTENT_CLUSTER_Y_ASPECT = 0.92;
const CONTENT_CLUSTER_SPREAD = 1;
const CONTENT_MEDIA_NOTE_GAP = UI_SPACE_UNIT + UI_TEXT_TRIM_TOP;
const CONTENT_MEDIA_NOTE_GAP_MIN_SCREEN = 10;
const CONTENT_MEDIA_NOTE_WIDTH_FACTOR = 1;
const OVERVIEW_ELASTIC_MIN_ZOOM_FLOOR = 0.32;
const OVERVIEW_ELASTIC_MIN_ZOOM_SLACK = 0.03;
const OVERVIEW_ELASTIC_MIN_ZOOM_TRIGGER_RANGE = 0.025;
const DEEP_ELASTIC_MIN_ZOOM_FLOOR = 0.26;
const DEEP_ELASTIC_MIN_ZOOM_SLACK = 0.09;
const DEEP_ELASTIC_MIN_ZOOM_TRIGGER_RANGE = 0.03;
const DEEP_NOTE_HEAD_REVEAL_START_T = 0.24;
const DEEP_NOTE_BODY_REVEAL_START_T = 0.72;
const POINTER_TAP_SLOP_MOUSE = 5;
const POINTER_TAP_SLOP_TOUCH = 10;
const DETAILS_INTERACTION_VISIBILITY_THRESHOLD = 0.15;
const DEEP_MODE_MIN_EDGE_EPS = 0.01;
const DEEP_MODE_MAX_ZOOM = 1.95;
const MAX_CONTENT_RECURSION_DEPTH = 32;
const CONTENT_PREWARM_DELAY_MS = 90;
const MOBILE_DEEP_LAYOUT_PRIMARY_RADIAL_PASSES = 32;
const MOBILE_DEEP_LAYOUT_SECONDARY_RADIAL_PASSES = 22;
const MOBILE_DEEP_LAYOUT_STRICT_PASSES = 8;
const MOBILE_DEEP_LAYOUT_ROOT_GUARD_PASSES = 8;
const MOBILE_DEEP_LAYOUT_ROOT_GUARD_FINAL_PASSES = 4;
const MOBILE_DEEP_LAYOUT_WORLD_BASE_PASSES_MIN = 8;
const MOBILE_DEEP_LAYOUT_WORLD_BASE_PASSES_MAX = 18;
const MOBILE_DEEP_LAYOUT_RING_PASSES = 2;
const MEDIA_HYDRATION_ROOT_MARGIN_PX = 300;
const MOBILE_MEDIA_HYDRATION_ROOT_MARGIN_PX = 120;
const MEDIA_EVICTION_ROOT_MARGIN_PX = 1500;
const MOBILE_MEDIA_EVICTION_ROOT_MARGIN_PX = 520;
const DESKTOP_MEDIA_HYDRATION_BATCH_SIZE = 18;
const MOBILE_MEDIA_HYDRATION_BATCH_SIZE = 4;
const DISABLE_ALL_VIDEO_MEDIA = false;
const DISABLE_MOBILE_VIDEO_MEDIA = true;
const HIDE_MOBILE_MOTION_MEDIA = true;
const CLEANED_BLACK_MATTE_PROXY_CACHE_LIMIT = 30;
const USE_CONTENT_MEDIA_PREVIEWS = true;
const USE_MOBILE_BOUNDED_FULL_MEDIA = true;
const USE_GRAPH_MEDIA_PROXIES = false;
const HEAD_INTERACTIVE_ROTATION_ENABLED = false;
const DESKTOP_HEAD_MAX_PIXEL_RATIO = 2;
const HEAD_MODEL_SRC = "./assets/head/golova_model.glb";
const HEAD_USE_BAKED_TEXTURE = true;
const HEAD_BAKED_TEXTURE_NEUTRALIZE = false;
const HEAD_BAKED_TEXTURE_INFLUENCE = 0.24;
const HEAD_BAKED_TEXTURE_LUMA_GAMMA = 0.96;
const HEAD_BASE_COLOR_HEX = 0xe9c4a2;
const HEAD_EMISSIVE_COLOR_HEX = 0x4d2e20;
const HEAD_EMISSIVE_INTENSITY = 0;
const HEAD_TONE_MAPPING_EXPOSURE = 0.99;
const HEAD_AMBIENT_INTENSITY = 0;
const HEAD_HEMISPHERE_INTENSITY = 1.34;
const HEAD_KEY_LIGHT_INTENSITY = 1.5;
const HEAD_FILL_LIGHT_INTENSITY = 2.4;
const HEAD_RIM_LIGHT_INTENSITY = 4;
const HEAD_BACK_LIGHT_INTENSITY = 2;
const HEAD_MATERIAL_ROUGHNESS = 1;
const HEAD_MATERIAL_METALNESS = 0;
const HEAD_MATERIAL_ENV_INTENSITY = 0;
const HEAD_TEXTURE_ANISOTROPY = 16;
const HEAD_TUNING_PANEL_ENABLED = false;
const HEAD_TUNING_STORAGE_KEY = "golova-head-tuning-v2";
const HEAD_TUNING_PRESETS_STORAGE_KEY = "golova-head-tuning-presets-v1";
const HEAD_TUNING_UI_STORAGE_KEY = "golova-head-tuning-ui-v1";
const HEAD_TUNING_HISTORY_LIMIT = 50;
const HEAD_TUNING_DEFAULTS = Object.freeze({
  useBakedTexture: HEAD_USE_BAKED_TEXTURE,
  bakedTextureNeutralize: HEAD_BAKED_TEXTURE_NEUTRALIZE,
  bakedTextureInfluence: HEAD_BAKED_TEXTURE_INFLUENCE,
  bakedTextureLumaGamma: HEAD_BAKED_TEXTURE_LUMA_GAMMA,
  rgbCurveEnabled: true,
  rgbCurveFac: 0.25,
  rgbCurveLift: 0.5,
  rgbCurveGamma: 3,
  rgbCurveGain: 3,
  rgbCurveR: 1.02,
  rgbCurveG: 2,
  rgbCurveB: 2,
  baseColorHex: HEAD_BASE_COLOR_HEX,
  emissiveColorHex: HEAD_EMISSIVE_COLOR_HEX,
  emissiveIntensity: HEAD_EMISSIVE_INTENSITY,
  toneMappingExposure: HEAD_TONE_MAPPING_EXPOSURE,
  ambientIntensity: HEAD_AMBIENT_INTENSITY,
  hemisphereIntensity: HEAD_HEMISPHERE_INTENSITY,
  keyLightIntensity: HEAD_KEY_LIGHT_INTENSITY,
  fillLightIntensity: HEAD_FILL_LIGHT_INTENSITY,
  rimLightIntensity: HEAD_RIM_LIGHT_INTENSITY,
  backLightIntensity: HEAD_BACK_LIGHT_INTENSITY,
  keyLightPosX: 0.2,
  keyLightPosY: 0.1,
  keyLightPosZ: 0.4,
  fillLightPosX: 0.05,
  fillLightPosY: 7.85,
  fillLightPosZ: 2.05,
  rimLightPosX: -1.9,
  rimLightPosY: 1.35,
  rimLightPosZ: -2.7,
  backLightPosX: -0.5,
  backLightPosY: -1.6,
  backLightPosZ: -2.6,
  materialRoughness: HEAD_MATERIAL_ROUGHNESS,
  materialMetalness: HEAD_MATERIAL_METALNESS,
  materialEnvIntensity: HEAD_MATERIAL_ENV_INTENSITY
});
const HEAD_ROTATION_SMOOTH_DESKTOP = 0.1;
const HEAD_ROTATION_SMOOTH_MOBILE = 0.18;
const HEAD_POINTER_SMOOTH_DESKTOP = 0.14;
const HEAD_POINTER_SMOOTH_MOBILE = 0.28;
const HEAD_POSE_DURATION_MS = 600;
const HEAD_TOUCH_RETURN_AUTO_SMOOTH = 0.09;
const HEAD_CLOSED_TARGET_HEIGHT_DESKTOP_PX = 90;
const HEAD_CLOSED_TARGET_HEIGHT_MOBILE_PX = 80;
const HEAD_CLOSED_BOTTOM_MARGIN_DESKTOP_PX = 28;
const HEAD_CLOSED_BOTTOM_MARGIN_MOBILE_PX = 15;
const HEAD_SCALE_CLOSED_DESKTOP = 0.9;
const HEAD_SCALE_CLOSED_MOBILE = 0.83;
const HEAD_SCALE_OPEN_DESKTOP = 5;
const HEAD_SCALE_OPEN_MOBILE = 4;
const HEAD_POS_Y_CLOSED_DESKTOP = -1.03;
const HEAD_POS_Y_CLOSED_MOBILE = -0.97;
const HEAD_POS_Y_OPEN_DESKTOP = 0;
const HEAD_POS_Y_OPEN_MOBILE = -0.5;
const HEAD_ROTATION_GAIN_OPEN_DESKTOP = 0.24;
const HEAD_ROTATION_GAIN_CLOSED_DESKTOP = 0.24;
const HEAD_ROTATION_GAIN_OPEN_MOBILE = 0.42;
const HEAD_ROTATION_GAIN_CLOSED_MOBILE = 0.34;
const HEAD_POINTER_IGNORE_SELECTOR = [
  ".top-bar",
  ".filters",
  ".filter-btn",
  ".site-info",
  ".deep-project-info",
  ".deep-project-info-toggle",
  ".collision-toggle",
  ".project-details-more",
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[data-head-ignore]"
].join(", ");

const state = {
  viewX: 0,
  viewY: 0,
  viewZoom: 0.68,
  targetX: 0,
  targetY: 0,
  targetZoom: 0.68,
  homeX: 0,
  homeY: 0,
  homeZoom: 0.68,
  filterHomeX: 0,
  filterHomeY: 0,
  filterHomeZoom: 0,
  focusedSlug: null,
  focusedMediaIndex: -1,
  focusTrackActive: false,
  activeType: "all",
  physicalOverviewTitlesHeldHidden: false,
  filterTypes: [...DEFAULT_MENU_FILTER_TYPES],
  suppressClickUntil: 0,
  simHeat: 0,
  collisionDebug: false,
  lodClass: "lod-far",
  lastMediaScale: Number.NaN,
  lastMediaLayoutT: Number.NaN,
  lastDetailsVisibility: Number.NaN,
  lastLabelScale: Number.NaN,
  lastOverviewTitleVisibility: Number.NaN,
  stepPullActive: false,
  stepPullStartZoom: 0,
  stepPullEndZoom: 0,
  stepPullStartX: 0,
  stepPullStartY: 0,
  stepPullEndX: 0,
  stepPullEndY: 0,
  stepPullClearFocus: false,
  deepProjectSlug: null,
  deepPath: [],
  deepSourceAnchors: null,
  deepEntryZoom: Number.NaN,
  deepEntryMediaLayoutT: Number.NaN,
  deepRequestedFocusSlug: null,
  deepRequestedFocusMediaIndex: Number.NaN,
  deepRequestedEntryZoomMode: null,
  deepOverviewReturn: null,
  deepInfoExpanded: false,
  stageWidth: 0,
  stageHeight: 0,
  detailsInteractionRevision: 0,
  lastDetailsInteractionRevision: -1,
  lastDetailsInteractionEnabled: null,
  lastDetailsInteractionFocusedSlug: null,
  headModalOpen: true
};

const inertia = { x: 0, y: 0 };
const pointers = new Map();
const nodeBySlug = new Map();
const modelBySlug = new Map();
const mediaLayoutBySlug = new Map();
const mediaLayoutCloseBySlug = new Map();
const contentModelSlugsBySource = new Map();
const parentSlugsByContentModel = new Map();
const pendingContentParentLinks = [];
const runtimeMediaSizeByKey = new Map();
const pendingMediaResizeSlugs = new Set();
const deepProjectLayoutCache = new Map();
const cleanedBlackMatteProxyUrlBySrc = new Map();
const pendingBlackMatteProxyJobsBySrc = new Map();

let drag = null;
let pinch = null;
let focusedModel = null;
let mediaResizeRelayoutScheduled = false;
let edgeSwipeGuardTouchId = null;
let edgeSwipeGuardPointerId = null;
let headScene = null;
let headCamera = null;
let headRenderer = null;
let headModelRoot = null;
let headRenderWidth = 0;
let headRenderHeight = 0;
let headRenderPixelRatio = 0;
let headLastRenderTime = 0;
let headPointerTargetX = 0;
let headPointerTargetY = 0;
let headPointerX = 0;
let headPointerY = 0;
let headCurrentScale = 1;
let headCurrentY = 0;
let headModelLoaded = false;
let headPoseAnim = null;
let headNeedsRender = true;
let headRaycaster = null;
let headPointerNdc = null;
let headModelBounds = null;
let headPressSession = null;
let headClosingClassTimeoutId = null;
let headTouchAutoCenterActive = false;
let headLastInputType = "mouse";
const headTextureCache = new Map();
const headTuning = { ...HEAD_TUNING_DEFAULTS };
const headTuningHistory = [];
const headTuningPresets = [];
const headLightRig = {
  ambient: null,
  hemisphere: null,
  key: null,
  fill: null,
  rim: null,
  back: null
};
const headTuningControlByKey = new Map();
let headTuningPanelEl = null;
let headTuningUndoBtnEl = null;
let headTuningCollapseBtnEl = null;
let headTuningPresetNameInputEl = null;
let headTuningPresetsListEl = null;
let headTuningCollapsed = false;
let headThreeLib = null;
let mountedContentSourceSlug = null;
let desiredPrewarmContentSourceSlug = null;
let contentPrewarmTimeoutId = null;
let promotedDeepMediaElement = null;
let mediaHydrationQueue = [];
const queuedMediaHydrationElements = new Set();
let mediaHydrationRafId = null;
let runtimeImageObjectUrlSerial = 0;
const worldCssVarCache = new Map();
let graphDirtyFrames = GRAPH_INITIAL_DIRTY_FRAMES;
let lastGraphLayoutZoom = Number.NaN;
let mainRafId = null;

function clearFocusedMediaTarget() {
  state.focusedMediaIndex = -1;
}

function setFocusedMediaTarget(mediaIndex = -1) {
  state.focusedMediaIndex = Number.isFinite(Number(mediaIndex)) ? Math.max(0, Math.round(Number(mediaIndex))) : -1;
}

function clearFocusedProjectState() {
  if (promotedDeepMediaElement) {
    clearPromotedDeepMediaElement();
  }
  state.focusedSlug = null;
  clearFocusedMediaTarget();
  focusedModel = null;
  state.focusTrackActive = false;
}

bootstrap();

function bootstrap() {
  const hasInitialProjectGraphLocation = Boolean(getProjectGraphSlugFromLocationSearch() || getProjectGraphSlugFromLocationHash());
  updateViewportSize();
  initGraphModels();
  refreshFilterTypesFromModels();
  settleInitialLayout();
  buildNodes();
  buildFilters();
  refreshMediaLayoutsFromDOM();
  refreshModelGeometriesFromDOM();
  rebuildLayoutsForViewport();
  fitHomeView();
  applyFilter("all", false, false);
  refreshSeeMoreLabels();
  refreshDeepNodeClasses();
  state.simHeat = 0;
  updateLODClass(state.targetZoom);
  setCollisionDebug(false);
  bindEvents();
  syncStaticTextTrim();
  if (HEAD_TUNING_PANEL_ENABLED) {
    initHeadTuningPanel();
  }
  initHeadWidget({ startOpen: !hasInitialProjectGraphLocation });
  if (hasInitialProjectGraphLocation) {
    requestAnimationFrame(() => {
      applyProjectGraphLocation({ animate: false });
    });
  } else {
    applyProjectGraphLocation({ animate: false });
    clearInitialProjectRouteLoadingState();
  }
  scheduleMainFrame();
}

function clearInitialProjectRouteLoadingState() {
  if (typeof document === "undefined" || !document.body) {
    return;
  }
  document.body.classList.remove("is-project-route-loading");
}

function buildProjectGraphQueryValue(slug) {
  if (typeof slug !== "string" || !slug.trim()) {
    return "";
  }
  return encodeURIComponent(slug.trim());
}

function getProjectGraphSlugFromLocationSearch(search = window.location.search) {
  if (typeof search !== "string") {
    return null;
  }
  const params = new URLSearchParams(search);
  const raw = params.get(PROJECT_GRAPH_QUERY_KEY);
  if (!raw || !raw.trim()) {
    return null;
  }
  try {
    return decodeURIComponent(raw).trim() || null;
  } catch (_error) {
    return raw.trim() || null;
  }
}

function getProjectGraphSlugFromLocationHash(hash = window.location.hash) {
  if (typeof hash !== "string" || !hash) {
    return null;
  }
  if (!hash.toLowerCase().startsWith(PROJECT_GRAPH_HASH_PREFIX)) {
    return null;
  }
  const rawSlug = hash.slice(PROJECT_GRAPH_HASH_PREFIX.length).trim();
  if (!rawSlug) {
    return null;
  }
  try {
    return decodeURIComponent(rawSlug).trim() || null;
  } catch (_error) {
    return rawSlug || null;
  }
}

function syncProjectGraphLocation(slug = null) {
  if (typeof window === "undefined" || !window.history?.replaceState) {
    return;
  }
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set(PROJECT_GRAPH_QUERY_KEY, buildProjectGraphQueryValue(slug));
  } else {
    url.searchParams.delete(PROJECT_GRAPH_QUERY_KEY);
  }
  url.hash = "";
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) {
    return;
  }
  window.history.replaceState(window.history.state, "", nextUrl);
}

function applyProjectGraphLocation({ animate = false } = {}) {
  const slug = getProjectGraphSlugFromLocationSearch() || getProjectGraphSlugFromLocationHash();
  if (!slug) {
    if (state.deepProjectSlug) {
      setDeepProject(null, { animate });
      return true;
    }
    clearInitialProjectRouteLoadingState();
    return false;
  }

  if (!modelBySlug.has(slug) || !getContentChildSlugs(slug).length) {
    syncProjectGraphLocation(null);
    clearInitialProjectRouteLoadingState();
    return false;
  }

  if (state.activeType !== "all") {
    applyFilter("all", false, false, true);
  } else {
    refreshModelVisibility("all");
  }

  if (state.headModalOpen) {
    setHeadModalOpen(false, { immediate: !animate });
  }

  if (state.deepProjectSlug === slug) {
    return true;
  }

  state.deepOverviewReturn = null;
  setDeepProject(slug, { animate });
  if (!animate) {
    requestAnimationFrame(() => {
      if (state.deepProjectSlug !== slug) {
        clearInitialProjectRouteLoadingState();
        return;
      }
      hydrateDeepProjectMedia(slug);
      relayoutDeepProjectContent(slug);
      refreshModelVisibility(state.activeType);
      fitDeepProjectView(false);
      clearInitialProjectRouteLoadingState();
    });
  } else {
    requestAnimationFrame(() => {
      clearInitialProjectRouteLoadingState();
    });
  }
  return true;
}

function normalizeFilterTag(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function collectNormalizedTags(...tagSources) {
  const tags = new Set();
  for (const source of tagSources) {
    if (typeof source === "string") {
      const tag = normalizeFilterTag(source);
      if (tag) {
        tags.add(tag);
      }
      continue;
    }
    if (!Array.isArray(source)) {
      continue;
    }
    for (const item of source) {
      const tag = normalizeFilterTag(typeof item === "string" ? item : String(item ?? ""));
      if (tag) {
        tags.add(tag);
      }
    }
  }
  return [...tags];
}

function inferContentClusterTags(item, sourceProject, sourceMedia) {
  const explicit = collectNormalizedTags(item?.types, item?.tags);
  if (explicit.length) {
    return explicit;
  }

  const terms = new Set(
    [
      ...tokenizeThemeTerms(typeof item?.label === "string" ? item.label : ""),
      ...tokenizeThemeTerms(typeof item?.title === "string" ? item.title : ""),
      ...tokenizeThemeTerms(typeof item?.role === "string" ? item.role : ""),
      ...tokenizeThemeTerms(typeof item?.media?.role === "string" ? item.media.role : ""),
      ...tokenizeThemeTerms(typeof sourceMedia?.role === "string" ? sourceMedia.role : "")
    ].filter(Boolean)
  );
  const inferred = [];
  const hasAny = (...tokens) => tokens.some((token) => terms.has(token));

  if (hasAny("pack", "packaging", "physical", "material", "box", "mockup")) {
    inferred.push("physical");
  }
  if (hasAny("logo", "identity", "branding", "illustration", "visual", "poster", "brand")) {
    inferred.push("identity");
  }
  if (hasAny("name", "naming", "title")) {
    inferred.push("naming");
  }
  if (hasAny("strategy", "research", "reference", "insight")) {
    inferred.push("strategy");
  }

  if (inferred.length) {
    return collectNormalizedTags(inferred);
  }

  const fallback = collectNormalizedTags(sourceProject?.types, sourceProject?.tags);
  return fallback.length ? [fallback[0]] : [];
}

function getProjectFilterTags(project) {
  if (!project || typeof project !== "object") {
    return [];
  }
  const allowed = new Set(DEFAULT_MENU_FILTER_TYPES);
  return collectNormalizedTags(project.types, project.tags).filter((tag) => allowed.has(tag));
}

function refreshFilterTypesFromModels() {
  const available = new Set();
  for (const model of modelBySlug.values()) {
    for (const tag of model.filterTags || []) {
      if (tag) {
        available.add(tag);
      }
    }
  }

  if (!available.size) {
    state.filterTypes = [...DEFAULT_MENU_FILTER_TYPES];
    return;
  }

  const ordered = [];
  for (const preferred of DEFAULT_MENU_FILTER_TYPES) {
    if (available.has(preferred)) {
      ordered.push(preferred);
      available.delete(preferred);
    }
  }
  const rest = [...available].sort((a, b) => a.localeCompare(b));
  state.filterTypes = [...ordered, ...rest];
}

function registerContentChildLink(parentSlug, childSlug) {
  if (!parentSlug || !childSlug || parentSlug === childSlug) {
    return;
  }
  const children = contentModelSlugsBySource.get(parentSlug) || [];
  if (!children.includes(childSlug)) {
    children.push(childSlug);
    contentModelSlugsBySource.set(parentSlug, children);
  }

  const parents = parentSlugsByContentModel.get(childSlug) || [];
  if (!parents.includes(parentSlug)) {
    parents.push(parentSlug);
    parentSlugsByContentModel.set(childSlug, parents);
  }
}

function hasContentParent(childSlug, parentSlug) {
  const parents = parentSlugsByContentModel.get(childSlug);
  return Array.isArray(parents) && parents.includes(parentSlug);
}

function getContentSubtreeSlugs(sourceSlug, visited = new Set()) {
  if (!sourceSlug || visited.has(sourceSlug)) {
    return [];
  }
  visited.add(sourceSlug);

  const out = [];
  for (const childSlug of getContentChildSlugs(sourceSlug)) {
    if (!childSlug || visited.has(childSlug)) {
      continue;
    }
    visited.add(childSlug);
    out.push(childSlug);
    out.push(...getContentSubtreeSlugs(childSlug, visited));
  }
  return out;
}

function getDesiredMountedContentSourceSlug() {
  if (state.deepProjectSlug) {
    return state.deepProjectSlug;
  }
  return desiredPrewarmContentSourceSlug;
}

function clearDeepProjectLayoutCache() {
  deepProjectLayoutCache.clear();
}

function getDeepProjectLayoutCacheKey(sourceSlug) {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const viewportMode = viewportWidth <= MOBILE_TITLE_BREAKPOINT ? "mobile" : "desktop";
  const layoutT = Number.isFinite(state.deepEntryMediaLayoutT) ? Math.round(state.deepEntryMediaLayoutT * 1000) : -1;
  return `${sourceSlug}::${viewportMode}::${layoutT}`;
}

function restoreDeepProjectLayoutFromCache(sourceSlug, childModels, rootAx, rootAy) {
  const cache = deepProjectLayoutCache.get(getDeepProjectLayoutCacheKey(sourceSlug));
  if (!cache || !Array.isArray(cache.items) || cache.items.length !== childModels.length) {
    return false;
  }

  const childBySlug = new Map(childModels.map((model) => [model.slug, model]));
  for (const item of cache.items) {
    if (!childBySlug.has(item.slug)) {
      return false;
    }
  }

  for (const item of cache.items) {
    const model = childBySlug.get(item.slug);
    model.ax = rootAx + item.dx;
    model.ay = rootAy + item.dy;
    model.x = model.ax;
    model.y = model.ay;
    model.bx = model.ax;
    model.by = model.ay;
    model.renderX = Number.NaN;
    model.renderY = Number.NaN;
    delete model.contentBaseX;
    delete model.contentBaseY;
  }
  return true;
}

function storeDeepProjectLayoutInCache(sourceSlug, childModels, rootAx, rootAy) {
  deepProjectLayoutCache.set(getDeepProjectLayoutCacheKey(sourceSlug), {
    items: childModels.map((model) => ({
      slug: model.slug,
      dx: model.ax - rootAx,
      dy: model.ay - rootAy
    }))
  });
}

function clearPendingContentPrewarm() {
  if (contentPrewarmTimeoutId != null) {
    clearTimeout(contentPrewarmTimeoutId);
    contentPrewarmTimeoutId = null;
  }
}

function cancelQueuedMediaHydration() {
  if (mediaHydrationRafId != null) {
    cancelAnimationFrame(mediaHydrationRafId);
    mediaHydrationRafId = null;
  }
  mediaHydrationQueue = [];
  queuedMediaHydrationElements.clear();
}

function releaseContentNodeMedia(node) {
  if (!node) {
    return;
  }

  if (promotedDeepMediaElement && node.contains(promotedDeepMediaElement)) {
    promotedDeepMediaElement = null;
  }

  for (const mediaElement of node.querySelectorAll(".project-media")) {
    const originalSrc = typeof mediaElement.dataset.mediaSrc === "string" ? mediaElement.dataset.mediaSrc.trim() : "";
    const previewSrc = getMediaElementLightweightSrc(mediaElement);
    mediaElement.dataset.mediaHydrated = "false";
    mediaElement.dataset.deferredSrc = previewSrc || originalSrc;
    mediaElement.dataset.previewActive = previewSrc ? "true" : "false";
    mediaElement.dataset.mobileActive = "false";
    unobserveMediaElement(mediaElement);

    if (mediaElement instanceof HTMLVideoElement) {
      try {
        mediaElement.pause();
      } catch (_error) {
        // no-op
      }
      mediaElement.removeAttribute("src");
      mediaElement.src = "";
      mediaElement.preload = "none";
      if (typeof mediaElement.load === "function") {
        mediaElement.load();
      }
      continue;
    }

    if (mediaElement instanceof HTMLImageElement) {
      invalidateMediaElementRuntimeImageObjectUrl(mediaElement);
      mediaElement.removeAttribute("loading");
      mediaElement.removeAttribute("src");
      mediaElement.src = "";
    }
  }
}

function applyFocusedClassesToMountedNodes() {
  for (const [slug, node] of nodeBySlug.entries()) {
    node.classList.toggle("is-focused", slug === state.focusedSlug);
  }
}

function syncMountedContentSubtreeDomState() {
  refreshModelVisibility(state.activeType);
  applyFocusedClassesToMountedNodes();
  refreshSeeMoreLabels();
  refreshDeepNodeClasses();
  refreshDetailsPointerInteractivity();
}

function mountProjectNodeBySlug(slug) {
  if (!slug || nodeBySlug.has(slug)) {
    return nodeBySlug.get(slug) || null;
  }
  const model = modelBySlug.get(slug);
  const project = getDisplayProject(model);
  if (!model || !project) {
    return null;
  }
  if (Array.isArray(project.media) && project.media.length) {
    applyKnownDimensionsToProjectMedia(project);
    const mediaLayouts = prepareProjectMediaVariants(project);
    mediaLayoutBySlug.set(project.slug, mediaLayouts.far);
    mediaLayoutCloseBySlug.set(project.slug, mediaLayouts.close);
    const geometry = estimateNodeGeometry(project, mediaLayouts.far, null, mediaLayouts.close);
    applyGeometryFieldsToModel(model, geometry);
  }
  const node = createProjectNode(project);
  node.style.transform = `translate(${model.x - model.centerX}px, ${model.y - model.centerY}px)`;
  world.append(node);
  nodeBySlug.set(slug, node);
  syncNodeCollisionDebug(node);
  return node;
}

function mountContentSubtree(sourceSlug) {
  const slugs = getContentSubtreeSlugs(sourceSlug);
  let changed = false;
  for (const slug of slugs) {
    if (!mountProjectNodeBySlug(slug)) {
      continue;
    }
    changed = true;
  }
  return changed;
}

function unmountContentSubtree(sourceSlug) {
  const slugs = getContentSubtreeSlugs(sourceSlug);
  let changed = false;
  for (const slug of slugs) {
    const node = nodeBySlug.get(slug);
    if (!node) {
      continue;
    }
    releaseContentNodeMedia(node);
    node.remove();
    nodeBySlug.delete(slug);
    const model = modelBySlug.get(slug);
    if (model) {
      model.renderX = Number.NaN;
      model.renderY = Number.NaN;
    }
    changed = true;
  }
  return changed;
}

function syncMountedContentSubtree({ refreshVisibility = true } = {}) {
  const nextSourceSlug = getDesiredMountedContentSourceSlug();
  if (mountedContentSourceSlug === nextSourceSlug) {
    return false;
  }

  let changed = false;
  if (mountedContentSourceSlug) {
    changed = unmountContentSubtree(mountedContentSourceSlug) || changed;
  }
  mountedContentSourceSlug = nextSourceSlug;
  if (mountedContentSourceSlug) {
    changed = mountContentSubtree(mountedContentSourceSlug) || changed;
  }

  if (changed && refreshVisibility) {
    syncMountedContentSubtreeDomState();
  }
  return changed;
}

function scheduleFocusedProjectContentPrewarm(sourceSlug) {
  clearPendingContentPrewarm();

  const hasPrewarmableContent = sourceSlug && getContentChildSlugs(sourceSlug).length > 0;
  if (!hasPrewarmableContent || state.deepProjectSlug) {
    desiredPrewarmContentSourceSlug = null;
    syncMountedContentSubtree();
    return;
  }

  if (desiredPrewarmContentSourceSlug === sourceSlug || mountedContentSourceSlug === sourceSlug) {
    return;
  }

  desiredPrewarmContentSourceSlug = null;
  syncMountedContentSubtree();
  contentPrewarmTimeoutId = window.setTimeout(() => {
    contentPrewarmTimeoutId = null;
    if (state.deepProjectSlug || state.focusedSlug !== sourceSlug) {
      return;
    }
    desiredPrewarmContentSourceSlug = sourceSlug;
    syncMountedContentSubtree();
  }, CONTENT_PREWARM_DELAY_MS);
}

function syncFocusedProjectContentPrewarm() {
  const focusedSlug = state.focusedSlug;
  const focusedModel = focusedSlug ? modelBySlug.get(focusedSlug) : null;
  const nextPrewarmSlug =
    !state.deepProjectSlug &&
    focusedModel &&
    focusedModel.nodeType !== "content" &&
    getContentChildSlugs(focusedSlug).length > 0
      ? focusedSlug
      : null;
  scheduleFocusedProjectContentPrewarm(nextPrewarmSlug);
}

function initGraphModels() {
  const { x: aspectX, y: aspectY } = getLayoutAspectFactors();

  for (const [index, project] of projects.entries()) {
    const mediaLayouts = prepareProjectMediaVariants(project);
    mediaLayoutBySlug.set(project.slug, mediaLayouts.far);
    mediaLayoutCloseBySlug.set(project.slug, mediaLayouts.close);

    const spiral = Math.sqrt((index + 0.5) / projects.length);
    const angle = index * GOLDEN_ANGLE + randomBetween(-0.18, 0.18);
    const hasInnerContent = hasProjectInnerContent(project);
    const ringBase = 132 + spiral * 344 + randomBetween(-20, 20);
    const ring = hasInnerContent ? ringBase * OVERVIEW_CONTENT_ROOT_INITIAL_RING_SCALE : ringBase;
    const x = Math.cos(angle) * ring * aspectX + randomBetween(-56, 56) * aspectX;
    const y = Math.sin(angle) * ring * aspectY + randomBetween(-28, 28) * aspectY;
    const geometry = estimateNodeGeometry(project, mediaLayouts.far, null, mediaLayouts.close);
    const model = {
      slug: project.slug,
      nodeType: "project",
      project,
      displayProject: project,
      filterTags: getProjectFilterTags(project),
      clusterTags: getProjectFilterTags(project),
      x,
      y,
      vx: 0,
      vy: 0,
      ax: x,
      ay: y,
      bx: x,
      by: y,
      halfWFar: geometry.halfWFar,
      halfHFar: geometry.halfHFar,
      halfWClose: geometry.halfWClose,
      halfHClose: geometry.halfHClose,
      textHalfWFar: geometry.textHalfWFar,
      textHalfHFar: geometry.textHalfHFar,
      textHalfWClose: geometry.textHalfWClose,
      textHalfHClose: geometry.textHalfHClose,
      centerX: geometry.centerX,
      centerY: geometry.centerY,
      focusX: geometry.focusX,
      focusY: geometry.focusY,
      renderX: Number.NaN,
      renderY: Number.NaN,
      visible: true
    };
    applyGeometryFieldsToModel(model, geometry);
    modelBySlug.set(project.slug, model);
  }

  for (const project of projects) {
    buildContentSubgraphForSource({
      sourceSlug: project.slug,
      sourceProject: project,
      sourceMediaList: mediaLayoutBySlug.get(project.slug) || project.media || [],
      items: Array.isArray(project.contentItems) ? project.contentItems : [],
      depth: 1
    });
  }

  resolvePendingContentParentLinks();
}

function buildContentSubgraphForSource({
  sourceSlug,
  sourceProject,
  sourceMediaList,
  items,
  depth = 1,
  rootSourceSlug = sourceSlug,
  rootSourceProject = sourceProject
}) {
  if (depth > MAX_CONTENT_RECURSION_DEPTH) {
    return;
  }

  const parentMedia = Array.isArray(sourceMediaList) ? sourceMediaList : [];
  const childItems = Array.isArray(items) ? items : [];
  if (!childItems.length) {
    return;
  }

  for (const [index, item] of childItems.entries()) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const sourceMediaIndex = inferSourceMediaIndexFromItem(item, parentMedia, 0);
    const sourceMedia = parentMedia[sourceMediaIndex] || parentMedia[0] || null;
    const itemMediaSrc = getContentItemSource(item) || sourceMedia?.src || "";
    if (shouldHideMotionMediaOnMobile(itemMediaSrc)) {
      continue;
    }
    const contentProjectBase = createContentItemProject(sourceProject, sourceSlug, item, sourceMedia, index);
    if (!contentProjectBase) {
      continue;
    }
    const contentProject = {
      ...contentProjectBase,
      slug: ensureUniqueContentSlug(contentProjectBase.slug)
    };

    const contentLayouts = prepareProjectMediaVariants(contentProject);
    mediaLayoutBySlug.set(contentProject.slug, contentLayouts.far);
    mediaLayoutCloseBySlug.set(contentProject.slug, contentLayouts.close);

    const geometry = estimateNodeGeometry(contentProject, contentLayouts.far, null, contentLayouts.close);
    const contentModel = {
      slug: contentProject.slug,
      nodeType: "content",
      project: contentProject,
      displayProject: contentProject,
      filterTags: getProjectFilterTags(contentProject),
      clusterTags: Array.isArray(contentProject.clusterTags) ? contentProject.clusterTags : getProjectFilterTags(contentProject),
      sourceProjectSlug: sourceSlug,
      sourceMediaIndex,
      contentIndex: index,
      contentDepth: depth,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      bx: 0,
      by: 0,
      halfWFar: geometry.halfWFar,
      halfHFar: geometry.halfHFar,
      halfWClose: geometry.halfWClose,
      halfHClose: geometry.halfHClose,
      textHalfWFar: geometry.textHalfWFar,
      textHalfHFar: geometry.textHalfHFar,
      textHalfWClose: geometry.textHalfWClose,
      textHalfHClose: geometry.textHalfHClose,
      centerX: geometry.centerX,
      centerY: geometry.centerY,
      focusX: geometry.focusX,
      focusY: geometry.focusY,
      renderX: Number.NaN,
      renderY: Number.NaN,
      visible: false
    };
    applyGeometryFieldsToModel(contentModel, geometry);
    modelBySlug.set(contentProject.slug, contentModel);

    const physicalProject = createPhysicalItemProject(
      rootSourceProject,
      rootSourceSlug,
      item,
      sourceMedia,
      sourceMediaIndex,
      contentProject,
      index
    );
    if (physicalProject) {
      const physicalLayouts = prepareProjectMediaVariants(physicalProject);
      mediaLayoutBySlug.set(physicalProject.slug, physicalLayouts.far);
      mediaLayoutCloseBySlug.set(physicalProject.slug, physicalLayouts.close);
      const physicalGeometry = estimateNodeGeometry(physicalProject, physicalLayouts.far, null, physicalLayouts.close);
      const physicalModel = {
        slug: physicalProject.slug,
        nodeType: "physical",
        project: physicalProject,
        displayProject: physicalProject,
        filterTags: ["physical"],
        clusterTags: ["physical"],
        sourceProjectSlug: sourceSlug,
        sourceMediaIndex,
        sourceContentSlug: contentProject.slug,
        contentIndex: index,
        contentDepth: depth,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        bx: 0,
        by: 0,
        halfWFar: physicalGeometry.halfWFar,
        halfHFar: physicalGeometry.halfHFar,
        halfWClose: physicalGeometry.halfWClose,
        halfHClose: physicalGeometry.halfHClose,
        textHalfWFar: physicalGeometry.textHalfWFar,
        textHalfHFar: physicalGeometry.textHalfHFar,
        textHalfWClose: physicalGeometry.textHalfWClose,
        textHalfHClose: physicalGeometry.textHalfHClose,
        centerX: physicalGeometry.centerX,
        centerY: physicalGeometry.centerY,
        focusX: physicalGeometry.focusX,
        focusY: physicalGeometry.focusY,
        renderX: Number.NaN,
        renderY: Number.NaN,
        visible: false
      };
      applyGeometryFieldsToModel(physicalModel, physicalGeometry);
      modelBySlug.set(physicalProject.slug, physicalModel);
    }

    registerContentChildLink(sourceSlug, contentProject.slug);
    const parentLinks = getAdditionalParentSlugsFromItem(item);
    if (parentLinks.length) {
      pendingContentParentLinks.push({
        childSlug: contentProject.slug,
        parentSlugs: parentLinks
      });
    }

    const nestedItems = getNestedContentItems(item);
    if (nestedItems.length) {
      buildContentSubgraphForSource({
        sourceSlug: contentProject.slug,
        sourceProject: contentProject,
        sourceMediaList: contentLayouts.far,
        items: nestedItems,
        depth: depth + 1,
        rootSourceSlug,
        rootSourceProject
      });
    }
  }
}

function getNestedContentItems(item) {
  if (Array.isArray(item?.contentItems)) {
    return item.contentItems;
  }
  if (Array.isArray(item?.children)) {
    return item.children;
  }
  return [];
}

function getAdditionalParentSlugsFromItem(item) {
  const raw =
    item?.parentSlugs ||
    item?.parents ||
    item?.attachTo ||
    item?.linkedProjects ||
    item?.linkTo ||
    [];
  if (typeof raw === "string") {
    const value = raw.trim();
    return value ? [value] : [];
  }
  if (!Array.isArray(raw)) {
    return [];
  }
  const refs = [];
  for (const entry of raw) {
    const ref = typeof entry === "string" ? entry.trim() : "";
    if (ref) {
      refs.push(ref);
    }
  }
  return refs;
}

function resolvePendingContentParentLinks() {
  if (!pendingContentParentLinks.length) {
    return;
  }
  for (const link of pendingContentParentLinks) {
    const childSlug = typeof link?.childSlug === "string" ? link.childSlug : "";
    if (!childSlug || !modelBySlug.has(childSlug)) {
      continue;
    }
    const parentSlugs = Array.isArray(link?.parentSlugs) ? link.parentSlugs : [];
    for (const rawParentSlug of parentSlugs) {
      const parentSlug = typeof rawParentSlug === "string" ? rawParentSlug.trim() : "";
      if (!parentSlug || !modelBySlug.has(parentSlug)) {
        continue;
      }
      registerContentChildLink(parentSlug, childSlug);
    }
  }
  pendingContentParentLinks.length = 0;
}

function normalizeContentSlugPart(value, fallback = "item") {
  const raw = typeof value === "string" ? value.trim() : String(value ?? "").trim();
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function ensureUniqueContentSlug(baseSlug) {
  const base = typeof baseSlug === "string" && baseSlug.trim() ? baseSlug.trim() : `content:auto:${modelBySlug.size}`;
  if (!modelBySlug.has(base) && !mediaLayoutBySlug.has(base)) {
    return base;
  }
  let suffix = 2;
  while (modelBySlug.has(`${base}~${suffix}`) || mediaLayoutBySlug.has(`${base}~${suffix}`)) {
    suffix += 1;
  }
  return `${base}~${suffix}`;
}

function buildPhysicalDetailsRows(sourceProject) {
  const rows = [];
  if (sourceProject?.client) {
    rows.push({ label: "CLIENT", value: String(sourceProject.client).toUpperCase() });
  }
  if (sourceProject?.location) {
    rows.push({ label: "LOCATION", value: String(sourceProject.location).toUpperCase() });
  }
  if (sourceProject?.year) {
    rows.push({ label: "DATE", value: String(sourceProject.year) });
  }
  if (sourceProject?.madeWith) {
    rows.push({ label: "MADE WITH", value: String(sourceProject.madeWith) });
  }
  return rows;
}

function createPhysicalItemProject(sourceProject, sourceSlug, item, sourceMedia, sourceMediaIndex, contentProject, index) {
  if (!item || item.physical !== true || !contentProject?.media?.[0]?.src) {
    return null;
  }

  const itemMedia = item?.media && typeof item.media === "object" ? item.media : null;
  const titleRaw =
    (typeof item?.label === "string" && item.label.trim()) ||
    (typeof item?.title === "string" && item.title.trim()) ||
    `OBJECT ${index + 1}`;
  const role = item?.rootRole || itemMedia?.role || item?.role || sourceMedia?.role || "";
  const size = item?.rootSize || "";
  const itemSlugPart = normalizeContentSlugPart(
    item?.id || item?.slug || titleRaw || `item-${index + 1}`,
    `item-${index + 1}`
  );
  const parentSlug = normalizeContentSlugPart(sourceSlug, "root");

  return {
    slug: ensureUniqueContentSlug(`physical:${parentSlug}:${itemSlugPart}`),
    title: titleRaw.toUpperCase(),
    types: ["physical"],
    tags: ["physical"],
    client: "",
    location: "",
    year: "",
    focusZoom: MAX_ZOOM,
    detailsText: "",
    detailsRows: buildPhysicalDetailsRows(sourceProject),
    clusterTags: ["physical"],
    moreLabel: "",
    moreUrl: "",
    nodeVariant: "physical-item",
    deepLinkSourceSlug: sourceSlug,
    deepLinkFocusSlug: contentProject.slug,
    deepLinkMediaIndex: sourceMediaIndex,
    media: [
      {
        src: contentProject.media[0].src,
        role,
        size,
        r: item?.rootR || itemMedia?.r || item?.r || sourceMedia?.r || "0deg"
      }
    ]
  };
}

function createContentItemProject(sourceProject, sourceSlug, item, sourceMedia, index) {
  const itemMedia = item?.media && typeof item.media === "object" ? item.media : null;
  const resolvedSrc =
    (typeof itemMedia?.src === "string" && itemMedia.src.trim()) ||
    (typeof item?.src === "string" && item.src.trim()) ||
    sourceMedia?.src ||
    "";
  if (!resolvedSrc) {
    return null;
  }

  const knownDims = getKnownMediaDimensionsBySrc(resolvedSrc);
  const baseWidth = Math.max(1, Number(knownDims?.w) || 180);
  const baseHeight = Math.max(1, Number(knownDims?.h) || 180);
  const titleRaw =
    (typeof item?.label === "string" && item.label.trim()) ||
    (typeof item?.title === "string" && item.title.trim()) ||
    `CONTENT ${index + 1}`;
  const detailsText = typeof item?.description === "string" ? item.description.trim() : "";
  const role = itemMedia?.role || item?.role || sourceMedia?.role || "";
  const size = itemMedia?.size || item?.size || "";
  const normalizedDims = getContentMediaDimensionsForLayout(baseWidth, baseHeight, role, resolvedSrc, size, {
    label: titleRaw,
    description: detailsText
  });
  const width = normalizedDims.w;
  const height = normalizedDims.h;
  const mediaX = Number.isFinite(Number(item?.mediaX)) ? Number(item.mediaX) : 0;
  const detailsTop = PROJECT_TEXT_BOX_HEIGHT + CONTENT_DETAILS_TOP_GAP;
  const mediaY = Number.isFinite(Number(item?.mediaY))
    ? Number(item.mediaY)
    : Math.round(detailsTop - height - CONTENT_MEDIA_NOTE_GAP);
  const itemSlugPart = normalizeContentSlugPart(
    item?.id || item?.slug || titleRaw || `item-${index + 1}`,
    `item-${index + 1}`
  );
  const parentSlug = normalizeContentSlugPart(sourceSlug, "root");
  const nestedItems = getNestedContentItems(item);
  const clusterTags = inferContentClusterTags(item, sourceProject, sourceMedia);
  const itemTags = clusterTags.length
    ? [...clusterTags]
    : collectNormalizedTags(item?.types, item?.tags, sourceProject?.types, sourceProject?.tags);

  return {
    slug: `content:${parentSlug}:${itemSlugPart}`,
    title: titleRaw.toUpperCase(),
    types: [],
    tags: itemTags,
    client: "",
    location: "",
    year: "",
    focusZoom: Math.min(1.28, sourceProject.focusZoom || MAX_ZOOM),
    detailsText,
    detailsRows: cloneProjectDetailsRows(item.detailsRows),
    clusterTags,
    moreLabel: "",
    moreUrl: "",
    nodeVariant: "content-item",
    mediaLayout: "manual",
    contentItems: nestedItems,
    media: [
      {
        src: resolvedSrc,
        role,
        size,
        x: mediaX,
        y: mediaY,
        w: width,
        h: height,
        r: itemMedia?.r || item?.r || sourceMedia?.r || "0deg"
      }
    ]
  };
}

function getBaseGraphModels() {
  return [...modelBySlug.values()].filter((model) => model.nodeType !== "content" && model.nodeType !== "physical");
}

function modelMatchesFilterType(model, type) {
  if (type === "all") {
    return true;
  }
  return Array.isArray(model?.filterTags) && model.filterTags.includes(type);
}

function isPhysicalItemProject(project) {
  return Boolean(project?.nodeVariant === "physical-item");
}

function isPhysicalItemModel(model) {
  return model?.nodeType === "physical" || isPhysicalItemProject(getDisplayProject(model));
}

function isModelVisibleForFilter(model, type) {
  if (state.deepProjectSlug) {
    if (model.slug === state.deepProjectSlug) {
      return true;
    }
    return hasContentParent(model.slug, state.deepProjectSlug) && modelMatchesFilterType(model, type);
  }
  if (type === "physical") {
    return isPhysicalItemModel(model);
  }
  if (isPhysicalItemModel(model)) {
    return false;
  }
  return model.nodeType !== "content" && modelMatchesFilterType(model, type);
}

function getDisplayProject(model) {
  return model?.displayProject || model?.project || null;
}

function isContentNodeProject(project) {
  return Boolean(project?.nodeVariant === "content-item");
}

function hasProjectInnerContent(project) {
  return Boolean(Array.isArray(project?.contentItems) && project.contentItems.length > 0);
}

function isOverviewContentRootModel(model) {
  return model?.nodeType === "project" && hasProjectInnerContent(getDisplayProject(model));
}

function getContentProjectNoteData(project, mediaIndex = 0) {
  if (!isContentNodeProject(project) || mediaIndex !== 0) {
    return null;
  }
  const label = typeof project.title === "string" ? project.title.trim() : "";
  const description = typeof project.detailsText === "string" ? project.detailsText.trim() : "";
  if (!label && !description) {
    return null;
  }
  return { label, description };
}

function getMediaSrcKey(src) {
  if (typeof src !== "string" || !src.trim()) {
    return "";
  }
  const raw = src.trim();
  const lastSegment = (() => {
    try {
      const pathname = new URL(raw, window.location.href).pathname || raw;
      return pathname.split("/").pop() || pathname;
    } catch (_error) {
      return raw.split("/").pop() || raw;
    }
  })();
  return decodeURIComponent(lastSegment).toLowerCase();
}

function isSvgMediaSrc(src) {
  const key = getMediaSrcKey(src);
  return key.endsWith(".svg");
}

function isVideoMediaSrc(src) {
  const key = getMediaSrcKey(src);
  return key.endsWith(".mp4") || key.endsWith(".m4v") || key.endsWith(".mov") || key.endsWith(".webm");
}

function isGifMediaSrc(src) {
  return getMediaSrcKey(src).endsWith(".gif");
}

function isMotionMediaSrc(src) {
  return isVideoMediaSrc(src) || isGifMediaSrc(src);
}

function shouldRoundProjectMedia(src) {
  return !isSvgMediaSrc(src);
}

function normalizeMediaDimensions(width, height) {
  const w = Math.round(Number(width) || 0);
  const h = Math.round(Number(height) || 0);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return null;
  }
  return { w, h };
}

function getKnownMediaDimensionsBySrc(src) {
  const key = getMediaSrcKey(src);
  if (!key) {
    return null;
  }
  const runtime = runtimeMediaSizeByKey.get(key);
  if (runtime) {
    return runtime;
  }
  const manifest = mediaManifestByName[key];
  return manifest ? normalizeMediaDimensions(manifest.w, manifest.h) : null;
}

function getGraphMediaProxyBySrc(src) {
  if (typeof src !== "string" || !src.trim()) {
    return null;
  }
  const entry = mediaProxyManifestBySrc[src.trim()];
  if (!entry || typeof entry !== "object" || typeof entry.src !== "string" || !entry.src.trim()) {
    return null;
  }
  return entry;
}

function getMediaPreviewBySrc(src) {
  if (!USE_CONTENT_MEDIA_PREVIEWS || typeof src !== "string" || !src.trim()) {
    return null;
  }
  const exact = mediaPreviewManifestBySrc[src.trim()];
  if (exact && typeof exact === "object" && typeof exact.src === "string" && exact.src.trim()) {
    return exact;
  }
  return null;
}

function getMediaPreviewSrcByMediaSrc(src) {
  const preview = getMediaPreviewBySrc(src);
  return typeof preview?.src === "string" && preview.src.trim() ? preview.src.trim() : "";
}

function getMediaThumbSrcByMediaSrc(src) {
  const preview = getMediaPreviewBySrc(src);
  return typeof preview?.thumbSrc === "string" && preview.thumbSrc.trim() ? preview.thumbSrc.trim() : "";
}

function getMobileMediaSrcByMediaSrc(src) {
  const preview = getMediaPreviewBySrc(src);
  return typeof preview?.mobileSrc === "string" && preview.mobileSrc.trim() ? preview.mobileSrc.trim() : "";
}

function getPreferredGraphProxySrc(entry) {
  if (!entry || typeof entry !== "object") {
    return "";
  }
  if (
    isMobileDeepProjectLayoutMode() &&
    typeof entry.mobileSrc === "string" &&
    entry.mobileSrc.trim()
  ) {
    return entry.mobileSrc.trim();
  }
  return typeof entry.src === "string" ? entry.src.trim() : "";
}

function isMobileViewport() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  return viewportWidth <= MOBILE_TITLE_BREAKPOINT;
}

function isMobileMediaMode() {
  if (isMobileViewport()) {
    return true;
  }
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const viewportHeight = state.stageHeight || stage.clientHeight || window.innerHeight || 0;
  const shortestViewportSide = Math.min(
    viewportWidth || Number.POSITIVE_INFINITY,
    viewportHeight || Number.POSITIVE_INFINITY
  );
  const shortestScreenSide =
    typeof window.screen === "object"
      ? Math.min(Number(window.screen.width) || Number.POSITIVE_INFINITY, Number(window.screen.height) || Number.POSITIVE_INFINITY)
      : Number.POSITIVE_INFINITY;
  const coarsePointer =
    typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  const hasTouch = Number(navigator.maxTouchPoints) > 0 || "ontouchstart" in window;
  return (coarsePointer || hasTouch) && Math.min(shortestViewportSide, shortestScreenSide) <= MOBILE_TITLE_BREAKPOINT;
}

function shouldDisableVideoPlayback() {
  return DISABLE_ALL_VIDEO_MEDIA || (DISABLE_MOBILE_VIDEO_MEDIA && isMobileMediaMode());
}

function shouldHideMotionMediaOnMobile(src) {
  return HIDE_MOBILE_MOTION_MEDIA && isMobileMediaMode() && isMotionMediaSrc(src);
}

function shouldUseMobileBoundedFullMedia() {
  return USE_MOBILE_BOUNDED_FULL_MEDIA && isMobileMediaMode();
}

function getVideoPosterSrcByMediaSrc(src) {
  const proxy = getGraphMediaProxyBySrc(src);
  return typeof proxy?.posterSrc === "string" && proxy.posterSrc.trim() ? proxy.posterSrc.trim() : "";
}

function applyKnownDimensionsToProjectMedia(project) {
  if (!project || !Array.isArray(project.media) || !project.media.length) {
    return false;
  }
  let changed = false;
  for (const media of project.media) {
    if (!media || typeof media !== "object") {
      continue;
    }
    const known = getKnownMediaDimensionsBySrc(media.src);
    if (!known) {
      continue;
    }
    const prevW = Math.round(Number(media.w) || 0);
    const prevH = Math.round(Number(media.h) || 0);
    if (prevW !== known.w || prevH !== known.h) {
      media.w = known.w;
      media.h = known.h;
      changed = true;
    }
  }
  return changed;
}

function recomputeModelMediaLayout(slug) {
  const model = modelBySlug.get(slug);
  if (!model) {
    return false;
  }
  const project = getDisplayProject(model);
  if (!project || !Array.isArray(project.media) || !project.media.length) {
    return false;
  }

  applyKnownDimensionsToProjectMedia(project);
  const titleWidth = getMeasuredProjectTitleWidth(slug, project);
  const mediaLayouts = prepareProjectMediaVariants(project, titleWidth, slug);
  mediaLayoutBySlug.set(project.slug, mediaLayouts.far);
  mediaLayoutCloseBySlug.set(project.slug, mediaLayouts.close);
  applyNodeMediaLayout(slug, mediaLayouts.far, mediaLayouts.close);

  const geometry = estimateNodeGeometry(project, mediaLayouts.far, titleWidth, mediaLayouts.close);
  applyGeometryFieldsToModel(model, geometry);
  model.renderX = Number.NaN;
  model.renderY = Number.NaN;

  return true;
}

function flushMediaResizeRelayout() {
  mediaResizeRelayoutScheduled = false;
  if (!pendingMediaResizeSlugs.size) {
    return;
  }
  clearDeepProjectLayoutCache();

  let changedBaseModel = false;
  const slugs = [...pendingMediaResizeSlugs];
  pendingMediaResizeSlugs.clear();
  for (const slug of slugs) {
    if (!recomputeModelMediaLayout(slug)) {
      continue;
    }
    const model = modelBySlug.get(slug);
    if (model && model.nodeType !== "content") {
      changedBaseModel = true;
    }
  }

  if (changedBaseModel) {
    rebuildLayoutsForViewport();
    if (state.activeType === "physical") {
      applyPhysicalFilterAnchors(capturePhysicalFilterAnchors());
    }
  }
  if (state.deepProjectSlug) {
    relayoutDeepProjectContent(state.deepProjectSlug);
    refreshModelVisibility(state.activeType);
  }
  if (state.focusedSlug && modelBySlug.get(state.focusedSlug)?.visible) {
    // Media load/resize can race with an active focus animation; keep the new target,
    // but do not hard-snap the camera mid-flight.
    recenterFocusedProjectAtCurrentZoom(false);
  }
}

function scheduleMediaResizeRelayout(slug) {
  if (slug) {
    pendingMediaResizeSlugs.add(slug);
  }
  if (mediaResizeRelayoutScheduled) {
    return;
  }
  mediaResizeRelayoutScheduled = true;
  requestAnimationFrame(flushMediaResizeRelayout);
}

function tryAutoplayProjectMediaVideo(videoElement) {
  if (!(videoElement instanceof HTMLVideoElement)) {
    return;
  }
  if (shouldDisableVideoPlayback()) {
    if (!setVideoElementToPreviewPosterOnly(videoElement) && !setVideoElementToPosterOnly(videoElement)) {
      clearVideoElementPlaybackSource(videoElement);
    }
    return;
  }
  if (videoElement.dataset.videoPosterOnly === "true" || !(videoElement.currentSrc || videoElement.src || "").trim()) {
    return;
  }

  const playAttempt = videoElement.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {});
  }
}

function hydrateDeferredProjectMediaElement(slug, mediaIndex, mediaElement) {
  if (!(mediaElement instanceof HTMLImageElement) && !(mediaElement instanceof HTMLVideoElement)) {
    return false;
  }
  const deferredSrc = typeof mediaElement.dataset.deferredSrc === "string" ? mediaElement.dataset.deferredSrc.trim() : "";
  if (!deferredSrc || mediaElement.dataset.mediaHydrated === "true") {
    return false;
  }

  mediaElement.dataset.mediaHydrated = "true";
  mediaElement.dataset.deferredSrc = "";

  if (mediaElement instanceof HTMLVideoElement) {
    if (shouldDisableVideoPlayback()) {
      if (!setVideoElementToPreviewPosterOnly(mediaElement) && !setVideoElementToPosterOnly(mediaElement)) {
        clearVideoElementPlaybackSource(mediaElement);
      }
      return true;
    }

    if (mediaElementUsesPreviewSource(mediaElement)) {
      setVideoElementToPreviewPosterOnly(mediaElement);
      return true;
    }

    if (shouldUsePosterOnlyVideoProxy(mediaElement)) {
      const posterSrc = getMediaElementProxyPosterSrc(mediaElement);
      mediaElement.dataset.videoPosterOnly = "true";
      if (posterSrc) {
        mediaElement.poster = posterSrc;
      }
      try {
        mediaElement.pause();
      } catch (_error) {
        // no-op
      }
      mediaElement.removeAttribute("src");
      mediaElement.src = "";
      mediaElement.preload = "none";
      if (typeof mediaElement.load === "function") {
        mediaElement.load();
      }
      return true;
    }

    mediaElement.dataset.videoPosterOnly = "false";
    mediaElement.src = mediaElement.dataset.proxyActive === "true" ? getResolvedMediaElementProxySrc(mediaElement) || deferredSrc : deferredSrc;
    mediaElement.preload = getMediaElementProxySrc(mediaElement) ? "auto" : "metadata";
    if (typeof mediaElement.load === "function") {
      mediaElement.load();
    }
    if (mediaElement.readyState >= 1 && mediaElement.videoWidth > 0 && mediaElement.videoHeight > 0) {
      handleProjectMediaElementLoad(slug, mediaIndex, mediaElement);
      tryAutoplayProjectMediaVideo(mediaElement);
    }
  } else {
    setImageElementToDirectSource(
      mediaElement,
      mediaElement.dataset.proxyActive === "true" ? getResolvedMediaElementProxySrc(mediaElement) || deferredSrc : deferredSrc
    );
    if (mediaElement.complete && mediaElement.naturalWidth > 0 && mediaElement.naturalHeight > 0) {
      handleProjectMediaElementLoad(slug, mediaIndex, mediaElement);
    }
  }

  return true;
}

function hydrateNodeMedia(slug) {
  if (!slug) {
    return false;
  }
  const node = nodeBySlug.get(slug);
  if (!node) {
    return false;
  }

  let changed = false;
  for (const mediaElement of node.querySelectorAll(".project-media")) {
    const mediaIndex = Number.parseInt(mediaElement.dataset.mediaIndex || "0", 10);
    if (hydrateDeferredProjectMediaElement(slug, mediaIndex, mediaElement)) {
      changed = true;
    }
  }
  return changed;
}

function getMediaHydrationBatchSize() {
  return isMobileMediaMode() ? MOBILE_MEDIA_HYDRATION_BATCH_SIZE : DESKTOP_MEDIA_HYDRATION_BATCH_SIZE;
}

function runQueuedMediaHydration() {
  mediaHydrationRafId = null;
  const batchSize = getMediaHydrationBatchSize();
  let processed = 0;
  while (mediaHydrationQueue.length && processed < batchSize) {
    const item = mediaHydrationQueue.shift();
    const mediaElement = item?.mediaElement;
    if (!mediaElement) {
      continue;
    }
    queuedMediaHydrationElements.delete(mediaElement);
    if (!mediaElement.isConnected || mediaElement.dataset.mediaHydrated === "true") {
      continue;
    }
    hydrateDeferredProjectMediaElement(item.slug, item.mediaIndex, mediaElement);
    observeVideoForPlayback(mediaElement);
    observeMediaForEviction(mediaElement);
    processed += 1;
  }
  if (mediaHydrationQueue.length) {
    mediaHydrationRafId = requestAnimationFrame(runQueuedMediaHydration);
  }
}

function queueProjectMediaHydration(slug, mediaIndex, mediaElement) {
  if (!(mediaElement instanceof HTMLImageElement) && !(mediaElement instanceof HTMLVideoElement)) {
    return false;
  }
  if (mediaElement.dataset.mediaHydrated === "true" || queuedMediaHydrationElements.has(mediaElement)) {
    return false;
  }
  queuedMediaHydrationElements.add(mediaElement);
  mediaHydrationQueue.push({ slug, mediaIndex, mediaElement });
  if (mediaHydrationRafId == null) {
    mediaHydrationRafId = requestAnimationFrame(runQueuedMediaHydration);
  }
  return true;
}

function hydrateOrQueueDeferredProjectMediaElement(slug, mediaIndex, mediaElement) {
  if (isMobileMediaMode()) {
    return queueProjectMediaHydration(slug, mediaIndex, mediaElement);
  }
  return hydrateDeferredProjectMediaElement(slug, mediaIndex, mediaElement);
}

function queueNodeMediaHydration(slug) {
  if (!slug) {
    return false;
  }
  const node = nodeBySlug.get(slug);
  if (!node) {
    return false;
  }

  let queued = false;
  for (const mediaElement of node.querySelectorAll(".project-media")) {
    const mediaIndex = Number.parseInt(mediaElement.dataset.mediaIndex || "0", 10);
    if (hydrateOrQueueDeferredProjectMediaElement(slug, mediaIndex, mediaElement)) {
      queued = true;
    }
  }
  return queued;
}

function hydrateDeepProjectMedia(sourceSlug, { queued = isMobileMediaMode() } = {}) {
  if (!sourceSlug) {
    return false;
  }
  if (queued) {
    let changed = queueNodeMediaHydration(sourceSlug);
    for (const childSlug of getContentChildSlugs(sourceSlug)) {
      if (queueNodeMediaHydration(childSlug)) {
        changed = true;
      }
    }
    return changed;
  }
  let changed = hydrateNodeMedia(sourceSlug);
  for (const childSlug of getContentChildSlugs(sourceSlug)) {
    if (hydrateNodeMedia(childSlug)) {
      changed = true;
    }
  }
  return changed;
}

let lazyMediaHydrationObserver = null;
let videoPlaybackObserver = null;
let mediaEvictionObserver = null;
let lazyMediaHydrationObserverRootMargin = "";
let mediaEvictionObserverRootMargin = "";

function getDeepMediaHydrationRootMargin() {
  const margin = isMobileDeepProjectLayoutMode()
    ? MOBILE_MEDIA_HYDRATION_ROOT_MARGIN_PX
    : MEDIA_HYDRATION_ROOT_MARGIN_PX;
  return `${margin}px ${margin}px`;
}

function getDeepMediaEvictionRootMargin() {
  const margin = isMobileDeepProjectLayoutMode()
    ? MOBILE_MEDIA_EVICTION_ROOT_MARGIN_PX
    : MEDIA_EVICTION_ROOT_MARGIN_PX;
  return `${margin}px ${margin}px`;
}

function getLazyMediaHydrationObserver() {
  const rootMargin = getDeepMediaHydrationRootMargin();
  if (lazyMediaHydrationObserver && lazyMediaHydrationObserverRootMargin === rootMargin) {
    return lazyMediaHydrationObserver;
  }
  if (typeof IntersectionObserver === "undefined") {
    return null;
  }
  if (lazyMediaHydrationObserver) {
    lazyMediaHydrationObserver.disconnect();
  }
  lazyMediaHydrationObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        const el = entry.target;
        const slug = typeof el.dataset.projectSlug === "string" ? el.dataset.projectSlug : "";
        const idx = Number.parseInt(el.dataset.mediaIndex || "0", 10);
        hydrateOrQueueDeferredProjectMediaElement(slug, idx, el);
        lazyMediaHydrationObserver.unobserve(el);
        observeVideoForPlayback(el);
        observeMediaForEviction(el);
      }
    },
    { rootMargin, threshold: 0 }
  );
  lazyMediaHydrationObserverRootMargin = rootMargin;
  return lazyMediaHydrationObserver;
}

function getMediaEvictionObserver() {
  const rootMargin = getDeepMediaEvictionRootMargin();
  if (mediaEvictionObserver && mediaEvictionObserverRootMargin === rootMargin) {
    return mediaEvictionObserver;
  }
  if (typeof IntersectionObserver === "undefined") {
    return null;
  }
  if (mediaEvictionObserver) {
    mediaEvictionObserver.disconnect();
  }
  mediaEvictionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          continue;
        }
        evictHydratedMediaElement(entry.target);
      }
    },
    { rootMargin, threshold: 0 }
  );
  mediaEvictionObserverRootMargin = rootMargin;
  return mediaEvictionObserver;
}

function observeMediaForEviction(mediaElement) {
  if (!mediaElement) {
    return;
  }
  const observer = getMediaEvictionObserver();
  if (!observer) {
    return;
  }
  observer.observe(mediaElement);
}

function evictHydratedMediaElement(mediaElement) {
  if (!mediaElement || mediaElement.dataset.mediaHydrated !== "true") {
    return;
  }
  const originalSrc = typeof mediaElement.dataset.mediaSrc === "string" ? mediaElement.dataset.mediaSrc.trim() : "";
  if (!originalSrc) {
    return;
  }
  const previewSrc = getMediaElementLightweightSrc(mediaElement);
  mediaElement.dataset.mediaHydrated = "false";
  mediaElement.dataset.deferredSrc = previewSrc || originalSrc;
  mediaElement.dataset.previewActive = previewSrc ? "true" : "false";
  mediaElement.dataset.mobileActive = "false";

  if (mediaElement instanceof HTMLVideoElement) {
    try {
      mediaElement.pause();
    } catch (_error) {
      // no-op
    }
    mediaElement.removeAttribute("src");
    mediaElement.src = "";
    mediaElement.preload = "none";
    if (typeof mediaElement.load === "function") {
      mediaElement.load();
    }
    if (videoPlaybackObserver) {
      videoPlaybackObserver.unobserve(mediaElement);
    }
  } else if (mediaElement instanceof HTMLImageElement) {
    invalidateMediaElementRuntimeImageObjectUrl(mediaElement);
    mediaElement.removeAttribute("src");
    mediaElement.src = "";
  }

  if (mediaEvictionObserver) {
    mediaEvictionObserver.unobserve(mediaElement);
  }
  // Re-queue for lazy hydration so it reloads if it comes back in range
  const lazyObserver = getLazyMediaHydrationObserver();
  if (lazyObserver) {
    lazyObserver.observe(mediaElement);
  }
}

function getVideoPlaybackObserver() {
  if (videoPlaybackObserver) {
    return videoPlaybackObserver;
  }
  if (typeof IntersectionObserver === "undefined") {
    return null;
  }
  videoPlaybackObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (!(el instanceof HTMLVideoElement)) {
          continue;
        }
        if (entry.isIntersecting) {
          tryAutoplayProjectMediaVideo(el);
        } else {
          try {
            el.pause();
          } catch (_error) {
            // no-op
          }
        }
      }
    },
    { rootMargin: "0px 0px", threshold: 0 }
  );
  return videoPlaybackObserver;
}

function observeMediaForLazyHydration(mediaElement) {
  if (!mediaElement || mediaElement.dataset.mediaHydrated === "true") {
    return false;
  }
  const observer = getLazyMediaHydrationObserver();
  if (!observer) {
    // fallback: synchronously hydrate if IO is unavailable
    const slug = typeof mediaElement.dataset.projectSlug === "string" ? mediaElement.dataset.projectSlug : "";
    const idx = Number.parseInt(mediaElement.dataset.mediaIndex || "0", 10);
    return hydrateOrQueueDeferredProjectMediaElement(slug, idx, mediaElement);
  }
  observer.observe(mediaElement);
  return false;
}

function observeVideoForPlayback(mediaElement) {
  if (!(mediaElement instanceof HTMLVideoElement)) {
    return;
  }
  const observer = getVideoPlaybackObserver();
  if (!observer) {
    return;
  }
  observer.observe(mediaElement);
}

function unobserveMediaElement(mediaElement) {
  if (!mediaElement) {
    return;
  }
  if (lazyMediaHydrationObserver) {
    lazyMediaHydrationObserver.unobserve(mediaElement);
  }
  if (videoPlaybackObserver) {
    videoPlaybackObserver.unobserve(mediaElement);
  }
  if (mediaEvictionObserver) {
    mediaEvictionObserver.unobserve(mediaElement);
  }
}

function getMediaElementProxySrc(mediaElement) {
  return typeof mediaElement?.dataset?.proxySrc === "string" ? mediaElement.dataset.proxySrc.trim() : "";
}

function getMediaElementProxyPosterSrc(mediaElement) {
  return typeof mediaElement?.dataset?.proxyPosterSrc === "string" ? mediaElement.dataset.proxyPosterSrc.trim() : "";
}

function getMediaElementProxyMatte(mediaElement) {
  return typeof mediaElement?.dataset?.proxyMatte === "string" ? mediaElement.dataset.proxyMatte.trim().toLowerCase() : "";
}

function getMediaElementPreviewSrc(mediaElement) {
  return typeof mediaElement?.dataset?.previewSrc === "string" ? mediaElement.dataset.previewSrc.trim() : "";
}

function getMediaElementThumbSrc(mediaElement) {
  return typeof mediaElement?.dataset?.thumbSrc === "string" ? mediaElement.dataset.thumbSrc.trim() : "";
}

function getMediaElementMobileSrc(mediaElement) {
  return typeof mediaElement?.dataset?.mobileSrc === "string" ? mediaElement.dataset.mobileSrc.trim() : "";
}

function getMediaElementLightweightSrc(mediaElement) {
  if (isMobileMediaMode()) {
    return getMediaElementThumbSrc(mediaElement) || getMediaElementPreviewSrc(mediaElement);
  }
  return getMediaElementPreviewSrc(mediaElement);
}

function getMediaElementFullSrc(mediaElement) {
  return typeof mediaElement?.dataset?.mediaSrc === "string" ? mediaElement.dataset.mediaSrc.trim() : "";
}

function mediaElementUsesProxySource(mediaElement) {
  const proxySrc = getMediaElementProxySrc(mediaElement);
  if (!proxySrc) {
    return false;
  }
  return mediaElement?.dataset?.proxyActive === "true";
}

function mediaElementUsesPreviewSource(mediaElement) {
  const previewSrc = getMediaElementPreviewSrc(mediaElement);
  if (!previewSrc) {
    return false;
  }
  return mediaElement?.dataset?.previewActive === "true";
}

function mediaElementUsesMobileSource(mediaElement) {
  const mobileSrc = getMediaElementMobileSrc(mediaElement);
  if (!mobileSrc) {
    return false;
  }
  return mediaElement?.dataset?.mobileActive === "true";
}

function getResolvedMediaElementProxySrc(mediaElement) {
  const proxySrc = getMediaElementProxySrc(mediaElement);
  if (!proxySrc) {
    return "";
  }
  return cleanedBlackMatteProxyUrlBySrc.get(proxySrc) || proxySrc;
}

function shouldUsePosterOnlyVideoProxy(mediaElement) {
  return (
    mediaElement instanceof HTMLVideoElement &&
    Boolean(state.deepProjectSlug) &&
    isMobileDeepProjectLayoutMode() &&
    Boolean(getMediaElementProxyPosterSrc(mediaElement))
  );
}

function getMediaProxyPixelIndex(width, x, y) {
  return (y * width + x) * 4;
}

function isBlackMatteRgbaPixel(data, width, x, y) {
  const index = getMediaProxyPixelIndex(width, x, y);
  const alpha = data[index + 3];
  if (alpha < 180) {
    return false;
  }
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
  return luma <= 20 && Math.max(r, g, b) <= 36;
}

function looksLikeBlackMatteProxyImage(imageElement) {
  if (!(imageElement instanceof HTMLImageElement) || imageElement.naturalWidth <= 0 || imageElement.naturalHeight <= 0) {
    return false;
  }
  if (getMediaElementProxyMatte(imageElement) === "black") {
    return true;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 5;
  canvas.height = 5;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return false;
  }

  ctx.drawImage(imageElement, 0, 0, 5, 5);
  const { data } = ctx.getImageData(0, 0, 5, 5);
  const pixels = [];
  for (let index = 0; index <= data.length - 4; index += 4) {
    pixels.push({
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3]
    });
  }
  const corners = [pixels[0], pixels[4], pixels[20], pixels[24]];
  const informativeInsidePixels = pixels.filter((_, index) => ![0, 4, 20, 24].includes(index)).filter((pixel) => {
    const luma = pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722;
    return pixel.a >= 32 && (luma >= 18 || pixel.r >= 18 || pixel.g >= 18 || pixel.b >= 18);
  }).length;
  const darkOpaqueCorners = corners.filter((pixel) => {
    const luma = pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722;
    return pixel.a >= 250 && luma <= 12;
  }).length;
  return darkOpaqueCorners >= 3 && informativeInsidePixels >= 2;
}

function createBlackMatteCleanedProxyUrl(imageElement) {
  if (!(imageElement instanceof HTMLImageElement) || imageElement.naturalWidth <= 0 || imageElement.naturalHeight <= 0) {
    return Promise.resolve("");
  }

  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return Promise.resolve("");
  }

  ctx.drawImage(imageElement, 0, 0, width, height);
  let imageData;
  try {
    imageData = ctx.getImageData(0, 0, width, height);
  } catch (_error) {
    return Promise.resolve("");
  }

  const { data } = imageData;
  const visited = new Uint8Array(width * height);
  const queueX = new Int32Array(width * height);
  const queueY = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }
    const visitIndex = y * width + x;
    if (visited[visitIndex] || !isBlackMatteRgbaPixel(data, width, x, y)) {
      return;
    }
    visited[visitIndex] = 1;
    queueX[tail] = x;
    queueY[tail] = y;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    head += 1;
    const dataIndex = getMediaProxyPixelIndex(width, x, y);
    data[dataIndex + 3] = 0;
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  ctx.putImageData(imageData, 0, 0);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve("");
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

function revokeObjectUrl(objectUrl) {
  if (
    typeof objectUrl !== "string" ||
    !objectUrl.startsWith("blob:") ||
    typeof URL === "undefined" ||
    typeof URL.revokeObjectURL !== "function"
  ) {
    return;
  }
  try {
    URL.revokeObjectURL(objectUrl);
  } catch (_error) {
    // Browser may already have released it.
  }
}

function rememberCleanedBlackMatteProxyUrl(proxySrc, objectUrl) {
  if (!proxySrc || !objectUrl) {
    return;
  }

  const previous = cleanedBlackMatteProxyUrlBySrc.get(proxySrc);
  if (previous && previous !== objectUrl) {
    revokeObjectUrl(previous);
  }
  if (previous) {
    cleanedBlackMatteProxyUrlBySrc.delete(proxySrc);
  }

  cleanedBlackMatteProxyUrlBySrc.set(proxySrc, objectUrl);
  while (cleanedBlackMatteProxyUrlBySrc.size > CLEANED_BLACK_MATTE_PROXY_CACHE_LIMIT) {
    const oldestKey = cleanedBlackMatteProxyUrlBySrc.keys().next().value;
    if (!oldestKey) {
      break;
    }
    const oldestUrl = cleanedBlackMatteProxyUrlBySrc.get(oldestKey);
    cleanedBlackMatteProxyUrlBySrc.delete(oldestKey);
    revokeObjectUrl(oldestUrl);
  }
}

function clearCleanedBlackMatteProxyCache() {
  for (const objectUrl of cleanedBlackMatteProxyUrlBySrc.values()) {
    revokeObjectUrl(objectUrl);
  }
  cleanedBlackMatteProxyUrlBySrc.clear();
  pendingBlackMatteProxyJobsBySrc.clear();
}

function revokeMediaElementRuntimeImageObjectUrl(mediaElement) {
  if (!(mediaElement instanceof HTMLImageElement)) {
    return;
  }
  const objectUrl =
    typeof mediaElement.dataset.runtimeObjectUrl === "string" ? mediaElement.dataset.runtimeObjectUrl.trim() : "";
  if (objectUrl) {
    revokeObjectUrl(objectUrl);
  }
  delete mediaElement.dataset.runtimeObjectUrl;
  delete mediaElement.dataset.runtimeObjectUrlSource;
}

function invalidateMediaElementRuntimeImageObjectUrl(mediaElement) {
  if (!(mediaElement instanceof HTMLImageElement)) {
    return;
  }
  mediaElement.dataset.runtimeObjectUrlToken = "";
  revokeMediaElementRuntimeImageObjectUrl(mediaElement);
}

function clearRuntimeImageObjectUrls() {
  for (const mediaElement of world.querySelectorAll(".project-media")) {
    invalidateMediaElementRuntimeImageObjectUrl(mediaElement);
  }
}

function canUseRevocableRuntimeImageSource() {
  return (
    isMobileMediaMode() &&
    typeof window !== "undefined" &&
    typeof window.fetch === "function" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function" &&
    typeof URL.revokeObjectURL === "function"
  );
}

function setImageElementToDirectSource(mediaElement, src) {
  if (!(mediaElement instanceof HTMLImageElement) || !src) {
    return false;
  }
  invalidateMediaElementRuntimeImageObjectUrl(mediaElement);
  if (getMediaSrcKey(src) === getMediaSrcKey(mediaElement.currentSrc || mediaElement.src || "")) {
    return false;
  }
  mediaElement.removeAttribute("src");
  mediaElement.src = "";
  mediaElement.src = src;
  return true;
}

function setImageElementToRevocableRuntimeSource(mediaElement, src) {
  if (!(mediaElement instanceof HTMLImageElement) || !src) {
    return false;
  }
  if (!canUseRevocableRuntimeImageSource()) {
    return setImageElementToDirectSource(mediaElement, src);
  }

  const currentObjectUrl =
    typeof mediaElement.dataset.runtimeObjectUrl === "string" ? mediaElement.dataset.runtimeObjectUrl.trim() : "";
  const currentObjectUrlSource =
    typeof mediaElement.dataset.runtimeObjectUrlSource === "string" ? mediaElement.dataset.runtimeObjectUrlSource.trim() : "";
  if (currentObjectUrl && currentObjectUrlSource === src && (mediaElement.currentSrc || mediaElement.src || "") === currentObjectUrl) {
    return false;
  }

  const token = String(++runtimeImageObjectUrlSerial);
  mediaElement.dataset.runtimeObjectUrlToken = token;

  window
    .fetch(src, { cache: "force-cache" })
    .then((response) => {
      if (!response || !response.ok) {
        throw new Error("image fetch failed");
      }
      return response.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      const stillCurrent =
        mediaElement.isConnected &&
        mediaElement.dataset.runtimeObjectUrlToken === token &&
        mediaElement.dataset.mobileActive === "true";
      if (!stillCurrent) {
        revokeObjectUrl(objectUrl);
        return;
      }

      const previousObjectUrl =
        typeof mediaElement.dataset.runtimeObjectUrl === "string" ? mediaElement.dataset.runtimeObjectUrl.trim() : "";
      mediaElement.dataset.runtimeObjectUrl = objectUrl;
      mediaElement.dataset.runtimeObjectUrlSource = src;
      mediaElement.removeAttribute("src");
      mediaElement.src = "";
      mediaElement.src = objectUrl;
      if (previousObjectUrl && previousObjectUrl !== objectUrl) {
        revokeObjectUrl(previousObjectUrl);
      }
    })
    .catch(() => {
      const stillCurrent =
        mediaElement.isConnected &&
        mediaElement.dataset.runtimeObjectUrlToken === token &&
        mediaElement.dataset.mobileActive === "true";
      if (stillCurrent) {
        setImageElementToDirectSource(mediaElement, src);
      }
    });

  return true;
}

function queueBlackMatteProxyCleanup(mediaElement) {
  if (!(mediaElement instanceof HTMLImageElement)) {
    return;
  }
  if (isMobileMediaMode()) {
    return;
  }
  const proxySrc = getMediaElementProxySrc(mediaElement);
  if (!proxySrc || mediaElement.dataset.proxyActive !== "true") {
    return;
  }

  const cachedUrl = cleanedBlackMatteProxyUrlBySrc.get(proxySrc);
  const currentSrc = typeof mediaElement.currentSrc === "string" && mediaElement.currentSrc.trim() ? mediaElement.currentSrc : mediaElement.src || "";
  if (cachedUrl) {
    if (currentSrc !== cachedUrl) {
      mediaElement.src = cachedUrl;
    }
    return;
  }
  if (!looksLikeBlackMatteProxyImage(mediaElement)) {
    return;
  }
  if (pendingBlackMatteProxyJobsBySrc.has(proxySrc) || !mediaElement.complete || mediaElement.naturalWidth <= 0 || mediaElement.naturalHeight <= 0) {
    return;
  }

  const job = createBlackMatteCleanedProxyUrl(mediaElement)
    .then((objectUrl) => {
      if (!objectUrl) {
        return;
      }
      rememberCleanedBlackMatteProxyUrl(proxySrc, objectUrl);
      if (
        mediaElement.isConnected &&
        mediaElement.dataset.proxyActive === "true" &&
        getMediaElementProxySrc(mediaElement) === proxySrc &&
        (mediaElement.currentSrc || mediaElement.src || "") !== objectUrl
      ) {
        mediaElement.src = objectUrl;
      }
    })
    .catch(() => {})
    .finally(() => {
      pendingBlackMatteProxyJobsBySrc.delete(proxySrc);
    });

  pendingBlackMatteProxyJobsBySrc.set(proxySrc, job);
}

function setVideoElementToPosterOnly(videoElement) {
  if (!(videoElement instanceof HTMLVideoElement)) {
    return false;
  }
  const posterSrc = getMediaElementProxyPosterSrc(videoElement);
  if (!posterSrc) {
    return false;
  }

  videoElement.dataset.proxyActive = "true";
  videoElement.dataset.previewActive = "false";
  videoElement.dataset.mobileActive = "false";
  videoElement.dataset.videoPosterOnly = "true";
  videoElement.poster = posterSrc;
  clearVideoElementPlaybackSource(videoElement);
  return true;
}

function clearVideoElementPlaybackSource(videoElement) {
  if (!(videoElement instanceof HTMLVideoElement)) {
    return false;
  }
  try {
    videoElement.pause();
  } catch (_error) {
    // no-op
  }
  videoElement.removeAttribute("src");
  videoElement.src = "";
  videoElement.preload = "none";
  if (typeof videoElement.load === "function") {
    videoElement.load();
  }
  return true;
}

function setVideoElementToPreviewPosterOnly(videoElement) {
  if (!(videoElement instanceof HTMLVideoElement)) {
    return false;
  }
  const previewSrc = getMediaElementLightweightSrc(videoElement);
  if (!previewSrc) {
    return false;
  }

  videoElement.dataset.previewActive = "true";
  videoElement.dataset.proxyActive = "false";
  videoElement.dataset.mobileActive = "false";
  videoElement.dataset.videoPosterOnly = "true";
  videoElement.poster = previewSrc;
  return clearVideoElementPlaybackSource(videoElement);
}

function demoteMediaElementToProxy(mediaElement) {
  if (!mediaElement) {
    return false;
  }
  const proxySrc = getMediaElementProxySrc(mediaElement);
  if (!proxySrc || mediaElementUsesProxySource(mediaElement)) {
    return false;
  }

  if (shouldUsePosterOnlyVideoProxy(mediaElement)) {
    return setVideoElementToPosterOnly(mediaElement);
  }

  mediaElement.dataset.proxyActive = "true";
  mediaElement.dataset.previewActive = "false";
  mediaElement.dataset.mobileActive = "false";
  mediaElement.dataset.videoPosterOnly = "false";
  if (mediaElement instanceof HTMLImageElement) {
    invalidateMediaElementRuntimeImageObjectUrl(mediaElement);
  }
  mediaElement.src = getResolvedMediaElementProxySrc(mediaElement) || proxySrc;
  if (mediaElement instanceof HTMLVideoElement) {
    mediaElement.preload = "auto";
    if (typeof mediaElement.load === "function") {
      mediaElement.load();
    }
    tryAutoplayProjectMediaVideo(mediaElement);
  }
  return true;
}

function demoteMediaElementToPreview(mediaElement) {
  if (!(mediaElement instanceof HTMLImageElement) && !(mediaElement instanceof HTMLVideoElement)) {
    return false;
  }
  const previewSrc = getMediaElementLightweightSrc(mediaElement);
  if (!previewSrc || mediaElementUsesPreviewSource(mediaElement)) {
    return false;
  }

  mediaElement.dataset.proxyActive = "false";
  mediaElement.dataset.previewActive = "true";
  mediaElement.dataset.mobileActive = "false";
  if (mediaElement instanceof HTMLVideoElement) {
    return setVideoElementToPreviewPosterOnly(mediaElement);
  }

  mediaElement.dataset.videoPosterOnly = "false";
  return setImageElementToDirectSource(mediaElement, previewSrc);
}

function demoteMediaElementToLightweightSource(mediaElement) {
  if (demoteMediaElementToProxy(mediaElement)) {
    return true;
  }
  return demoteMediaElementToPreview(mediaElement);
}

function setMediaElementToMobileSource(mediaElement, { trackPromotion = false } = {}) {
  if (!(mediaElement instanceof HTMLImageElement) && !(mediaElement instanceof HTMLVideoElement)) {
    return false;
  }
  const mobileSrc = getMediaElementMobileSrc(mediaElement);
  if (!mobileSrc) {
    return false;
  }
  if (mediaElement instanceof HTMLVideoElement) {
    mediaElement.dataset.proxyActive = "false";
    mediaElement.dataset.previewActive = "false";
    mediaElement.dataset.mobileActive = "true";
    mediaElement.dataset.videoPosterOnly = "true";
    mediaElement.poster = mobileSrc;
    clearVideoElementPlaybackSource(mediaElement);
    if (trackPromotion) {
      promotedDeepMediaElement = mediaElement;
    }
    return true;
  }
  if (
    getMediaSrcKey(mobileSrc) === getMediaSrcKey(mediaElement.currentSrc || mediaElement.src || "") ||
    (mediaElement.dataset.runtimeObjectUrlSource === mobileSrc &&
      mediaElement.dataset.runtimeObjectUrl &&
      (mediaElement.currentSrc || mediaElement.src || "") === mediaElement.dataset.runtimeObjectUrl)
  ) {
    mediaElement.dataset.proxyActive = "false";
    mediaElement.dataset.previewActive = "false";
    mediaElement.dataset.mobileActive = "true";
    mediaElement.dataset.videoPosterOnly = "false";
    if (trackPromotion) {
      promotedDeepMediaElement = mediaElement;
    }
    return false;
  }

  mediaElement.dataset.proxyActive = "false";
  mediaElement.dataset.previewActive = "false";
  mediaElement.dataset.mobileActive = "true";
  mediaElement.dataset.videoPosterOnly = "false";
  setImageElementToRevocableRuntimeSource(mediaElement, mobileSrc);
  if (trackPromotion) {
    promotedDeepMediaElement = mediaElement;
  }
  return true;
}

function setMediaElementToFullSource(mediaElement, { trackPromotion = false } = {}) {
  if (!(mediaElement instanceof HTMLImageElement) && !(mediaElement instanceof HTMLVideoElement)) {
    return false;
  }
  const fullSrc = getMediaElementFullSrc(mediaElement);
  const proxySrc = getMediaElementProxySrc(mediaElement);
  const previewSrc = getMediaElementPreviewSrc(mediaElement);
  if (!fullSrc || (!proxySrc && !previewSrc)) {
    return false;
  }
  if (shouldUseMobileBoundedFullMedia() && getMediaElementMobileSrc(mediaElement)) {
    return setMediaElementToMobileSource(mediaElement, { trackPromotion });
  }
  if (shouldDisableVideoPlayback() && isMotionMediaSrc(fullSrc)) {
    if (!demoteMediaElementToLightweightSource(mediaElement) && mediaElement instanceof HTMLVideoElement) {
      clearVideoElementPlaybackSource(mediaElement);
    }
    return false;
  }
  if (getMediaSrcKey(fullSrc) === getMediaSrcKey(mediaElement.currentSrc || mediaElement.src || "")) {
    mediaElement.dataset.proxyActive = "false";
    mediaElement.dataset.previewActive = "false";
    mediaElement.dataset.mobileActive = "false";
    mediaElement.dataset.videoPosterOnly = "false";
    if (mediaElement instanceof HTMLImageElement) {
      invalidateMediaElementRuntimeImageObjectUrl(mediaElement);
    }
    if (trackPromotion) {
      promotedDeepMediaElement = mediaElement;
    }
    return false;
  }

  mediaElement.dataset.proxyActive = "false";
  mediaElement.dataset.previewActive = "false";
  mediaElement.dataset.mobileActive = "false";
  mediaElement.dataset.videoPosterOnly = "false";
  if (mediaElement instanceof HTMLVideoElement) {
    mediaElement.removeAttribute("src");
    mediaElement.src = "";
    mediaElement.src = fullSrc;
    mediaElement.preload = "metadata";
    if (typeof mediaElement.load === "function") {
      mediaElement.load();
    }
    tryAutoplayProjectMediaVideo(mediaElement);
  } else if (mediaElement instanceof HTMLImageElement) {
    setImageElementToDirectSource(mediaElement, fullSrc);
  }
  if (trackPromotion) {
    promotedDeepMediaElement = mediaElement;
  }
  return true;
}

function clearPromotedDeepMediaElement() {
  if (!promotedDeepMediaElement) {
    return;
  }
  demoteMediaElementToLightweightSource(promotedDeepMediaElement);
  promotedDeepMediaElement = null;
}

function demoteConnectedDeepMediaToLightweight({ except = null } = {}) {
  if (!state.deepProjectSlug) {
    return false;
  }
  let changed = false;
  for (const mediaElement of world.querySelectorAll(".project-media")) {
    if (except && mediaElement === except) {
      continue;
    }
    const node = mediaElement.closest(".project-node");
    const slug = typeof node?.dataset?.slug === "string" ? node.dataset.slug : "";
    const model = slug ? modelBySlug.get(slug) : null;
    if (!model || !model.visible) {
      continue;
    }
    if (demoteMediaElementToLightweightSource(mediaElement)) {
      changed = true;
    }
  }
  if (promotedDeepMediaElement && promotedDeepMediaElement !== except) {
    promotedDeepMediaElement = null;
  }
  return changed;
}

function promoteMediaElementToFullSource(mediaElement) {
  demoteConnectedDeepMediaToLightweight({ except: mediaElement });
  if (promotedDeepMediaElement && promotedDeepMediaElement !== mediaElement) {
    demoteMediaElementToLightweightSource(promotedDeepMediaElement);
  }
  return setMediaElementToFullSource(mediaElement, { trackPromotion: true });
}

function setNodeMediaProxyMode(slug, useProxy) {
  if (!slug) {
    return false;
  }
  const node = nodeBySlug.get(slug);
  if (!node) {
    return false;
  }

  let changed = false;
  for (const mediaElement of node.querySelectorAll(".project-media")) {
    if (!getMediaElementProxySrc(mediaElement)) {
      continue;
    }
    if (useProxy) {
      if (demoteMediaElementToProxy(mediaElement)) {
        changed = true;
      }
      continue;
    }
    if (setMediaElementToFullSource(mediaElement)) {
      changed = true;
    }
  }
  return changed;
}

function observeDeepNodeMedia(slug) {
  if (!slug) {
    return false;
  }
  const node = nodeBySlug.get(slug);
  if (!node) {
    return false;
  }
  let scheduled = false;
  for (const mediaElement of node.querySelectorAll(".project-media")) {
    if (mediaElement.dataset.mediaHydrated === "true") {
      observeVideoForPlayback(mediaElement);
      continue;
    }
    if (observeMediaForLazyHydration(mediaElement)) {
      scheduled = true;
    }
  }
  return scheduled;
}

function handleProjectMediaElementLoad(slug, mediaIndex, mediaElement) {
  const isImage = mediaElement instanceof HTMLImageElement;
  const isVideo = mediaElement instanceof HTMLVideoElement;
  if (!isImage && !isVideo) {
    return;
  }

  if (
    mediaElementUsesProxySource(mediaElement) ||
    mediaElementUsesPreviewSource(mediaElement) ||
    mediaElementUsesMobileSource(mediaElement)
  ) {
    return;
  }

  const dims = isImage
    ? normalizeMediaDimensions(mediaElement.naturalWidth, mediaElement.naturalHeight)
    : normalizeMediaDimensions(mediaElement.videoWidth, mediaElement.videoHeight);
  if (!dims) {
    return;
  }

  const model = modelBySlug.get(slug);
  if (!model) {
    return;
  }
  const project = getDisplayProject(model);
  if (!project || !Array.isArray(project.media) || mediaIndex < 0 || mediaIndex >= project.media.length) {
    return;
  }

  const targetMedia = project.media[mediaIndex];
  const src = targetMedia?.src || mediaElement.currentSrc || mediaElement.src;
  const key = getMediaSrcKey(src);
  if (!key) {
    return;
  }

  const prevRuntime = runtimeMediaSizeByKey.get(key);
  const runtimeChanged = !prevRuntime || prevRuntime.w !== dims.w || prevRuntime.h !== dims.h;
  if (runtimeChanged) {
    runtimeMediaSizeByKey.set(key, dims);
  }

  const prevW = Math.round(Number(targetMedia?.w) || 0);
  const prevH = Math.round(Number(targetMedia?.h) || 0);
  const dimsChanged = prevW !== dims.w || prevH !== dims.h;
  if (!dimsChanged) {
    return;
  }

  targetMedia.w = dims.w;
  targetMedia.h = dims.h;
  scheduleMediaResizeRelayout(slug);
}

function getContentItemSource(item) {
  const media = item?.media && typeof item.media === "object" ? item.media : null;
  if (typeof media?.src === "string" && media.src.trim()) {
    return media.src.trim();
  }
  if (typeof item?.src === "string" && item.src.trim()) {
    return item.src.trim();
  }
  return "";
}

function contentItemMatchesAnySourceMedia(item, sourceMediaList) {
  const itemKey = getMediaSrcKey(getContentItemSource(item));
  if (!itemKey) {
    return false;
  }
  return (Array.isArray(sourceMediaList) ? sourceMediaList : []).some((media) => getMediaSrcKey(media?.src) === itemKey);
}

function getProjectContentItemBySrc(project, mediaSrc) {
  const targetKey = getMediaSrcKey(mediaSrc);
  if (!targetKey) {
    return null;
  }
  const items = Array.isArray(project?.contentItems) ? project.contentItems : [];
  for (const item of items) {
    if (getMediaSrcKey(getContentItemSource(item)) === targetKey) {
      return item;
    }
  }
  return null;
}

function inferSourceMediaIndexFromItem(item, sourceMediaList, fallbackIndex = 0) {
  if (!Array.isArray(sourceMediaList) || !sourceMediaList.length) {
    return 0;
  }

  if (Number.isFinite(Number(item?.sourceMediaIndex))) {
    return clamp(Math.round(Number(item.sourceMediaIndex)), 0, sourceMediaList.length - 1);
  }

  const itemTokens = new Set(
    [
      ...tokenizeThemeTerms(typeof item?.label === "string" ? item.label : ""),
      ...tokenizeThemeTerms(typeof item?.media?.role === "string" ? item.media.role : ""),
      ...tokenizeThemeTerms(getContentItemSource(item))
    ].filter(Boolean)
  );
  let bestIndex = -1;
  let bestScore = 0;

  for (let index = 0; index < sourceMediaList.length; index += 1) {
    const media = sourceMediaList[index];
    const mediaTokens = getMediaDescriptorTokens(media);
    let score = 0;
    for (const token of itemTokens) {
      if (mediaTokens.has(token)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  if (bestIndex >= 0 && bestScore > 0) {
    return bestIndex;
  }
  return clamp(Math.round(Number(fallbackIndex) || 0), 0, sourceMediaList.length - 1);
}

function getContentChildSlugs(sourceSlug) {
  if (!sourceSlug) {
    return [];
  }
  const children = contentModelSlugsBySource.get(sourceSlug);
  if (!Array.isArray(children) || !children.length) {
    return [];
  }
  const unique = [];
  for (const slug of children) {
    if (!slug || unique.includes(slug) || !modelBySlug.has(slug)) {
      continue;
    }
    unique.push(slug);
  }
  return unique;
}

function refreshModelVisibility(type = state.activeType) {
  let changed = false;
  for (const model of modelBySlug.values()) {
    const visible = isModelVisibleForFilter(model, type);
    if (model.visible !== visible) {
      changed = true;
      model.renderX = Number.NaN;
      model.renderY = Number.NaN;
    }
    model.visible = visible;
    const node = nodeBySlug.get(model.slug);
    if (node) {
      node.classList.toggle("is-hidden", !visible);
    }
  }
  state.detailsInteractionRevision += 1;
  if (changed) {
    wakeGraph(8);
  }
}

function refreshSeeMoreLabels() {
  for (const button of document.querySelectorAll(".project-details-more[data-project-slug]")) {
    if (button.dataset.hasContentItems !== "true") {
      continue;
    }
    const slug = button.dataset.projectSlug;
    const defaultLabel = button.dataset.defaultLabel || "SEE MORE";
    button.textContent = state.deepProjectSlug === slug ? "CLOSE" : defaultLabel;
  }
}

function applyTrimToLineSet(lines, { trimTop = true, trimBottom = true } = {}) {
  const normalized = Array.isArray(lines) ? lines.filter((line) => line instanceof HTMLElement) : [];
  if (!normalized.length) {
    return;
  }
  for (const line of normalized) {
    line.classList.remove("is-trim-top", "is-trim-bottom");
  }
  if (trimTop) {
    normalized[0].classList.add("is-trim-top");
  }
  if (trimBottom) {
    normalized[normalized.length - 1].classList.add("is-trim-bottom");
  }
}

function splitUiTextParagraphs(...blocks) {
  const out = [];
  for (const block of blocks) {
    const raw = typeof block === "string" ? block.trim() : "";
    if (!raw) {
      continue;
    }
    const paragraphs = raw
      .split(/\r?\n{2,}/)
      .map((paragraph) =>
        paragraph
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .join(" ")
          .trim()
      )
      .filter(Boolean);
    out.push(...paragraphs);
  }
  return out;
}

function syncStaticTextTrim() {
  const siteInfo = document.querySelector(".site-info");
  if (!siteInfo) {
    return;
  }
  const lines = [...siteInfo.querySelectorAll(".ui-text-line")];
  applyTrimToLineSet(lines);
}

function parseHeadBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on") {
      return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no" || normalized === "off") {
      return false;
    }
  }
  return Boolean(fallback);
}

function parseHeadHexColor(value, fallbackHex) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return clamp(Math.round(value), 0, 0xffffff);
  }
  if (typeof value === "string") {
    const normalized = value.trim().replace(/^#/, "");
    if (/^[0-9a-f]{3}$/i.test(normalized)) {
      const expanded = normalized
        .split("")
        .map((char) => char + char)
        .join("");
      return parseInt(expanded, 16);
    }
    if (/^[0-9a-f]{6}$/i.test(normalized)) {
      return parseInt(normalized, 16);
    }
  }
  return fallbackHex;
}

function normalizeHeadTuning(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  return {
    useBakedTexture: parseHeadBoolean(source.useBakedTexture, HEAD_TUNING_DEFAULTS.useBakedTexture),
    bakedTextureNeutralize: parseHeadBoolean(
      source.bakedTextureNeutralize,
      HEAD_TUNING_DEFAULTS.bakedTextureNeutralize
    ),
    bakedTextureInfluence: clamp(
      Number.isFinite(Number(source.bakedTextureInfluence))
        ? Number(source.bakedTextureInfluence)
        : HEAD_TUNING_DEFAULTS.bakedTextureInfluence,
      0,
      1
    ),
    bakedTextureLumaGamma: clamp(
      Number.isFinite(Number(source.bakedTextureLumaGamma))
        ? Number(source.bakedTextureLumaGamma)
        : HEAD_TUNING_DEFAULTS.bakedTextureLumaGamma,
      0.2,
      2
    ),
    rgbCurveEnabled: parseHeadBoolean(source.rgbCurveEnabled, HEAD_TUNING_DEFAULTS.rgbCurveEnabled),
    rgbCurveFac: clamp(
      Number.isFinite(Number(source.rgbCurveFac)) ? Number(source.rgbCurveFac) : HEAD_TUNING_DEFAULTS.rgbCurveFac,
      0,
      1
    ),
    rgbCurveLift: clamp(
      Number.isFinite(Number(source.rgbCurveLift)) ? Number(source.rgbCurveLift) : HEAD_TUNING_DEFAULTS.rgbCurveLift,
      -0.5,
      0.5
    ),
    rgbCurveGamma: clamp(
      Number.isFinite(Number(source.rgbCurveGamma))
        ? Number(source.rgbCurveGamma)
        : HEAD_TUNING_DEFAULTS.rgbCurveGamma,
      0.2,
      3
    ),
    rgbCurveGain: clamp(
      Number.isFinite(Number(source.rgbCurveGain)) ? Number(source.rgbCurveGain) : HEAD_TUNING_DEFAULTS.rgbCurveGain,
      0,
      3
    ),
    rgbCurveR: clamp(
      Number.isFinite(Number(source.rgbCurveR)) ? Number(source.rgbCurveR) : HEAD_TUNING_DEFAULTS.rgbCurveR,
      0,
      2
    ),
    rgbCurveG: clamp(
      Number.isFinite(Number(source.rgbCurveG)) ? Number(source.rgbCurveG) : HEAD_TUNING_DEFAULTS.rgbCurveG,
      0,
      2
    ),
    rgbCurveB: clamp(
      Number.isFinite(Number(source.rgbCurveB)) ? Number(source.rgbCurveB) : HEAD_TUNING_DEFAULTS.rgbCurveB,
      0,
      2
    ),
    baseColorHex: parseHeadHexColor(source.baseColorHex, HEAD_TUNING_DEFAULTS.baseColorHex),
    emissiveColorHex: parseHeadHexColor(source.emissiveColorHex, HEAD_TUNING_DEFAULTS.emissiveColorHex),
    emissiveIntensity: clamp(
      Number.isFinite(Number(source.emissiveIntensity))
        ? Number(source.emissiveIntensity)
        : HEAD_TUNING_DEFAULTS.emissiveIntensity,
      0,
      2
    ),
    toneMappingExposure: clamp(
      Number.isFinite(Number(source.toneMappingExposure))
        ? Number(source.toneMappingExposure)
        : HEAD_TUNING_DEFAULTS.toneMappingExposure,
      0.2,
      2.4
    ),
    ambientIntensity: clamp(
      Number.isFinite(Number(source.ambientIntensity))
        ? Number(source.ambientIntensity)
        : HEAD_TUNING_DEFAULTS.ambientIntensity,
      0,
      3
    ),
    hemisphereIntensity: clamp(
      Number.isFinite(Number(source.hemisphereIntensity))
        ? Number(source.hemisphereIntensity)
        : HEAD_TUNING_DEFAULTS.hemisphereIntensity,
      0,
      3
    ),
    keyLightIntensity: clamp(
      Number.isFinite(Number(source.keyLightIntensity))
        ? Number(source.keyLightIntensity)
        : HEAD_TUNING_DEFAULTS.keyLightIntensity,
      0,
      8
    ),
    fillLightIntensity: clamp(
      Number.isFinite(Number(source.fillLightIntensity))
        ? Number(source.fillLightIntensity)
        : HEAD_TUNING_DEFAULTS.fillLightIntensity,
      0,
      4
    ),
    rimLightIntensity: clamp(
      Number.isFinite(Number(source.rimLightIntensity))
        ? Number(source.rimLightIntensity)
        : HEAD_TUNING_DEFAULTS.rimLightIntensity,
      0,
      4
    ),
    backLightIntensity: clamp(
      Number.isFinite(Number(source.backLightIntensity))
        ? Number(source.backLightIntensity)
        : HEAD_TUNING_DEFAULTS.backLightIntensity,
      0,
      4
    ),
    keyLightPosX: clamp(
      Number.isFinite(Number(source.keyLightPosX)) ? Number(source.keyLightPosX) : HEAD_TUNING_DEFAULTS.keyLightPosX,
      -8,
      8
    ),
    keyLightPosY: clamp(
      Number.isFinite(Number(source.keyLightPosY)) ? Number(source.keyLightPosY) : HEAD_TUNING_DEFAULTS.keyLightPosY,
      -8,
      8
    ),
    keyLightPosZ: clamp(
      Number.isFinite(Number(source.keyLightPosZ)) ? Number(source.keyLightPosZ) : HEAD_TUNING_DEFAULTS.keyLightPosZ,
      -8,
      8
    ),
    fillLightPosX: clamp(
      Number.isFinite(Number(source.fillLightPosX))
        ? Number(source.fillLightPosX)
        : HEAD_TUNING_DEFAULTS.fillLightPosX,
      -8,
      8
    ),
    fillLightPosY: clamp(
      Number.isFinite(Number(source.fillLightPosY))
        ? Number(source.fillLightPosY)
        : HEAD_TUNING_DEFAULTS.fillLightPosY,
      -8,
      8
    ),
    fillLightPosZ: clamp(
      Number.isFinite(Number(source.fillLightPosZ))
        ? Number(source.fillLightPosZ)
        : HEAD_TUNING_DEFAULTS.fillLightPosZ,
      -8,
      8
    ),
    rimLightPosX: clamp(
      Number.isFinite(Number(source.rimLightPosX)) ? Number(source.rimLightPosX) : HEAD_TUNING_DEFAULTS.rimLightPosX,
      -8,
      8
    ),
    rimLightPosY: clamp(
      Number.isFinite(Number(source.rimLightPosY)) ? Number(source.rimLightPosY) : HEAD_TUNING_DEFAULTS.rimLightPosY,
      -8,
      8
    ),
    rimLightPosZ: clamp(
      Number.isFinite(Number(source.rimLightPosZ)) ? Number(source.rimLightPosZ) : HEAD_TUNING_DEFAULTS.rimLightPosZ,
      -8,
      8
    ),
    backLightPosX: clamp(
      Number.isFinite(Number(source.backLightPosX))
        ? Number(source.backLightPosX)
        : HEAD_TUNING_DEFAULTS.backLightPosX,
      -8,
      8
    ),
    backLightPosY: clamp(
      Number.isFinite(Number(source.backLightPosY))
        ? Number(source.backLightPosY)
        : HEAD_TUNING_DEFAULTS.backLightPosY,
      -8,
      8
    ),
    backLightPosZ: clamp(
      Number.isFinite(Number(source.backLightPosZ))
        ? Number(source.backLightPosZ)
        : HEAD_TUNING_DEFAULTS.backLightPosZ,
      -8,
      8
    ),
    materialRoughness: clamp(
      Number.isFinite(Number(source.materialRoughness))
        ? Number(source.materialRoughness)
        : HEAD_TUNING_DEFAULTS.materialRoughness,
      0,
      1
    ),
    materialMetalness: clamp(
      Number.isFinite(Number(source.materialMetalness))
        ? Number(source.materialMetalness)
        : HEAD_TUNING_DEFAULTS.materialMetalness,
      0,
      1
    ),
    materialEnvIntensity: clamp(
      Number.isFinite(Number(source.materialEnvIntensity))
        ? Number(source.materialEnvIntensity)
        : HEAD_TUNING_DEFAULTS.materialEnvIntensity,
      0,
      1
    )
  };
}

function getHeadTuningSnapshot() {
  return normalizeHeadTuning(headTuning);
}

function areHeadTuningStatesEqual(a, b) {
  const keys = Object.keys(HEAD_TUNING_DEFAULTS);
  for (const key of keys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

function shouldClearHeadTextureCache(prevState, nextState) {
  return (
    prevState.useBakedTexture !== nextState.useBakedTexture ||
    prevState.bakedTextureNeutralize !== nextState.bakedTextureNeutralize ||
    prevState.bakedTextureInfluence !== nextState.bakedTextureInfluence ||
    prevState.bakedTextureLumaGamma !== nextState.bakedTextureLumaGamma ||
    prevState.rgbCurveEnabled !== nextState.rgbCurveEnabled ||
    prevState.rgbCurveFac !== nextState.rgbCurveFac ||
    prevState.rgbCurveLift !== nextState.rgbCurveLift ||
    prevState.rgbCurveGamma !== nextState.rgbCurveGamma ||
    prevState.rgbCurveGain !== nextState.rgbCurveGain ||
    prevState.rgbCurveR !== nextState.rgbCurveR ||
    prevState.rgbCurveG !== nextState.rgbCurveG ||
    prevState.rgbCurveB !== nextState.rgbCurveB ||
    prevState.baseColorHex !== nextState.baseColorHex
  );
}

function updateHeadTuningUndoButtonState() {
  if (!headTuningUndoBtnEl) {
    return;
  }
  const hasHistory = headTuningHistory.length > 0;
  headTuningUndoBtnEl.disabled = !hasHistory;
  headTuningUndoBtnEl.setAttribute("aria-disabled", String(!hasHistory));
}

function pushHeadTuningHistorySnapshot(snapshot) {
  const normalized = normalizeHeadTuning(snapshot);
  const last = headTuningHistory.length ? headTuningHistory[headTuningHistory.length - 1] : null;
  if (last && areHeadTuningStatesEqual(last, normalized)) {
    return;
  }
  headTuningHistory.push(normalized);
  if (headTuningHistory.length > HEAD_TUNING_HISTORY_LIMIT) {
    headTuningHistory.shift();
  }
  updateHeadTuningUndoButtonState();
}

function applyHeadTuningState(nextState, { persist = true, syncControls = true } = {}) {
  const currentState = getHeadTuningSnapshot();
  if (areHeadTuningStatesEqual(currentState, nextState)) {
    return false;
  }
  const clearTextureCache = shouldClearHeadTextureCache(currentState, nextState);
  Object.assign(headTuning, nextState);
  applyHeadTuning({ clearTextureCache });
  if (persist) {
    saveHeadTuningToStorage();
  }
  if (syncControls) {
    syncHeadTuningControls();
  }
  return true;
}

function undoHeadTuningChange() {
  if (!headTuningHistory.length) {
    setHeadTuningPanelStatus("No undo");
    return;
  }
  const previous = headTuningHistory.pop();
  const changed = applyHeadTuningState(previous, { persist: true, syncControls: true });
  updateHeadTuningUndoButtonState();
  if (changed && headTuningPresetsListEl) {
    renderHeadTuningPresetsList();
  }
  setHeadTuningPanelStatus("Undo");
  window.setTimeout(() => {
    setHeadTuningPanelStatus("");
  }, 1200);
}

function loadHeadTuningFromStorage() {
  let loaded = null;
  try {
    loaded = window.localStorage.getItem(HEAD_TUNING_STORAGE_KEY);
  } catch (error) {
    loaded = null;
  }
  if (!loaded) {
    Object.assign(headTuning, HEAD_TUNING_DEFAULTS);
    return;
  }
  try {
    const parsed = JSON.parse(loaded);
    Object.assign(headTuning, normalizeHeadTuning(parsed));
  } catch (error) {
    Object.assign(headTuning, HEAD_TUNING_DEFAULTS);
  }
}

function saveHeadTuningToStorage() {
  try {
    window.localStorage.setItem(HEAD_TUNING_STORAGE_KEY, JSON.stringify(headTuning));
  } catch (error) {
    // Ignore quota/privacy errors.
  }
}

function normalizeHeadTuningPreset(value, index = 0) {
  const source = value && typeof value === "object" ? value : {};
  const fallbackId = `preset-${Date.now().toString(36)}-${index.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const rawName = typeof source.name === "string" ? source.name.trim() : "";
  return {
    id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : fallbackId,
    name: rawName || `Preset ${index + 1}`,
    createdAt:
      typeof source.createdAt === "string" && source.createdAt.trim() ? source.createdAt : new Date().toISOString(),
    tuning: normalizeHeadTuning(source.tuning)
  };
}

function loadHeadTuningPresetsFromStorage() {
  headTuningPresets.length = 0;
  let loaded = null;
  try {
    loaded = window.localStorage.getItem(HEAD_TUNING_PRESETS_STORAGE_KEY);
  } catch (error) {
    loaded = null;
  }
  if (!loaded) {
    return;
  }

  try {
    const parsed = JSON.parse(loaded);
    const sourceList = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.presets) ? parsed.presets : [];
    const usedIds = new Set();
    for (let index = 0; index < sourceList.length; index += 1) {
      const preset = normalizeHeadTuningPreset(sourceList[index], index);
      let candidateId = preset.id;
      while (usedIds.has(candidateId)) {
        candidateId = `${preset.id}-${Math.random().toString(36).slice(2, 6)}`;
      }
      preset.id = candidateId;
      usedIds.add(candidateId);
      headTuningPresets.push(preset);
    }
  } catch (error) {
    headTuningPresets.length = 0;
  }
}

function saveHeadTuningPresetsToStorage() {
  try {
    window.localStorage.setItem(HEAD_TUNING_PRESETS_STORAGE_KEY, JSON.stringify(headTuningPresets));
  } catch (error) {
    // Ignore quota/privacy errors.
  }
}

function loadHeadTuningUiFromStorage() {
  let loaded = null;
  try {
    loaded = window.localStorage.getItem(HEAD_TUNING_UI_STORAGE_KEY);
  } catch (error) {
    loaded = null;
  }
  if (!loaded) {
    headTuningCollapsed = false;
    return;
  }
  try {
    const parsed = JSON.parse(loaded);
    headTuningCollapsed = Boolean(parsed?.collapsed);
  } catch (error) {
    headTuningCollapsed = false;
  }
}

function saveHeadTuningUiToStorage() {
  try {
    window.localStorage.setItem(
      HEAD_TUNING_UI_STORAGE_KEY,
      JSON.stringify({
        collapsed: headTuningCollapsed
      })
    );
  } catch (error) {
    // Ignore quota/privacy errors.
  }
}

function applyHeadRendererTuning() {
  if (!headRenderer || !headThreeLib) {
    return;
  }
  headRenderer.toneMapping = headThreeLib.ACESFilmicToneMapping;
  headRenderer.toneMappingExposure = headTuning.toneMappingExposure;
}

function applyHeadLightingTuning() {
  if (!headLightRig.ambient) {
    return;
  }
  headLightRig.ambient.intensity = headTuning.ambientIntensity;
  headLightRig.hemisphere.intensity = headTuning.hemisphereIntensity;
  headLightRig.key.intensity = headTuning.keyLightIntensity;
  headLightRig.fill.intensity = headTuning.fillLightIntensity;
  headLightRig.rim.intensity = headTuning.rimLightIntensity;
  headLightRig.back.intensity = headTuning.backLightIntensity;
  headLightRig.key.position.set(headTuning.keyLightPosX, headTuning.keyLightPosY, headTuning.keyLightPosZ);
  headLightRig.fill.position.set(headTuning.fillLightPosX, headTuning.fillLightPosY, headTuning.fillLightPosZ);
  headLightRig.rim.position.set(headTuning.rimLightPosX, headTuning.rimLightPosY, headTuning.rimLightPosZ);
  headLightRig.back.position.set(headTuning.backLightPosX, headTuning.backLightPosY, headTuning.backLightPosZ);
}

function applyHeadMaterialTuning({ clearTextureCache = false } = {}) {
  if (clearTextureCache) {
    for (const texture of headTextureCache.values()) {
      if (texture && typeof texture.dispose === "function") {
        texture.dispose();
      }
    }
    headTextureCache.clear();
  }
  if (!headThreeLib || !headModelRoot) {
    return;
  }
  tuneHeadModelMaterials(headThreeLib, headModelRoot);
}

function applyHeadTuning({ clearTextureCache = false } = {}) {
  applyHeadRendererTuning();
  applyHeadLightingTuning();
  applyHeadMaterialTuning({ clearTextureCache });
}

function headTuningHexToCss(value) {
  return `#${Math.max(0, Math.min(0xffffff, Math.round(value || 0)))
    .toString(16)
    .padStart(6, "0")}`;
}

function syncHeadTuningControls() {
  for (const [key, control] of headTuningControlByKey.entries()) {
    if (!control?.input) {
      continue;
    }
    const current = headTuning[key];
    if (control.type === "toggle") {
      control.input.checked = Boolean(current);
      continue;
    }
    if (control.type === "color") {
      control.input.value = headTuningHexToCss(current);
      if (control.readout) {
        control.readout.textContent = control.input.value.toUpperCase();
      }
      continue;
    }
    if (control.type === "range") {
      control.input.value = String(current);
      if (control.readout) {
        control.readout.textContent = control.formatter(current);
      }
    }
  }
}

function setHeadTuningValue(key, value, { persist = true, syncControls = false } = {}) {
  if (!(key in headTuning)) {
    return false;
  }
  const nextState = normalizeHeadTuning({ ...getHeadTuningSnapshot(), [key]: value });
  const changed = applyHeadTuningState(nextState, { persist, syncControls });
  if (changed && headTuningPresetsListEl) {
    renderHeadTuningPresetsList();
  }
  return changed;
}

function commitHeadTuningInteraction(startSnapshot) {
  if (!startSnapshot) {
    saveHeadTuningToStorage();
    return;
  }
  const before = normalizeHeadTuning(startSnapshot);
  const after = getHeadTuningSnapshot();
  if (!areHeadTuningStatesEqual(before, after)) {
    pushHeadTuningHistorySnapshot(before);
  }
  saveHeadTuningToStorage();
  if (headTuningPresetsListEl) {
    renderHeadTuningPresetsList();
  }
}

function createHeadTuningSection(titleText) {
  const section = document.createElement("section");
  section.className = "head-tuning-section";
  section.setAttribute("data-head-ignore", "true");
  const title = document.createElement("p");
  title.className = "head-tuning-section-title";
  title.textContent = titleText;
  const content = document.createElement("div");
  content.className = "head-tuning-section-content";
  section.append(title, content);
  return { section, content };
}

function createHeadTuningPresetId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `preset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function saveCurrentHeadTuningPreset() {
  const rawName = headTuningPresetNameInputEl?.value?.trim() || "";
  const name = (rawName || `Preset ${headTuningPresets.length + 1}`).slice(0, 80);
  const preset = {
    id: createHeadTuningPresetId(),
    name,
    createdAt: new Date().toISOString(),
    tuning: getHeadTuningSnapshot()
  };
  headTuningPresets.unshift(preset);
  if (headTuningPresets.length > 100) {
    headTuningPresets.length = 100;
  }
  saveHeadTuningPresetsToStorage();
  renderHeadTuningPresetsList();
  if (headTuningPresetNameInputEl) {
    headTuningPresetNameInputEl.value = "";
  }
  setHeadTuningPanelStatus("Preset saved");
  window.setTimeout(() => {
    setHeadTuningPanelStatus("");
  }, 1200);
}

function applyHeadTuningPresetById(presetId) {
  const preset = headTuningPresets.find((item) => item.id === presetId);
  if (!preset) {
    setHeadTuningPanelStatus("Preset not found");
    return;
  }
  const startSnapshot = getHeadTuningSnapshot();
  const changed = applyHeadTuningState(normalizeHeadTuning(preset.tuning), { persist: true, syncControls: true });
  if (changed) {
    pushHeadTuningHistorySnapshot(startSnapshot);
  }
  renderHeadTuningPresetsList();
  setHeadTuningPanelStatus(changed ? `Preset: ${preset.name}` : "Preset already active");
  window.setTimeout(() => {
    setHeadTuningPanelStatus("");
  }, 1200);
}

function deleteHeadTuningPresetById(presetId) {
  const index = headTuningPresets.findIndex((item) => item.id === presetId);
  if (index < 0) {
    return;
  }
  headTuningPresets.splice(index, 1);
  saveHeadTuningPresetsToStorage();
  renderHeadTuningPresetsList();
  setHeadTuningPanelStatus("Preset deleted");
  window.setTimeout(() => {
    setHeadTuningPanelStatus("");
  }, 1200);
}

function renderHeadTuningPresetsList() {
  if (!headTuningPresetsListEl) {
    return;
  }
  headTuningPresetsListEl.textContent = "";
  if (!headTuningPresets.length) {
    const empty = document.createElement("p");
    empty.className = "head-tuning-presets-empty";
    empty.textContent = "No saved presets yet";
    headTuningPresetsListEl.append(empty);
    return;
  }

  const currentState = getHeadTuningSnapshot();
  for (const preset of headTuningPresets) {
    const item = document.createElement("div");
    item.className = "head-tuning-preset-item";
    item.setAttribute("data-head-ignore", "true");

    const loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.className = "head-tuning-preset-load";
    loadBtn.setAttribute("data-head-ignore", "true");
    if (areHeadTuningStatesEqual(normalizeHeadTuning(preset.tuning), currentState)) {
      loadBtn.classList.add("is-active");
    }
    loadBtn.textContent = preset.name;
    loadBtn.addEventListener("click", () => {
      applyHeadTuningPresetById(preset.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "head-tuning-preset-delete";
    deleteBtn.textContent = "DEL";
    deleteBtn.setAttribute("data-head-ignore", "true");
    deleteBtn.addEventListener("click", () => {
      deleteHeadTuningPresetById(preset.id);
    });

    item.append(loadBtn, deleteBtn);
    headTuningPresetsListEl.append(item);
  }
}

function downloadHeadTuningExportFile() {
  const payload = {
    format: "golova-head-tuning-v1",
    exportedAt: new Date().toISOString(),
    current: getHeadTuningSnapshot(),
    presets: headTuningPresets.map((preset) => ({
      id: preset.id,
      name: preset.name,
      createdAt: preset.createdAt,
      tuning: normalizeHeadTuning(preset.tuning)
    }))
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `golova-head-tuning-${stamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  setHeadTuningPanelStatus("Exported file");
  window.setTimeout(() => {
    setHeadTuningPanelStatus("");
  }, 1400);
}

function createHeadTuningPresetControls(container) {
  const tools = document.createElement("div");
  tools.className = "head-tuning-presets-tools";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Preset name";
  nameInput.className = "head-tuning-preset-name";
  nameInput.maxLength = 80;
  nameInput.setAttribute("data-head-ignore", "true");
  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveCurrentHeadTuningPreset();
    }
  });

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "head-tuning-btn";
  saveBtn.textContent = "SAVE";
  saveBtn.setAttribute("data-head-ignore", "true");
  saveBtn.addEventListener("click", saveCurrentHeadTuningPreset);

  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.className = "head-tuning-btn";
  exportBtn.textContent = "EXPORT";
  exportBtn.setAttribute("data-head-ignore", "true");
  exportBtn.addEventListener("click", downloadHeadTuningExportFile);

  tools.append(nameInput, saveBtn, exportBtn);

  const list = document.createElement("div");
  list.className = "head-tuning-presets-list";
  list.setAttribute("data-head-ignore", "true");

  headTuningPresetNameInputEl = nameInput;
  headTuningPresetsListEl = list;
  container.append(tools, list);
}

function setHeadTuningCollapsed(collapsed, { persist = true } = {}) {
  headTuningCollapsed = Boolean(collapsed);
  if (headTuningPanelEl) {
    headTuningPanelEl.classList.toggle("is-collapsed", headTuningCollapsed);
  }
  if (headTuningCollapseBtnEl) {
    headTuningCollapseBtnEl.textContent = headTuningCollapsed ? "SHOW" : "HIDE";
    headTuningCollapseBtnEl.setAttribute("aria-pressed", String(headTuningCollapsed));
  }
  if (persist) {
    saveHeadTuningUiToStorage();
  }
}

function toggleHeadTuningCollapsed() {
  setHeadTuningCollapsed(!headTuningCollapsed, { persist: true });
}

function registerHeadTuningToggleControl(container, { key, label }) {
  const row = document.createElement("label");
  row.className = "head-tuning-row";
  const text = document.createElement("span");
  text.className = "head-tuning-label";
  text.textContent = label;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "head-tuning-toggle";
  input.setAttribute("data-head-ignore", "true");
  input.checked = Boolean(headTuning[key]);
  input.addEventListener("change", () => {
    const startSnapshot = getHeadTuningSnapshot();
    const changed = setHeadTuningValue(key, input.checked, { persist: false });
    if (!changed) {
      return;
    }
    commitHeadTuningInteraction(startSnapshot);
    syncHeadTuningControls();
  });
  row.append(text, input);
  container.append(row);
  headTuningControlByKey.set(key, { type: "toggle", input });
}

function registerHeadTuningColorControl(container, { key, label }) {
  const row = document.createElement("label");
  row.className = "head-tuning-row";
  const text = document.createElement("span");
  text.className = "head-tuning-label";
  text.textContent = label;
  const controls = document.createElement("div");
  controls.className = "head-tuning-controls";
  const input = document.createElement("input");
  input.type = "color";
  input.className = "head-tuning-color";
  input.setAttribute("data-head-ignore", "true");
  input.value = headTuningHexToCss(headTuning[key]);
  const readout = document.createElement("span");
  readout.className = "head-tuning-value";
  readout.textContent = input.value.toUpperCase();

  let interactionStartState = null;
  const beginInteraction = () => {
    if (!interactionStartState) {
      interactionStartState = getHeadTuningSnapshot();
    }
  };
  const update = () => {
    const nextHex = parseHeadHexColor(input.value, headTuning[key]);
    setHeadTuningValue(key, nextHex, { persist: false });
    readout.textContent = input.value.toUpperCase();
  };
  const finish = () => {
    if (!interactionStartState) {
      return;
    }
    commitHeadTuningInteraction(interactionStartState);
    interactionStartState = null;
  };

  input.addEventListener("input", () => {
    beginInteraction();
    update();
  });
  input.addEventListener("change", () => {
    beginInteraction();
    update();
    finish();
  });
  input.addEventListener("blur", finish);

  controls.append(input, readout);
  row.append(text, controls);
  container.append(row);
  headTuningControlByKey.set(key, { type: "color", input, readout });
}

function registerHeadTuningRangeControl(
  container,
  { key, label, min, max, step, formatter = (value) => Number(value).toFixed(2) }
) {
  const row = document.createElement("label");
  row.className = "head-tuning-row is-range";
  const text = document.createElement("span");
  text.className = "head-tuning-label";
  text.textContent = label;
  const controls = document.createElement("div");
  controls.className = "head-tuning-controls";
  const input = document.createElement("input");
  input.type = "range";
  input.className = "head-tuning-slider";
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(headTuning[key]);
  input.setAttribute("data-head-ignore", "true");
  const readout = document.createElement("span");
  readout.className = "head-tuning-value";
  readout.textContent = formatter(headTuning[key]);

  let interactionStartState = null;
  const beginInteraction = () => {
    if (!interactionStartState) {
      interactionStartState = getHeadTuningSnapshot();
    }
  };
  const update = () => {
    const next = Number(input.value);
    if (!Number.isFinite(next)) {
      return;
    }
    setHeadTuningValue(key, next, { persist: false });
    readout.textContent = formatter(headTuning[key]);
  };
  const finish = () => {
    if (!interactionStartState) {
      return;
    }
    commitHeadTuningInteraction(interactionStartState);
    interactionStartState = null;
  };

  input.addEventListener("pointerdown", beginInteraction);
  input.addEventListener("mousedown", beginInteraction);
  input.addEventListener("touchstart", beginInteraction, { passive: true });
  input.addEventListener("keydown", beginInteraction);
  input.addEventListener("focus", beginInteraction);
  input.addEventListener("input", () => {
    beginInteraction();
    update();
  });
  input.addEventListener("change", () => {
    beginInteraction();
    update();
    finish();
  });
  input.addEventListener("blur", finish);

  controls.append(input, readout);
  row.append(text, controls);
  container.append(row);
  headTuningControlByKey.set(key, { type: "range", input, readout, formatter });
}

function setHeadTuningPanelStatus(text) {
  if (!headTuningPanelEl) {
    return;
  }
  const status = headTuningPanelEl.querySelector(".head-tuning-status");
  if (status) {
    status.textContent = text;
  }
}

function copyHeadTuningToClipboard() {
  const payload = JSON.stringify(headTuning, null, 2);
  if (!navigator?.clipboard?.writeText) {
    setHeadTuningPanelStatus("Clipboard unavailable");
    return;
  }
  navigator.clipboard
    .writeText(payload)
    .then(() => {
      setHeadTuningPanelStatus("Copied");
      window.setTimeout(() => {
        setHeadTuningPanelStatus("");
      }, 1600);
    })
    .catch(() => {
      setHeadTuningPanelStatus("Copy failed");
      window.setTimeout(() => {
        setHeadTuningPanelStatus("");
      }, 1600);
    });
}

function resetHeadTuning() {
  const startSnapshot = getHeadTuningSnapshot();
  const defaults = normalizeHeadTuning(HEAD_TUNING_DEFAULTS);
  if (areHeadTuningStatesEqual(startSnapshot, defaults)) {
    setHeadTuningPanelStatus("Already reset");
    window.setTimeout(() => {
      setHeadTuningPanelStatus("");
    }, 1200);
    return;
  }
  pushHeadTuningHistorySnapshot(startSnapshot);
  applyHeadTuningState(defaults, { persist: true, syncControls: true });
  renderHeadTuningPresetsList();
  setHeadTuningPanelStatus("Reset");
  window.setTimeout(() => {
    setHeadTuningPanelStatus("");
  }, 1200);
}

function initHeadTuningPanel() {
  loadHeadTuningFromStorage();
  loadHeadTuningPresetsFromStorage();
  loadHeadTuningUiFromStorage();
  if (headTuningPanelEl || !document.body) {
    return;
  }

  const panel = document.createElement("aside");
  panel.className = "head-tuning-panel";
  panel.setAttribute("data-head-ignore", "true");
  panel.setAttribute("aria-label", "Head tuning controls");

  const titleRow = document.createElement("div");
  titleRow.className = "head-tuning-header";
  const title = document.createElement("p");
  title.className = "head-tuning-title";
  title.textContent = "MODEL";
  const actions = document.createElement("div");
  actions.className = "head-tuning-actions";
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "head-tuning-btn";
  copyBtn.textContent = "COPY";
  copyBtn.setAttribute("data-head-ignore", "true");
  copyBtn.addEventListener("click", copyHeadTuningToClipboard);
  const undoBtn = document.createElement("button");
  undoBtn.type = "button";
  undoBtn.className = "head-tuning-btn";
  undoBtn.textContent = "UNDO";
  undoBtn.setAttribute("data-head-ignore", "true");
  undoBtn.addEventListener("click", undoHeadTuningChange);
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "head-tuning-btn";
  resetBtn.textContent = "RESET";
  resetBtn.setAttribute("data-head-ignore", "true");
  resetBtn.addEventListener("click", resetHeadTuning);
  const collapseBtn = document.createElement("button");
  collapseBtn.type = "button";
  collapseBtn.className = "head-tuning-btn head-tuning-btn-collapse";
  collapseBtn.textContent = "HIDE";
  collapseBtn.setAttribute("data-head-ignore", "true");
  collapseBtn.addEventListener("click", toggleHeadTuningCollapsed);

  actions.append(collapseBtn, copyBtn, undoBtn, resetBtn);
  titleRow.append(title, actions);

  const status = document.createElement("p");
  status.className = "head-tuning-status";

  const content = document.createElement("div");
  content.className = "head-tuning-content";

  const textureSection = createHeadTuningSection("Texture & Curve");
  registerHeadTuningToggleControl(textureSection.content, { key: "useBakedTexture", label: "Texture" });
  registerHeadTuningToggleControl(textureSection.content, { key: "bakedTextureNeutralize", label: "Neutralize texture" });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "bakedTextureInfluence",
    label: "Texture influence",
    min: 0,
    max: 1,
    step: 0.01
  });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "bakedTextureLumaGamma",
    label: "Texture gamma",
    min: 0.2,
    max: 2,
    step: 0.01
  });
  registerHeadTuningColorControl(textureSection.content, { key: "baseColorHex", label: "Base color" });
  registerHeadTuningColorControl(textureSection.content, { key: "emissiveColorHex", label: "Emissive color" });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "emissiveIntensity",
    label: "Emissive",
    min: 0,
    max: 2,
    step: 0.01
  });
  registerHeadTuningToggleControl(textureSection.content, { key: "rgbCurveEnabled", label: "RGB curve" });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "rgbCurveFac",
    label: "Curve mix",
    min: 0,
    max: 1,
    step: 0.01
  });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "rgbCurveLift",
    label: "Curve lift",
    min: -0.5,
    max: 0.5,
    step: 0.005
  });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "rgbCurveGamma",
    label: "Curve gamma",
    min: 0.2,
    max: 3,
    step: 0.01
  });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "rgbCurveGain",
    label: "Curve gain",
    min: 0,
    max: 3,
    step: 0.01
  });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "rgbCurveR",
    label: "Curve R",
    min: 0,
    max: 2,
    step: 0.01
  });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "rgbCurveG",
    label: "Curve G",
    min: 0,
    max: 2,
    step: 0.01
  });
  registerHeadTuningRangeControl(textureSection.content, {
    key: "rgbCurveB",
    label: "Curve B",
    min: 0,
    max: 2,
    step: 0.01
  });

  const rendererSection = createHeadTuningSection("Renderer & Material");
  registerHeadTuningRangeControl(rendererSection.content, {
    key: "toneMappingExposure",
    label: "Exposure",
    min: 0.2,
    max: 2.4,
    step: 0.01
  });
  registerHeadTuningRangeControl(rendererSection.content, {
    key: "materialRoughness",
    label: "Roughness",
    min: 0,
    max: 1,
    step: 0.01
  });
  registerHeadTuningRangeControl(rendererSection.content, {
    key: "materialMetalness",
    label: "Metalness",
    min: 0,
    max: 1,
    step: 0.01
  });
  registerHeadTuningRangeControl(rendererSection.content, {
    key: "materialEnvIntensity",
    label: "Env intensity",
    min: 0,
    max: 1,
    step: 0.01
  });

  const lightIntensitySection = createHeadTuningSection("Light Intensity");
  registerHeadTuningRangeControl(lightIntensitySection.content, {
    key: "ambientIntensity",
    label: "Ambient",
    min: 0,
    max: 3,
    step: 0.01
  });
  registerHeadTuningRangeControl(lightIntensitySection.content, {
    key: "hemisphereIntensity",
    label: "Hemisphere",
    min: 0,
    max: 3,
    step: 0.01
  });
  registerHeadTuningRangeControl(lightIntensitySection.content, {
    key: "keyLightIntensity",
    label: "Key",
    min: 0,
    max: 8,
    step: 0.01
  });
  registerHeadTuningRangeControl(lightIntensitySection.content, {
    key: "fillLightIntensity",
    label: "Fill",
    min: 0,
    max: 4,
    step: 0.01
  });
  registerHeadTuningRangeControl(lightIntensitySection.content, {
    key: "rimLightIntensity",
    label: "Rim",
    min: 0,
    max: 4,
    step: 0.01
  });
  registerHeadTuningRangeControl(lightIntensitySection.content, {
    key: "backLightIntensity",
    label: "Back",
    min: 0,
    max: 4,
    step: 0.01
  });

  const lightPositionSection = createHeadTuningSection("Light Position");
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "keyLightPosX",
    label: "Key X",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "keyLightPosY",
    label: "Key Y",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "keyLightPosZ",
    label: "Key Z",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "fillLightPosX",
    label: "Fill X",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "fillLightPosY",
    label: "Fill Y",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "fillLightPosZ",
    label: "Fill Z",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "rimLightPosX",
    label: "Rim X",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "rimLightPosY",
    label: "Rim Y",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "rimLightPosZ",
    label: "Rim Z",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "backLightPosX",
    label: "Back X",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "backLightPosY",
    label: "Back Y",
    min: -8,
    max: 8,
    step: 0.05
  });
  registerHeadTuningRangeControl(lightPositionSection.content, {
    key: "backLightPosZ",
    label: "Back Z",
    min: -8,
    max: 8,
    step: 0.05
  });

  const presetSection = createHeadTuningSection("Presets");
  createHeadTuningPresetControls(presetSection.content);

  content.append(
    textureSection.section,
    rendererSection.section,
    lightIntensitySection.section,
    lightPositionSection.section,
    presetSection.section
  );

  panel.append(titleRow, status, content);
  document.body.append(panel);
  headTuningPanelEl = panel;
  headTuningUndoBtnEl = undoBtn;
  headTuningCollapseBtnEl = collapseBtn;
  syncHeadTuningControls();
  updateHeadTuningUndoButtonState();
  renderHeadTuningPresetsList();
  setHeadTuningCollapsed(headTuningCollapsed, { persist: false });
}

function getHeadPoseTargets() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const isMobileViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
  if (state.headModalOpen) {
    return {
      scale: isMobileViewport ? HEAD_SCALE_OPEN_MOBILE : HEAD_SCALE_OPEN_DESKTOP,
      y: isMobileViewport ? HEAD_POS_Y_OPEN_MOBILE : HEAD_POS_Y_OPEN_DESKTOP
    };
  }

  if (headCamera && headModelBounds) {
    const viewportHeight = window.innerHeight || state.stageHeight || 1;
    const fovRadians = (headCamera.fov * Math.PI) / 180;
    const cameraZ = Math.abs(headCamera.position.z || 10);
    const worldViewHeight = 2 * Math.tan(fovRadians / 2) * cameraZ;
    const pxPerWorld = viewportHeight / Math.max(0.0001, worldViewHeight);
    const targetHeightPx = isMobileViewport ? HEAD_CLOSED_TARGET_HEIGHT_MOBILE_PX : HEAD_CLOSED_TARGET_HEIGHT_DESKTOP_PX;
    const scale = targetHeightPx / Math.max(0.0001, headModelBounds.height * pxPerWorld);
    const targetBottomPx = isMobileViewport ? HEAD_CLOSED_BOTTOM_MARGIN_MOBILE_PX : HEAD_CLOSED_BOTTOM_MARGIN_DESKTOP_PX;
    let targetTopPx = viewportHeight - targetHeightPx - targetBottomPx;
    targetTopPx = clamp(targetTopPx, 0, Math.max(0, viewportHeight - targetHeightPx));
    const targetTopWorld = (viewportHeight / 2 - targetTopPx) / Math.max(0.0001, pxPerWorld);
    const y = targetTopWorld - headModelBounds.maxY * scale;

    return { scale, y };
  }

  return {
    scale: isMobileViewport ? HEAD_SCALE_CLOSED_MOBILE : HEAD_SCALE_CLOSED_DESKTOP,
    y: isMobileViewport ? HEAD_POS_Y_CLOSED_MOBILE : HEAD_POS_Y_CLOSED_DESKTOP
  };
}

function updateHeadPointerTargetFromClient(
  clientX,
  clientY,
  {
    horizontalFactor = 1,
    verticalFactor = 1,
    minY = -1,
    maxY = 1
  } = {}
) {
  if (!HEAD_INTERACTIVE_ROTATION_ENABLED) {
    return;
  }
  const viewportWidth = window.innerWidth || state.stageWidth || 1;
  const viewportHeight = window.innerHeight || state.stageHeight || 1;
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY) || viewportWidth <= 0 || viewportHeight <= 0) {
    return;
  }
  const nx = clamp(((clientX / viewportWidth) * 2 - 1) * (Number(horizontalFactor) || 0), -1, 1);
  const rawNy = clamp((clientY / viewportHeight) * 2 - 1, -1, 1);
  const nyScaled = rawNy * (Number(verticalFactor) || 0);
  const ny = clamp(nyScaled, Number(minY), Number(maxY));
  headPointerTargetX = nx;
  headPointerTargetY = ny;
}

function rememberHeadInputType(pointerType) {
  const normalized = typeof pointerType === "string" ? pointerType.toLowerCase() : "";
  if (!normalized) {
    return;
  }
  if (normalized === "touch" || normalized === "pen") {
    headLastInputType = "touch";
    return;
  }
  if (normalized === "mouse") {
    headLastInputType = "mouse";
  }
}

function shouldUseMobileHeadDynamics() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const isNarrowViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
  const touchCapable = (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) || "ontouchstart" in window;
  if (headLastInputType === "touch") {
    return true;
  }
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return isNarrowViewport && touchCapable;
  }
  const hasFine = window.matchMedia("(pointer: fine)").matches;
  const hasCoarse = window.matchMedia("(pointer: coarse)").matches;
  if (headLastInputType === "mouse" && hasFine) {
    return false;
  }
  if (isNarrowViewport && touchCapable) {
    return true;
  }
  return hasCoarse && !hasFine;
}

function shouldIgnoreHeadPointerEvent(event) {
  const target = event?.target;
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest(HEAD_POINTER_IGNORE_SELECTOR));
}

function updateHeadTargetForUiTouch(clientX, clientY) {
  const isClosed = !state.headModalOpen;
  updateHeadPointerTargetFromClient(clientX, clientY, {
    horizontalFactor: isClosed ? 0.92 : 1,
    verticalFactor: isClosed ? 0.8 : 0.5,
    minY: isClosed ? -0.95 : -0.6,
    maxY: isClosed ? 0.06 : 0.35
  });
}

function stopHeadTouchAutoCenter() {
  if (!HEAD_INTERACTIVE_ROTATION_ENABLED) {
    return;
  }
  headTouchAutoCenterActive = false;
}

function startHeadTouchAutoCenter() {
  if (!HEAD_INTERACTIVE_ROTATION_ENABLED) {
    return;
  }
  headTouchAutoCenterActive = true;
}

function onDocumentPointerMoveForHead(event) {
  if (!event || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) {
    return;
  }
  rememberHeadInputType(event.pointerType);
  if (shouldIgnoreHeadPointerEvent(event)) {
    return;
  }
  updateHeadPointerTargetFromClient(event.clientX, event.clientY);
}

function onDocumentTouchStartForHead(event) {
  if (!event?.touches || !event.touches.length) {
    return;
  }
  rememberHeadInputType("touch");
  if (shouldIgnoreHeadPointerEvent(event)) {
    stopHeadTouchAutoCenter();
    const touch = event.touches[0];
    if (touch) {
      updateHeadTargetForUiTouch(touch.clientX, touch.clientY);
    }
    return;
  }
  stopHeadTouchAutoCenter();
  const touch = event.touches[0];
  if (!touch) {
    return;
  }
  updateHeadPointerTargetFromClient(touch.clientX, touch.clientY);
}

function onDocumentTouchMoveForHead(event) {
  if (!event?.touches || !event.touches.length) {
    return;
  }
  rememberHeadInputType("touch");
  if (shouldIgnoreHeadPointerEvent(event)) {
    stopHeadTouchAutoCenter();
    const touch = event.touches[0];
    if (touch) {
      updateHeadTargetForUiTouch(touch.clientX, touch.clientY);
    }
    return;
  }
  stopHeadTouchAutoCenter();
  const touch = event.touches[0];
  if (!touch) {
    return;
  }
  updateHeadPointerTargetFromClient(touch.clientX, touch.clientY);
}

function onDocumentTouchEndForHead(event) {
  if (!event?.changedTouches || !event.changedTouches.length) {
    return;
  }
  rememberHeadInputType("touch");
  if (shouldIgnoreHeadPointerEvent(event)) {
    const touch = event.changedTouches[0];
    if (touch) {
      updateHeadTargetForUiTouch(touch.clientX, touch.clientY);
    }
    startHeadTouchAutoCenter();
    return;
  }
  const touch = event.changedTouches[0];
  if (!touch) {
    return;
  }
  updateHeadPointerTargetFromClient(touch.clientX, touch.clientY);
  startHeadTouchAutoCenter();
}

function clearHeadClosingVisualState() {
  if (headClosingClassTimeoutId != null) {
    clearTimeout(headClosingClassTimeoutId);
    headClosingClassTimeoutId = null;
  }
  document.body.classList.remove("is-head-modal-closing");
}

function setHeadClosingVisualState() {
  clearHeadClosingVisualState();
  document.body.classList.add("is-head-modal-closing");
  headClosingClassTimeoutId = window.setTimeout(() => {
    headClosingClassTimeoutId = null;
    document.body.classList.remove("is-head-modal-closing");
  }, HEAD_POSE_DURATION_MS + 50);
}

function setHeadModalOpen(nextOpen, { immediate = false } = {}) {
  const open = Boolean(nextOpen);
  const changed = state.headModalOpen !== open;
  state.headModalOpen = open;
  if (open) {
    clearHeadClosingVisualState();
  } else if (changed && !immediate) {
    setHeadClosingVisualState();
  } else if (immediate) {
    clearHeadClosingVisualState();
  }
  document.body.classList.toggle("is-head-modal-open", open);
  if (headWidgetEl) {
    headWidgetEl.classList.toggle("is-open", open);
    headWidgetEl.setAttribute("aria-pressed", String(open));
  }
  if (headBackdropEl) {
    headBackdropEl.setAttribute("aria-hidden", String(!open));
  }
  if (open) {
    stopHeadTouchAutoCenter();
    headPointerTargetX = 0;
    headPointerTargetY = 0;
    headPointerX = 0;
    headPointerY = 0;
    if (headModelRoot) {
      headModelRoot.rotation.x = 0;
      headModelRoot.rotation.y = 0;
    }
  }
  const pose = getHeadPoseTargets();
  if (immediate) {
    headCurrentScale = pose.scale;
    headCurrentY = pose.y;
    headPoseAnim = null;
  } else if (changed && Number.isFinite(headCurrentScale) && Number.isFinite(headCurrentY)) {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    headPoseAnim = {
      start: now,
      duration: HEAD_POSE_DURATION_MS,
      fromScale: headCurrentScale,
      toScale: pose.scale,
      fromY: headCurrentY,
      toY: pose.y
    };
  }
  if (changed) {
    resizeHeadRendererToHost(true);
  }
  markHeadNeedsRender();
}

function onHeadWidgetActivate() {
  if (state.deepProjectSlug) {
    applyFilter("all", true, false);
    setHeadModalOpen(false, { immediate: true });
    return;
  }
  setHeadModalOpen(!state.headModalOpen);
}

function isHeadHitAtClientPoint(clientX, clientY) {
  if (!headRaycaster || !headPointerNdc || !headModelRoot || !headModelLoaded || !headCamera) {
    return false;
  }
  const viewportWidth = window.innerWidth || state.stageWidth || 1;
  const viewportHeight = window.innerHeight || state.stageHeight || 1;
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return false;
  }
  headPointerNdc.x = (clientX / viewportWidth) * 2 - 1;
  headPointerNdc.y = -(clientY / viewportHeight) * 2 + 1;
  headRaycaster.setFromCamera(headPointerNdc, headCamera);
  return headRaycaster.intersectObject(headModelRoot, true).length > 0;
}

function onDocumentPointerDownForHead(event) {
  if (!event || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) {
    return;
  }
  rememberHeadInputType(event.pointerType);
  if (!isHeadHitAtClientPoint(event.clientX, event.clientY)) {
    return;
  }
  const isTouchLike = event.pointerType === "touch" || event.pointerType === "pen";
  if (isTouchLike) {
    stopHeadTouchAutoCenter();
  }
  event.preventDefault();
  event.stopPropagation();
  if (typeof event.stopImmediatePropagation === "function") {
    event.stopImmediatePropagation();
  }
  updateHeadPointerTargetFromClient(event.clientX, event.clientY);
  headPressSession = {
    pointerId: Number.isFinite(event.pointerId) ? event.pointerId : -1,
    pointerType: event.pointerType || "mouse",
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    slop: isTouchLike ? POINTER_TAP_SLOP_TOUCH : POINTER_TAP_SLOP_MOUSE
  };
}

function onDocumentPointerMoveForHeadPress(event) {
  if (!headPressSession || !event || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) {
    return;
  }
  rememberHeadInputType(event.pointerType || headPressSession.pointerType);
  if (Number.isFinite(event.pointerId) && headPressSession.pointerId !== event.pointerId) {
    return;
  }
  const dx = event.clientX - headPressSession.startX;
  const dy = event.clientY - headPressSession.startY;
  if (Math.hypot(dx, dy) > headPressSession.slop) {
    headPressSession.moved = true;
  }
  if (headPressSession.pointerType === "touch" || headPressSession.pointerType === "pen") {
    stopHeadTouchAutoCenter();
  }
  updateHeadPointerTargetFromClient(event.clientX, event.clientY);
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
  if (typeof event.stopImmediatePropagation === "function") {
    event.stopImmediatePropagation();
  }
}

function finishHeadPressSession(event, { cancelled = false } = {}) {
  if (!headPressSession || !event || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) {
    return;
  }
  if (Number.isFinite(event.pointerId) && headPressSession.pointerId !== event.pointerId) {
    return;
  }
  const shouldToggle =
    !cancelled &&
    !headPressSession.moved &&
    isHeadHitAtClientPoint(event.clientX, event.clientY);
  updateHeadPointerTargetFromClient(event.clientX, event.clientY);
  headPressSession = null;
  if (shouldToggle) {
    onHeadWidgetActivate();
  }
}

function onDocumentPointerUpForHeadPress(event) {
  if (!headPressSession || !event) {
    return;
  }
  if (Number.isFinite(event.pointerId) && headPressSession.pointerId !== event.pointerId) {
    return;
  }
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
  if (typeof event.stopImmediatePropagation === "function") {
    event.stopImmediatePropagation();
  }
  const pointerType = headPressSession.pointerType;
  finishHeadPressSession(event, { cancelled: false });
  if (pointerType === "touch" || pointerType === "pen") {
    startHeadTouchAutoCenter();
  }
}

function onDocumentPointerCancelForHeadPress(event) {
  if (!headPressSession || !event) {
    return;
  }
  if (Number.isFinite(event.pointerId) && headPressSession.pointerId !== event.pointerId) {
    return;
  }
  const pointerType = headPressSession.pointerType;
  headPressSession = null;
  if (pointerType === "touch" || pointerType === "pen") {
    startHeadTouchAutoCenter();
  }
}

function resizeHeadRendererToHost(force = false) {
  if (!headRenderer || !headCamera || !headCanvasHostEl) {
    return false;
  }
  const width = Math.max(1, Math.round(window.innerWidth || headCanvasHostEl.clientWidth || 1));
  const height = Math.max(1, Math.round(window.innerHeight || headCanvasHostEl.clientHeight || 1));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, DESKTOP_HEAD_MAX_PIXEL_RATIO);
  if (
    !force &&
    width === headRenderWidth &&
    height === headRenderHeight &&
    Math.abs(pixelRatio - headRenderPixelRatio) < 0.01
  ) {
    return false;
  }
  headRenderWidth = width;
  headRenderHeight = height;
  headRenderPixelRatio = pixelRatio;
  headRenderer.setPixelRatio(pixelRatio);
  headRenderer.setSize(width, height, false);
  headCamera.aspect = width / Math.max(1, height);
  headCamera.updateProjectionMatrix();
  headNeedsRender = true;
  return true;
}

function configureHeadRendererPipeline(ThreeLib) {
  if (!headRenderer) {
    return;
  }

  headRenderer.physicallyCorrectLights = true;
  headRenderer.toneMapping = ThreeLib.ACESFilmicToneMapping;
  headRenderer.toneMappingExposure = headTuning.toneMappingExposure;
  if ("outputColorSpace" in headRenderer && ThreeLib.SRGBColorSpace) {
    headRenderer.outputColorSpace = ThreeLib.SRGBColorSpace;
  } else {
    headRenderer.outputEncoding = ThreeLib.sRGBEncoding;
  }
  headRenderer.setClearColor(0x000000, 0);
}

function setupHeadLightingRig(ThreeLib) {
  if (!headScene) {
    return;
  }

  const ambientLight = new ThreeLib.AmbientLight(0xffffff, headTuning.ambientIntensity);
  headScene.add(ambientLight);

  const hemisphereLight = new ThreeLib.HemisphereLight(0xfff5eb, 0xd7a57d, headTuning.hemisphereIntensity);
  hemisphereLight.position.set(0, 3, 0);
  headScene.add(hemisphereLight);

  // Main key from side/top to avoid flat frontal lighting.
  const keyLight = new ThreeLib.DirectionalLight(0xffa96c, headTuning.keyLightIntensity);
  keyLight.position.set(headTuning.keyLightPosX, headTuning.keyLightPosY, headTuning.keyLightPosZ);
  headScene.add(keyLight);

  const fillLight = new ThreeLib.DirectionalLight(0xffa96c, headTuning.fillLightIntensity);
  fillLight.position.set(headTuning.fillLightPosX, headTuning.fillLightPosY, headTuning.fillLightPosZ);
  headScene.add(fillLight);

  const rimLight = new ThreeLib.PointLight(0xffaa6c, headTuning.rimLightIntensity, 48);
  rimLight.position.set(headTuning.rimLightPosX, headTuning.rimLightPosY, headTuning.rimLightPosZ);
  headScene.add(rimLight);

  const backLight = new ThreeLib.DirectionalLight(0xffa96c, headTuning.backLightIntensity);
  backLight.position.set(headTuning.backLightPosX, headTuning.backLightPosY, headTuning.backLightPosZ);
  headScene.add(backLight);

  headLightRig.ambient = ambientLight;
  headLightRig.hemisphere = hemisphereLight;
  headLightRig.key = keyLight;
  headLightRig.fill = fillLight;
  headLightRig.rim = rimLight;
  headLightRig.back = backLight;
}

function isHeadRgbCurveActive() {
  return Boolean(headTuning.rgbCurveEnabled) && Math.abs(Number(headTuning.rgbCurveFac) || 0) > 0.0001;
}

function applyHeadRgbCurveToChannel(value, channelScale) {
  const lift = headTuning.rgbCurveLift;
  const gamma = Math.max(0.2, headTuning.rgbCurveGamma);
  const gain = headTuning.rgbCurveGain;
  let v = clamp(value + lift, 0, 1);
  v = Math.pow(v, gamma);
  v *= gain * channelScale;
  return clamp(v, 0, 1);
}

function getNeutralizedHeadTexture(ThreeLib, sourceMap) {
  if (!sourceMap?.image) {
    return sourceMap;
  }
  const shouldNeutralize = Boolean(headTuning.bakedTextureNeutralize);
  const shouldApplyCurve = isHeadRgbCurveActive();
  if (!shouldNeutralize && !shouldApplyCurve) {
    return sourceMap;
  }

  const sourceKey = sourceMap.uuid || sourceMap.id || sourceMap.name || "__head_texture__";
  const cacheKey = [
    sourceKey,
    shouldNeutralize ? 1 : 0,
    headTuning.baseColorHex,
    headTuning.bakedTextureInfluence.toFixed(4),
    headTuning.bakedTextureLumaGamma.toFixed(4),
    shouldApplyCurve ? 1 : 0,
    headTuning.rgbCurveFac.toFixed(4),
    headTuning.rgbCurveLift.toFixed(4),
    headTuning.rgbCurveGamma.toFixed(4),
    headTuning.rgbCurveGain.toFixed(4),
    headTuning.rgbCurveR.toFixed(4),
    headTuning.rgbCurveG.toFixed(4),
    headTuning.rgbCurveB.toFixed(4)
  ].join("|");
  if (headTextureCache.has(cacheKey)) {
    return headTextureCache.get(cacheKey);
  }

  const image = sourceMap.image;
  const width = Number(image.width) || 0;
  const height = Number(image.height) || 0;
  if (!width || !height) {
    return sourceMap;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return sourceMap;
  }

  ctx.drawImage(image, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const baseR = ((headTuning.baseColorHex >> 16) & 255) / 255;
  const baseG = ((headTuning.baseColorHex >> 8) & 255) / 255;
  const baseB = (headTuning.baseColorHex & 255) / 255;
  const influence = clamp(Number(headTuning.bakedTextureInfluence) || 0, 0, 1);
  const neutralizeGamma = Math.max(0.2, Number(headTuning.bakedTextureLumaGamma) || 1);
  const curveFac = clamp(Number(headTuning.rgbCurveFac) || 0, 0, 1);

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha <= 0) {
      continue;
    }
    const sourceR = data[i] / 255;
    const sourceG = data[i + 1] / 255;
    const sourceB = data[i + 2] / 255;
    let outR = sourceR;
    let outG = sourceG;
    let outB = sourceB;

    if (shouldNeutralize) {
      const luma = Math.pow(0.299 * sourceR + 0.587 * sourceG + 0.114 * sourceB, neutralizeGamma);
      outR = clamp(baseR * (1 - influence) + luma * influence, 0, 1);
      outG = clamp(baseG * (1 - influence) + luma * influence, 0, 1);
      outB = clamp(baseB * (1 - influence) + luma * influence, 0, 1);
    }

    if (shouldApplyCurve) {
      const curveR = applyHeadRgbCurveToChannel(outR, headTuning.rgbCurveR);
      const curveG = applyHeadRgbCurveToChannel(outG, headTuning.rgbCurveG);
      const curveB = applyHeadRgbCurveToChannel(outB, headTuning.rgbCurveB);
      outR = clamp(outR * (1 - curveFac) + curveR * curveFac, 0, 1);
      outG = clamp(outG * (1 - curveFac) + curveG * curveFac, 0, 1);
      outB = clamp(outB * (1 - curveFac) + curveB * curveFac, 0, 1);
    }

    data[i] = Math.round(outR * 255);
    data[i + 1] = Math.round(outG * 255);
    data[i + 2] = Math.round(outB * 255);
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new ThreeLib.CanvasTexture(canvas);
  texture.name = `${sourceMap.name || "headMap"}-processed`;
  texture.flipY = sourceMap.flipY;
  texture.wrapS = sourceMap.wrapS;
  texture.wrapT = sourceMap.wrapT;
  texture.magFilter = sourceMap.magFilter;
  texture.minFilter = sourceMap.minFilter;
  texture.generateMipmaps = sourceMap.generateMipmaps;
  texture.anisotropy = sourceMap.anisotropy;
  if ("colorSpace" in texture && ThreeLib.SRGBColorSpace) {
    texture.colorSpace = ThreeLib.SRGBColorSpace;
  } else if ("encoding" in texture) {
    texture.encoding = ThreeLib.sRGBEncoding;
  }
  texture.needsUpdate = true;

  headTextureCache.set(cacheKey, texture);
  return texture;
}

function tuneHeadModelMaterials(ThreeLib, root) {
  if (!root || !headRenderer) {
    return;
  }

  const maxAnisotropy =
    typeof headRenderer.capabilities?.getMaxAnisotropy === "function"
      ? Math.max(1, headRenderer.capabilities.getMaxAnisotropy())
      : 1;
  const anisotropy = Math.min(maxAnisotropy, HEAD_TEXTURE_ANISOTROPY);

  root.traverse((node) => {
    if (!node || !node.isMesh || !node.material) {
      return;
    }

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (!material) {
        continue;
      }
      if (material.map && !material.userData.__headOriginalMap) {
        material.userData.__headOriginalMap = material.map;
      }
      const sourceMap = material.userData.__headOriginalMap || material.map || null;
      if (sourceMap) {
        if ("colorSpace" in sourceMap && ThreeLib.SRGBColorSpace) {
          sourceMap.colorSpace = ThreeLib.SRGBColorSpace;
        } else if ("encoding" in sourceMap) {
          sourceMap.encoding = ThreeLib.sRGBEncoding;
        }
        if ("anisotropy" in sourceMap) {
          sourceMap.anisotropy = anisotropy;
        }
        sourceMap.needsUpdate = true;
      }

      if (headTuning.useBakedTexture) {
        const needsProcessedTexture = Boolean(sourceMap) && (headTuning.bakedTextureNeutralize || isHeadRgbCurveActive());
        material.map =
          needsProcessedTexture
            ? getNeutralizedHeadTexture(ThreeLib, sourceMap)
            : sourceMap;
      } else {
        material.map = null;
      }

      if ("color" in material && material.color?.setHex) {
        material.color.setHex(headTuning.baseColorHex);
      }
      if ("emissive" in material && material.emissive?.setHex) {
        material.emissive.setHex(headTuning.emissiveColorHex);
      }
      if ("emissiveIntensity" in material) {
        material.emissiveIntensity = headTuning.emissiveIntensity;
      }
      if ("metalness" in material) {
        material.metalness = headTuning.materialMetalness;
      }
      if ("roughness" in material) {
        material.roughness = headTuning.materialRoughness;
      }
      if ("envMapIntensity" in material) {
        material.envMapIntensity = headTuning.materialEnvIntensity;
      }
      material.dithering = true;
      material.needsUpdate = true;
    }
  });
}

function initHeadThreeScene() {
  if (!headCanvasHostEl) {
    return;
  }
  const ThreeLib = window.THREE;
  if (!ThreeLib || typeof ThreeLib.WebGLRenderer !== "function" || typeof ThreeLib.GLTFLoader !== "function") {
    console.warn("[head] THREE/GLTFLoader not available");
    if (headWidgetEl) {
      headWidgetEl.hidden = true;
    }
    return;
  }

  headThreeLib = ThreeLib;
  headScene = new ThreeLib.Scene();
  headCamera = new ThreeLib.PerspectiveCamera(14, 1, 0.1, 1000);
  headCamera.position.set(0, 0, 10);
  headRaycaster = new ThreeLib.Raycaster();
  headPointerNdc = new ThreeLib.Vector2();

  headRenderer = new ThreeLib.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  bindHeadRendererContextEvents();
  configureHeadRendererPipeline(ThreeLib);
  headCanvasHostEl.textContent = "";
  headCanvasHostEl.append(headRenderer.domElement);
  resizeHeadRendererToHost(true);

  setupHeadLightingRig(ThreeLib);

  const loader = new ThreeLib.GLTFLoader();
  loader.load(
    HEAD_MODEL_SRC,
    (gltf) => {
      if (headModelRoot) {
        headScene.remove(headModelRoot);
      }
      headModelRoot = gltf.scene;
      tuneHeadModelMaterials(ThreeLib, headModelRoot);
      const bounds = new ThreeLib.Box3().setFromObject(headModelRoot);
      headModelBounds = {
        minY: bounds.min.y,
        maxY: bounds.max.y,
        height: Math.max(0.0001, bounds.max.y - bounds.min.y)
      };
      const pose = getHeadPoseTargets();
      headCurrentScale = pose.scale;
      headCurrentY = pose.y;
      headPoseAnim = null;
      headModelRoot.scale.setScalar(headCurrentScale);
      headModelRoot.position.set(0, headCurrentY, 0);
      headScene.add(headModelRoot);
      headModelLoaded = true;
      applyHeadTuning();
      markHeadNeedsRender();
    },
    undefined,
    (error) => {
      console.error("[head] model load failed", error);
      if (headWidgetEl) {
        headWidgetEl.hidden = true;
      }
    }
  );
}

function bindHeadRendererContextEvents() {
  const canvas = headRenderer?.domElement;
  if (!canvas) {
    return;
  }

  canvas.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      headModelLoaded = false;
      headPoseAnim = null;
    },
    false
  );
  canvas.addEventListener(
    "webglcontextrestored",
    () => {
      headLastRenderTime = 0;
      resizeHeadRendererToHost(true);
      if (headModelRoot) {
        headModelLoaded = true;
        applyHeadTuning();
      }
      markHeadNeedsRender();
    },
    false
  );
}

function markHeadNeedsRender({ wake = true } = {}) {
  headNeedsRender = true;
  if (wake) {
    scheduleMainFrame();
  }
}

function shouldRunHeadFrame() {
  if (!headRenderer || !headScene || !headCamera || document.hidden || headWidgetEl?.hidden) {
    return false;
  }
  return headNeedsRender || Boolean(headPoseAnim);
}

function updateHeadWidgetFrame() {
  if (!headRenderer || !headScene || !headCamera) {
    return;
  }
  if (document.hidden || headWidgetEl?.hidden) {
    return;
  }
  if (!shouldRunHeadFrame()) {
    return;
  }
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  headLastRenderTime = now;
  resizeHeadRendererToHost();
  if (!headModelRoot || !headModelLoaded) {
    headRenderer.render(headScene, headCamera);
    headNeedsRender = false;
    return;
  }

  const pose = getHeadPoseTargets();
  if (headPoseAnim) {
    const duration = Math.max(1, headPoseAnim.duration || HEAD_POSE_DURATION_MS);
    const t = clamp((now - headPoseAnim.start) / duration, 0, 1);
    const eased = 1 - (1 - t) * (1 - t);
    headCurrentScale = lerp(headPoseAnim.fromScale, headPoseAnim.toScale, eased);
    headCurrentY = lerp(headPoseAnim.fromY, headPoseAnim.toY, eased);
    if (t >= 1) {
      headPoseAnim = null;
      headCurrentScale = pose.scale;
      headCurrentY = pose.y;
    }
  } else {
    headCurrentScale = pose.scale;
    headCurrentY = pose.y;
  }
  if (HEAD_INTERACTIVE_ROTATION_ENABLED && headTouchAutoCenterActive) {
    headPointerTargetX = lerp(headPointerTargetX, 0, HEAD_TOUCH_RETURN_AUTO_SMOOTH);
    headPointerTargetY = lerp(headPointerTargetY, 0, HEAD_TOUCH_RETURN_AUTO_SMOOTH);
    if (Math.abs(headPointerTargetX) < 0.0008 && Math.abs(headPointerTargetY) < 0.0008) {
      headPointerTargetX = 0;
      headPointerTargetY = 0;
      headTouchAutoCenterActive = false;
    }
  }
  const baseRotationX = state.headModalOpen ? 0 : -0.1;
  if (HEAD_INTERACTIVE_ROTATION_ENABLED) {
    const useMobileDynamics = shouldUseMobileHeadDynamics();
    const pointerSmooth = useMobileDynamics ? HEAD_POINTER_SMOOTH_MOBILE : HEAD_POINTER_SMOOTH_DESKTOP;
    const rotationSmooth = useMobileDynamics ? HEAD_ROTATION_SMOOTH_MOBILE : HEAD_ROTATION_SMOOTH_DESKTOP;
    headPointerX = lerp(headPointerX, headPointerTargetX, pointerSmooth);
    headPointerY = lerp(headPointerY, headPointerTargetY, pointerSmooth);

    const gain = state.headModalOpen
      ? (useMobileDynamics ? HEAD_ROTATION_GAIN_OPEN_MOBILE : HEAD_ROTATION_GAIN_OPEN_DESKTOP)
      : (useMobileDynamics ? HEAD_ROTATION_GAIN_CLOSED_MOBILE : HEAD_ROTATION_GAIN_CLOSED_DESKTOP);
    const targetRotationY = headPointerX * gain;
    const targetRotationX = baseRotationX + headPointerY * gain;
    headModelRoot.rotation.y += (targetRotationY - headModelRoot.rotation.y) * rotationSmooth;
    headModelRoot.rotation.x += (targetRotationX - headModelRoot.rotation.x) * rotationSmooth;
  } else {
    headPointerTargetX = 0;
    headPointerTargetY = 0;
    headPointerX = 0;
    headPointerY = 0;
    headTouchAutoCenterActive = false;
    headModelRoot.rotation.y = 0;
    headModelRoot.rotation.x = baseRotationX;
  }
  headModelRoot.scale.setScalar(headCurrentScale);
  headModelRoot.position.set(0, headCurrentY, 0);

  headRenderer.render(headScene, headCamera);
  headNeedsRender = false;
}

function initHeadWidget({ startOpen = true } = {}) {
  if (!headWidgetEl || !headCanvasHostEl) {
    return;
  }
  headWidgetEl.setAttribute("aria-hidden", "true");
  if (headBackdropEl) {
    headBackdropEl.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  }
  document.addEventListener("pointerdown", onDocumentPointerDownForHead, true);
  document.addEventListener("pointermove", onDocumentPointerMoveForHeadPress, true);
  document.addEventListener("pointerup", onDocumentPointerUpForHeadPress, true);
  document.addEventListener("pointercancel", onDocumentPointerCancelForHeadPress, true);
  if (HEAD_INTERACTIVE_ROTATION_ENABLED) {
    document.addEventListener("pointermove", onDocumentPointerMoveForHead, { passive: true });
    document.addEventListener("touchstart", onDocumentTouchStartForHead, { passive: true });
    document.addEventListener("touchmove", onDocumentTouchMoveForHead, { passive: true });
    document.addEventListener("touchend", onDocumentTouchEndForHead, { passive: true });
    document.addEventListener("touchcancel", onDocumentTouchEndForHead, { passive: true });
  }
  window.addEventListener("blur", () => {
    headPressSession = null;
    stopHeadTouchAutoCenter();
    headPointerTargetX = 0;
    headPointerTargetY = 0;
  });
  setHeadModalOpen(Boolean(startOpen), { immediate: true });
  initHeadThreeScene();
}

function isMobileDeepProjectInfoMode() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  return viewportWidth <= MOBILE_DEEP_INFO_BREAKPOINT;
}

function isMobileDeepProjectLayoutMode() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  return viewportWidth <= MOBILE_TITLE_BREAKPOINT;
}

function isFullWidthDeepProjectInfoMode() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  return viewportWidth <= MOBILE_DEEP_INFO_FULL_WIDTH_BREAKPOINT;
}

function updateDeepProjectInfoStateClasses(isMobileMode, isExpanded) {
  if (!deepProjectInfoEl) {
    return;
  }
  deepProjectInfoEl.classList.toggle("is-mobile", isMobileMode);
  deepProjectInfoEl.classList.toggle("is-collapsed", !isExpanded);
  deepProjectInfoEl.dataset.expanded = String(isExpanded);
}

function updateDeepProjectInfoCollapsedWidth() {
  if (!deepProjectInfoEl || deepProjectInfoEl.hidden) {
    return;
  }
  const titleMain = deepProjectInfoEl.querySelector(".deep-project-info-title-main");
  const titleText = deepProjectInfoEl.querySelector(".deep-project-info-title-text");
  const titleDot = deepProjectInfoEl.querySelector(".deep-project-info-title-main .project-dot");
  const toggle = deepProjectInfoEl.querySelector(".deep-project-info-toggle");
  if (!titleMain || !titleText || !titleDot || !toggle) {
    return;
  }
  const style = window.getComputedStyle(deepProjectInfoEl);
  const titleMainStyle = window.getComputedStyle(titleMain);
  const titleDotStyle = window.getComputedStyle(titleDot);
  const padLeft = Number.parseFloat(style.paddingLeft) || 0;
  const padRight = Number.parseFloat(style.paddingRight) || 0;
  const titleTextWidth = Math.ceil(
    Math.max(
      titleText.scrollWidth || 0,
      titleText.clientWidth || 0,
      titleText.getBoundingClientRect().width || 0
    )
  );
  const titleMainGap = Number.parseFloat(titleMainStyle.columnGap || titleMainStyle.gap) || 0;
  const titleDotWidth = Number.parseFloat(titleDotStyle.width) || titleDot.getBoundingClientRect().width || 0;
  const titleMainWidth = Math.ceil(titleDotWidth + titleMainGap + titleTextWidth);
  const toggleWidth = Math.ceil(toggle.getBoundingClientRect().width);
  const collapsedWidth = Math.ceil(
    titleMainWidth + toggleWidth + MOBILE_DEEP_INFO_COLLAPSED_TITLE_GAP + padLeft + padRight
  );
  deepProjectInfoEl.style.setProperty("--deep-info-collapsed-width", `${collapsedWidth}px`);
}

let deepProjectInfoLayoutSyncRafA = 0;
let deepProjectInfoLayoutSyncRafB = 0;
let deepProjectInfoTransitionSyncCleanup = null;

function clearDeepProjectInfoTransitionSync() {
  if (typeof deepProjectInfoTransitionSyncCleanup === "function") {
    deepProjectInfoTransitionSyncCleanup();
  }
  deepProjectInfoTransitionSyncCleanup = null;
}

function runDeepProjectInfoLayoutSync() {
  if (!deepProjectInfoEl || deepProjectInfoEl.hidden) {
    return;
  }
  updateDeepProjectInfoCollapsedWidth();
  syncDeepProjectInfoTextTrim();
  updateDeepProjectInfoMeasuredHeights();
}

function updateDeepProjectInfoMeasuredHeights() {
  if (!deepProjectInfoEl || deepProjectInfoEl.hidden) {
    return;
  }

  if (!isMobileDeepProjectInfoMode()) {
    deepProjectInfoEl.style.removeProperty("--deep-info-expanded-inner-width");
    deepProjectInfoEl.style.removeProperty("--deep-info-content-height");
    deepProjectInfoEl.style.removeProperty("--deep-info-body-height");
    return;
  }

  const rootStyle = window.getComputedStyle(document.documentElement);
  const panelStyle = window.getComputedStyle(deepProjectInfoEl);
  const edgeOffset = Number.parseFloat(rootStyle.getPropertyValue("--deep-info-edge-offset")) || 0;
  const textStackGap = Number.parseFloat(rootStyle.getPropertyValue("--text-stack-gap")) || 0;
  const safeLeft = Number.parseFloat(rootStyle.getPropertyValue("--safe-left")) || 0;
  const safeRight = Number.parseFloat(rootStyle.getPropertyValue("--safe-right")) || 0;
  const padLeft = Number.parseFloat(panelStyle.paddingLeft) || 0;
  const padRight = Number.parseFloat(panelStyle.paddingRight) || 0;
  const maxDesktopWidth = 395;
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const expandedOuterWidth = isFullWidthDeepProjectInfoMode()
    ? Math.max(0, viewportWidth - ((edgeOffset + safeLeft) + (edgeOffset + safeRight)))
    : Math.max(0, Math.min(maxDesktopWidth, viewportWidth - ((edgeOffset + safeLeft) + (edgeOffset + safeRight))));
  const expandedInnerWidth = Math.max(0, expandedOuterWidth - padLeft - padRight);
  deepProjectInfoEl.style.setProperty("--deep-info-expanded-inner-width", `${expandedInnerWidth}px`);

  const metaEl = deepProjectInfoEl.querySelector(".deep-project-info-meta");
  const bodyWrap = deepProjectInfoEl.querySelector(".deep-project-info-body-wrap");
  const bodyInner = deepProjectInfoEl.querySelector(".deep-project-info-body-inner");

  let bodyHeight = 0;
  if (bodyInner instanceof HTMLElement) {
    bodyHeight = Math.ceil(bodyInner.scrollHeight || bodyInner.getBoundingClientRect().height || 0);
    deepProjectInfoEl.style.setProperty("--deep-info-body-height", `${Math.max(0, bodyHeight)}px`);
  } else {
    deepProjectInfoEl.style.removeProperty("--deep-info-body-height");
  }

  const metaHeight =
    metaEl instanceof HTMLElement
      ? Math.ceil(metaEl.scrollHeight || metaEl.getBoundingClientRect().height || 0)
      : 0;
  const bodyMarginTop =
    bodyWrap instanceof HTMLElement
      ? Number.parseFloat(window.getComputedStyle(bodyWrap).marginTop) || textStackGap
      : 0;
  const contentHeight = Math.max(0, metaHeight + (bodyHeight > 0 ? bodyMarginTop + bodyHeight : 0));
  deepProjectInfoEl.style.setProperty("--deep-info-content-height", `${contentHeight}px`);
}

function scheduleDeepProjectInfoLayoutSync({ afterTransition = false } = {}) {
  if (deepProjectInfoLayoutSyncRafA) {
    cancelAnimationFrame(deepProjectInfoLayoutSyncRafA);
    deepProjectInfoLayoutSyncRafA = 0;
  }
  if (deepProjectInfoLayoutSyncRafB) {
    cancelAnimationFrame(deepProjectInfoLayoutSyncRafB);
    deepProjectInfoLayoutSyncRafB = 0;
  }

  deepProjectInfoLayoutSyncRafA = requestAnimationFrame(() => {
    deepProjectInfoLayoutSyncRafA = 0;
    deepProjectInfoLayoutSyncRafB = requestAnimationFrame(() => {
      deepProjectInfoLayoutSyncRafB = 0;
      runDeepProjectInfoLayoutSync();
    });
  });

  clearDeepProjectInfoTransitionSync();
  if (!afterTransition || !deepProjectInfoEl) {
    return;
  }

  const onTransitionEnd = (event) => {
    const propertyName = String(event?.propertyName || "");
    if (!["width", "height", "opacity", "margin-top"].includes(propertyName)) {
      return;
    }
    clearDeepProjectInfoTransitionSync();
    runDeepProjectInfoLayoutSync();
  };

  deepProjectInfoTransitionSyncCleanup = () => {
    if (deepProjectInfoEl) {
      deepProjectInfoEl.removeEventListener("transitionend", onTransitionEnd, true);
    }
  };
  deepProjectInfoEl.addEventListener("transitionend", onTransitionEnd, true);
}

function syncDeepProjectInfoTextTrim() {
  if (!deepProjectInfoEl || deepProjectInfoEl.hidden) {
    return;
  }
  const allLines = [...deepProjectInfoEl.querySelectorAll(".ui-text-line")];
  for (const line of allLines) {
    line.classList.remove("is-trim-top", "is-trim-bottom");
  }

  const titleLine = deepProjectInfoEl.querySelector(".deep-project-info-title.ui-text-line");
  const metaLines = [...deepProjectInfoEl.querySelectorAll(".deep-project-info-line.ui-text-line")];
  const bodyLines = [...deepProjectInfoEl.querySelectorAll(".deep-project-info-body.ui-text-line")];
  const isMobileMode = isMobileDeepProjectInfoMode();
  const isExpanded = Boolean(state.deepInfoExpanded);
  const visibleLines = [];

  if (titleLine) {
    visibleLines.push(titleLine);
  }
  if (isMobileMode) {
    if (isExpanded) {
      visibleLines.push(...metaLines);
      visibleLines.push(...bodyLines);
    }
  } else {
    visibleLines.push(...metaLines);
    if (isExpanded) {
      visibleLines.push(...bodyLines);
    }
  }

  if (!visibleLines.length) {
    return;
  }
  visibleLines[0].classList.add("is-trim-top");
  visibleLines[visibleLines.length - 1].classList.add("is-trim-bottom");
}

function setDeepProjectInfoExpanded(expanded) {
  const next = Boolean(expanded);
  if (state.deepInfoExpanded === next) {
    return;
  }
  state.deepInfoExpanded = next;
  const isMobileMode = isMobileDeepProjectInfoMode();
  const canUpdateInPlace =
    deepProjectInfoEl &&
    !deepProjectInfoEl.hidden &&
    deepProjectInfoEl.dataset.projectSlug &&
    deepProjectInfoEl.dataset.projectSlug === (state.deepProjectSlug || "");
  if (canUpdateInPlace) {
    updateDeepProjectInfoStateClasses(isMobileMode, next);
    const toggle = deepProjectInfoEl.querySelector(".deep-project-info-toggle");
    if (toggle) {
      toggle.textContent = next ? "(CLOSE)" : "(INFO)";
      toggle.setAttribute("aria-expanded", String(next));
    }
    renderDeepProjectBackButton(state.deepProjectSlug);
    if (isMobileMode) {
      runDeepProjectInfoLayoutSync();
      scheduleDeepProjectInfoLayoutSync();
    } else {
      clearDeepProjectInfoTransitionSync();
      updateDeepProjectInfoCollapsedWidth();
      syncDeepProjectInfoTextTrim();
      updateDeepProjectInfoMeasuredHeights();
    }
    return;
  }
  renderDeepProjectInfo(state.deepProjectSlug);
}

function collapseDeepProjectInfoOnGraphInteraction() {
  // Mobile deep-project info now follows desktop behavior:
  // it is toggled only by the INFO/CLOSE button.
}

function captureDeepOverviewReturnState() {
  state.deepOverviewReturn = {
    activeType: state.activeType,
    x: Number.isFinite(state.targetX) ? state.targetX : state.viewX,
    y: Number.isFinite(state.targetY) ? state.targetY : state.viewY,
    zoom: Number.isFinite(state.targetZoom) ? state.targetZoom : state.viewZoom,
    focusedSlug: typeof state.focusedSlug === "string" && state.focusedSlug.trim() ? state.focusedSlug.trim() : null,
    focusedMediaIndex: Number.isFinite(Number(state.focusedMediaIndex))
      ? Math.max(0, Math.round(Number(state.focusedMediaIndex)))
      : -1
  };
}

function restoreDeepOverviewReturnState(animate = true) {
  const snapshot = state.deepOverviewReturn;
  state.deepOverviewReturn = null;
  if (!snapshot || typeof snapshot !== "object") {
    return false;
  }

  const targetType =
    snapshot.activeType === "all" || (Array.isArray(state.filterTypes) && state.filterTypes.includes(snapshot.activeType))
      ? snapshot.activeType
      : "all";
  if (targetType !== state.activeType) {
    applyFilter(targetType, false, false, true);
  } else {
    refreshModelVisibility(targetType);
  }

  const nextFocusedSlug =
    typeof snapshot.focusedSlug === "string" && modelBySlug.get(snapshot.focusedSlug)?.visible ? snapshot.focusedSlug : null;
  state.focusedSlug = nextFocusedSlug;
  state.focusTrackActive = Boolean(nextFocusedSlug);
  if (nextFocusedSlug && Number.isFinite(Number(snapshot.focusedMediaIndex)) && Number(snapshot.focusedMediaIndex) >= 0) {
    setFocusedMediaTarget(snapshot.focusedMediaIndex);
  } else {
    clearFocusedMediaTarget();
  }
  focusedModel = nextFocusedSlug ? modelBySlug.get(nextFocusedSlug) || null : null;
  refreshFocusedClasses();

  const nextX = Number.isFinite(snapshot.x) ? snapshot.x : state.homeX;
  const nextY = Number.isFinite(snapshot.y) ? snapshot.y : state.homeY;
  const nextZoom = clamp(
    Number.isFinite(snapshot.zoom) ? snapshot.zoom : state.homeZoom,
    MIN_ZOOM,
    getCurrentMaxZoom()
  );
  state.simHeat = 0;

  if (animate) {
    setTargetView(nextX, nextY, nextZoom);
  } else {
    state.viewX = nextX;
    state.viewY = nextY;
    state.viewZoom = nextZoom;
    setTargetView(nextX, nextY, nextZoom);
  }
  return true;
}

function renderDeepProjectBackButton(projectSlug = null) {
  if (!deepProjectBackBtn) {
    return;
  }
  if (!projectSlug) {
    deepProjectBackBtn.hidden = true;
    deepProjectBackBtn.textContent = "";
    deepProjectBackBtn.classList.remove("is-mobile");
    return;
  }

  const isMobileMode = isMobileDeepProjectInfoMode();
  const isFullWidthMode = isFullWidthDeepProjectInfoMode();
  deepProjectBackBtn.classList.toggle("is-mobile", isMobileMode);
  if (isFullWidthMode && state.deepInfoExpanded) {
    deepProjectBackBtn.hidden = true;
    deepProjectBackBtn.textContent = "";
    return;
  }
  deepProjectBackBtn.hidden = false;
  deepProjectBackBtn.textContent = "";
  const text = document.createElement("span");
  text.className = "deep-project-back-text ui-text-line is-trim-top is-trim-bottom";
  text.textContent = isMobileMode ? "←" : "← BACK";
  deepProjectBackBtn.append(text);
  deepProjectBackBtn.setAttribute("aria-label", "Back");
}

function renderDeepProjectInfo(projectSlug = null) {
  if (!deepProjectInfoEl) {
    return;
  }
  const model = projectSlug ? modelBySlug.get(projectSlug) : null;
  const project = model ? getDisplayProject(model) : null;
  renderDeepProjectBackButton(projectSlug);
  if (!project) {
    deepProjectInfoEl.classList.remove("is-mobile", "is-collapsed");
    deepProjectInfoEl.removeAttribute("data-expanded");
    deepProjectInfoEl.removeAttribute("data-project-slug");
    deepProjectInfoEl.style.removeProperty("--deep-info-collapsed-width");
    deepProjectInfoEl.hidden = true;
    deepProjectInfoEl.textContent = "";
    return;
  }

  const isMobileMode = isMobileDeepProjectInfoMode();
  const isExpanded = state.deepInfoExpanded;
  const renderedSlug = deepProjectInfoEl.dataset.projectSlug || "";
  if (!deepProjectInfoEl.hidden && renderedSlug === project.slug) {
    updateDeepProjectInfoStateClasses(isMobileMode, isExpanded);
    const toggleBtn = deepProjectInfoEl.querySelector(".deep-project-info-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = isExpanded ? "(CLOSE)" : "(INFO)";
      toggleBtn.setAttribute("aria-expanded", String(isExpanded));
    }
    if (isMobileMode) {
      runDeepProjectInfoLayoutSync();
      scheduleDeepProjectInfoLayoutSync();
    } else {
      clearDeepProjectInfoTransitionSync();
      updateDeepProjectInfoCollapsedWidth();
      syncDeepProjectInfoTextTrim();
      updateDeepProjectInfoMeasuredHeights();
    }
    return;
  }

  const metaRows = getProjectDetailsRows(project, { includeMoreLink: true });
  const introText = typeof project.introText === "string" ? project.introText.trim() : "";
  const detailsText = typeof project.detailsText === "string" ? project.detailsText.trim() : "";
  const bodyParagraphs = splitUiTextParagraphs(introText, detailsText);

  const titleMain = document.createElement("span");
  titleMain.className = "deep-project-info-title-main";

  const dot = document.createElement("span");
  dot.className = "project-dot";
  dot.setAttribute("aria-hidden", "true");

  const title = document.createElement("span");
  title.className = "deep-project-info-title-text";
  title.textContent = project.title;

  const titleRow = document.createElement("p");
  titleRow.className = "deep-project-info-title ui-text-line";
  titleMain.append(dot, title);
  titleRow.append(titleMain);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "deep-project-info-toggle";
  toggle.textContent = isExpanded ? "(CLOSE)" : "(INFO)";
  toggle.setAttribute("aria-expanded", String(isExpanded));
  toggle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDeepProjectInfoExpanded(!state.deepInfoExpanded);
  });
  titleRow.append(toggle);

  const fragment = document.createDocumentFragment();
  fragment.append(titleRow);
  const allTextLines = [titleRow];
  const content = document.createElement("div");
  content.className = "deep-project-info-content";
  const contentInner = document.createElement("div");
  contentInner.className = "deep-project-info-content-inner";
  if (metaRows.length) {
    const meta = document.createElement("div");
    meta.className = "deep-project-info-meta";
    for (const row of metaRows) {
      const line = document.createElement("p");
      line.className = "deep-project-info-line ui-text-line";

      const label = document.createElement("span");
      label.className = "deep-project-info-label";
      label.textContent = `${row.label}: `;
      line.append(label);

      if (row.href) {
        const link = document.createElement("a");
        link.className = "deep-project-info-link";
        link.href = row.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = row.value;
        line.append(link);
      } else {
        const value = document.createElement("span");
        value.className = "deep-project-info-value";
        appendInlineMarkdownLinks(value, row.value);
        line.append(value);
      }

      meta.append(line);
      allTextLines.push(line);
    }
    contentInner.append(meta);
  }
  if (bodyParagraphs.length) {
    const bodyWrap = document.createElement("div");
    bodyWrap.className = "deep-project-info-body-wrap";
    const bodyInner = document.createElement("div");
    bodyInner.className = "deep-project-info-body-inner";
    for (const paragraphText of bodyParagraphs) {
      const paragraph = document.createElement("p");
      paragraph.className = "deep-project-info-body ui-text-line";
      appendInlineMarkdownLinks(paragraph, paragraphText);
      bodyInner.append(paragraph);
      allTextLines.push(paragraph);
    }
    bodyWrap.append(bodyInner);
    contentInner.append(bodyWrap);
  }
  content.append(contentInner);
  if (content.childElementCount) {
    fragment.append(content);
  }

  applyTrimToLineSet(allTextLines);

  updateDeepProjectInfoStateClasses(isMobileMode, isExpanded);
  deepProjectInfoEl.dataset.projectSlug = project.slug;
  deepProjectInfoEl.textContent = "";
  deepProjectInfoEl.append(fragment);
  deepProjectInfoEl.hidden = false;
  if (isMobileMode) {
    runDeepProjectInfoLayoutSync();
    scheduleDeepProjectInfoLayoutSync();
  } else {
    clearDeepProjectInfoTransitionSync();
    updateDeepProjectInfoCollapsedWidth();
    syncDeepProjectInfoTextTrim();
    updateDeepProjectInfoMeasuredHeights();
  }
}

function hasDeepChildModelForSourceMediaIndex(sourceSlug, mediaIndex) {
  const targetIndex = Math.max(0, Math.round(Number(mediaIndex) || 0));
  for (const childSlug of getContentChildSlugs(sourceSlug)) {
    const childModel = modelBySlug.get(childSlug);
    if (!childModel) {
      continue;
    }
    const childSourceIndex = Math.max(0, Math.round(Number(childModel.sourceMediaIndex) || 0));
    if (childSourceIndex === targetIndex) {
      return true;
    }
  }
  return false;
}

function shouldHideDeepRootMediaInDeepMode(sourceSlug) {
  if (!sourceSlug) {
    return false;
  }
  const sourceModel = modelBySlug.get(sourceSlug);
  const sourceProject = sourceModel ? getDisplayProject(sourceModel) : null;
  const sourceMediaLayout = mediaLayoutBySlug.get(sourceSlug) || sourceProject?.media || [];
  if (!Array.isArray(sourceMediaLayout) || !sourceMediaLayout.length) {
    return false;
  }
  const childSlugs = getContentChildSlugs(sourceSlug);
  if (!childSlugs.length) {
    return false;
  }
  for (let mediaIndex = 0; mediaIndex < sourceMediaLayout.length; mediaIndex += 1) {
    if (!hasDeepChildModelForSourceMediaIndex(sourceSlug, mediaIndex)) {
      return false;
    }
  }
  return true;
}

function getDeepRootVirtualBounds(rootX, rootY, childCount = 0) {
  const density = clamp((childCount - 8) / 24, 0, 1);
  const halfW = lerp(26, 42, density);
  const halfH = lerp(20, 30, density);
  return {
    minX: rootX - halfW,
    maxX: rootX + halfW,
    minY: rootY - halfH,
    maxY: rootY + halfH
  };
}

function refreshDeepNodeClasses() {
  for (const node of nodeBySlug.values()) {
    node.classList.remove("is-deep-root", "is-deep-item", "is-deep-root-media-hidden");
  }

  if (!state.deepProjectSlug) {
    return;
  }

  const deepRootNode = nodeBySlug.get(state.deepProjectSlug);
  if (deepRootNode) {
    deepRootNode.classList.add("is-deep-root");
    if (shouldHideDeepRootMediaInDeepMode(state.deepProjectSlug)) {
      deepRootNode.classList.add("is-deep-root-media-hidden");
    }
  }
  for (const slug of getContentChildSlugs(state.deepProjectSlug)) {
    nodeBySlug.get(slug)?.classList.add("is-deep-item");
  }
}

function tokenizeThemeTerms(value) {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]{2,4}$/gi, " ")
    .replace(/[_/\\.-]+/g, " ")
    .replace(/[^a-z0-9@ ]+/gi, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function getMediaDescriptorTokens(media) {
  const role = typeof media?.role === "string" ? media.role : "";
  const srcKey = getMediaSrcKey(media?.src || "");
  return new Set([...tokenizeThemeTerms(role), ...tokenizeThemeTerms(srcKey)]);
}

function getDeepRootAnchorPosition(sourceModel) {
  if (!sourceModel) {
    return { x: 0, y: 0 };
  }
  const x = Number.isFinite(sourceModel.deepAx)
    ? sourceModel.deepAx
    : Number.isFinite(sourceModel.ax)
      ? sourceModel.ax
      : sourceModel.x;
  const y = Number.isFinite(sourceModel.deepAy)
    ? sourceModel.deepAy
    : Number.isFinite(sourceModel.ay)
      ? sourceModel.ay
      : sourceModel.y;
  return { x, y };
}

function clearDeepRootAnchor(sourceSlug) {
  if (!sourceSlug) {
    return;
  }
  const model = modelBySlug.get(sourceSlug);
  if (!model) {
    return;
  }
  delete model.deepAx;
  delete model.deepAy;
}

function captureDeepSourceMediaAnchorsSnapshot(
  sourceSlug,
  referenceZoom = state.targetZoom || state.viewZoom || MAX_ZOOM
) {
  const sourceModel = modelBySlug.get(sourceSlug);
  if (!sourceModel) {
    return null;
  }

  const project = getDisplayProject(sourceModel);
  const mediaLayout = mediaLayoutBySlug.get(sourceSlug) || project?.media || [];
  const safeZoom = clamp(Number(referenceZoom) || MAX_ZOOM, MIN_ZOOM, MAX_ZOOM);
  const node = nodeBySlug.get(sourceSlug);
  const mediaElements = node ? [...node.querySelectorAll(".project-media")] : [];
  const anchors = [];

  for (const [index, media] of mediaLayout.entries()) {
    const mediaEl = mediaElements[index];
    const fromDOM = mediaEl ? getElementWorldCenter(mediaEl) : null;
    const fromLayout = getMediaWorldCenterAtZoom(sourceModel, index, safeZoom);
    const center = fromDOM || fromLayout;
    if (!center) {
      continue;
    }
    anchors.push({
      index,
      x: center.x,
      y: center.y,
      tokens: getMediaDescriptorTokens(media),
      media
    });
  }

  if (anchors.length) {
    return anchors;
  }

  const fallbackRoot = getModelPositionAtZoom(sourceModel, safeZoom);
  return [
    {
      index: 0,
      x: fallbackRoot.x,
      y: fallbackRoot.y,
      tokens: new Set(),
      media: null
    }
  ];
}

function getDeepSourceMediaAnchors(sourceModel, zoom = MAX_ZOOM) {
  const project = getDisplayProject(sourceModel);
  const mediaLayout = mediaLayoutBySlug.get(sourceModel.slug) || project?.media || [];
  const mediaLayoutClose = mediaLayoutCloseBySlug.get(sourceModel.slug) || mediaLayout;
  const layoutT = Number.isFinite(state.deepEntryMediaLayoutT) ? state.deepEntryMediaLayoutT : 0;
  const rootAnchor = getDeepRootAnchorPosition(sourceModel);
  const rootAx = rootAnchor.x;
  const rootAy = rootAnchor.y;

  if (!Array.isArray(mediaLayout) || !mediaLayout.length) {
    return [
      {
        index: 0,
        x: rootAx,
        y: rootAy,
        tokens: new Set(),
        media: null
      }
    ];
  }

  const origin = getMediaLayoutOrigin(mediaLayout);
  const scale = getDeepModeMediaScaleAtZoom(zoom);
  const baseX = rootAx - sourceModel.centerX;
  const baseY = rootAy - sourceModel.centerY;

  return mediaLayout.map((media, index) => {
    const mediaClose = mediaLayoutClose[index] || media;
    const x = lerp(Number(media?.x) || 0, Number(mediaClose?.x) || 0, layoutT);
    const y = lerp(Number(media?.y) || 0, Number(mediaClose?.y) || 0, layoutT);
    const w = Math.max(1, Number(media?.w) || Number(mediaClose?.w) || 180);
    const h = Math.max(1, Number(media?.h) || Number(mediaClose?.h) || 180);
    const scaledX = origin.x + (x - origin.x) * scale;
    const scaledY = origin.y + (y - origin.y) * scale;
    return {
      index,
      x: baseX + scaledX + (w * scale) / 2,
      y: baseY + scaledY + (h * scale) / 2,
      tokens: getMediaDescriptorTokens(media),
      media
    };
  });
}

function pickDeepAnchorIndexForContentModel(model, anchors, sourceSlug) {
  if (!Array.isArray(anchors) || !anchors.length) {
    return 0;
  }
  if (anchors.length === 1) {
    return 0;
  }

  if (Number.isFinite(model.sourceMediaIndex)) {
    const direct = Math.max(0, Math.min(anchors.length - 1, Math.round(model.sourceMediaIndex)));
    const hasMedia = anchors[direct]?.media != null;
    if (hasMedia) {
      return direct;
    }
  }

  const fallbackOrder = Number.isFinite(model.contentIndex)
    ? Math.max(0, Math.round(model.contentIndex))
    : Math.abs(hashString(`${sourceSlug}:${model.slug}`));
  return fallbackOrder % anchors.length;
}

function relayoutDeepProjectContent(sourceSlug) {
  const sourceModel = modelBySlug.get(sourceSlug);
  if (!sourceModel) {
    return;
  }

  const childModels = getContentChildSlugs(sourceSlug)
    .map((slug) => modelBySlug.get(slug))
    .filter(Boolean)
    .sort((a, b) => (a.contentIndex || 0) - (b.contentIndex || 0));
  if (!childModels.length) {
    return;
  }

  const isMobileDeepLayout = isMobileDeepProjectLayoutMode();
  const deepDensityT = clamp((childModels.length - 8) / 32, 0, 1);
  const deepTargetAspectRatio = getTargetDeepAspectRatio(childModels.length);
  const deepAspectStretch = getDeepLayoutAspectStretch(childModels.length);
  const includeDeepNoteBounds = !isMobileDeepLayout;
  const rootAnchor = getDeepRootAnchorPosition(sourceModel);
  const rootAx = rootAnchor.x;
  const rootAy = rootAnchor.y;
  if (restoreDeepProjectLayoutFromCache(sourceSlug, childModels, rootAx, rootAy)) {
    return;
  }
  const deepCollisionZoom = getCurrentMaxZoom();
  const hideRootMediaInDeep = shouldHideDeepRootMediaInDeepMode(sourceSlug);
  const rootObstacleBoxes = hideRootMediaInDeep ? [] : getDeepRootObstacleBoxes(sourceModel, deepCollisionZoom);
  const deepAnchorZoom = Number.isFinite(state.deepEntryZoom) ? state.deepEntryZoom : MAX_ZOOM;
  const anchors = getDeepSourceMediaAnchors(sourceModel, deepAnchorZoom);
  if (state.deepProjectSlug === sourceSlug && Array.isArray(state.deepSourceAnchors) && state.deepSourceAnchors.length) {
    const snapshotByIndex = new Map();
    for (const snapshot of state.deepSourceAnchors) {
      const index = Number(snapshot?.index);
      const x = Number(snapshot?.x);
      const y = Number(snapshot?.y);
      if (!Number.isFinite(index) || !Number.isFinite(x) || !Number.isFinite(y)) {
        continue;
      }
      snapshotByIndex.set(Math.max(0, Math.round(index)), snapshot);
    }
    for (const anchor of anchors) {
      const snapshot = snapshotByIndex.get(anchor.index);
      if (!snapshot) {
        continue;
      }
      anchor.x = Number(snapshot.x);
      anchor.y = Number(snapshot.y);
      if (snapshot.tokens instanceof Set) {
        anchor.tokens = new Set(snapshot.tokens);
      }
    }
  }
  const groupedByAnchor = new Map();
  for (const model of childModels) {
    const anchorIndex = pickDeepAnchorIndexForContentModel(model, anchors, sourceSlug);
    if (!groupedByAnchor.has(anchorIndex)) {
      groupedByAnchor.set(anchorIndex, []);
    }
    groupedByAnchor.get(anchorIndex).push(model);
  }

  const anchorEntries = [...groupedByAnchor.entries()].sort((a, b) => a[0] - b[0]);
  for (const [anchorIndex, models] of anchorEntries) {
    const anchor = anchors[anchorIndex] || { x: rootAx, y: rootAy };
    const sortedModels = [...models].sort((a, b) => {
      const ai = Number.isFinite(a.contentIndex) ? a.contentIndex : Number.POSITIVE_INFINITY;
      const bi = Number.isFinite(b.contentIndex) ? b.contentIndex : Number.POSITIVE_INFINITY;
      if (ai !== bi) {
        return ai - bi;
      }
      return a.slug.localeCompare(b.slug);
    });
    const itemStart = (hashString(`${sourceSlug}:anchor:${anchorIndex}`) % 6283) / 1000;

    for (const [itemIndex, model] of sortedModels.entries()) {
      const itemRadius =
        itemIndex === 0
          ? 0
          : (28 + Math.sqrt(itemIndex) * lerp(36, 56, deepDensityT)) * lerp(1.04, 1.28, deepDensityT);
      const itemAngle = itemStart + itemIndex * GOLDEN_ANGLE;
      const ox = Math.cos(itemAngle) * itemRadius * CONTENT_CLUSTER_X_ASPECT * deepAspectStretch.x;
      const oy = Math.sin(itemAngle) * itemRadius * CONTENT_CLUSTER_Y_ASPECT * deepAspectStretch.y;
      model.contentBaseX = anchor.x + ox;
      model.contentBaseY = anchor.y + oy;
      model.ax = model.contentBaseX;
      model.ay = model.contentBaseY;
      model.renderX = Number.NaN;
      model.renderY = Number.NaN;
    }
  }

  enforceLayoutAspectAroundPoint(
    childModels,
    "ax",
    "ay",
    rootAx,
    rootAy,
    deepTargetAspectRatio,
    isMobileDeepLayout ? 1.14 : 1.44
  );

  resolveOverlapsRadial(childModels, deepCollisionZoom, {
    xKey: "ax",
    yKey: "ay",
    spacingX: 1.01,
    spacingY: 1.02,
    passes: isMobileDeepLayout ? MOBILE_DEEP_LAYOUT_PRIMARY_RADIAL_PASSES : 54,
    strength: 0.26,
    maxPush: 30,
    pullStrength: 0.04,
    pullXKey: "contentBaseX",
    pullYKey: "contentBaseY"
  });

  for (const model of childModels) {
    const dx = model.ax - rootAx;
    const dy = model.ay - rootAy;
    const dist = Math.hypot(dx, dy) || 1;
    const childSize = getModelHalfSize(model, deepCollisionZoom);
    const minDist = 24 + Math.min(36, Math.max(childSize.w, childSize.h) * 0.1);
    const pushScale = dist < minDist ? minDist / dist : 1;
    const ox = dx * pushScale;
    const oy = dy * pushScale;
    model.ax = rootAx + ox;
    model.ay = rootAy + oy;
    model.x = model.ax;
    model.y = model.ay;
    delete model.contentBaseX;
    delete model.contentBaseY;
  }

  resolveOverlapsRadial(childModels, deepCollisionZoom, {
    xKey: "ax",
    yKey: "ay",
    spacingX: 1.008,
    spacingY: 1.015,
    passes: isMobileDeepLayout ? MOBILE_DEEP_LAYOUT_SECONDARY_RADIAL_PASSES : 38,
    strength: 0.24,
    maxPush: 22,
    pullStrength: 0
  });

  enforceLayoutAspectAroundPoint(
    childModels,
    "ax",
    "ay",
    rootAx,
    rootAy,
    deepTargetAspectRatio,
    isMobileDeepLayout ? 1.1 : 1.28
  );

  const deepLayoutZoom = deepCollisionZoom;
  const rootMediaBounds = hideRootMediaInDeep
    ? getDeepRootVirtualBounds(rootAx, rootAy, childModels.length)
    : getModelMediaWorldBoundsAtZoom(sourceModel, deepLayoutZoom, {
        useDeepScale: true,
        includeNotes: false
      }) || getModelFallbackWorldBoundsAtZoom(sourceModel, deepLayoutZoom);
  const rootSize = {
    w: Math.max(1, (rootMediaBounds.maxX - rootMediaBounds.minX) * 0.5 + 10),
    h: Math.max(1, (rootMediaBounds.maxY - rootMediaBounds.minY) * 0.5 + 12)
  };
  for (let pass = 0; pass < (isMobileDeepLayout ? MOBILE_DEEP_LAYOUT_ROOT_GUARD_PASSES : 10); pass += 1) {
    let moved = false;
    for (const model of childModels) {
      let dx = model.ax - rootAx;
      let dy = model.ay - rootAy;
      const childSize = getModelHalfSize(model, deepCollisionZoom);
      const reqX = Math.max(1, (rootSize.w + childSize.w) * 1.01);
      const reqY = Math.max(1, (rootSize.h + childSize.h) * 1.02);

      let nx = dx / reqX;
      let ny = dy / reqY;
      let normDist = Math.hypot(nx, ny);
      if (normDist >= 1) {
        continue;
      }

      if (Math.hypot(dx, dy) < 0.0001) {
        const angle = pairAngleJitter(sourceModel.slug, model.slug, pass);
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        nx = dx / reqX;
        ny = dy / reqY;
        normDist = Math.hypot(nx, ny);
      }

      const dirLen = Math.hypot(dx, dy) || 1;
      const ux = dx / dirLen;
      const uy = dy / dirLen;
      const overlap = 1 - normDist;
      const directionalReq = Math.hypot(ux * reqX, uy * reqY);
      const correction = Math.min(directionalReq * overlap * 0.62, 24);

      model.ax += ux * correction;
      model.ay += uy * correction;
      moved = true;
    }

    if (!moved && pass > 3) {
      break;
    }
  }

  resolveOverlapsStrict(childModels, deepCollisionZoom, {
    xKey: "ax",
    yKey: "ay",
    spacingX: 1.01,
    spacingY: 1.015,
    passes: isMobileDeepLayout ? MOBILE_DEEP_LAYOUT_STRICT_PASSES : 12
  });

  for (let pass = 0; pass < (isMobileDeepLayout ? MOBILE_DEEP_LAYOUT_ROOT_GUARD_FINAL_PASSES : 6); pass += 1) {
    let moved = false;
    for (const model of childModels) {
      let dx = model.ax - rootAx;
      let dy = model.ay - rootAy;
      const childSize = getModelHalfSize(model, deepCollisionZoom);
      const reqX = Math.max(1, (rootSize.w + childSize.w) * 1.01);
      const reqY = Math.max(1, (rootSize.h + childSize.h) * 1.02);
      let nx = dx / reqX;
      let ny = dy / reqY;
      let normDist = Math.hypot(nx, ny);
      if (normDist >= 1) {
        continue;
      }
      if (Math.hypot(dx, dy) < 0.0001) {
        const angle = pairAngleJitter(sourceModel.slug, model.slug, pass + 121);
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        nx = dx / reqX;
        ny = dy / reqY;
        normDist = Math.hypot(nx, ny);
      }
      const dirLen = Math.hypot(dx, dy) || 1;
      const ux = dx / dirLen;
      const uy = dy / dirLen;
      const overlap = 1 - normDist;
      const directionalReq = Math.hypot(ux * reqX, uy * reqY);
      const correction = Math.min(directionalReq * overlap * 0.56, 18);
      model.ax += ux * correction;
      model.ay += uy * correction;
      moved = true;
    }
    if (!moved && pass > 1) {
      break;
    }
  }

  const densityT = clamp((childModels.length - 8) / 24, 0, 1);
  const rootMarginX = lerp(1.005, 1.016, densityT);
  const rootMarginY = lerp(1.008, 1.022, densityT);
  const rootPushPasses = Math.round(lerp(5, 10, densityT));
  const rootPushMax = lerp(14, 24, densityT);
  const rootEdgePad = lerp(3, 8, densityT);
  const worldGapBase = lerp(6, 12, densityT);
  const worldPassBase = isMobileDeepLayout
    ? Math.round(lerp(MOBILE_DEEP_LAYOUT_WORLD_BASE_PASSES_MIN, MOBILE_DEEP_LAYOUT_WORLD_BASE_PASSES_MAX, densityT))
    : Math.round(lerp(12, 28, densityT));
  const worldPushBase = lerp(14, 24, densityT);

  pushModelsOutsideWorldBox(childModels, rootMediaBounds, deepLayoutZoom, {
    marginX: rootMarginX,
    marginY: rootMarginY,
    passes: rootPushPasses,
    maxPush: rootPushMax,
    edgePad: rootEdgePad
  });

  for (let cycle = 0; cycle < (isMobileDeepLayout ? 1 : 2); cycle += 1) {
    resolveWorldBoundsOverlaps(childModels, deepCollisionZoom, {
      useDeepScale: true,
      includeNotes: includeDeepNoteBounds,
      gap: worldGapBase + cycle * 2,
      passes: worldPassBase + cycle * 4,
      maxPush: worldPushBase + cycle * 3
    });

    pushModelsOutsideWorldBox(childModels, rootMediaBounds, deepLayoutZoom, {
      marginX: rootMarginX,
      marginY: rootMarginY,
      passes: Math.max(4, rootPushPasses - 1 + cycle),
      maxPush: rootPushMax + cycle * 2,
      edgePad: rootEdgePad + cycle
    });

    resolveOverlapsStrict(childModels, deepCollisionZoom, {
      xKey: "ax",
      yKey: "ay",
      spacingX: 1.008,
      spacingY: 1.012,
      passes: 6 + cycle * 2
    });
  }

  // Keep world-bounds pass as the last resolver so text notes cannot be re-overlapped
  // by stricter half-size passes.
  resolveWorldBoundsOverlaps(childModels, deepCollisionZoom, {
    useDeepScale: true,
    includeNotes: includeDeepNoteBounds,
    gap: worldGapBase + 4,
    passes: worldPassBase + (isMobileDeepLayout ? 6 : 10),
    maxPush: worldPushBase + 6
  });
  pushModelsOutsideWorldBox(childModels, rootMediaBounds, deepLayoutZoom, {
    marginX: rootMarginX,
    marginY: rootMarginY,
    passes: rootPushPasses + 2,
    maxPush: rootPushMax + 4,
    edgePad: rootEdgePad + 2
  });

  // Final guard: keep child nodes outside root media+notes on a zoom range, not at a single zoom snapshot.
  pushModelWorldBoundsOutsideBoxes(childModels, rootObstacleBoxes, deepLayoutZoom, {
    useDeepScale: true,
    includeNotes: includeDeepNoteBounds,
    gap: 8,
    passes: isMobileDeepLayout ? 10 : 18,
    maxPush: Math.max(rootPushMax + 4, 20)
  });

  enforceLayoutAspectAroundPoint(
    childModels,
    "ax",
    "ay",
    rootAx,
    rootAy,
    deepTargetAspectRatio,
    isMobileDeepLayout ? 1.08 : 1.22
  );

  const baseMinRadius = Math.max(56, Math.max(rootSize.w, rootSize.h) * 0.74 + 28 + lerp(0, 34, deepDensityT));
  const baseMaxRadius =
    baseMinRadius + lerp(180, 300, deepDensityT) + Math.sqrt(childModels.length) * lerp(30, 48, deepDensityT);
  const ellipseStretch = clamp(
    Math.sqrt(deepTargetAspectRatio),
    isMobileDeepLayout ? 1.02 : 1.08,
    isMobileDeepLayout ? 1.14 : 1.42
  );
  const minRingRadiusX = baseMinRadius * ellipseStretch;
  const minRingRadiusY = baseMinRadius / ellipseStretch;
  const maxRingRadiusX = baseMaxRadius * ellipseStretch;
  const maxRingRadiusY = baseMaxRadius / ellipseStretch;
  for (let pass = 0; pass < (isMobileDeepLayout ? MOBILE_DEEP_LAYOUT_RING_PASSES : 3); pass += 1) {
    constrainModelsToEllipse(
      childModels,
      rootAx,
      rootAy,
      minRingRadiusX,
      minRingRadiusY,
      maxRingRadiusX,
      maxRingRadiusY,
      pass
    );
    resolveOverlapsStrict(childModels, deepCollisionZoom, {
      xKey: "ax",
      yKey: "ay",
      spacingX: 1.006,
      spacingY: 1.01,
      passes: isMobileDeepLayout ? 3 : 4
    });
    resolveWorldBoundsOverlaps(childModels, deepCollisionZoom, {
      useDeepScale: true,
      includeNotes: includeDeepNoteBounds,
      gap: 6,
      passes: isMobileDeepLayout ? 4 : 6,
      maxPush: 14
    });
    pushModelsOutsideWorldBox(childModels, rootMediaBounds, deepLayoutZoom, {
      marginX: 1.004,
      marginY: 1.008,
      passes: 2,
      maxPush: 10,
      edgePad: 3
    });
    pushModelWorldBoundsOutsideBoxes(childModels, rootObstacleBoxes, deepLayoutZoom, {
      useDeepScale: true,
      includeNotes: includeDeepNoteBounds,
      gap: 6,
      passes: isMobileDeepLayout ? 2 : 3,
      maxPush: 16
    });
    enforceLayoutAspectAroundPoint(
      childModels,
      "ax",
      "ay",
      rootAx,
      rootAy,
      deepTargetAspectRatio,
      isMobileDeepLayout ? 1.04 : 1.14
    );
  }

  const denseRelayoutPasses = getDenseDeepLayoutPassCount(childModels.length);
  if (denseRelayoutPasses > 0) {
    relaxDenseDeepLayout(childModels, rootAx, rootAy, deepCollisionZoom, {
      useDeepScale: true,
      includeNotes: includeDeepNoteBounds,
      rootMediaBounds,
      rootObstacleBoxes,
      deepLayoutZoom,
      passes: denseRelayoutPasses,
      baseGap: lerp(8, 16, deepDensityT)
    });
  }

  for (const model of childModels) {
    model.bx = model.ax;
    model.by = model.ay;
  }
  storeDeepProjectLayoutInCache(sourceSlug, childModels, rootAx, rootAy);
}

function setDeepProject(
  sourceSlug = null,
  { animate = true, entryFocusSlug = null, entryFocusMediaIndex = undefined, entryZoomMode = null } = {}
) {
  state.stepPullActive = false;
  state.stepPullClearFocus = false;
  const requestedSlug = typeof sourceSlug === "string" && sourceSlug.trim() ? sourceSlug.trim() : null;
  const previousDeepSlug = state.deepProjectSlug;
  const previousPathRaw = Array.isArray(state.deepPath) ? state.deepPath.filter(Boolean) : [];
  const previousPath = previousPathRaw.length ? previousPathRaw : previousDeepSlug ? [previousDeepSlug] : [];
  let nextSlug = requestedSlug;
  if (!nextSlug && previousPath.length > 1) {
    nextSlug = previousPath[previousPath.length - 2];
  }
  if (nextSlug && !getContentChildSlugs(nextSlug).length) {
    return false;
  }

  if (previousDeepSlug && previousDeepSlug !== nextSlug) {
    clearDeepRootAnchor(previousDeepSlug);
  }
  if (nextSlug) {
    if (previousPath.includes(nextSlug)) {
      state.deepPath = previousPath.slice(0, previousPath.indexOf(nextSlug) + 1);
    } else if (previousPath.length) {
      state.deepPath = [...previousPath, nextSlug];
    } else {
      state.deepPath = [nextSlug];
    }
    const sourceModel = modelBySlug.get(nextSlug);
    const entryZoom = clamp(state.targetZoom || state.viewZoom || state.homeZoom || MAX_ZOOM, MIN_ZOOM, MAX_ZOOM);
    state.deepEntryZoom = entryZoom;
    state.deepEntryMediaLayoutT = getMediaLayoutTAtZoom(entryZoom);
    if (sourceModel) {
      const rootPosition = getModelPositionAtZoom(sourceModel, entryZoom);
      sourceModel.deepAx = rootPosition.x;
      sourceModel.deepAy = rootPosition.y;
    }
    state.deepSourceAnchors = captureDeepSourceMediaAnchorsSnapshot(nextSlug, entryZoom);
    state.deepInfoExpanded = false;
    state.deepRequestedFocusSlug =
      typeof entryFocusSlug === "string" && entryFocusSlug.trim() ? entryFocusSlug.trim() : null;
    state.deepRequestedFocusMediaIndex = Number.isFinite(Number(entryFocusMediaIndex))
      ? Math.max(0, Math.round(Number(entryFocusMediaIndex)))
      : Number.NaN;
    state.deepRequestedEntryZoomMode =
      typeof entryZoomMode === "string" && entryZoomMode.trim() ? entryZoomMode.trim() : null;
  } else {
    if (previousDeepSlug) {
      clearDeepRootAnchor(previousDeepSlug);
    }
    state.deepPath = [];
    state.deepSourceAnchors = null;
    state.deepEntryZoom = Number.NaN;
    state.deepEntryMediaLayoutT = Number.NaN;
    state.deepRequestedFocusSlug = null;
    state.deepRequestedFocusMediaIndex = Number.NaN;
    state.deepRequestedEntryZoomMode = null;
    state.deepInfoExpanded = false;
  }

  state.deepProjectSlug = nextSlug;
  syncProjectGraphLocation(state.deepProjectSlug);
  if (previousDeepSlug !== nextSlug && promotedDeepMediaElement) {
    clearPromotedDeepMediaElement();
  }
  // On mobile, restoring the just-exited root node to full sources can spike memory
  // right as the overview comes back into view.
  const shouldRestorePreviousDeepRootFullMedia =
    Boolean(previousDeepSlug) &&
    previousDeepSlug !== nextSlug &&
    (Boolean(nextSlug) || !isMobileViewport());
  if (shouldRestorePreviousDeepRootFullMedia) {
    setNodeMediaProxyMode(previousDeepSlug, false);
  }
  if (!state.deepProjectSlug || (promotedDeepMediaElement && !document.body.contains(promotedDeepMediaElement))) {
    promotedDeepMediaElement = null;
  }
  clearPendingContentPrewarm();
  cancelQueuedMediaHydration();
  desiredPrewarmContentSourceSlug = null;
  syncMountedContentSubtree({ refreshVisibility: false });
  if (state.deepProjectSlug && state.headModalOpen) {
    setHeadModalOpen(false, { immediate: true });
  }
  stage.classList.toggle("is-deep-mode", Boolean(state.deepProjectSlug));
  stage.classList.toggle("is-filter-naming", state.activeType === "naming" && !state.deepProjectSlug);
  stage.classList.toggle("is-filter-physical", state.activeType === "physical" && !state.deepProjectSlug);
  document.body.classList.toggle("is-deep-mode", Boolean(state.deepProjectSlug));
  renderDeepProjectInfo(state.deepProjectSlug);

  if (state.deepProjectSlug) {
    setNodeMediaProxyMode(state.deepProjectSlug, true);
    hydrateDeepProjectMedia(state.deepProjectSlug);
    relayoutDeepProjectContent(state.deepProjectSlug);
  }

  refreshModelVisibility(state.activeType);
  refreshSeeMoreLabels();
  refreshDeepNodeClasses();

  if (state.deepProjectSlug) {
    state.focusedSlug = state.deepProjectSlug;
    clearFocusedMediaTarget();
    state.focusTrackActive = false;
    focusedModel = modelBySlug.get(state.deepProjectSlug) || null;
    refreshFocusedClasses();
    fitDeepProjectView(animate);
    return true;
  }

  clearFocusedProjectState();
  refreshFocusedClasses();
  if (previousPath.length <= 1 && restoreDeepOverviewReturnState(animate)) {
    return true;
  }
  if (state.activeType === "all") {
    if (animate) {
      setTargetView(state.homeX, state.homeY, state.homeZoom);
    } else {
      state.viewX = state.homeX;
      state.viewY = state.homeY;
      state.viewZoom = state.homeZoom;
      setTargetView(state.homeX, state.homeY, state.homeZoom);
    }
  } else {
    fitVisibleProjects(animate);
  }
  return true;
}

function getModelProjectTextWorldBoundsAtZoom(model, zoom, { useModelPosition = false } = {}) {
  if (!model) {
    return null;
  }

  const project = getDisplayProject(model);
  if (!project || isContentNodeProject(project)) {
    return null;
  }

  const titleWidth = getMeasuredProjectTitleWidth(model.slug, project);
  const textBoxes = getProjectTextCollisionBoxes(project, titleWidth, model.slug);
  if (!textBoxes) {
    return null;
  }

  const layoutT = state.deepProjectSlug
    ? Number.isFinite(state.deepEntryMediaLayoutT)
      ? state.deepEntryMediaLayoutT
      : 0
    : getMediaLayoutTAtZoom(zoom);
  const localBox = {
    minX: lerp(textBoxes.far.minX, textBoxes.close.minX, layoutT),
    maxX: lerp(textBoxes.far.maxX, textBoxes.close.maxX, layoutT),
    minY: lerp(textBoxes.far.minY, textBoxes.close.minY, layoutT),
    maxY: lerp(textBoxes.far.maxY, textBoxes.close.maxY, layoutT)
  };

  const safeZoom = Math.max(0.0001, zoom);
  const labelScale = 1 / safeZoom;
  const anchorPosition = useModelPosition
    ? getModelPositionAtZoom(model, zoom)
    : state.deepProjectSlug && model.slug === state.deepProjectSlug
      ? getDeepRootAnchorPosition(model)
      : {
          x: Number.isFinite(model.ax) ? model.ax : model.x,
          y: Number.isFinite(model.ay) ? model.ay : model.y
        };
  const baseX = anchorPosition.x - model.centerX;
  const baseY = anchorPosition.y - model.centerY;

  return {
    minX: baseX + localBox.minX * labelScale,
    maxX: baseX + localBox.maxX * labelScale,
    minY: baseY + localBox.minY * labelScale,
    maxY: baseY + localBox.maxY * labelScale
  };
}

function getModelPrimaryVisualBoundsAtZoom(model, zoom, { includeProjectText = false, includeNotes = true } = {}) {
  if (!model) {
    return null;
  }

  const useDeepScale = Boolean(state.deepProjectSlug);
  let visualBounds = getModelMediaWorldBoundsAtZoom(model, zoom, {
    useDeepScale,
    includeNotes,
    useModelPosition: true
  });

  if (includeProjectText) {
    const textBounds = getModelProjectTextWorldBoundsAtZoom(model, zoom, { useModelPosition: true });
    visualBounds = visualBounds ? (textBounds ? unionBox(visualBounds, textBounds) : visualBounds) : textBounds;
  }

  return visualBounds;
}

function getModelPrimaryVisualCenterAtZoom(model, zoom, { includeProjectText = false, includeNotes = true } = {}) {
  if (!model) {
    return null;
  }
  const visualBounds = getModelPrimaryVisualBoundsAtZoom(model, zoom, { includeProjectText, includeNotes });
  if (visualBounds) {
    return {
      x: (visualBounds.minX + visualBounds.maxX) * 0.5,
      y: (visualBounds.minY + visualBounds.maxY) * 0.5
    };
  }
  const mediaCenter = getMediaWorldCenterAtZoom(model, 0, zoom);
  if (mediaCenter) {
    return mediaCenter;
  }
  const position = getModelPositionAtZoom(model, zoom);
  const focusPoint = getProjectFocusPoint(model, zoom);
  return {
    x: position.x + (focusPoint.x - model.centerX),
    y: position.y + (focusPoint.y - model.centerY)
  };
}

function getRootProjectFocusCenterAtZoom(model, zoom) {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const project = getDisplayProject(model);
  if (isPhysicalItemProject(project)) {
    return getModelPrimaryVisualCenterAtZoom(model, zoom, {
      includeProjectText: true,
      includeNotes: false
    });
  }
  const shouldCenterWholeContentBlock =
    viewportWidth > MOBILE_TITLE_BREAKPOINT &&
    project &&
    !isContentNodeProject(project) &&
    projectHasDetails(project);

  if (shouldCenterWholeContentBlock) {
    return getModelPrimaryVisualCenterAtZoom(model, zoom, {
      includeProjectText: true,
      includeNotes: false
    });
  }

  const textBounds = getModelProjectTextWorldBoundsAtZoom(model, zoom, { useModelPosition: true });
  if (textBounds) {
    return {
      x: (textBounds.minX + textBounds.maxX) * 0.5,
      y: (textBounds.minY + textBounds.maxY) * 0.5
    };
  }

  return getModelPrimaryVisualCenterAtZoom(model, zoom, { includeProjectText: true });
}

function pickDeepEntryFocusTarget(rootModel, fromX, fromY, zoom) {
  if (!rootModel) {
    return null;
  }
  const rootProject = getDisplayProject(rootModel);
  const allChildModels = getContentChildSlugs(rootModel.slug)
    .map((slug) => modelBySlug.get(slug))
    .filter((model) => Boolean(model) && model.visible);
  if (!allChildModels.length) {
    return null;
  }

  const requestedSlug =
    typeof state.deepRequestedFocusSlug === "string" && state.deepRequestedFocusSlug.trim()
      ? state.deepRequestedFocusSlug.trim()
      : "";
  if (requestedSlug) {
    const byRequestedSlug = allChildModels.find((model) => model.slug === requestedSlug);
    if (byRequestedSlug) {
      return {
        model: byRequestedSlug,
        center: getModelPrimaryVisualCenterAtZoom(byRequestedSlug, zoom)
      };
    }
  }

  const configuredSlug =
    typeof rootProject?.deepEntryFocusSlug === "string" ? rootProject.deepEntryFocusSlug.trim() : "";
  if (configuredSlug) {
    const bySlug = allChildModels.find((model) => model.slug === configuredSlug);
    if (bySlug) {
      return {
        model: bySlug,
        center: getModelPrimaryVisualCenterAtZoom(bySlug, zoom)
      };
    }
  }

  let candidates = allChildModels;
  const requestedMediaIndex = Number.isFinite(Number(state.deepRequestedFocusMediaIndex))
    ? Math.max(0, Math.round(Number(state.deepRequestedFocusMediaIndex)))
    : Number.isFinite(Number(rootProject?.deepEntryFocusMediaIndex))
      ? Math.max(0, Math.round(Number(rootProject.deepEntryFocusMediaIndex)))
      : Number.NaN;
  if (Number.isFinite(requestedMediaIndex)) {
    const byMediaIndex = allChildModels.filter(
      (model) => Math.max(0, Math.round(Number(model.sourceMediaIndex) || 0)) === requestedMediaIndex
    );
    if (byMediaIndex.length) {
      candidates = byMediaIndex;
    }
  }

  const referenceX = Number.isFinite(fromX) ? fromX : state.viewX;
  const referenceY = Number.isFinite(fromY) ? fromY : state.viewY;
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const model of candidates) {
    const center = getModelPrimaryVisualCenterAtZoom(model, zoom);
    if (!center) {
      continue;
    }
    const dist = Math.hypot(center.x - referenceX, center.y - referenceY);
    if (dist < bestDistance) {
      bestDistance = dist;
      best = { model, center };
    }
  }

  if (best) {
    return best;
  }

  const fallback = candidates[0];
  return fallback
    ? {
        model: fallback,
        center: getModelPrimaryVisualCenterAtZoom(fallback, zoom)
      }
    : null;
}

function getDeepEntryFocusViewportFitZoom(entryFocus, preferredZoom) {
  const focusModel = entryFocus?.model;
  if (!focusModel) {
    return preferredZoom;
  }

  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return preferredZoom;
  }

  const maxZoomLimit = getCurrentMaxZoom();
  const high = clamp(preferredZoom, MIN_ZOOM, maxZoomLimit);
  const { left, right, top, bottom } = getViewportFitPadding(rect);
  const safeLeft = left + clamp(rect.width * 0.02, 12, 28);
  const safeRight = right + clamp(rect.width * 0.02, 12, 28);
  const safeTop = top + clamp(rect.height * 0.07, 24, 78);
  const safeBottom = bottom + clamp(rect.height * 0.1, 34, 102);
  const availableW = Math.max(120, rect.width - safeLeft - safeRight);
  const availableH = Math.max(120, rect.height - safeTop - safeBottom);
  const includeNotes = entryFocus?.includeNotes !== false;

  const fitsAtZoom = (zoom) => {
    const bounds = getModelMediaWorldBoundsAtZoom(focusModel, zoom, {
      useDeepScale: true,
      includeNotes,
      useModelPosition: true
    });
    if (!bounds) {
      return true;
    }
    const worldW = Math.max(1, bounds.maxX - bounds.minX);
    const worldH = Math.max(1, bounds.maxY - bounds.minY);
    const screenW = worldW * zoom;
    const screenH = worldH * zoom;
    return screenW <= availableW && screenH <= availableH;
  };

  if (fitsAtZoom(high)) {
    return high;
  }

  let low = MIN_ZOOM;
  let hi = high;
  for (let i = 0; i < 14; i += 1) {
    const mid = (low + hi) * 0.5;
    if (fitsAtZoom(mid)) {
      low = mid;
    } else {
      hi = mid;
    }
  }
  return clamp(low, MIN_ZOOM, high);
}

function fitDeepProjectView(animate) {
  const rootModel = state.deepProjectSlug ? modelBySlug.get(state.deepProjectSlug) : null;
  const visible = getVisibleModels();
  if (!visible.length || !rootModel) {
    return;
  }

  const fitted = fitModelsToViewport(visible, {
    startZoom: state.targetZoom || state.viewZoom || state.homeZoom || 0.9,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM
  });
  const maxZoomLimit = getCurrentMaxZoom();
  const overviewZoom = clamp(fitted.zoom, MIN_ZOOM, MAX_ZOOM);
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const isMobileViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
  const entryZoomMode =
    typeof state.deepRequestedEntryZoomMode === "string" && state.deepRequestedEntryZoomMode.trim()
      ? state.deepRequestedEntryZoomMode.trim()
      : null;
  const prefersMidEntryFocus = entryZoomMode === "mid";
  const currentCenterX = Number.isFinite(state.targetX) ? state.targetX : state.viewX;
  const currentCenterY = Number.isFinite(state.targetY) ? state.targetY : state.viewY;
  const preferredEntryZoom = prefersMidEntryFocus ? clamp(getOverviewStepMidZoom(overviewZoom), overviewZoom, MAX_ZOOM) : maxZoomLimit;
  const initialEntryFocus = pickDeepEntryFocusTarget(rootModel, currentCenterX, currentCenterY, preferredEntryZoom);
  const desiredZoom = initialEntryFocus
    ? getDeepEntryFocusViewportFitZoom(initialEntryFocus, preferredEntryZoom)
    : preferredEntryZoom;

  state.filterHomeX = fitted.centerX;
  state.filterHomeY = fitted.centerY;
  state.filterHomeZoom = overviewZoom;

  if (!isMobileViewport && !prefersMidEntryFocus) {
    if (animate) {
      setTargetView(fitted.centerX, fitted.centerY, overviewZoom, maxZoomLimit);
    } else {
      state.viewX = fitted.centerX;
      state.viewY = fitted.centerY;
      state.viewZoom = overviewZoom;
      setTargetView(fitted.centerX, fitted.centerY, overviewZoom, maxZoomLimit);
    }
    return;
  }

  const entryFocus = initialEntryFocus?.model
    ? {
        model: initialEntryFocus.model,
        includeNotes: !prefersMidEntryFocus,
        center: getModelPrimaryVisualCenterAtZoom(initialEntryFocus.model, desiredZoom, {
          includeNotes: !prefersMidEntryFocus
        })
      }
    : null;
  const rootPosition = getModelPositionAtZoom(rootModel, desiredZoom);
  const rootFocus = getProjectFocusPoint(rootModel, desiredZoom);
  const rootCenterX = rootPosition.x + (rootFocus.x - rootModel.centerX);
  const rootCenterY = rootPosition.y + (rootFocus.y - rootModel.centerY);
  const targetCenterX = Number.isFinite(entryFocus?.center?.x) ? entryFocus.center.x : rootCenterX;
  const targetCenterY = Number.isFinite(entryFocus?.center?.y) ? entryFocus.center.y : rootCenterY;
  let enterCenterX = targetCenterX;
  let enterCenterY = targetCenterY;
  if (isMobileViewport) {
    // On mobile, entering deep mode must stay centered on the whole deep graph.
    enterCenterX = fitted.centerX;
    enterCenterY = fitted.centerY;
  }
  if (!entryFocus && !isMobileViewport) {
    const rootPull = clamp(Math.hypot(rootCenterX - currentCenterX, rootCenterY - currentCenterY) / 720, 0.08, 0.22);
    enterCenterX = lerp(currentCenterX, rootCenterX, rootPull);
    enterCenterY = lerp(currentCenterY, rootCenterY, rootPull);
  }

  if (animate) {
    setTargetView(enterCenterX, enterCenterY, desiredZoom, maxZoomLimit);
  } else {
    state.viewX = enterCenterX;
    state.viewY = enterCenterY;
    state.viewZoom = desiredZoom;
    setTargetView(enterCenterX, enterCenterY, desiredZoom, maxZoomLimit);
  }

  state.deepRequestedEntryZoomMode = null;
}

function toggleProjectDepth(sourceSlug) {
  if (!sourceSlug) {
    return;
  }
  if (state.deepProjectSlug === sourceSlug) {
    setDeepProject(null, { animate: true });
    return;
  }
  if (!state.deepProjectSlug) {
    captureDeepOverviewReturnState();
  }
  setDeepProject(sourceSlug, { animate: true });
}

function openProjectDepthLink(
  sourceSlug,
  { entryFocusSlug = null, entryFocusMediaIndex = undefined, entryZoomMode = null } = {}
) {
  if (!sourceSlug) {
    return;
  }
  if (!state.deepProjectSlug) {
    captureDeepOverviewReturnState();
  }
  if (state.activeType !== "all") {
    applyFilter("all", false, false, true);
  }
  setDeepProject(sourceSlug, {
    animate: true,
    entryFocusSlug,
    entryFocusMediaIndex,
    entryZoomMode
  });
}

function cloneProjectDetailsRows(rows) {
  if (!Array.isArray(rows)) {
    return rows;
  }
  return rows.map((row) => (row && typeof row === "object" ? { ...row } : row));
}

function getMediaLayoutOrigin(mediaLayout) {
  if (!Array.isArray(mediaLayout) || !mediaLayout.length) {
    return { x: 0, y: 0 };
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const media of mediaLayout) {
    const x = Number(media.x) || 0;
    const y = Number(media.y) || 0;
    const w = Math.max(1, Number(media.w) || 180);
    const h = Math.max(1, Number(media.h) || 180);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + w);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y + h);
  }

  return {
    x: (minX + maxX) * 0.5,
    y: (minY + maxY) * 0.5
  };
}

function getMediaScaleAtZoom(zoom) {
  const baseScale = lerp(FAR_MEDIA_SCALE, CLOSE_MEDIA_SCALE, getZoomT(zoom));
  if (state.activeType !== "physical" || state.deepProjectSlug) {
    return baseScale;
  }
  const closeOnlyT = clamp(
    (zoom - PROJECT_DETAILS_LAYOUT_FULL_ZOOM) / Math.max(0.0001, MAX_ZOOM - PROJECT_DETAILS_LAYOUT_FULL_ZOOM),
    0,
    1
  );
  return baseScale * lerp(1, 0.88, closeOnlyT);
}

function getMediaLayoutTAtZoom(zoom) {
  const detailsLayoutStartZoom = clamp(
    state.homeZoom || LOD_FAR,
    MIN_ZOOM,
    PROJECT_DETAILS_LAYOUT_FULL_ZOOM - 0.02
  );
  const closePhase = clamp(
    (zoom - detailsLayoutStartZoom) /
      Math.max(0.0001, PROJECT_DETAILS_LAYOUT_FULL_ZOOM - detailsLayoutStartZoom),
    0,
    1
  );
  return closePhase * closePhase;
}

function getInterpolatedLocalMediaCenterPosition(mediaLayoutFar, mediaLayoutClose, mediaIndex, scale, layoutT) {
  if (!Array.isArray(mediaLayoutFar) || !mediaLayoutFar.length) {
    return null;
  }

  const mediaFar = mediaLayoutFar[mediaIndex];
  if (!mediaFar) {
    return null;
  }

  const mediaClose = (Array.isArray(mediaLayoutClose) && mediaLayoutClose[mediaIndex]) || mediaFar;
  const origin = getMediaLayoutOrigin(mediaLayoutFar);
  const width = Math.max(1, Number(mediaFar.w) || 180);
  const height = Math.max(1, Number(mediaFar.h) || 180);
  const centerX = lerp(Number(mediaFar.x) || 0, Number(mediaClose.x) || 0, layoutT) + width * 0.5;
  const centerY = lerp(Number(mediaFar.y) || 0, Number(mediaClose.y) || 0, layoutT) + height * 0.5;
  const safeScale = Math.max(0.0001, Number(scale) || 1);

  return {
    x: origin.x + (centerX - origin.x) * safeScale,
    y: origin.y + (centerY - origin.y) * safeScale
  };
}

function getElementWorldCenter(element) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  const stageRect = stage.getBoundingClientRect();
  const localX = rect.left - stageRect.left + rect.width * 0.5;
  const localY = rect.top - stageRect.top + rect.height * 0.5;
  const zoom = Math.max(0.0001, state.viewZoom);

  return {
    x: state.viewX + (localX - state.stageWidth * 0.5) / zoom,
    y: state.viewY + (localY - state.stageHeight * 0.5) / zoom
  };
}

function getElementsWorldCenter(elements) {
  if (!Array.isArray(elements) || !elements.length) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const element of elements) {
    if (!element) {
      continue;
    }
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      continue;
    }
    minX = Math.min(minX, rect.left);
    maxX = Math.max(maxX, rect.right);
    minY = Math.min(minY, rect.top);
    maxY = Math.max(maxY, rect.bottom);
  }

  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
    return null;
  }

  const stageRect = stage.getBoundingClientRect();
  const viewportWidth = state.stageWidth || stageRect.width || window.innerWidth || 0;
  const viewportHeight = state.stageHeight || stageRect.height || window.innerHeight || 0;
  const localX = (minX + maxX) * 0.5 - stageRect.left;
  const localY = (minY + maxY) * 0.5 - stageRect.top;
  const zoom = Math.max(0.0001, state.viewZoom);

  return {
    x: state.viewX + (localX - viewportWidth * 0.5) / zoom,
    y: state.viewY + (localY - viewportHeight * 0.5) / zoom
  };
}

function getMediaNoteElementForMedia(mediaElement) {
  if (!(mediaElement instanceof Element)) {
    return null;
  }
  const mediaWrap = mediaElement.closest(".project-media-wrap");
  const mediaIndex = mediaElement.dataset.mediaIndex;
  if (!mediaWrap || mediaIndex == null) {
    return null;
  }
  return mediaWrap.querySelector(`.project-media-note[data-media-index="${mediaIndex}"]`);
}

function getMediaWorldCenterAtZoom(model, mediaIndex, zoom) {
  if (!model) {
    return null;
  }
  const project = getDisplayProject(model);
  const mediaLayoutFar = mediaLayoutBySlug.get(model.slug) || project.media || [];
  const mediaLayoutClose = mediaLayoutCloseBySlug.get(model.slug) || mediaLayoutFar;
  if (!Array.isArray(mediaLayoutFar) || !mediaLayoutFar.length) {
    return null;
  }

  const normalizedMediaIndex = clamp(Math.round(Number(mediaIndex) || 0), 0, mediaLayoutFar.length - 1);
  const mediaScale = state.deepProjectSlug ? getDeepModeMediaScaleAtZoom(zoom) : getMediaScaleAtZoom(zoom);
  const mediaLayoutT = state.deepProjectSlug
    ? Number.isFinite(state.deepEntryMediaLayoutT)
      ? state.deepEntryMediaLayoutT
      : getMediaLayoutTAtZoom(zoom)
    : getMediaLayoutTAtZoom(zoom);
  const localCenter = getInterpolatedLocalMediaCenterPosition(
    mediaLayoutFar,
    mediaLayoutClose,
    normalizedMediaIndex,
    mediaScale,
    mediaLayoutT
  );
  if (!localCenter) {
    return null;
  }

  const position = getModelPositionAtZoom(model, zoom);
  return {
    x: position.x + (localCenter.x - model.centerX),
    y: position.y + (localCenter.y - model.centerY)
  };
}

function focusProjectMediaByIndex(slug, mediaIndex = 0, zoomOverride = MAX_ZOOM, { offsetXPx = 0, offsetYPx = 0 } = {}) {
  const model = modelBySlug.get(slug);
  if (!model || !model.visible) {
    return false;
  }
  const project = getDisplayProject(model);
  const hasMedia = Array.isArray(project.media) && project.media.length > 0;
  const focusMaxZoom = state.deepProjectSlug
    ? getCurrentMaxZoom()
    : hasMedia
      ? MAX_ZOOM
      : MAX_TEXT_ONLY_FOCUS_ZOOM;
  const zoom = clamp(zoomOverride, MIN_ZOOM, focusMaxZoom);
  const center = getMediaWorldCenterAtZoom(model, mediaIndex, zoom);
  if (!center) {
    return false;
  }
  setTargetView(
    center.x + (offsetXPx / Math.max(0.0001, zoom)),
    center.y + (offsetYPx / Math.max(0.0001, zoom)),
    zoom,
    focusMaxZoom
  );
  return true;
}

function focusStoredMediaTargetAtCurrentZoom(syncView = false) {
  const slug = state.focusedSlug;
  const mediaIndex = Number.isFinite(Number(state.focusedMediaIndex)) ? Math.max(0, Math.round(Number(state.focusedMediaIndex))) : -1;
  if (!slug || mediaIndex < 0) {
    return false;
  }

  const model = modelBySlug.get(slug);
  if (!model || !model.visible) {
    return false;
  }

  const project = getDisplayProject(model);
  const hasMedia = Array.isArray(project?.media) && project.media.length > 0;
  const focusMaxZoom = state.deepProjectSlug
    ? getCurrentMaxZoom()
    : hasMedia
      ? MAX_ZOOM
      : MAX_TEXT_ONLY_FOCUS_ZOOM;
  const zoom = clamp(state.targetZoom || state.viewZoom || focusMaxZoom, MIN_ZOOM, focusMaxZoom);

  let offsetYPx = 0;
  const node = nodeBySlug.get(slug);
  const mediaElement = node?.querySelector(`.project-media[data-media-index="${mediaIndex}"]`) || null;
  const noteElement = mediaElement ? getMediaNoteElementForMedia(mediaElement) : null;
  if (noteElement) {
    const noteRect = noteElement.getBoundingClientRect();
    offsetYPx = noteRect.height > 0 ? (CONTENT_MEDIA_NOTE_GAP + noteRect.height) * 0.5 : 0;
  }

  const center = getMediaWorldCenterAtZoom(model, mediaIndex, zoom);
  if (!center) {
    return false;
  }

  const nextX = center.x;
  const nextY = center.y + (offsetYPx / Math.max(0.0001, zoom));
  if (syncView) {
    state.viewX = nextX;
    state.viewY = nextY;
    state.viewZoom = zoom;
  }
  setTargetView(nextX, nextY, zoom, focusMaxZoom);
  return true;
}

function focusProjectMediaElement(mediaElement) {
  if (!(mediaElement instanceof Element)) {
    return false;
  }

  const mediaNode = mediaElement.closest(".project-node");
  const slug = mediaNode?.dataset.slug;
  if (!slug) {
    return false;
  }

  const model = modelBySlug.get(slug);
  if (!model || !model.visible) {
    return false;
  }

  const project = getDisplayProject(model);
  if (!state.deepProjectSlug && isPhysicalItemProject(project)) {
    focusProject(slug);
    return true;
  }

  state.stepPullActive = false;
  state.stepPullClearFocus = false;
  state.focusedSlug = slug;
  setFocusedMediaTarget(Number.parseInt(mediaElement.dataset.mediaIndex || "0", 10));
  state.focusTrackActive = true;
  focusedModel = model;
  state.simHeat = 0;
  refreshFocusedClasses();

  const hasMedia = Array.isArray(project.media) && project.media.length > 0;
  const focusMaxZoom = state.deepProjectSlug
    ? getCurrentMaxZoom()
    : hasMedia
      ? MAX_ZOOM
      : MAX_TEXT_ONLY_FOCUS_ZOOM;
  const zoom = focusMaxZoom;
  const mediaIndex = Number.parseInt(mediaElement.dataset.mediaIndex || "0", 10);

  if (state.deepProjectSlug && (getMediaElementProxySrc(mediaElement) || getMediaElementPreviewSrc(mediaElement))) {
    promoteMediaElementToFullSource(mediaElement);
  } else if (promotedDeepMediaElement && promotedDeepMediaElement !== mediaElement) {
    clearPromotedDeepMediaElement();
  }

  const noteElement = getMediaNoteElementForMedia(mediaElement);
  if (noteElement) {
    const noteRect = noteElement.getBoundingClientRect();
    const offsetYPx = noteRect.height > 0 ? (CONTENT_MEDIA_NOTE_GAP + noteRect.height) * 0.5 : 0;
    if (focusProjectMediaByIndex(slug, mediaIndex, zoom, { offsetXPx: 0, offsetYPx })) {
      return true;
    }
  }

  if (focusProjectMediaByIndex(slug, mediaIndex, zoom)) {
    return true;
  }

  const blockCenter =
    getElementsWorldCenter(noteElement ? [mediaElement, noteElement] : [mediaElement]) || getElementWorldCenter(mediaElement);
  if (!blockCenter) {
    return false;
  }
  setTargetView(blockCenter.x, blockCenter.y, zoom, focusMaxZoom);
  return true;
}

function clearPhysicalFilterAnchors() {
  for (const model of modelBySlug.values()) {
    delete model.filterAx;
    delete model.filterAy;
    delete model.filterBx;
    delete model.filterBy;
  }
}

function getPhysicalLayoutModels() {
  return [...modelBySlug.values()]
    .filter(isPhysicalItemModel)
    .sort((a, b) => {
      const sourceA = typeof a?.sourceProjectSlug === "string" ? a.sourceProjectSlug : "";
      const sourceB = typeof b?.sourceProjectSlug === "string" ? b.sourceProjectSlug : "";
      if (sourceA !== sourceB) {
        return sourceA.localeCompare(sourceB);
      }
      const titleA = typeof getDisplayProject(a)?.title === "string" ? getDisplayProject(a).title : a.slug;
      const titleB = typeof getDisplayProject(b)?.title === "string" ? getDisplayProject(b).title : b.slug;
      return titleA.localeCompare(titleB);
    });
}

function getPhysicalLayoutGroups(models = getPhysicalLayoutModels()) {
  const groups = new Map();
  for (const model of models) {
    const key =
      typeof model?.sourceProjectSlug === "string" && model.sourceProjectSlug.trim() ? model.sourceProjectSlug.trim() : model.slug;
    const bucket = groups.get(key);
    if (bucket) {
      bucket.models.push(model);
      continue;
    }
    groups.set(key, { key, models: [model] });
  }

  return [...groups.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((group) => ({
      ...group,
      models: group.models.sort((a, b) => {
        const titleA = typeof getDisplayProject(a)?.title === "string" ? getDisplayProject(a).title : a.slug;
        const titleB = typeof getDisplayProject(b)?.title === "string" ? getDisplayProject(b).title : b.slug;
        return titleA.localeCompare(titleB);
      })
    }));
}

function getPhysicalFilterTargetAspectRatio() {
  if (isMobileViewport()) {
    return 1.08;
  }
  return getTargetBaseAspectRatio() + 0.14;
}

function getPhysicalFilterFarHalfSize(model) {
  const referenceZoom = clamp(Math.min(state.homeZoom || 0.66, 0.72), MIN_ZOOM, 0.78);
  const base = getOverviewLayoutHalfSize(model, referenceZoom);
  return {
    w: base.w * PHYSICAL_FILTER_COLLISION_BOOST_FAR_X,
    h: base.h * PHYSICAL_FILTER_COLLISION_BOOST_FAR_Y
  };
}

function getPhysicalFilterCloseHalfSize(model) {
  if ((Number(model?.physicalCloseHalfW) || 0) > 0 && (Number(model?.physicalCloseHalfH) || 0) > 0) {
    return {
      w: model.physicalCloseHalfW * PHYSICAL_FILTER_COLLISION_BOOST_CLOSE_X,
      h: model.physicalCloseHalfH * PHYSICAL_FILTER_COLLISION_BOOST_CLOSE_Y
    };
  }
  const base = getModelHalfSize(model, clamp(PROJECT_DETAILS_LAYOUT_FULL_ZOOM, MIN_ZOOM, MAX_ZOOM));
  return {
    w: base.w * PHYSICAL_FILTER_COLLISION_BOOST_CLOSE_X,
    h: base.h * PHYSICAL_FILTER_COLLISION_BOOST_CLOSE_Y
  };
}

function getPointCentroid(models, xKey, yKey) {
  if (!Array.isArray(models) || !models.length) {
    return { x: 0, y: 0 };
  }
  const sum = models.reduce(
    (acc, model) => {
      acc.x += Number(model?.[xKey]) || 0;
      acc.y += Number(model?.[yKey]) || 0;
      return acc;
    },
    { x: 0, y: 0 }
  );
  return {
    x: sum.x / models.length,
    y: sum.y / models.length
  };
}

function pullPhysicalGroupsTowardCenters(groups, xKey, yKey, strength = 0.08) {
  if (!Array.isArray(groups) || !groups.length) {
    return;
  }
  for (const group of groups) {
    const models = Array.isArray(group?.models) ? group.models : [];
    if (models.length < 2) {
      continue;
    }
    const center = getPointCentroid(models, xKey, yKey);
    for (const model of models) {
      model[xKey] = lerp(model[xKey], center.x, strength);
      model[yKey] = lerp(model[yKey], center.y, strength);
    }
  }
}

function separatePhysicalGroups(
  groups,
  xKey,
  yKey,
  getHalfSize,
  { spacingX = 1.18, spacingY = 1.22, passes = 12, strength = 0.26, maxPush = 42 } = {}
) {
  if (!Array.isArray(groups) || groups.length < 2 || typeof getHalfSize !== "function") {
    return;
  }

  const nodes = groups.map((group) => {
    const center = getPointCentroid(group.models, xKey, yKey);
    let halfW = 0;
    let halfH = 0;
    for (const model of group.models) {
      const size = getHalfSize(model) || { w: 0, h: 0 };
      halfW = Math.max(halfW, Math.abs((Number(model?.[xKey]) || 0) - center.x) + (Number(size.w) || 0));
      halfH = Math.max(halfH, Math.abs((Number(model?.[yKey]) || 0) - center.y) + (Number(size.h) || 0));
    }
    return {
      group,
      x: center.x,
      y: center.y,
      halfW: Math.max(120, halfW),
      halfH: Math.max(120, halfH)
    };
  });

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const reqX = Math.max(1, (a.halfW + b.halfW) * spacingX);
        const reqY = Math.max(1, (a.halfH + b.halfH) * spacingY);
        let nx = dx / reqX;
        let ny = dy / reqY;
        let normDist = Math.hypot(nx, ny);
        if (normDist >= 1) {
          continue;
        }
        if (Math.hypot(dx, dy) < 0.0001) {
          const angle = pairAngleJitter(a.group.key, b.group.key, pass);
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          nx = dx / reqX;
          ny = dy / reqY;
          normDist = Math.hypot(nx, ny);
        }

        const dirLen = Math.hypot(dx, dy) || 1;
        const ux = dx / dirLen;
        const uy = dy / dirLen;
        const overlap = 1 - normDist;
        const directionalReq = Math.hypot(ux * reqX, uy * reqY);
        const correction = Math.min(directionalReq * overlap * strength, maxPush);

        a.x -= ux * correction * 0.5;
        a.y -= uy * correction * 0.5;
        b.x += ux * correction * 0.5;
        b.y += uy * correction * 0.5;
        moved = true;
      }
    }
    if (!moved) {
      break;
    }
  }

  for (const node of nodes) {
    const currentCenter = getPointCentroid(node.group.models, xKey, yKey);
    const deltaX = node.x - currentCenter.x;
    const deltaY = node.y - currentCenter.y;
    if (Math.abs(deltaX) < 0.001 && Math.abs(deltaY) < 0.001) {
      continue;
    }
    for (const model of node.group.models) {
      model[xKey] += deltaX;
      model[yKey] += deltaY;
    }
  }
}

function capturePhysicalFilterAnchors() {
  clearPhysicalFilterAnchors();

  const physicalModels = getPhysicalLayoutModels();
  if (!physicalModels.length) {
    return new Map();
  }

  const groups = getPhysicalLayoutGroups(physicalModels);
  const groupCount = groups.length;
  const { x: aspectX, y: aspectY } = getLayoutAspectFactors();
  const targetAspect = getPhysicalFilterTargetAspectRatio();
  const groupSpread = isMobileViewport() ? 1.06 : 1.36;
  const memberSpread = isMobileViewport() ? 1.14 : 1.56;
  const maxSeedRadius = isMobileViewport()
    ? Math.max(320, 200 + Math.sqrt(Math.max(1, groupCount)) * 190)
    : Math.max(340, 210 + Math.sqrt(Math.max(1, groupCount)) * 196);
  const clusterSpreadX = isMobileViewport() ? aspectX : aspectX * 1.04;
  const clusterSpreadY = isMobileViewport() ? aspectY : aspectY * 0.9;

  for (const [groupIndex, group] of groups.entries()) {
    const clusterHash = hashString(group.key);
    const clusterJitter = (((clusterHash & 2047) / 2047) * 2 - 1) * 0.26;
    const spiral = Math.sqrt((groupIndex + 0.5) / Math.max(1, groupCount));
    const angle = groupIndex * GOLDEN_ANGLE + clusterJitter;
    const radius = 120 + spiral * maxSeedRadius;
    const clusterCenterX = Math.cos(angle) * radius * clusterSpreadX;
    const clusterCenterY = Math.sin(angle) * radius * clusterSpreadY;
    const memberCount = group.models.length;
    const memberRadiusMax = 72 + Math.sqrt(memberCount) * 44;

    for (const [memberIndex, model] of group.models.entries()) {
      const hash = hashString(model.slug);
      const localAngleJitter = ((((hash >>> 9) & 1023) / 1023) * 2 - 1) * 0.34;
      const localRadiusJitter = ((((hash >>> 19) & 1023) / 1023) * 2 - 1) * 18;
      const localXJitter = ((((hash >>> 3) & 1023) / 1023) * 2 - 1) * 22;
      const localYJitter = ((((hash >>> 13) & 1023) / 1023) * 2 - 1) * 16;
      const localSpiral = Math.sqrt((memberIndex + 0.5) / Math.max(1, memberCount));
      const localAngle = memberIndex * GOLDEN_ANGLE + localAngleJitter;
      const localRadius = 20 + localSpiral * memberRadiusMax + localRadiusJitter;
      model.filterAx = clusterCenterX + Math.cos(localAngle) * localRadius * 1.12 + localXJitter;
      model.filterAy = clusterCenterY + Math.sin(localAngle) * localRadius * 0.92 + localYJitter;
      model.filterBx = model.filterAx;
      model.filterBy = model.filterAy;
    }
  }

  resolveOverlapsRadial(physicalModels, 0.72, {
    xKey: "filterAx",
    yKey: "filterAy",
    getHalfSize: getPhysicalFilterFarHalfSize,
    spacingX: 1.34,
    spacingY: 1.28,
    passes: 96,
    strength: 0.32,
    maxPush: 36,
    pullStrength: 0.004
  });
  separatePhysicalGroups(groups, "filterAx", "filterAy", getPhysicalFilterFarHalfSize, {
    spacingX: isMobileViewport() ? 1.16 : 1.34,
    spacingY: isMobileViewport() ? 1.18 : 1.28,
    passes: isMobileViewport() ? 10 : 18,
    strength: 0.28,
    maxPush: isMobileViewport() ? 32 : 52
  });
  pullPhysicalGroupsTowardCenters(groups, "filterAx", "filterAy", isMobileViewport() ? 0.1 : 0.16);
  enforceLayoutAspect(physicalModels, "filterAx", "filterAy", targetAspect, 1.42);
  resolveOverlapsRadial(physicalModels, 0.72, {
    xKey: "filterAx",
    yKey: "filterAy",
    getHalfSize: getPhysicalFilterFarHalfSize,
    spacingX: 1.28,
    spacingY: 1.24,
    passes: 48,
    strength: 0.24,
    maxPush: 26,
    pullStrength: 0.002
  });
  separatePhysicalGroups(groups, "filterAx", "filterAy", getPhysicalFilterFarHalfSize, {
    spacingX: isMobileViewport() ? 1.12 : 1.28,
    spacingY: isMobileViewport() ? 1.14 : 1.24,
    passes: isMobileViewport() ? 6 : 10,
    strength: 0.24,
    maxPush: isMobileViewport() ? 24 : 38
  });
  pullPhysicalGroupsTowardCenters(groups, "filterAx", "filterAy", isMobileViewport() ? 0.08 : 0.12);
  resolveOverlapsStrict(physicalModels, 0.72, {
    xKey: "filterAx",
    yKey: "filterAy",
    spacingX: 1.04,
    spacingY: 1.05,
    passes: 12
  });

  const farCentroid = getPointCentroid(physicalModels, "filterAx", "filterAy");
  const farGroupCenters = new Map(groups.map((group) => [group.key, getPointCentroid(group.models, "filterAx", "filterAy")]));
  for (const group of groups) {
    const farGroupCenter = farGroupCenters.get(group.key) || farCentroid;
    const spreadGroupCenter = {
      x: farCentroid.x + (farGroupCenter.x - farCentroid.x) * groupSpread,
      y: farCentroid.y + (farGroupCenter.y - farCentroid.y) * groupSpread
    };
    for (const model of group.models) {
      model.filterBx = spreadGroupCenter.x + (model.filterAx - farGroupCenter.x) * memberSpread;
      model.filterBy = spreadGroupCenter.y + (model.filterAy - farGroupCenter.y) * memberSpread;
      model.filterBx -= Number(model.physicalCloseCenterDx) || 0;
      model.filterBy -= Number(model.physicalCloseCenterDy) || 0;
    }
  }

  enforceLayoutAspectAroundPoint(
    physicalModels,
    "filterBx",
    "filterBy",
    farCentroid.x,
    farCentroid.y,
    targetAspect + 0.12,
    1.46
  );
  resolveOverlapsRadial(physicalModels, MAX_ZOOM, {
    xKey: "filterBx",
    yKey: "filterBy",
    getHalfSize: getPhysicalFilterCloseHalfSize,
    spacingX: 1.84,
    spacingY: 1.96,
    passes: 144,
    strength: 0.28,
    maxPush: 74,
    pullStrength: 0.02,
    pullXKey: "filterAx",
    pullYKey: "filterAy",
    pullScale: memberSpread
  });
  separatePhysicalGroups(groups, "filterBx", "filterBy", getPhysicalFilterCloseHalfSize, {
    spacingX: isMobileViewport() ? 1.2 : 1.8,
    spacingY: isMobileViewport() ? 1.22 : 1.72,
    passes: isMobileViewport() ? 10 : 26,
    strength: 0.28,
    maxPush: isMobileViewport() ? 34 : 82
  });
  pullPhysicalGroupsTowardCenters(groups, "filterBx", "filterBy", isMobileViewport() ? 0.06 : 0.12);
  resolveOverlapsStrict(physicalModels, MAX_ZOOM, {
    xKey: "filterBx",
    yKey: "filterBy",
    spacingX: 1.05,
    spacingY: 1.06,
    passes: 12
  });

  const closeCentroid = getPointCentroid(physicalModels, "filterBx", "filterBy");
  const anchors = new Map();
  for (const model of physicalModels) {
    model.filterAx -= farCentroid.x;
    model.filterAy -= farCentroid.y;
    model.filterBx -= closeCentroid.x;
    model.filterBy -= closeCentroid.y;
    anchors.set(model.slug, {
      ax: model.filterAx,
      ay: model.filterAy,
      bx: model.filterBx,
      by: model.filterBy
    });
  }

  return anchors;
}

function applyPhysicalFilterAnchors(anchorMap) {
  clearPhysicalFilterAnchors();
  if (!(anchorMap instanceof Map) || !anchorMap.size) {
    return;
  }
  for (const model of modelBySlug.values()) {
    if (!isPhysicalItemModel(model)) {
      continue;
    }
    const anchor = anchorMap.get(model.slug);
    if (!anchor) {
      continue;
    }
    model.filterAx = Number(anchor.ax);
    model.filterAy = Number(anchor.ay);
    model.filterBx = Number(anchor.bx);
    model.filterBy = Number(anchor.by);
  }
}

function updateViewportSize() {
  const vv = window.visualViewport;
  state.stageWidth = stage.clientWidth || vv?.width || window.innerWidth || 1;
  state.stageHeight = stage.clientHeight || vv?.height || window.innerHeight || 1;
}

function getFallbackProjectTitleWidth(project) {
  return PROJECT_DETAILS_LEFT + 1 + Math.max(1, project.title.length * TITLE_CHAR_WIDTH + 8);
}

function getMeasuredProjectTitleWidth(slug, project) {
  const fallback = getFallbackProjectTitleWidth(project);
  const node = nodeBySlug.get(slug);
  if (!node) {
    return fallback;
  }
  const anchor = node.querySelector(".project-anchor");
  if (!anchor) {
    return fallback;
  }
  const measured = Number(anchor.offsetWidth);
  if (!Number.isFinite(measured) || measured <= 0) {
    return fallback;
  }
  return measured + 2;
}

function applyGeometryFieldsToModel(model, geometry) {
  if (!model || !geometry) {
    return;
  }
  model.halfWFar = geometry.halfWFar;
  model.halfHFar = geometry.halfHFar;
  model.halfWClose = geometry.halfWClose;
  model.halfHClose = geometry.halfHClose;
  model.textHalfWFar = geometry.textHalfWFar;
  model.textHalfHFar = geometry.textHalfHFar;
  model.textHalfWClose = geometry.textHalfWClose;
  model.textHalfHClose = geometry.textHalfHClose;
  model.centerX = geometry.centerX;
  model.centerY = geometry.centerY;
  model.focusX = geometry.focusX;
  model.focusY = geometry.focusY;
  model.physicalCloseCenterDx = Number(geometry.physicalCloseCenterDx) || 0;
  model.physicalCloseCenterDy = Number(geometry.physicalCloseCenterDy) || 0;
  model.physicalCloseHalfW = Number(geometry.physicalCloseHalfW) || 0;
  model.physicalCloseHalfH = Number(geometry.physicalCloseHalfH) || 0;
}

function refreshModelGeometriesFromDOM() {
  if (!nodeBySlug.size) {
    return false;
  }
  for (const model of modelBySlug.values()) {
    if (model.nodeType === "content" && !nodeBySlug.has(model.slug)) {
      continue;
    }
    const project = getDisplayProject(model);
    if (!project) {
      continue;
    }
    const mediaLayoutFar = mediaLayoutBySlug.get(model.slug) || project.media || [];
    const mediaLayoutClose = mediaLayoutCloseBySlug.get(model.slug) || mediaLayoutFar;
    const titleWidth = getMeasuredProjectTitleWidth(model.slug, project);
    const geometry = estimateNodeGeometry(project, mediaLayoutFar, titleWidth, mediaLayoutClose);
    applyGeometryFieldsToModel(model, geometry);
    model.renderX = Number.NaN;
    model.renderY = Number.NaN;
  }
  return true;
}

function refreshMediaLayoutsFromDOM() {
  if (!nodeBySlug.size) {
    return false;
  }
  let changed = false;
  for (const model of modelBySlug.values()) {
    if (model.nodeType === "content" && !nodeBySlug.has(model.slug)) {
      continue;
    }
    const project = getDisplayProject(model);
    if (!Array.isArray(project.media) || !project.media.length) {
      continue;
    }
    const titleWidth = getMeasuredProjectTitleWidth(model.slug, project);
    const mediaLayouts = prepareProjectMediaVariants(project, titleWidth, model.slug);
    mediaLayoutBySlug.set(project.slug, mediaLayouts.far);
    mediaLayoutCloseBySlug.set(project.slug, mediaLayouts.close);
    applyNodeMediaLayout(model.slug, mediaLayouts.far, mediaLayouts.close);
    changed = true;
  }
  return changed;
}

function getProjectTextBox(titleWidth) {
  return {
    minX: -PROJECT_TEXT_BOX_PAD_X,
    maxX: titleWidth + PROJECT_TEXT_BOX_PAD_X,
    minY: -PROJECT_TEXT_BOX_PAD_Y,
    maxY: PROJECT_TEXT_BOX_HEIGHT + PROJECT_TEXT_BOX_PAD_Y
  };
}

function applyNodeMediaLayout(slug, mediaLayoutFar, mediaLayoutClose = mediaLayoutFar) {
  const node = nodeBySlug.get(slug);
  if (!node) {
    return;
  }
  const mediaWrap = node.querySelector(".project-media-wrap");
  const mediaEls = [...node.querySelectorAll(".project-media")];
  for (const [index, mediaFar] of mediaLayoutFar.entries()) {
    const img = mediaEls[index];
    if (!img) {
      continue;
    }
    const mediaClose = mediaLayoutClose[index] || mediaFar;
    img.style.setProperty("--mx-far", `${mediaFar.x}px`);
    img.style.setProperty("--my-far", `${mediaFar.y}px`);
    img.style.setProperty("--mx-close", `${mediaClose.x}px`);
    img.style.setProperty("--my-close", `${mediaClose.y}px`);
    // Keep legacy vars for any debug/runtime fallback paths.
    img.style.setProperty("--mx", `${mediaFar.x}px`);
    img.style.setProperty("--my", `${mediaFar.y}px`);
    img.style.setProperty("--mw", `${mediaFar.w}px`);
    img.style.setProperty("--mh", `${mediaFar.h}px`);
    img.style.setProperty("--mr", mediaFar.r || "0deg");

    const note = mediaWrap?.querySelector(`.project-media-note[data-media-index="${index}"]`);
    if (note) {
      applyProjectMediaNoteLayout(note, mediaFar, mediaClose);
    }
  }
  setMediaWrapOrigin(mediaWrap, mediaLayoutFar);
  const details = node.querySelector(".project-details");
  const model = modelBySlug.get(slug);
  applyProjectDetailsLayout(details, getDisplayProject(model));
}

function createProjectMediaNote(contentItem, mediaIndex, mediaFar, mediaClose) {
  const note = document.createElement("div");
  note.className = "project-media-note";
  note.dataset.mediaIndex = String(mediaIndex);
  const textLines = [];

  const labelText = typeof contentItem?.label === "string" ? contentItem.label.trim() : "";
  const descriptionText = typeof contentItem?.description === "string" ? contentItem.description.trim() : "";

  if (labelText) {
    const head = document.createElement("p");
    head.className = "project-media-note-head ui-text-line";
    const dot = document.createElement("span");
    dot.className = "project-dot";
    dot.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "project-media-note-label";
    label.textContent = labelText;
    head.append(dot, label);
    note.append(head);
    textLines.push(head);
  }

  if (descriptionText) {
    const body = document.createElement("p");
    body.className = "project-media-note-body ui-text-line";
    body.textContent = descriptionText;
    note.append(body);
    textLines.push(body);
  }

  applyTrimToLineSet(textLines);

  applyProjectMediaNoteLayout(note, mediaFar, mediaClose);
  return note;
}

function applyProjectMediaNoteLayout(note, mediaFar, mediaClose = mediaFar) {
  const noteWidthFar = Math.max(1, Number(mediaFar.w) || 180);
  const noteWidthClose = Math.max(1, Number(mediaClose.w) || 180);
  const noteYFar = (Number(mediaFar.y) || 0) + Math.max(1, Number(mediaFar.h) || 180);
  const noteYClose = (Number(mediaClose.y) || 0) + Math.max(1, Number(mediaClose.h) || 180);

  note.style.setProperty("--note-x-far", `${Number(mediaFar.x) || 0}px`);
  note.style.setProperty("--note-y-far", `${noteYFar}px`);
  note.style.setProperty("--note-w-far", `${noteWidthFar}px`);
  note.style.setProperty("--note-x-close", `${Number(mediaClose.x) || 0}px`);
  note.style.setProperty("--note-y-close", `${noteYClose}px`);
  note.style.setProperty("--note-w-close", `${noteWidthClose}px`);
}

function applyProjectDetailsLayout(details, project = null) {
  if (!details) {
    return;
  }
  if (isContentNodeProject(project)) {
    details.classList.add("is-content-caption");
    details.style.setProperty("--details-left", "0px");
    details.style.setProperty("--details-ui-scale", "1");
    details.style.setProperty("--details-top", `${PROJECT_TEXT_BOX_HEIGHT + CONTENT_DETAILS_TOP_GAP}px`);
    return;
  }
  details.classList.remove("is-content-caption");
  details.style.setProperty("--details-left", `${PROJECT_DETAILS_LEFT}px`);
  details.style.setProperty("--details-ui-scale", `${PROJECT_DETAILS_UI_SCALE}`);
  details.style.setProperty("--details-top", `${PROJECT_TEXT_BOX_HEIGHT + PROJECT_DETAILS_TOP_GAP}px`);
}

function setMediaWrapOrigin(mediaWrap, mediaLayout) {
  if (!mediaWrap) {
    return;
  }
  if (!Array.isArray(mediaLayout) || !mediaLayout.length) {
    mediaWrap.style.setProperty("--media-origin-x", "0px");
    mediaWrap.style.setProperty("--media-origin-y", "0px");
    return;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const media of mediaLayout) {
    const x = Number(media.x) || 0;
    const y = Number(media.y) || 0;
    const w = Math.max(1, Number(media.w) || 180);
    const h = Math.max(1, Number(media.h) || 180);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + w);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y + h);
  }

  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  mediaWrap.style.setProperty("--media-origin-x", `${cx}px`);
  mediaWrap.style.setProperty("--media-origin-y", `${cy}px`);
}

function estimateNodeGeometry(
  project,
  mediaItemsFar = project.media || [],
  titleWidthOverride = null,
  mediaItemsClose = null
) {
  const titleWidth = Number.isFinite(titleWidthOverride) && titleWidthOverride > 0 ? titleWidthOverride : getFallbackProjectTitleWidth(project);

  const farBox = getProjectTextBox(titleWidth);
  const closeTextBox = getProjectTextBox(titleWidth);
  const closeVerticalReserve = getProjectCloseBodyTextVerticalReserve(project, titleWidth);

  const closeItems = Array.isArray(mediaItemsClose) ? mediaItemsClose : mediaItemsFar;
  const mediaBoundsFar = getMediaBounds(mediaItemsFar);
  const mediaBoundsClose = getMediaBounds(closeItems);

  const farMediaBox = mediaBoundsFar
    ? scaleBoxAroundPoint(
        mediaBoundsFar,
        FAR_MEDIA_SCALE,
        (mediaBoundsFar.minX + mediaBoundsFar.maxX) * 0.5,
        (mediaBoundsFar.minY + mediaBoundsFar.maxY) * 0.5
      )
    : null;
  const closeMediaBox = mediaBoundsClose;
  const farCombined = farMediaBox ? unionBox(farBox, farMediaBox) : farBox;
  const closeCombined = closeMediaBox ? unionBox(closeTextBox, closeMediaBox) : closeTextBox;

  const anchorCenterX = (farBox.minX + farBox.maxX) / 2;
  const anchorCenterY = (farBox.minY + farBox.maxY) / 2;
  const farCenterX = (farCombined.minX + farCombined.maxX) * 0.5;
  const farCenterY = (farCombined.minY + farCombined.maxY) * 0.5;
  const closeCenterX = (closeCombined.minX + closeCombined.maxX) * 0.5;
  const closeCenterY = (closeCombined.minY + closeCombined.maxY) * 0.5;
  // Keep a single stable center anchored to FAR geometry.
  // Mixing FAR/CLOSE centers creates mirrored "dead tails" (often on the right) in overview.
  const centerX = farCenterX;
  const centerY = farCenterY;

  const farHalfW = Math.max(Math.abs(centerX - farCombined.minX), Math.abs(farCombined.maxX - centerX));
  const farHalfH = Math.max(Math.abs(centerY - farCombined.minY), Math.abs(farCombined.maxY - centerY));
  const closeHalfW = Math.max(Math.abs(centerX - closeCombined.minX), Math.abs(closeCombined.maxX - centerX));
  const closeHalfH = Math.max(Math.abs(centerY - closeCombined.minY), Math.abs(closeCombined.maxY - centerY));
  const farTextHalfW = Math.max(Math.abs(centerX - farBox.minX), Math.abs(farBox.maxX - centerX));
  const farTextHalfH = Math.max(Math.abs(centerY - farBox.minY), Math.abs(farBox.maxY - centerY));
  const closeTextHalfW = Math.max(Math.abs(centerX - closeTextBox.minX), Math.abs(closeTextBox.maxX - centerX));
  const closeTextHalfH = Math.max(Math.abs(centerY - closeTextBox.minY), Math.abs(closeTextBox.maxY - centerY));

  const FAR_COLLISION_PAD = 12;
  const CLOSE_COLLISION_PAD = 16;
  const halfWFar = Math.max(64, farHalfW + FAR_COLLISION_PAD);
  const halfHFar = Math.max(18, farHalfH + FAR_COLLISION_PAD);
  const halfWClose = Math.max(76, closeHalfW + CLOSE_COLLISION_PAD);
  const halfHClose = Math.max(24, closeHalfH + closeVerticalReserve + CLOSE_COLLISION_PAD);
  const textHalfWFar = Math.max(64, farTextHalfW + FAR_COLLISION_PAD);
  const textHalfHFar = Math.max(18, farTextHalfH + FAR_COLLISION_PAD);
  const textHalfWClose = Math.max(76, closeTextHalfW + CLOSE_COLLISION_PAD);
  const textHalfHClose = Math.max(24, closeTextHalfH + closeVerticalReserve + CLOSE_COLLISION_PAD);

  return {
    centerX,
    centerY,
    focusX: anchorCenterX,
    focusY: anchorCenterY,
    physicalCloseCenterDx: closeCenterX - farCenterX,
    physicalCloseCenterDy: closeCenterY - farCenterY,
    physicalCloseHalfW: Math.max(Math.abs(closeCenterX - closeCombined.minX), Math.abs(closeCombined.maxX - closeCenterX)) + CLOSE_COLLISION_PAD,
    physicalCloseHalfH:
      Math.max(Math.abs(closeCenterY - closeCombined.minY), Math.abs(closeCombined.maxY - closeCenterY)) +
      closeVerticalReserve +
      CLOSE_COLLISION_PAD,
    halfWFar,
    halfHFar,
    halfWClose,
    halfHClose,
    textHalfWFar,
    textHalfHFar,
    textHalfWClose,
    textHalfHClose
  };
}

function getMediaBounds(mediaItems) {
  if (!Array.isArray(mediaItems) || !mediaItems.length) {
    return null;
  }
  let bounds = null;
  for (const media of mediaItems) {
    const box = {
      minX: Number(media.x) || 0,
      maxX: (Number(media.x) || 0) + Math.max(1, Number(media.w) || 180),
      minY: Number(media.y) || 0,
      maxY: (Number(media.y) || 0) + Math.max(1, Number(media.h) || 180)
    };
    bounds = bounds ? unionBox(bounds, box) : box;
  }
  return bounds;
}

function buildNodes() {
  for (const model of modelBySlug.values()) {
    if (model.nodeType === "content") {
      continue;
    }
    mountProjectNodeBySlug(model.slug);
  }
}

function createProjectNode(project) {
  const isContentNode = isContentNodeProject(project);
  const node = document.createElement("article");
  node.className = "project-node is-hidden";
  node.dataset.slug = project.slug;
  node.dataset.nodeType = isContentNode ? "content" : "project";
  node.dataset.types = project.types.join(",");
  node.dataset.hasMedia = String(Array.isArray(project.media) && project.media.length > 0);

  const textWrap = document.createElement("div");
  textWrap.className = "project-text";

  const anchor = document.createElement("button");
  anchor.className = "project-anchor";
  anchor.type = "button";

  const dot = document.createElement("span");
  dot.className = "project-dot";
  dot.setAttribute("aria-hidden", "true");

  const title = document.createElement("span");
  title.className = "project-title";
  title.textContent = project.title;

  anchor.append(dot, title);

  const details = createProjectDetails(project, project.slug);

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "project-media-wrap";
  const mediaFarList = mediaLayoutBySlug.get(project.slug) || project.media || [];
  const mediaCloseList = mediaLayoutCloseBySlug.get(project.slug) || mediaFarList;
  if (Array.isArray(mediaFarList)) {
    for (const [index, mediaFar] of mediaFarList.entries()) {
      if (shouldHideMotionMediaOnMobile(mediaFar.src)) {
        continue;
      }
      const mediaClose = mediaCloseList[index] || mediaFar;
      const isVideo = isVideoMediaSrc(mediaFar.src);
      const isMotion = isVideo || isGifMediaSrc(mediaFar.src);
      const isSvg = isSvgMediaSrc(mediaFar.src);
      const shouldRoundMedia = shouldRoundProjectMedia(mediaFar.src);
      const graphProxy = USE_GRAPH_MEDIA_PROXIES ? getGraphMediaProxyBySrc(mediaFar.src) : null;
      const videoPosterSrc = isVideo && USE_GRAPH_MEDIA_PROXIES ? getVideoPosterSrcByMediaSrc(mediaFar.src) : "";
      const graphMediaSrc = USE_GRAPH_MEDIA_PROXIES ? getPreferredGraphProxySrc(graphProxy) || mediaFar.src : mediaFar.src;
      const usesGraphProxy = Boolean(USE_GRAPH_MEDIA_PROXIES && graphProxy && graphMediaSrc && graphMediaSrc !== mediaFar.src);
      const shouldUsePreview = USE_CONTENT_MEDIA_PREVIEWS && (isContentNode || isMobileMediaMode());
      const thumbSrc = getMediaThumbSrcByMediaSrc(mediaFar.src);
      const previewSrc = shouldUsePreview
        ? isMobileMediaMode()
          ? thumbSrc || getMediaPreviewSrcByMediaSrc(mediaFar.src)
          : getMediaPreviewSrcByMediaSrc(mediaFar.src)
        : "";
      const mobileMediaSrc = getMobileMediaSrcByMediaSrc(mediaFar.src);
      const usesPreview = Boolean(previewSrc && previewSrc !== mediaFar.src);
      const motionPosterSrc = previewSrc || videoPosterSrc;
      const renderVideoAsPoster = isMotion && shouldDisableVideoPlayback() && Boolean(motionPosterSrc);
      const lightweightMediaSrc = usesPreview ? previewSrc : graphMediaSrc;
      const mediaFrame = document.createElement("div");
      mediaFrame.className = "project-media-frame";
      if (shouldRoundMedia) {
        mediaFrame.classList.add("is-rounded");
      }
      const mediaElement = document.createElement(renderVideoAsPoster ? "img" : isVideo ? "video" : "img");
      mediaElement.className = "project-media";
      if (isSvg) {
        mediaElement.classList.add("is-svg");
      }
      if (isVideo && !renderVideoAsPoster) {
        mediaFrame.classList.add("is-video");
        mediaElement.classList.add("is-video");
        mediaElement.muted = true;
        mediaElement.defaultMuted = true;
        mediaElement.autoplay = true;
        mediaElement.loop = true;
        mediaElement.playsInline = true;
        mediaElement.controls = false;
        mediaElement.preload = "auto";
        mediaElement.disablePictureInPicture = true;
        mediaElement.disableRemotePlayback = true;
        mediaElement.setAttribute("muted", "");
        mediaElement.setAttribute("autoplay", "");
        mediaElement.setAttribute("loop", "");
        mediaElement.setAttribute("playsinline", "");
        mediaElement.setAttribute("webkit-playsinline", "");
        mediaElement.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback nofullscreen");
        if (usesPreview) {
          mediaElement.poster = previewSrc;
        }
        if (typeof graphProxy?.posterSrc === "string" && graphProxy.posterSrc.trim()) {
          mediaElement.poster = graphProxy.posterSrc.trim();
        }
        mediaElement.addEventListener("loadedmetadata", () => {
          handleProjectMediaElementLoad(project.slug, index, mediaElement);
          tryAutoplayProjectMediaVideo(mediaElement);
        });
        mediaElement.addEventListener("canplay", () => {
          tryAutoplayProjectMediaVideo(mediaElement);
        });
      } else {
        mediaElement.alt = `${project.title} media`;
        // We already lazy-hydrate content media ourselves; native loading=lazy on
        // detached deep subtrees is a known Safari/iOS problem.
        mediaElement.decoding = "async";
        mediaElement.addEventListener("load", () => {
          handleProjectMediaElementLoad(project.slug, index, mediaElement);
          queueBlackMatteProxyCleanup(mediaElement);
        });
      }
      mediaElement.draggable = false;
      mediaFrame.style.setProperty("--mx-far", `${mediaFar.x}px`);
      mediaFrame.style.setProperty("--my-far", `${mediaFar.y}px`);
      mediaFrame.style.setProperty("--mx-close", `${mediaClose.x}px`);
      mediaFrame.style.setProperty("--my-close", `${mediaClose.y}px`);
      mediaFrame.style.setProperty("--mx", `${mediaFar.x}px`);
      mediaFrame.style.setProperty("--my", `${mediaFar.y}px`);
      mediaFrame.style.setProperty("--mw", `${mediaFar.w}px`);
      mediaFrame.style.setProperty("--mh", `${mediaFar.h}px`);
      mediaFrame.style.setProperty("--mr", mediaFar.r || "0deg");
      mediaElement.dataset.mediaIndex = String(index);
      mediaElement.dataset.mediaSrc = mediaFar.src;
      mediaElement.dataset.projectSlug = project.slug;
      mediaElement.dataset.proxySrc = !renderVideoAsPoster && usesGraphProxy ? graphMediaSrc : "";
      mediaElement.dataset.proxyPosterSrc =
        !renderVideoAsPoster && usesGraphProxy && typeof graphProxy?.posterSrc === "string" ? graphProxy.posterSrc : "";
      mediaElement.dataset.proxyMatte = usesGraphProxy && typeof graphProxy?.matte === "string" ? graphProxy.matte : "";
      mediaElement.dataset.proxyActive = !renderVideoAsPoster && isContentNode && usesGraphProxy ? "true" : "false";
      mediaElement.dataset.thumbSrc = thumbSrc && thumbSrc !== mediaFar.src ? thumbSrc : "";
      mediaElement.dataset.previewSrc = usesPreview ? previewSrc : "";
      mediaElement.dataset.previewActive = usesPreview ? "true" : "false";
      mediaElement.dataset.mobileSrc = mobileMediaSrc && mobileMediaSrc !== mediaFar.src ? mobileMediaSrc : "";
      mediaElement.dataset.mobileActive = "false";
      mediaElement.dataset.videoPosterOnly = "false";
      if (isContentNode) {
        mediaElement.dataset.deferredSrc = renderVideoAsPoster ? motionPosterSrc || mediaFar.src : lightweightMediaSrc;
        mediaElement.dataset.mediaHydrated = "false";
        if (isVideo && !renderVideoAsPoster) {
          mediaElement.preload = "none";
        }
      } else {
        mediaElement.src = renderVideoAsPoster ? motionPosterSrc || mediaFar.src : usesPreview ? previewSrc : mediaFar.src;
        mediaElement.dataset.mediaHydrated = "true";
        if (isVideo && !renderVideoAsPoster) {
          if (mediaElement.readyState >= 1 && mediaElement.videoWidth > 0 && mediaElement.videoHeight > 0) {
            handleProjectMediaElementLoad(project.slug, index, mediaElement);
            tryAutoplayProjectMediaVideo(mediaElement);
          }
        } else if (mediaElement.complete && mediaElement.naturalWidth > 0 && mediaElement.naturalHeight > 0) {
          handleProjectMediaElementLoad(project.slug, index, mediaElement);
          queueBlackMatteProxyCleanup(mediaElement);
        }
      }
      mediaFrame.append(mediaElement);
      mediaWrap.append(mediaFrame);

      if (isContentNode) {
        if (index === 0 && (project.title || project.detailsText)) {
          mediaWrap.append(
            createProjectMediaNote(
              {
                label: project.title,
                description: project.detailsText
              },
              index,
              mediaFar,
              mediaClose
            )
          );
        }
      } else {
        const contentItem = getProjectContentItemBySrc(project, mediaFar.src);
        if (contentItem && (contentItem.label || contentItem.description)) {
          mediaWrap.append(createProjectMediaNote(contentItem, index, mediaFar, mediaClose));
        }
      }
    }
  }
  setMediaWrapOrigin(mediaWrap, mediaFarList);

  textWrap.append(anchor);
  if (details) {
    applyProjectDetailsLayout(details, project);
    textWrap.append(details);
  }
  node.append(textWrap, mediaWrap);
  return node;
}

function createProjectDetails(project, slug = project.slug) {
  const isContentNode = isContentNodeProject(project);
  if (isContentNode) {
    return null;
  }
  const rows = getProjectDetailsRows(project, { includeMoreLink: true });
  const bodyText = typeof project.detailsText === "string" ? project.detailsText.trim() : "";
  const deepLinkSourceSlug =
    typeof project.deepLinkSourceSlug === "string" && project.deepLinkSourceSlug.trim() ? project.deepLinkSourceSlug.trim() : "";
  const deepLinkFocusSlug =
    typeof project.deepLinkFocusSlug === "string" && project.deepLinkFocusSlug.trim() ? project.deepLinkFocusSlug.trim() : "";
  const deepLinkMediaIndex = Number.isFinite(Number(project.deepLinkMediaIndex))
    ? Math.max(0, Math.round(Number(project.deepLinkMediaIndex)))
    : Number.NaN;
  const hasContentItems =
    getContentChildSlugs(slug).length > 0 || (Array.isArray(project.contentItems) && project.contentItems.length > 0);
  const hasDeepLink = Boolean(deepLinkSourceSlug);
  const moreButtonLabel = hasContentItems || hasDeepLink ? "SEE MORE" : "";

  if (!rows.length && !bodyText && !moreButtonLabel) {
    return null;
  }

  const details = document.createElement("div");
  details.className = "project-details";
  const textLines = [];
  // Ensure pan/drag can start over details text the same way as over media/title.
  details.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button")) {
      return;
    }
    onPointerDown(event);
    event.stopPropagation();
  });

  if (rows.length) {
    const meta = document.createElement("div");
    meta.className = "project-details-meta";
    for (const row of rows) {
      const line = document.createElement("p");
      line.className = "project-details-line ui-text-line";

      const label = document.createElement("span");
      label.className = "project-details-label";
      label.textContent = `${row.label}: `;
      line.append(label);

      if (row.href) {
        const link = document.createElement("a");
        link.className = "project-details-link";
        link.href = row.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = row.value;
        line.append(link);
      } else {
        const value = document.createElement("span");
        value.className = "project-details-value";
        appendInlineMarkdownLinks(value, row.value);
        line.append(value);
      }
      meta.append(line);
      textLines.push(line);
    }
    details.append(meta);
  }

  if (bodyText) {
    const body = document.createElement("p");
    body.className = "project-details-body ui-text-line";
    appendInlineMarkdownLinks(body, bodyText);
    details.append(body);
    textLines.push(body);
  }

  if (moreButtonLabel) {
    const more = document.createElement("button");
    more.className = "project-details-more";
    more.type = "button";
    more.dataset.projectSlug = slug;
    more.dataset.defaultLabel = moreButtonLabel;
    more.dataset.hasContentItems = String(hasContentItems);
    more.textContent = more.dataset.defaultLabel;
    more.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    more.addEventListener("click", () => {
      if (hasDeepLink) {
        openProjectDepthLink(deepLinkSourceSlug, {
          entryFocusSlug: deepLinkFocusSlug || null,
          entryFocusMediaIndex: Number.isFinite(deepLinkMediaIndex) ? deepLinkMediaIndex : undefined,
          entryZoomMode: state.activeType === "physical" ? "mid" : null
        });
        return;
      }
      if (hasContentItems) {
        toggleProjectDepth(slug);
        return;
      }
    });
    details.append(more);
  }

  applyTrimToLineSet(textLines);

  return details;
}

function getProjectDetailsRows(project, { includeMoreLink = false } = {}) {
  const explicitRows = Array.isArray(project.detailsRows) && project.detailsRows.length ? project.detailsRows : null;
  const rows = Array.isArray(project.detailsRows) && project.detailsRows.length
    ? explicitRows
      .map((row) => normalizeProjectDetailsRow(row))
      .filter((row) => row && row.label && row.value)
    : (() => {
        const computedRows = [];
        const typeValue =
          Array.isArray(project.types) && project.types.length ? project.types.join(", ").toUpperCase() : "";
        if (typeValue) {
          computedRows.push({ label: "TYPE", value: typeValue });
        }
        if (project.client) {
          computedRows.push({ label: "CLIENT", value: String(project.client).toUpperCase() });
        }
        if (project.location) {
          computedRows.push({ label: "LOCATION", value: String(project.location).toUpperCase() });
        }
        if (project.year) {
          computedRows.push({ label: "DATE", value: String(project.year) });
        }
        if (project.madeWith) {
          computedRows.push({ label: "MADE WITH", value: String(project.madeWith) });
        }
        return computedRows;
      })();

  if (includeMoreLink) {
    const moreLabel = typeof project.moreLabel === "string" && project.moreLabel.trim() ? project.moreLabel.trim() : "";
    const moreUrl = typeof project.moreUrl === "string" && project.moreUrl.trim() ? project.moreUrl.trim() : "";
    if (moreUrl) {
      rows.push({
        label: "MORE",
        value: moreLabel || "LINK",
        href: moreUrl
      });
    }
  }

  return rows;
}

function hasInlineMarkdownLinks(text) {
  return /\[([^\]]+)\]\(([^)]+)\)/.test(String(text || ""));
}

function appendInlineMarkdownLinks(target, text) {
  const raw = String(text || "");
  target.textContent = "";

  if (!raw) {
    return;
  }

  if (!hasInlineMarkdownLinks(raw)) {
    target.textContent = raw;
    return;
  }

  const inlineMarkdownLinkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = inlineMarkdownLinkRe.exec(raw))) {
    const [fullMatch, labelRaw, hrefRaw] = match;
    const textBefore = raw.slice(lastIndex, match.index);
    if (textBefore) {
      target.append(document.createTextNode(textBefore));
    }

    const label = String(labelRaw || "").trim();
    const href = String(hrefRaw || "").trim();
    if (label && href) {
      const link = document.createElement("a");
      link.className = "project-details-link";
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = label;
      target.append(link);
    } else {
      target.append(document.createTextNode(fullMatch));
    }

    lastIndex = match.index + fullMatch.length;
  }

  const tail = raw.slice(lastIndex);
  if (tail) {
    target.append(document.createTextNode(tail));
  }
}

function normalizeProjectDetailsRow(row) {
  if (!row) {
    return null;
  }
  if (typeof row === "string") {
    const raw = row.trim();
    if (!raw) {
      return null;
    }
    const split = raw.indexOf(":");
    if (split === -1) {
      return { label: "INFO", value: raw.toUpperCase() };
    }
    const label = raw.slice(0, split).trim().toUpperCase();
    const value = raw.slice(split + 1).trim();
    if (!value) {
      return null;
    }
    return {
      label,
      value: hasInlineMarkdownLinks(value) ? value : value.toUpperCase()
    };
  }

  const label = String(row.label || "").trim().toUpperCase();
  const value = String(row.value || "").trim();
  const href = typeof row.href === "string" && row.href.trim() ? row.href.trim() : "";
  if (!label || !value) {
    return null;
  }
  return {
    label,
    value: hasInlineMarkdownLinks(value) ? value : value.toUpperCase(),
    href
  };
}

function prepareProjectMedia(project, titleWidthOverride = null, layoutOverride = null) {
  applyKnownDimensionsToProjectMedia(project);
  const source = Array.isArray(project.media) ? project.media : [];
  if (!source.length) {
    return [];
  }

  const items = source.map((media, index) => ({ ...media, _index: index }));
  const rootBox = layoutOverride?.rootBox || getProjectMediaRootBox(project, titleWidthOverride);
  const mediaCollisionBox = layoutOverride?.collisionBox || getProjectMediaCollisionBox(project, titleWidthOverride);
  const mediaPads = getProjectMediaLayoutPads();
  const isContentNode = isContentNodeProject(project);

  if (isPhysicalItemProject(project)) {
    for (const media of items) {
      normalizeMediaSize(media);
    }
    return layoutPhysicalItemMedia(items, rootBox);
  }

  if (project.mediaLayout === "manual") {
    for (const [index, media] of items.entries()) {
      if (isContentNode) {
        normalizeContentMediaSize(media, getContentProjectNoteData(project, index));
      } else {
        normalizeMediaSize(media);
      }
    }
    for (let pass = 0; pass < 3; pass += 1) {
      resolveMediaPairOverlaps(items, mediaPads.mediaSafePad, 8);
      for (const media of items) {
        pushMediaOutsideBox(media, mediaCollisionBox, mediaPads.textSafePad);
      }
      enforceFarScaleTextSeparation(items, mediaCollisionBox, mediaPads.textSafePad, FAR_MEDIA_SCALE, 1);
    }
    return items;
  }

  return layoutMediaClusterAuto(items, mediaCollisionBox, rootBox, project.slug, mediaPads);
}

function layoutPhysicalItemMedia(items, rootBox) {
  const ordered = (Array.isArray(items) ? items : [])
    .map((media) => ({
      ...media,
      x: Number(media.x) || 0,
      y: Number(media.y) || 0,
      w: Math.max(1, Math.round((Math.max(1, Number(media.w) || 180)) * PHYSICAL_ITEM_MEDIA_SCALE)),
      h: Math.max(1, Math.round((Math.max(1, Number(media.h) || 180)) * PHYSICAL_ITEM_MEDIA_SCALE))
    }))
    .sort((a, b) => (Number(b.w) || 0) * (Number(b.h) || 0) - (Number(a.w) || 0) * (Number(a.h) || 0));

  if (!ordered.length) {
    return ordered;
  }

  const leftX = rootBox.minX;
  const anchorTop = rootBox.minY;
  const gapY = PHYSICAL_ITEM_MEDIA_GAP_Y;
  let cursorY = anchorTop;

  for (let index = 0; index < ordered.length; index += 1) {
    const media = ordered[index];
    media.x = Math.round(leftX);
    media.y = Math.round(cursorY - media.h - gapY);
    cursorY = media.y - gapY * 0.8;
  }

  return ordered
    .sort((a, b) => a._index - b._index)
    .map((media) => ({
      ...media,
      x: Math.round(media.x),
      y: Math.round(media.y),
      w: Math.round(media.w),
      h: Math.round(media.h)
    }));
}

function buildPhysicalFarMediaLayout(closeLayout) {
  const safeScale = Math.max(0.0001, FAR_MEDIA_SCALE);
  return (Array.isArray(closeLayout) ? closeLayout : []).map((media) => {
    const x = Number(media.x) || 0;
    const y = Number(media.y) || 0;
    const w = Math.max(1, Number(media.w) || 180);
    const h = Math.max(1, Number(media.h) || 180);
    const anchoredLeft = x;
    const anchoredBottom = y + h;
    return {
      ...media,
      x: Math.round(anchoredLeft - (w * (1 - safeScale)) / 2),
      y: Math.round(anchoredBottom - (h * (1 + safeScale)) / 2),
      w,
      h
    };
  });
}

function prepareProjectMediaVariants(project, titleWidthOverride = null, slugForMeasure = null) {
  const far = prepareProjectMedia(project, titleWidthOverride);
  if (!far.length) {
    return { far, close: far };
  }
  if (isContentNodeProject(project)) {
    return {
      far,
      close: far.map((media) => ({ ...media }))
    };
  }
  if (isPhysicalItemProject(project)) {
    const close = far.map((media) => ({ ...media }));
    return {
      far: buildPhysicalFarMediaLayout(close),
      close
    };
  }

  const titleWidth =
    Number.isFinite(titleWidthOverride) && titleWidthOverride > 0 ? titleWidthOverride : getFallbackProjectTitleWidth(project);
  const detailsBox = getProjectDetailsCollisionBox(project, titleWidth, slugForMeasure);
  if (!detailsBox) {
    return { far, close: far.map((media) => ({ ...media })) };
  }

  const rootBoxFar = getProjectMediaRootBox(project, titleWidth);
  const collisionBoxFar = getProjectMediaCollisionBox(project, titleWidth);
  const detailsSafeBox = inflateRect(detailsBox, PROJECT_DETAILS_MEDIA_GAP);
  const rootBoxClose = unionBox(rootBoxFar, detailsSafeBox);
  const collisionBoxClose = unionBox(collisionBoxFar, detailsSafeBox);
  const closeLayoutZoom = getProjectCloseLayoutZoom(project);
  const rootBoxCloseMediaSpace = convertTextBoxToMediaSpace(rootBoxClose, closeLayoutZoom);
  const collisionBoxCloseMediaSpace = convertTextBoxToMediaSpace(collisionBoxClose, closeLayoutZoom);
  const closeBottomMediaGap = convertTextLengthToMediaSpace(PROJECT_CLOSE_BOTTOM_MEDIA_GAP, closeLayoutZoom);
  const mediaPads = getProjectMediaLayoutPads();
  const close = adaptMediaLayoutForExpandedText(
    far,
    rootBoxFar,
    rootBoxCloseMediaSpace,
    collisionBoxCloseMediaSpace,
    mediaPads,
    closeBottomMediaGap
  );

  return { far, close };
}

function adaptMediaLayoutForExpandedText(farLayout, rootBoxFar, rootBoxClose, collisionBoxClose, mediaPads, bottomGap = 0) {
  const items = (Array.isArray(farLayout) ? farLayout : []).map((media) => ({
    ...media,
    x: Number(media.x) || 0,
    y: Number(media.y) || 0,
    w: Math.max(1, Number(media.w) || 180),
    h: Math.max(1, Number(media.h) || 180)
  }));
  if (!items.length) {
    return items;
  }

  const textPad = Math.max(0, Number(mediaPads?.textSafePad) || 0);
  const mediaPad = Math.max(0, Number(mediaPads?.mediaSafePad) || 0);
  const rootCenter = {
    x: (rootBoxFar.minX + rootBoxFar.maxX) * 0.5,
    y: (rootBoxFar.minY + rootBoxFar.maxY) * 0.5
  };
  const baseMap = new Map(
    (Array.isArray(farLayout) ? farLayout : []).map((media) => [media._index, media])
  );
  const sideMap = new Map(
    (Array.isArray(farLayout) ? farLayout : []).map((media) => [media._index, detectMediaSide(media, rootBoxFar, rootCenter)])
  );
  const anchorMap = new Map();

  for (const media of items) {
    const side = sideMap.get(media._index) || "right";
    if (side === "bottom") {
      const anchorTop = collisionBoxClose.maxY + textPad + Math.max(0, Number(bottomGap) || 0);
      media.y = anchorTop;
      anchorMap.set(media._index, { minY: anchorTop });
    }
  }

  // Keep far-layout topology stable and only minimally push media away from expanded text/details area.
  for (let pass = 0; pass < 8; pass += 1) {
    let movedFromText = false;
    for (const media of items) {
      const prevX = media.x;
      const prevY = media.y;
      const side = sideMap.get(media._index) || "right";
      pushMediaOutsideBoxBySide(media, collisionBoxClose, textPad, side);
      if (Math.abs(media.x - prevX) > 0.001 || Math.abs(media.y - prevY) > 0.001) {
        movedFromText = true;
      }
      if (rootBoxClose) {
        pushMediaOutsideBoxBySide(media, rootBoxClose, textPad, side);
      }
      const base = baseMap.get(media._index);
      const anchor = anchorMap.get(media._index) || null;
      if (base) {
        enforceMediaDirectionalConstraint(media, base, side, anchor);
      }
    }
    resolveMediaPairOverlaps(items, mediaPad, 3);
    for (const media of items) {
      const side = sideMap.get(media._index) || "right";
      pushMediaOutsideBoxBySide(media, collisionBoxClose, textPad, side);
      if (rootBoxClose) {
        pushMediaOutsideBoxBySide(media, rootBoxClose, textPad, side);
      }
      const base = baseMap.get(media._index);
      const anchor = anchorMap.get(media._index) || null;
      if (base) {
        enforceMediaDirectionalConstraint(media, base, side, anchor);
      }
    }
    if (!movedFromText) {
      break;
    }
  }

  return items.map((media) => ({
    ...media,
    x: Math.round(media.x),
    y: Math.round(media.y),
    w: Math.round(media.w),
    h: Math.round(media.h)
  }));
}

function detectMediaSide(baseMedia, rootBoxFar, rootCenter) {
  const baseX = Number(baseMedia.x) || 0;
  const baseY = Number(baseMedia.y) || 0;
  const baseW = Math.max(1, Number(baseMedia.w) || 180);
  const baseH = Math.max(1, Number(baseMedia.h) || 180);
  const rect = {
    minX: baseX,
    maxX: baseX + baseW,
    minY: baseY,
    maxY: baseY + baseH
  };
  const out = {
    top: rootBoxFar.minY - rect.maxY,
    left: rootBoxFar.minX - rect.maxX,
    bottom: rect.minY - rootBoxFar.maxY,
    right: rect.minX - rootBoxFar.maxX
  };
  let bestSide = "right";
  let bestOutside = 0;
  for (const side of ["top", "left", "bottom", "right"]) {
    if (out[side] > bestOutside) {
      bestOutside = out[side];
      bestSide = side;
    }
  }
  if (bestOutside > 0) {
    return bestSide;
  }

  const cx = (rect.minX + rect.maxX) * 0.5;
  const cy = (rect.minY + rect.maxY) * 0.5;
  const dx = cx - rootCenter.x;
  const dy = cy - rootCenter.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? "right" : "left";
  }
  return dy >= 0 ? "bottom" : "top";
}

function pushMediaOutsideBoxBySide(media, box, gap, side) {
  const prevX = Number(media.x) || 0;
  const prevY = Number(media.y) || 0;
  const expanded = {
    minX: box.minX - gap,
    maxX: box.maxX + gap,
    minY: box.minY - gap,
    maxY: box.maxY + gap
  };
  const rect = getMediaRect(media);
  const overlapX = Math.min(rect.maxX, expanded.maxX) - Math.max(rect.minX, expanded.minX);
  const overlapY = Math.min(rect.maxY, expanded.maxY) - Math.max(rect.minY, expanded.minY);
  if (overlapX <= 0 || overlapY <= 0) {
    return false;
  }

  if (side === "bottom") {
    media.y = prevY + (expanded.maxY - rect.minY);
  } else if (side === "top") {
    media.y = prevY + (expanded.minY - rect.maxY);
  } else if (side === "left") {
    media.x = prevX + (expanded.minX - rect.maxX);
  } else if (side === "right") {
    media.x = prevX + (expanded.maxX - rect.minX);
  } else {
    pushMediaOutsideBox(media, box, gap);
  }
  return true;
}

function enforceMediaDirectionalConstraint(media, baseMedia, side, anchor = null) {
  const baseX = Number(baseMedia.x) || 0;
  const baseY = Number(baseMedia.y) || 0;

  const crossAxisDriftLimit = 10;
  if (side === "left" || side === "right") {
    // Horizontal slot (left/right): allow movement along X, keep Y nearly fixed.
    media.y = clamp((Number(media.y) || 0), baseY - crossAxisDriftLimit, baseY + crossAxisDriftLimit);
    if (side === "right") {
      media.x = Math.max(Number(media.x) || 0, baseX);
    } else {
      media.x = Math.min(Number(media.x) || 0, baseX);
    }
  } else {
    // Vertical slot (top/bottom): allow movement along Y, keep X nearly fixed.
    media.x = clamp((Number(media.x) || 0), baseX - crossAxisDriftLimit, baseX + crossAxisDriftLimit);
    if (side === "bottom") {
      const minY = Number.isFinite(anchor?.minY) ? anchor.minY : baseY;
      media.y = Math.max(Number(media.y) || 0, minY);
    } else {
      media.y = Math.min(Number(media.y) || 0, baseY);
    }
  }
}

function getProjectMediaLayoutPads() {
  return {
    textSafePad: PROJECT_TEXT_SAFE_PAD,
    mediaSafePad: PROJECT_MEDIA_SAFE_PAD
  };
}

function getProjectCloseLayoutZoom(project) {
  const hasMedia = Array.isArray(project?.media) && project.media.length > 0;
  const focusMaxZoom = hasMedia ? MAX_ZOOM : MAX_TEXT_ONLY_FOCUS_ZOOM;
  return clamp(project?.focusZoom || MAX_ZOOM, 0.86, focusMaxZoom);
}

function convertTextBoxToMediaSpace(box, zoom) {
  const safeZoom = Math.max(0.0001, Number(zoom) || 1);
  return {
    minX: box.minX / safeZoom,
    maxX: box.maxX / safeZoom,
    minY: box.minY / safeZoom,
    maxY: box.maxY / safeZoom
  };
}

function convertTextLengthToMediaSpace(length, zoom) {
  const safeZoom = Math.max(0.0001, Number(zoom) || 1);
  return Math.max(0, Number(length) || 0) / safeZoom;
}

function getProjectDetailsCollisionBox(project, titleWidthOverride = null, slugForMeasure = null) {
  const hasDetails = projectHasDetails(project);
  if (!hasDetails) {
    return null;
  }

  const isContentNode = isContentNodeProject(project);
  const titleWidth =
    Number.isFinite(titleWidthOverride) && titleWidthOverride > 0 ? titleWidthOverride : getFallbackProjectTitleWidth(project);
  const measured = getMeasuredProjectDetailsSize(slugForMeasure);
  const estimated = estimateProjectDetailsSize(project, titleWidth);
  const detailsScale = isContentNode ? 1 : PROJECT_DETAILS_UI_SCALE;
  const width = Math.max(1, (measured?.width ?? estimated.width) * detailsScale);
  const height = Math.max(1, (measured?.height ?? estimated.height) * detailsScale);
  const left = isContentNode ? 0 : PROJECT_DETAILS_LEFT;
  const top = PROJECT_TEXT_BOX_HEIGHT + (isContentNode ? CONTENT_DETAILS_TOP_GAP : PROJECT_DETAILS_TOP_GAP);
  return {
    minX: left,
    maxX: left + width,
    minY: top,
    maxY: top + height
  };
}

function projectHasDetails(project) {
  const isContentNode = isContentNodeProject(project);
  const rows = getProjectDetailsRows(project, { includeMoreLink: true });
  const bodyText = typeof project.detailsText === "string" ? project.detailsText.trim() : "";
  const hasContentItems = Array.isArray(project.contentItems) && project.contentItems.length > 0;
  return rows.length > 0 || Boolean(bodyText) || (!isContentNode && hasContentItems);
}

function getMeasuredProjectDetailsSize(slug) {
  if (!slug) {
    return null;
  }
  const node = nodeBySlug.get(slug);
  if (!node) {
    return null;
  }
  const details = node.querySelector(".project-details");
  if (!details) {
    return null;
  }
  const width = Number(details.offsetWidth);
  const height = Number(details.offsetHeight);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return { width, height };
}

function estimateProjectDetailsSize(project, titleWidth) {
  const isContentNode = isContentNodeProject(project);
  const rows = getProjectDetailsRows(project, { includeMoreLink: true });
  const bodyText = typeof project.detailsText === "string" ? project.detailsText.trim() : "";
  const hasContentItems = Array.isArray(project.contentItems) && project.contentItems.length > 0;
  const hasMoreButton = !isContentNode && hasContentItems;

  const rowChars = rows.length
    ? Math.max(
        ...rows.map((row) => {
          const label = String(row.label || "");
          const value = String(row.value || "");
          return `${label}: ${value}`.length;
        })
      )
    : 0;
  const minTextChars = Math.max(isContentNode ? 12 : 16, Math.ceil(titleWidth / Math.max(1, TITLE_CHAR_WIDTH)));
  let widthChars = Math.max(minTextChars, rowChars);
  if (bodyText) {
    widthChars = Math.max(widthChars, Math.min(52, Math.max(22, Math.ceil(Math.sqrt(bodyText.length)))));
  }
  if (hasMoreButton) {
    widthChars = Math.max(widthChars, 14);
  }
  const maxDetailsWidth = isContentNode ? 320 : PROJECT_DETAILS_MAX_WIDTH;
  const width = clamp(widthChars * TITLE_CHAR_WIDTH + 20, isContentNode ? 140 : 120, maxDetailsWidth);
  const charsPerLine = Math.max(10, Math.floor((width - 20) / Math.max(1, TITLE_CHAR_WIDTH)));

  const metaLines = rows.reduce((sum, row) => {
    const label = String(row.label || "");
    const value = String(row.value || "");
    const chars = `${label}: ${value}`.length;
    return sum + Math.max(1, Math.ceil(chars / charsPerLine));
  }, 0);

  let height = metaLines * 20;
  if (bodyText) {
    const bodyCharsPerLine = Math.max(18, charsPerLine);
    const bodyLines = bodyText
      .split(/\n+/)
      .map((line) => Math.max(1, Math.ceil(line.trim().length / bodyCharsPerLine)))
      .reduce((sum, lines) => sum + lines, 0);
    height += UI_TEXT_STACK_GAP + bodyLines * 20;
  }
  if (hasMoreButton) {
    height += PROJECT_DETAILS_BUTTON_GAP + PROJECT_DETAILS_BUTTON_HEIGHT;
  }

  return {
    width,
    height: Math.max(20, height)
  };
}

function createCollisionDebugTextLayer(farBox, closeBox, safePad) {
  const layer = document.createElement("div");
  layer.className = "collision-debug-text-layer";
  layer.append(
    createCollisionDebugInterpolatedBox(
      farBox.minX,
      farBox.minY,
      farBox.maxX - farBox.minX,
      farBox.maxY - farBox.minY,
      closeBox.minX,
      closeBox.minY,
      closeBox.maxX - closeBox.minX,
      closeBox.maxY - closeBox.minY
    )
  );
  if (safePad > 0) {
    layer.append(
      createCollisionDebugInterpolatedBox(
        farBox.minX - safePad,
        farBox.minY - safePad,
        farBox.maxX - farBox.minX + safePad * 2,
        farBox.maxY - farBox.minY + safePad * 2,
        closeBox.minX - safePad,
        closeBox.minY - safePad,
        closeBox.maxX - closeBox.minX + safePad * 2,
        closeBox.maxY - closeBox.minY + safePad * 2,
        true
      )
    );
  }
  return layer;
}

function createCollisionDebugMediaLayer(mediaListFar, mediaListClose, safePad) {
  const layer = document.createElement("div");
  layer.className = "collision-debug-media-layer";
  if (!Array.isArray(mediaListFar) || !mediaListFar.length) {
    return layer;
  }

  for (const [index, mediaFar] of mediaListFar.entries()) {
    const mediaClose = (Array.isArray(mediaListClose) ? mediaListClose[index] : null) || mediaFar;
    const xFar = Number(mediaFar.x) || 0;
    const yFar = Number(mediaFar.y) || 0;
    const xClose = Number(mediaClose.x) || xFar;
    const yClose = Number(mediaClose.y) || yFar;
    const w = Math.max(1, Number(mediaFar.w) || 180);
    const h = Math.max(1, Number(mediaFar.h) || 180);
    layer.append(createCollisionDebugInterpolatedBox(xFar, yFar, w, h, xClose, yClose, w, h));
    if (safePad > 0) {
      layer.append(
        createCollisionDebugInterpolatedBox(
          xFar - safePad,
          yFar - safePad,
          w + safePad * 2,
          h + safePad * 2,
          xClose - safePad,
          yClose - safePad,
          w + safePad * 2,
          h + safePad * 2,
          true
        )
      );
    }
  }

  return layer;
}

function createCollisionDebugInterpolatedBox(xFar, yFar, wFar, hFar, xClose, yClose, wClose, hClose, isSafe = false) {
  const box = document.createElement("div");
  box.className = isSafe ? "collision-debug-box is-safe is-interpolated" : "collision-debug-box is-interpolated";
  box.style.setProperty("--dbg-x-far", `${Math.round(xFar)}px`);
  box.style.setProperty("--dbg-y-far", `${Math.round(yFar)}px`);
  box.style.setProperty("--dbg-w-far", `${Math.max(1, Math.round(wFar))}px`);
  box.style.setProperty("--dbg-h-far", `${Math.max(1, Math.round(hFar))}px`);
  box.style.setProperty("--dbg-x-close", `${Math.round(xClose)}px`);
  box.style.setProperty("--dbg-y-close", `${Math.round(yClose)}px`);
  box.style.setProperty("--dbg-w-close", `${Math.max(1, Math.round(wClose))}px`);
  box.style.setProperty("--dbg-h-close", `${Math.max(1, Math.round(hClose))}px`);
  return box;
}

function createCollisionDebugBox(x, y, w, h, isSafe = false) {
  const box = document.createElement("div");
  box.className = isSafe ? "collision-debug-box is-safe" : "collision-debug-box";
  box.style.left = `${Math.round(x)}px`;
  box.style.top = `${Math.round(y)}px`;
  box.style.width = `${Math.round(w)}px`;
  box.style.height = `${Math.round(h)}px`;
  return box;
}

function syncNodeCollisionDebug(node) {
  const slug = node?.dataset?.slug;
  if (!slug) {
    return;
  }
  const model = modelBySlug.get(slug);
  if (!model?.project) {
    return;
  }
  const project = getDisplayProject(model);

  const textWrap = node.querySelector(".project-text");
  const mediaWrap = node.querySelector(".project-media-wrap");
  if (!textWrap || !mediaWrap) {
    return;
  }

  const currentTextLayer = textWrap.querySelector(".collision-debug-text-layer");
  const currentMediaLayer = mediaWrap.querySelector(".collision-debug-media-layer");
  if (!state.collisionDebug) {
    currentTextLayer?.remove();
    currentMediaLayer?.remove();
    return;
  }

  const mediaPads = getProjectMediaLayoutPads();
  if (!currentTextLayer) {
    const titleWidth = getMeasuredProjectTitleWidth(slug, project);
    const textBoxes = getProjectTextCollisionBoxes(project, titleWidth, slug);
    const textLayer = createCollisionDebugTextLayer(textBoxes.far, textBoxes.close, mediaPads.textSafePad);
    textWrap.insertBefore(textLayer, textWrap.firstChild);
  }
  if (!currentMediaLayer) {
    const mediaListFar = mediaLayoutBySlug.get(slug) || project.media || [];
    const mediaListClose = mediaLayoutCloseBySlug.get(slug) || mediaListFar;
    mediaWrap.append(createCollisionDebugMediaLayer(mediaListFar, mediaListClose, mediaPads.mediaSafePad));
  }
}

function getProjectMediaRootBox(project, titleWidthOverride = null) {
  const titleWidth =
    Number.isFinite(titleWidthOverride) && titleWidthOverride > 0 ? titleWidthOverride : getFallbackProjectTitleWidth(project);
  return getProjectTextBox(titleWidth);
}

function getProjectMediaCollisionBox(project, titleWidthOverride = null) {
  const titleWidth =
    Number.isFinite(titleWidthOverride) && titleWidthOverride > 0 ? titleWidthOverride : getFallbackProjectTitleWidth(project);

  return getProjectTextBox(titleWidth);
}

function getProjectTextCollisionBoxes(project, titleWidthOverride = null, slugForMeasure = null) {
  const titleWidth =
    Number.isFinite(titleWidthOverride) && titleWidthOverride > 0 ? titleWidthOverride : getFallbackProjectTitleWidth(project);
  const far = getProjectTextBox(titleWidth);
  const details = getProjectDetailsCollisionBox(project, titleWidth, slugForMeasure);
  const close = details ? unionBox(far, details) : far;
  return { far, close };
}

function getProjectCloseBodyTextVerticalReserve(project, titleWidth) {
  const hasMedia = Array.isArray(project?.media) && project.media.length > 0;
  if (hasMedia) {
    return 0;
  }

  const textBox = getProjectTextBox(titleWidth);
  const detailsBox = getProjectDetailsCollisionBox(project, titleWidth);
  if (!detailsBox) {
    return 0;
  }

  const overflowBelow = Math.max(0, detailsBox.maxY - textBox.maxY);
  return clamp(
    overflowBelow * PROJECT_CLOSE_BODY_TEXT_VERTICAL_RESERVE_FACTOR,
    0,
    PROJECT_CLOSE_BODY_TEXT_VERTICAL_RESERVE_MAX
  );
}

function getScaleFromTargetArea(width, height, targetArea) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const safeArea = Math.max(1, safeWidth * safeHeight);
  const desiredArea = Math.max(1, Number(targetArea) || 1);
  return Math.sqrt(desiredArea / safeArea);
}

function getViewportSafeScreenSize() {
  const rectRaw = stage.getBoundingClientRect();
  const width = rectRaw.width || state.stageWidth || window.innerWidth || 1;
  const height = rectRaw.height || state.stageHeight || window.innerHeight || 1;
  const rect =
    rectRaw.width && rectRaw.height
      ? rectRaw
      : {
          ...rectRaw,
          width,
          height,
          left: 0,
          top: 0,
          right: width,
          bottom: height
        };
  const { left, right, top, bottom } = getViewportFitPadding(rect);
  return {
    width: Math.max(120, width - left - right),
    height: Math.max(120, height - top - bottom)
  };
}

function getDeepModeMaxMediaScreenScale() {
  const deepScale = getDeepModeMediaScaleAtZoom(DEEP_MODE_MAX_ZOOM);
  return Math.max(0.0001, deepScale * DEEP_MODE_MAX_ZOOM);
}

function getContentImageScreenWidthByViewportRules(aspect) {
  const safeAspect = Math.max(0.05, Math.min(20, Number(aspect) || 1));
  let safeScreen = getViewportSafeScreenSize();
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || safeScreen.width;
  const isMobileViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
  if (isMobileViewport) {
    const width = state.stageWidth || stage.clientWidth || window.innerWidth || safeScreen.width;
    const height = state.stageHeight || stage.clientHeight || window.innerHeight || safeScreen.height;
    const sidePad = 30;
    const topPad = clamp(height * 0.05, 18, 40);
    const bottomPad = clamp(height * 0.09, 40, 88);
    safeScreen = {
      width: Math.max(120, width - sidePad * 2),
      height: Math.max(120, height - topPad - bottomPad)
    };
  }
  const targetAreaShare = isMobileViewport ? CONTENT_IMAGE_TARGET_AREA_SHARE_MOBILE : CONTENT_IMAGE_TARGET_AREA_SHARE;
  const maxWidthShare = isMobileViewport ? CONTENT_IMAGE_MAX_WIDTH_SHARE_MOBILE : CONTENT_IMAGE_MAX_WIDTH_SHARE;
  const maxHeightShare = isMobileViewport ? CONTENT_IMAGE_MAX_HEIGHT_SHARE_MOBILE : CONTENT_IMAGE_MAX_HEIGHT_SHARE;
  const minWidthShare = isMobileViewport ? CONTENT_IMAGE_MIN_WIDTH_SHARE_MOBILE : CONTENT_IMAGE_MIN_WIDTH_SHARE;
  const targetArea = safeScreen.width * safeScreen.height * targetAreaShare;
  const widthByArea = Math.sqrt(targetArea * safeAspect);
  const maxWidth = Math.max(120, safeScreen.width * maxWidthShare);
  const maxHeight = Math.max(120, safeScreen.height * maxHeightShare);
  const widthByHeight = maxHeight * safeAspect;
  const minWidth = Math.max(72, safeScreen.width * minWidthShare);
  const maxAllowedWidth = Math.max(minWidth, Math.min(maxWidth, widthByHeight));
  return clamp(widthByArea, minWidth, maxAllowedWidth);
}

function resolveMediaScaleByBounds(
  longSide,
  shortSide,
  preferredScale,
  { minLong = 0, maxLong = Number.POSITIVE_INFINITY, minShort = 0, maxShort = Number.POSITIVE_INFINITY } = {}
) {
  const safeLong = Math.max(1, Number(longSide) || 1);
  const safeShort = Math.max(1, Number(shortSide) || 1);
  const preferred = Math.max(0.0001, Number(preferredScale) || 0.0001);

  const minScaleLong = minLong > 0 ? minLong / safeLong : 0;
  const minScaleShort = minShort > 0 ? minShort / safeShort : 0;
  const maxScaleLong = Number.isFinite(maxLong) ? maxLong / safeLong : Number.POSITIVE_INFINITY;
  const maxScaleShort = Number.isFinite(maxShort) ? maxShort / safeShort : Number.POSITIVE_INFINITY;

  const minScale = Math.max(0.0001, minScaleLong, minScaleShort);
  const maxScale = Math.max(0.0001, Math.min(maxScaleLong, maxScaleShort));

  if (minScale <= maxScale) {
    return clamp(preferred, minScale, maxScale);
  }
  // Infeasible limits (e.g., ultra-wide panoramas): respect maximum bounds to avoid giant outliers.
  return clamp(preferred, 0.0001, maxScale);
}

function getDeclaredMediaScale(sizeValue) {
  const raw = String(sizeValue || "").trim().toLowerCase();
  if (!raw) {
    return 1;
  }

  const numeric = Number.parseFloat(raw);
  if (Number.isFinite(numeric) && numeric > 0) {
    return clamp(numeric, 0.2, 3);
  }

  const preset = new Map([
    ["xs", 0.55],
    ["xsmall", 0.55],
    ["s", 0.72],
    ["small", 0.72],
    ["m", 1],
    ["medium", 1],
    ["l", 1.18],
    ["large", 1.18],
    ["xl", 1.36],
    ["xlarge", 1.36]
  ]);

  return preset.get(raw) || 1;
}

function getMediaDimensionsForLayout(width, height, role = "", src = "", size = "") {
  const safeWidth = Math.max(1, Number(width) || 180);
  const safeHeight = Math.max(1, Number(height) || 180);
  const longSide = Math.max(safeWidth, safeHeight);
  const shortSide = Math.min(safeWidth, safeHeight);
  const stubMedia = { role, src };
  const isLogo = isLogoMedia(stubMedia, safeWidth, safeHeight);
  const targetArea = isLogo ? ROOT_MEDIA_LOGO_TARGET_AREA : ROOT_MEDIA_TARGET_AREA;
  let scale = getScaleFromTargetArea(safeWidth, safeHeight, targetArea);
  scale = resolveMediaScaleByBounds(longSide, shortSide, scale, {
    minLong: isLogo ? ROOT_MEDIA_LOGO_MIN_LONG : ROOT_MEDIA_MIN_LONG,
    maxLong: isLogo ? ROOT_MEDIA_LOGO_MAX_LONG : ROOT_MEDIA_MAX_LONG,
    minShort: isLogo ? ROOT_MEDIA_LOGO_MIN_SHORT : ROOT_MEDIA_MIN_SHORT,
    maxShort: isLogo ? ROOT_MEDIA_LOGO_MAX_SHORT : ROOT_MEDIA_MAX_SHORT
  });
  scale *= getDeclaredMediaScale(size);

  return {
    w: Math.round(safeWidth * scale),
    h: Math.round(safeHeight * scale)
  };
}

function getContentMediaDimensionsForLayout(width, height, role = "", src = "", size = "", noteData = null) {
  const safeWidth = Math.max(1, Number(width) || 180);
  const safeHeight = Math.max(1, Number(height) || 180);
  const aspect = safeWidth / safeHeight;
  const imageWidthScreen = getContentImageScreenWidthByViewportRules(aspect);
  const maxMediaScreenScale = getDeepModeMaxMediaScreenScale();
  let scale = (imageWidthScreen / maxMediaScreenScale) / safeWidth;
  scale *= CONTENT_MEDIA_GLOBAL_SCALE_BOOST;
  scale *= getDeclaredMediaScale(size);
  return {
    w: Math.round(safeWidth * scale),
    h: Math.round(safeHeight * scale)
  };
}

function normalizeMediaSize(media) {
  const known = getKnownMediaDimensionsBySrc(media.src);
  const width = Math.max(1, Number(known?.w) || 180);
  const height = Math.max(1, Number(known?.h) || 180);
  const normalized = getMediaDimensionsForLayout(width, height, media.role, media.src, media.size);
  media.w = normalized.w;
  media.h = normalized.h;
}

function normalizeContentMediaSize(media, noteData = null) {
  const known = getKnownMediaDimensionsBySrc(media.src);
  const width = Math.max(1, Number(known?.w) || 180);
  const height = Math.max(1, Number(known?.h) || 180);
  const normalized = getContentMediaDimensionsForLayout(width, height, media.role, media.src, media.size, noteData);
  media.w = normalized.w;
  media.h = normalized.h;
}

function normalizeAutoMediaSize(media, baseHeight) {
  const width = Math.max(1, Number(media.w) || 180);
  const height = Math.max(1, Number(media.h) || 180);
  const aspect = width / height;
  const fixedH = Math.max(84, baseHeight);
  const isLogo = isLogoMedia(media, width, height);
  let fixedW = fixedH * aspect;

  // Treat every media as a compact node (logos included), not as infinitely wide strips.
  if (isLogo) {
    fixedW = clamp(fixedW, fixedH * 0.95, fixedH * 1.2);
  } else {
    fixedW = clamp(fixedW, fixedH * 0.74, fixedH * 1.26);
  }

  media.w = Math.round(fixedW);
  media.h = Math.round(fixedH);
}

function isLogoMedia(media, width, height) {
  if (media.role === "logo") {
    return true;
  }
  return false;
}

function pushMediaOutsideBox(media, box, gap) {
  const expanded = {
    minX: box.minX - gap,
    maxX: box.maxX + gap,
    minY: box.minY - gap,
    maxY: box.maxY + gap
  };

  let rect = getMediaRect(media);
  const overlapX = Math.min(rect.maxX, expanded.maxX) - Math.max(rect.minX, expanded.minX);
  const overlapY = Math.min(rect.maxY, expanded.maxY) - Math.max(rect.minY, expanded.minY);
  if (overlapX <= 0 || overlapY <= 0) {
    return;
  }

  const rectCenterX = (rect.minX + rect.maxX) * 0.5;
  const rectCenterY = (rect.minY + rect.maxY) * 0.5;
  const boxCenterX = (expanded.minX + expanded.maxX) * 0.5;
  const boxCenterY = (expanded.minY + expanded.maxY) * 0.5;
  let dx = rectCenterX - boxCenterX;
  let dy = rectCenterY - boxCenterY;
  if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
    dx = 1;
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    const deltaX = dx >= 0 ? expanded.maxX - rect.minX : expanded.minX - rect.maxX;
    media.x = (media.x || 0) + deltaX;
  } else {
    const deltaY = dy >= 0 ? expanded.maxY - rect.minY : expanded.minY - rect.maxY;
    media.y = (media.y || 0) + deltaY;
  }
}

function pushMediaOutsideBoxAtScale(media, box, gap, scale, originX, originY) {
  const safeScale = Math.max(0.0001, Number(scale) || 1);
  if (Math.abs(safeScale - 1) < 0.0001) {
    const beforeX = media.x || 0;
    const beforeY = media.y || 0;
    pushMediaOutsideBox(media, box, gap);
    return Math.abs((media.x || 0) - beforeX) > 0.001 || Math.abs((media.y || 0) - beforeY) > 0.001;
  }

  const expanded = {
    minX: box.minX - gap,
    maxX: box.maxX + gap,
    minY: box.minY - gap,
    maxY: box.maxY + gap
  };

  const rect = getMediaRect(media);
  const scaled = {
    minX: originX + (rect.minX - originX) * safeScale,
    maxX: originX + (rect.maxX - originX) * safeScale,
    minY: originY + (rect.minY - originY) * safeScale,
    maxY: originY + (rect.maxY - originY) * safeScale
  };

  const overlapX = Math.min(scaled.maxX, expanded.maxX) - Math.max(scaled.minX, expanded.minX);
  const overlapY = Math.min(scaled.maxY, expanded.maxY) - Math.max(scaled.minY, expanded.minY);
  if (overlapX <= 0 || overlapY <= 0) {
    return false;
  }

  const rectCenterX = (scaled.minX + scaled.maxX) * 0.5;
  const rectCenterY = (scaled.minY + scaled.maxY) * 0.5;
  const boxCenterX = (expanded.minX + expanded.maxX) * 0.5;
  const boxCenterY = (expanded.minY + expanded.maxY) * 0.5;
  let dx = rectCenterX - boxCenterX;
  let dy = rectCenterY - boxCenterY;
  if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
    dx = 1;
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    const deltaFarX = dx >= 0 ? expanded.maxX - scaled.minX : expanded.minX - scaled.maxX;
    media.x = (media.x || 0) + deltaFarX / safeScale;
  } else {
    const deltaFarY = dy >= 0 ? expanded.maxY - scaled.minY : expanded.minY - scaled.maxY;
    media.y = (media.y || 0) + deltaFarY / safeScale;
  }
  return true;
}

function getMediaBoundsBox(items) {
  if (!items.length) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const media of items) {
    const rect = getMediaRect(media);
    minX = Math.min(minX, rect.minX);
    maxX = Math.max(maxX, rect.maxX);
    minY = Math.min(minY, rect.minY);
    maxY = Math.max(maxY, rect.maxY);
  }
  return { minX, maxX, minY, maxY };
}

function enforceFarScaleTextSeparation(items, box, gap, scale, passes = 2) {
  if (!items.length) {
    return;
  }

  for (let pass = 0; pass < passes; pass += 1) {
    const bounds = getMediaBoundsBox(items);
    if (!bounds) {
      return;
    }
    const originX = (bounds.minX + bounds.maxX) * 0.5;
    const originY = (bounds.minY + bounds.maxY) * 0.5;
    let moved = false;
    for (const media of items) {
      moved = pushMediaOutsideBoxAtScale(media, box, gap, scale, originX, originY) || moved;
    }
    if (!moved) {
      break;
    }
  }
}

function resolveMediaPairOverlaps(items, gap = 8, passes = 10) {
  if (items.length < 2) {
    return;
  }

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (let i = 0; i < items.length; i += 1) {
      const a = items[i];
      for (let j = i + 1; j < items.length; j += 1) {
        const b = items[j];
        const ra = inflateRect(getMediaRect(a), gap);
        const rb = inflateRect(getMediaRect(b), gap);
        const overlapX = Math.min(ra.maxX, rb.maxX) - Math.max(ra.minX, rb.minX);
        const overlapY = Math.min(ra.maxY, rb.maxY) - Math.max(ra.minY, rb.minY);
        if (overlapX <= 0 || overlapY <= 0) {
          continue;
        }

        let dx = getMediaCenterX(b) - getMediaCenterX(a);
        let dy = getMediaCenterY(b) - getMediaCenterY(a);
        if (Math.hypot(dx, dy) < 0.0001) {
          dx = i % 2 === 0 ? 1 : -1;
          dy = j % 2 === 0 ? 1 : -1;
        }

        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const push = Math.min(Math.max(overlapX, overlapY) * 0.56, 26);
        a.x = (a.x || 0) - ux * push * 0.5;
        a.y = (a.y || 0) - uy * push * 0.5;
        b.x = (b.x || 0) + ux * push * 0.5;
        b.y = (b.y || 0) + uy * push * 0.5;
        moved = true;
      }
    }
    if (!moved) {
      break;
    }
  }
}

function layoutMediaClusterAuto(items, mediaCollisionBox, rootBox, slug, mediaPads) {
  const baseHeight = getAutoMediaBaseHeight(items.length);
  for (const media of items) {
    normalizeAutoMediaSize(media, baseHeight);
    media._kind = classifyAutoMediaKind(media);
    media._priority = getAutoMediaPriority(media);
  }

  const rootNode = createRootClusterNode(rootBox);
  const placedNodes = [rootNode];
  const mediaNodes = [];
  const sorted = [...items].sort((a, b) => b._priority - a._priority);

  for (let i = 0; i < sorted.length; i += 1) {
    const media = sorted[i];
    const node = {
      id: `m-${i}`,
      media,
      x: 0,
      y: 0,
      w: media.w,
      h: media.h,
      level: 1,
      children: 0,
      usedSlots: new Set(),
      attachedFrom: null
    };

    const parent = chooseMediaParentNode(placedNodes, node, i, rootNode);
    const slot = chooseMediaAttachSlot(parent, node, placedNodes, rootNode, slug, i);
    placeNodeBySlot(parent, node, slot, AUTO_MEDIA_GAP);
    node.level = parent.level + 1;
    node.parentId = parent.id;
    node.attachedFrom = slot;
    parent.children += 1;
    parent.usedSlots.add(slot);
    mediaNodes.push(node);
    placedNodes.push(node);
  }

  rebalanceMediaCluster(mediaNodes, rootNode);
  relaxMediaCluster(placedNodes, rootNode);

  // Map back to source order and keep content outside compact project text safe box.
  const bySourceIndex = new Map();
  for (const node of mediaNodes) {
    const result = {
      ...node.media,
      x: Math.round(node.x),
      y: Math.round(node.y),
      w: Math.round(node.w),
      h: Math.round(node.h)
    };
    pushMediaOutsideBox(result, mediaCollisionBox, mediaPads.textSafePad);
    bySourceIndex.set(result._index, result);
  }

  const ordered = [...bySourceIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map((entry) => entry[1]);

  for (let pass = 0; pass < 3; pass += 1) {
    resolveMediaPairOverlaps(ordered, mediaPads.mediaSafePad, 8);
    for (const media of ordered) {
      pushMediaOutsideBox(media, mediaCollisionBox, mediaPads.textSafePad);
    }
    enforceFarScaleTextSeparation(ordered, mediaCollisionBox, mediaPads.textSafePad, FAR_MEDIA_SCALE, 1);
  }

  return ordered;
}

function getAutoMediaBaseHeight(count) {
  void count;
  return AUTO_MEDIA_BASE_HEIGHT;
}

function createRootClusterNode(textBox) {
  return {
    id: "root",
    x: textBox.minX,
    y: textBox.minY,
    w: Math.max(1, textBox.maxX - textBox.minX),
    h: Math.max(1, textBox.maxY - textBox.minY),
    level: 0,
    children: 0,
    usedSlots: new Set()
  };
}

function classifyAutoMediaKind(media) {
  const width = Math.max(1, Number(media.w) || 180);
  const height = Math.max(1, Number(media.h) || 180);
  const aspect = width / height;
  if (isLogoMedia(media, width, height)) {
    return "logo";
  }
  if (aspect >= 1.45) {
    return "wide";
  }
  if (aspect <= 0.78) {
    return "tall";
  }
  return "default";
}

function getAutoMediaPriority(media) {
  const area = Math.max(1, Number(media.w) || 180) * Math.max(1, Number(media.h) || 180);
  if (media._kind === "logo") {
    return area * 1.08;
  }
  if (media._kind === "tall") {
    return area * 1.04;
  }
  return area;
}

function chooseMediaParentNode(placedNodes, node, index, rootNode) {
  if (index < AUTO_MEDIA_ROOT_CHILD_LIMIT && rootNode.children < AUTO_MEDIA_ROOT_CHILD_LIMIT) {
    return rootNode;
  }

  let best = rootNode;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const candidate of placedNodes) {
    if (candidate.level >= AUTO_MEDIA_MAX_LEVEL) {
      continue;
    }
    const childLimit = candidate.level === 0 ? AUTO_MEDIA_ROOT_CHILD_LIMIT : AUTO_MEDIA_NODE_CHILD_LIMIT;
    if (candidate.children >= childLimit) {
      continue;
    }

    const candidateCenter = getNodeCenter(candidate);
    const rootCenter = getNodeCenter(rootNode);
    const distFromRoot = Math.hypot(candidateCenter.x - rootCenter.x, candidateCenter.y - rootCenter.y);
    const score = candidate.level * 80 + candidate.children * 36 + distFromRoot * 0.035;
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

function chooseMediaAttachSlot(parent, node, nodes, rootNode, slug, index) {
  const candidateSlots = parent.level === 0 ? getRootPreferredSlots(node, parent, slug, index) : getChildPreferredSlots(parent, node);
  let bestSlot = candidateSlots[0];
  let bestScore = Number.POSITIVE_INFINITY;
  const rootCenter = getNodeCenter(rootNode);
  const parentCenter = getNodeCenter(parent);

  for (const slot of candidateSlots) {
    const trialRect = getPlacedRectBySlot(parent, node, slot, AUTO_MEDIA_GAP);
    const trialCenter = getRectCenter(trialRect);
    let score = 0;

    if (parent.usedSlots.has(slot)) {
      score += 220;
    }

    if (parent.attachedFrom && slot === getOppositeSlot(parent.attachedFrom)) {
      score += 42;
    }
    if (parent.attachedFrom && slot === parent.attachedFrom) {
      score -= 12;
    }

    if (node.media._kind === "wide" && (slot === "left" || slot === "right")) {
      score += 20;
    }
    if (node.media._kind === "tall" && (slot === "top" || slot === "bottom")) {
      score += 20;
    }

    score += computeNodeOverlapPenalty(trialRect, nodes);

    const outward = Math.hypot(trialCenter.x - rootCenter.x, trialCenter.y - rootCenter.y);
    score += outward * 0.075;

    const fromParent = Math.hypot(trialCenter.x - parentCenter.x, trialCenter.y - parentCenter.y);
    score += fromParent * 0.02;

    if (score < bestScore) {
      bestScore = score;
      bestSlot = slot;
    }
  }
  return bestSlot;
}

function getRotatedSlots(seed, index) {
  const slots = ["right", "left", "bottom", "top"];
  const rotation = (hashString(`${seed}:${index}`) >>> 0) % slots.length;
  const rotated = [];
  for (let i = 0; i < slots.length; i += 1) {
    rotated.push(slots[(i + rotation) % slots.length]);
  }
  return rotated;
}

function getRootPreferredSlots(node, parent, slug, index) {
  const slots = getRotatedSlots(slug, index);
  if (node.media._kind === "logo") {
    return prioritizeSlots(slots, ["top", "left", "bottom"], parent).filter((slot) => slot !== "right");
  }
  if (node.media._kind === "tall") {
    return prioritizeSlots(slots, ["left", "bottom", "top"], parent).filter((slot) => slot !== "right");
  }
  if (node.media._kind === "wide") {
    return prioritizeSlots(slots, ["bottom", "left", "top"], parent).filter((slot) => slot !== "right");
  }
  return prioritizeSlots(slots, ["left", "bottom", "top"], parent).filter((slot) => slot !== "right");
}

function getChildPreferredSlots(parent, node) {
  const outward = parent.attachedFrom || "right";
  if (node.media._kind === "logo") {
    return [outward, "top", "right", "left", "bottom"];
  }
  if (node.media._kind === "tall") {
    return [outward, "left", "right", "bottom", "top"];
  }
  return [outward, "bottom", "left", "right", "top"];
}

function prioritizeSlots(rotated, preferred, parent) {
  const order = [];
  for (const slot of preferred) {
    if (rotated.includes(slot) && !order.includes(slot)) {
      order.push(slot);
    }
  }
  for (const slot of rotated) {
    if (!order.includes(slot)) {
      order.push(slot);
    }
  }
  // Avoid immediate reuse when root still has free sides.
  return order.sort((a, b) => Number(parent.usedSlots.has(a)) - Number(parent.usedSlots.has(b)));
}

function getOppositeSlot(slot) {
  if (slot === "right") {
    return "left";
  }
  if (slot === "left") {
    return "right";
  }
  if (slot === "top") {
    return "bottom";
  }
  return "top";
}

function placeNodeBySlot(parent, node, slot, gap) {
  const rect = getPlacedRectBySlot(parent, node, slot, gap);
  node.x = rect.x;
  node.y = rect.y;
}

function getPlacedRectBySlot(parent, node, slot, gap) {
  if (slot === "right") {
    return {
      x: parent.x + parent.w + gap,
      y: parent.y + (parent.h - node.h) * 0.5,
      w: node.w,
      h: node.h
    };
  }
  if (slot === "left") {
    return {
      x: parent.x - node.w - gap,
      y: parent.y + (parent.h - node.h) * 0.5,
      w: node.w,
      h: node.h
    };
  }
  if (slot === "top") {
    return {
      x: parent.x + (parent.w - node.w) * 0.5,
      y: parent.y - node.h - gap,
      w: node.w,
      h: node.h
    };
  }
  return {
    x: parent.x + (parent.w - node.w) * 0.5,
    y: parent.y + parent.h + gap,
    w: node.w,
    h: node.h
  };
}

function computeNodeOverlapPenalty(rect, nodes) {
  let penalty = 0;
  const test = inflateRect(
    { minX: rect.x, maxX: rect.x + rect.w, minY: rect.y, maxY: rect.y + rect.h },
    AUTO_MEDIA_SAFE_PAD
  );
  for (const node of nodes) {
    const existing = inflateRect(
      { minX: node.x, maxX: node.x + node.w, minY: node.y, maxY: node.y + node.h },
      AUTO_MEDIA_SAFE_PAD
    );
    const overlapX = Math.min(test.maxX, existing.maxX) - Math.max(test.minX, existing.minX);
    const overlapY = Math.min(test.maxY, existing.maxY) - Math.max(test.minY, existing.minY);
    if (overlapX > 0 && overlapY > 0) {
      penalty += overlapX * overlapY * 0.08 + 170;
    }
  }
  return penalty;
}

function rebalanceMediaCluster(mediaNodes, rootNode) {
  if (!mediaNodes.length) {
    return;
  }
  const rootCenter = getNodeCenter(rootNode);
  const bounds = mediaNodes.reduce(
    (acc, node) => {
      acc.minX = Math.min(acc.minX, node.x);
      acc.maxX = Math.max(acc.maxX, node.x + node.w);
      acc.minY = Math.min(acc.minY, node.y);
      acc.maxY = Math.max(acc.maxY, node.y + node.h);
      return acc;
    },
    { minX: Number.POSITIVE_INFINITY, maxX: Number.NEGATIVE_INFINITY, minY: Number.POSITIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY }
  );
  const mediaCenter = { x: (bounds.minX + bounds.maxX) * 0.5, y: (bounds.minY + bounds.maxY) * 0.5 };
  const shiftX = (rootCenter.x - mediaCenter.x) * 0.74;
  const shiftY = (rootCenter.y - mediaCenter.y) * 0.66;
  for (const node of mediaNodes) {
    node.x += shiftX;
    node.y += shiftY;
  }
}

function relaxMediaCluster(nodes, rootNode) {
  if (nodes.length < 3) {
    return;
  }

  for (let pass = 0; pass < 28; pass += 1) {
    let moved = false;
    for (let i = 1; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const push = resolveNodePairOverlap(a, b, AUTO_MEDIA_SAFE_PAD);
        moved = moved || push;
      }
      // root node is fixed; keep children outside root safe box.
      const pushedFromRoot = resolveNodeRootOverlap(a, rootNode, AUTO_MEDIA_SAFE_PAD);
      moved = moved || pushedFromRoot;
    }

    if (!moved && pass > 8) {
      break;
    }
  }
}

function resolveNodePairOverlap(a, b, pad) {
  const ra = inflateRect({ minX: a.x, maxX: a.x + a.w, minY: a.y, maxY: a.y + a.h }, pad);
  const rb = inflateRect({ minX: b.x, maxX: b.x + b.w, minY: b.y, maxY: b.y + b.h }, pad);
  const overlapX = Math.min(ra.maxX, rb.maxX) - Math.max(ra.minX, rb.minX);
  const overlapY = Math.min(ra.maxY, rb.maxY) - Math.max(ra.minY, rb.minY);
  if (overlapX <= 0 || overlapY <= 0) {
    return false;
  }

  let dx = getNodeCenterX(b) - getNodeCenterX(a);
  let dy = getNodeCenterY(b) - getNodeCenterY(a);
  if (Math.hypot(dx, dy) < 0.0001) {
    dx = 1;
    dy = 0;
  }
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const push = Math.min(Math.max(overlapX, overlapY) * 0.62, 24);
  a.x -= ux * push * 0.5;
  a.y -= uy * push * 0.5;
  b.x += ux * push * 0.5;
  b.y += uy * push * 0.5;
  return true;
}

function resolveNodeRootOverlap(node, rootNode, pad) {
  const rn = inflateRect({ minX: node.x, maxX: node.x + node.w, minY: node.y, maxY: node.y + node.h }, pad);
  const rr = inflateRect(
    { minX: rootNode.x, maxX: rootNode.x + rootNode.w, minY: rootNode.y, maxY: rootNode.y + rootNode.h },
    pad
  );
  const overlapX = Math.min(rn.maxX, rr.maxX) - Math.max(rn.minX, rr.minX);
  const overlapY = Math.min(rn.maxY, rr.maxY) - Math.max(rn.minY, rr.minY);
  if (overlapX <= 0 || overlapY <= 0) {
    return false;
  }

  let dx = getNodeCenterX(node) - getNodeCenterX(rootNode);
  let dy = getNodeCenterY(node) - getNodeCenterY(rootNode);
  if (Math.hypot(dx, dy) < 0.0001) {
    dx = 1;
    dy = 0;
  }
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const push = Math.min(Math.max(overlapX, overlapY) * 0.72, 26);
  node.x += ux * push;
  node.y += uy * push;
  return true;
}

function getNodeCenter(node) {
  return { x: getNodeCenterX(node), y: getNodeCenterY(node) };
}

function getNodeCenterX(node) {
  return node.x + node.w * 0.5;
}

function getNodeCenterY(node) {
  return node.y + node.h * 0.5;
}

function getRectCenter(rect) {
  return { x: rect.x + rect.w * 0.5, y: rect.y + rect.h * 0.5 };
}

function getMediaRect(media) {
  const x = Number(media.x) || 0;
  const y = Number(media.y) || 0;
  const w = Math.max(1, Number(media.w) || 180);
  const h = Math.max(1, Number(media.h) || 180);
  return {
    minX: x,
    maxX: x + w,
    minY: y,
    maxY: y + h
  };
}

function inflateRect(rect, gap) {
  return {
    minX: rect.minX - gap,
    maxX: rect.maxX + gap,
    minY: rect.minY - gap,
    maxY: rect.maxY + gap
  };
}

function getMediaCenterX(media) {
  return (Number(media.x) || 0) + Math.max(1, Number(media.w) || 180) * 0.5;
}

function getMediaCenterY(media) {
  return (Number(media.y) || 0) + Math.max(1, Number(media.h) || 180) * 0.5;
}

function buildFilters() {
  const filterTypes = Array.isArray(state.filterTypes) && state.filterTypes.length
    ? state.filterTypes
    : DEFAULT_MENU_FILTER_TYPES;
  filtersEl.textContent = "";
  const maxIndex = Math.max(1, filterTypes.length - 1);
  for (const [index, type] of filterTypes.entries()) {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.type = "button";
    btn.dataset.type = type;
    btn.setAttribute("aria-label", type);
    const label = document.createElement("span");
    label.className = "filter-btn-label";
    label.textContent = type;
    btn.append(label);
    btn.style.setProperty("--menu-ratio", `${index / maxIndex}`);
    btn.addEventListener("click", () => {
      if (state.activeType === type) {
        applyFilter("all", true, false);
        return;
      }
      applyFilter(type, true, false);
    });
    filtersEl.append(btn);
  }
}

function shouldEnableMobileEdgeGestureGuard() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const touchCapable = (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) || "ontouchstart" in window;
  return touchCapable && viewportWidth <= MOBILE_TITLE_BREAKPOINT;
}

function isInMobileEdgeGestureZone(clientX) {
  if (!shouldEnableMobileEdgeGestureGuard()) {
    return false;
  }
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  if (!Number.isFinite(clientX) || viewportWidth <= 0) {
    return false;
  }
  return clientX <= MOBILE_EDGE_GESTURE_GUARD_PX;
}

function onTouchStartEdgeGestureGuard(event) {
  if (!shouldEnableMobileEdgeGestureGuard()) {
    edgeSwipeGuardTouchId = null;
    return;
  }
  if (!event.touches || event.touches.length !== 1) {
    edgeSwipeGuardTouchId = null;
    return;
  }
  const touch = event.touches[0];
  if (!touch || !isInMobileEdgeGestureZone(touch.clientX)) {
    edgeSwipeGuardTouchId = null;
    return;
  }
  edgeSwipeGuardTouchId = touch.identifier;
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
}

function onTouchMoveEdgeGestureGuard(event) {
  if (edgeSwipeGuardTouchId == null) {
    return;
  }
  if (!event.touches || event.touches.length !== 1) {
    edgeSwipeGuardTouchId = null;
    return;
  }
  const activeTouch = [...event.touches].find((touch) => touch.identifier === edgeSwipeGuardTouchId);
  if (!activeTouch) {
    return;
  }
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
}

function onTouchEndEdgeGestureGuard(event) {
  if (edgeSwipeGuardTouchId == null) {
    return;
  }
  const ended = [...event.changedTouches].some((touch) => touch.identifier === edgeSwipeGuardTouchId);
  if (ended) {
    edgeSwipeGuardTouchId = null;
  }
}

function onPointerDownEdgeGestureGuard(event) {
  if (!shouldEnableMobileEdgeGestureGuard() || event.pointerType !== "touch") {
    edgeSwipeGuardPointerId = null;
    return;
  }
  if (!isInMobileEdgeGestureZone(event.clientX)) {
    edgeSwipeGuardPointerId = null;
    return;
  }
  edgeSwipeGuardPointerId = event.pointerId;
  state.suppressClickUntil = performance.now() + 220;
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
}

function onPointerMoveEdgeGestureGuard(event) {
  if (edgeSwipeGuardPointerId == null || event.pointerId !== edgeSwipeGuardPointerId) {
    return;
  }
  if (event.pointerType !== "touch") {
    edgeSwipeGuardPointerId = null;
    return;
  }
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
}

function onPointerUpEdgeGestureGuard(event) {
  if (edgeSwipeGuardPointerId == null || event.pointerId !== edgeSwipeGuardPointerId) {
    return;
  }
  edgeSwipeGuardPointerId = null;
}

function preventBrowserGestureZoom(event) {
  if (!event) {
    return;
  }
  if (event.cancelable) {
    event.preventDefault();
  }
}

function preventBrowserPinchZoomOnTouchMove(event) {
  if (!event || !event.touches || event.touches.length < 2) {
    return;
  }
  if (event.cancelable) {
    event.preventDefault();
  }
}

function bindEvents() {
  stage.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("touchstart", onTouchStartEdgeGestureGuard, { passive: false, capture: true });
  document.addEventListener("touchmove", onTouchMoveEdgeGestureGuard, { passive: false, capture: true });
  document.addEventListener("touchmove", preventBrowserPinchZoomOnTouchMove, { passive: false, capture: true });
  document.addEventListener("touchend", onTouchEndEdgeGestureGuard, { passive: false, capture: true });
  document.addEventListener("touchcancel", onTouchEndEdgeGestureGuard, { passive: false, capture: true });
  document.addEventListener("pointerdown", onPointerDownEdgeGestureGuard, { capture: true });
  document.addEventListener("pointermove", onPointerMoveEdgeGestureGuard, { capture: true });
  document.addEventListener("pointerup", onPointerUpEdgeGestureGuard, { capture: true });
  document.addEventListener("pointercancel", onPointerUpEdgeGestureGuard, { capture: true });
  document.addEventListener("gesturestart", preventBrowserGestureZoom, { passive: false, capture: true });
  document.addEventListener("gesturechange", preventBrowserGestureZoom, { passive: false, capture: true });
  document.addEventListener("gestureend", preventBrowserGestureZoom, { passive: false, capture: true });
  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);
  filtersEl.addEventListener("click", onFiltersClick);
  if (collisionToggleBtn) {
    collisionToggleBtn.addEventListener("click", () => {
      setCollisionDebug(!state.collisionDebug);
    });
  }
  if (deepProjectBackBtn) {
    deepProjectBackBtn.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    deepProjectBackBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDeepProject(null, { animate: true });
    });
  }
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.headModalOpen) {
      setHeadModalOpen(false);
      return;
    }
    if (event.key === "Escape" && state.deepProjectSlug) {
      setDeepProject(null, { animate: true });
    }
  });
  window.addEventListener("hashchange", () => {
    applyProjectGraphLocation({ animate: true });
  });
  window.addEventListener("popstate", () => {
    applyProjectGraphLocation({ animate: true });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearPromotedDeepMediaElement();
      demoteConnectedDeepMediaToLightweight();
      clearRuntimeImageObjectUrls();
      clearCleanedBlackMatteProxyCache();
      runtimeMediaSizeByKey.clear();
      worldCssVarCache.clear();
      return;
    }
    wakeGraph(8);
    scheduleMainFrame();
  });
  window.addEventListener("pagehide", () => {
    clearPromotedDeepMediaElement();
    demoteConnectedDeepMediaToLightweight();
    clearRuntimeImageObjectUrls();
    clearCleanedBlackMatteProxyCache();
    runtimeMediaSizeByKey.clear();
    worldCssVarCache.clear();
  });

  const handleViewportResize = () => {
    edgeSwipeGuardTouchId = null;
    edgeSwipeGuardPointerId = null;
    const overviewHome = getActiveOverviewHome();
    const wasOverviewFit = state.targetZoom <= overviewHome.zoom * HOME_LOCK_ZOOM_FACTOR;
    const deepModeActive = Boolean(state.deepProjectSlug);
    const hasFocusedProject = Boolean(state.focusedSlug && modelBySlug.get(state.focusedSlug)?.visible);
    const shouldRefitFiltered =
      state.activeType !== "all" &&
      !hasFocusedProject &&
      state.targetZoom <= clamp(overviewHome.zoom * HOME_LOCK_ZOOM_FACTOR, MIN_ZOOM, 1.08);

    updateViewportSize();
    resizeHeadRendererToHost(true);
    refreshMediaLayoutsFromDOM();
    refreshModelGeometriesFromDOM();
    clearDeepProjectLayoutCache();
    if (state.activeType === "physical") {
      applyPhysicalFilterAnchors(capturePhysicalFilterAnchors());
    }
    if (deepModeActive && state.deepProjectSlug) {
      renderDeepProjectInfo(state.deepProjectSlug);
      relayoutDeepProjectContent(state.deepProjectSlug);
      refreshModelVisibility(state.activeType);
      fitDeepProjectView(false);
      return;
    }
    fitHomeView();

    if (hasFocusedProject) {
      recenterFocusedProjectAtCurrentZoom(true);
      return;
    }

    if (state.activeType === "all") {
      if (wasOverviewFit) {
        state.viewX = state.homeX;
        state.viewY = state.homeY;
        state.viewZoom = state.homeZoom;
        setTargetView(state.homeX, state.homeY, state.homeZoom);
      }
      return;
    }

    if (shouldRefitFiltered) {
      fitVisibleProjects(false);
    } else if (wasOverviewFit) {
      state.viewX = state.filterHomeX;
      state.viewY = state.filterHomeY;
      state.viewZoom = state.filterHomeZoom;
      setTargetView(state.filterHomeX, state.filterHomeY, state.filterHomeZoom);
    }

  };

  window.addEventListener("resize", handleViewportResize);
}

function isExternalUrl(url) {
  return /^(https?:)?\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:");
}

function setCollisionDebug(enabled) {
  state.collisionDebug = Boolean(enabled);
  stage.classList.toggle("show-collision-debug", state.collisionDebug);
  for (const node of nodeBySlug.values()) {
    syncNodeCollisionDebug(node);
  }
  if (!collisionToggleBtn) {
    return;
  }
  collisionToggleBtn.textContent = `collision: ${state.collisionDebug ? "on" : "off"}`;
  collisionToggleBtn.classList.toggle("is-on", state.collisionDebug);
  collisionToggleBtn.setAttribute("aria-pressed", String(state.collisionDebug));
}

function onFiltersClick(event) {
  if (event.target.closest(".filter-btn")) {
    return;
  }

  const rect = filtersEl.getBoundingClientRect();
  const y = event.clientY - rect.top;
  if (y < 0 || y > 30) {
    return;
  }

  applyFilter("all", true, false);
}

function applyFilter(type, refit, withHeat = true, preserveDeepMode = false) {
  if (state.deepProjectSlug && !preserveDeepMode) {
    clearDeepRootAnchor(state.deepProjectSlug);
    state.deepProjectSlug = null;
    syncProjectGraphLocation(null);
    state.deepPath = [];
    state.deepSourceAnchors = null;
    state.deepEntryZoom = Number.NaN;
    state.deepEntryMediaLayoutT = Number.NaN;
    state.deepInfoExpanded = false;
    stage.classList.remove("is-deep-mode");
    document.body.classList.remove("is-deep-mode");
    renderDeepProjectInfo(null);
    refreshSeeMoreLabels();
    refreshDeepNodeClasses();
    syncMountedContentSubtree();
  }

  const filterTypes = Array.isArray(state.filterTypes) ? state.filterTypes : [];
  const normalizedType = type === "all" || filterTypes.includes(type) ? type : "all";
  const typeChanged = state.activeType !== normalizedType;
  const physicalAnchors = normalizedType === "physical" ? capturePhysicalFilterAnchors() : null;
  state.activeType = normalizedType;
  state.physicalOverviewTitlesHeldHidden = normalizedType === "physical" && !state.deepProjectSlug;
  stage.classList.toggle("is-filter-naming", normalizedType === "naming" && !state.deepProjectSlug);
  stage.classList.toggle("is-filter-physical", normalizedType === "physical" && !state.deepProjectSlug);
  if (normalizedType === "physical") {
    applyPhysicalFilterAnchors(physicalAnchors);
  } else {
    clearPhysicalFilterAnchors();
  }
  if (withHeat) {
    state.simHeat = 0;
  }

  for (const btn of filtersEl.querySelectorAll(".filter-btn")) {
    btn.classList.toggle("is-active", btn.dataset.type === normalizedType);
  }

  refreshModelVisibility(normalizedType);

  if (typeChanged || refit) {
    clearFocusedProjectState();
    refreshFocusedClasses();
  }

  if (refit) {
    if (normalizedType === "all") {
      fitHomeView();
      state.simHeat = 0;
      setTargetView(state.homeX, state.homeY, state.homeZoom);
    } else {
      fitVisibleProjects(true);
    }
  }

  const immediateOverviewTitleVisibility =
    normalizedType === "physical" && !state.deepProjectSlug ? 0 : getOverviewTitleVisibility(state.targetZoom || state.viewZoom);
  state.lastOverviewTitleVisibility = immediateOverviewTitleVisibility;
  world.style.setProperty("--overview-title-visibility", `${immediateOverviewTitleVisibility}`);
}

function fitHomeView() {
  const fitModels = getBaseGraphModels();
  const fitted = fitModelsToViewport(fitModels, {
    startZoom: state.homeZoom || 0.66,
    minZoom: MIN_ZOOM,
    maxZoom: 0.94
  });
  const isMobileViewport = (state.stageWidth || stage.clientWidth || window.innerWidth || 0) <= MOBILE_TITLE_BREAKPOINT;
  const homeZoom = isMobileViewport
    ? clamp(fitted.zoom * getMobileHomeOverviewZoomScale(), MIN_ZOOM, 0.94)
    : fitted.zoom;
  const overviewTitleVisibilityAtHome = getOverviewTitleVisibility(homeZoom);
  const homeCenterBiasWorldX = isMobileViewport
    ? ((1 - overviewTitleVisibilityAtHome) * MOBILE_HIDDEN_TITLE_CENTER_BIAS_PX) / Math.max(0.0001, homeZoom)
    : 0;

  state.homeX = fitted.centerX - homeCenterBiasWorldX;
  state.homeY = fitted.centerY;
  state.homeZoom = homeZoom;

  if (state.viewZoom === 0.68) {
    state.viewX = fitted.centerX - homeCenterBiasWorldX;
    state.viewY = fitted.centerY;
    state.viewZoom = homeZoom;
    setTargetView(fitted.centerX - homeCenterBiasWorldX, fitted.centerY, homeZoom);
  }
}

function fitVisibleProjects(animate) {
  const visible = getVisibleModels();
  if (!visible.length) {
    return;
  }

  const fitMaxZoom = clamp(state.homeZoom || 0.88, MIN_ZOOM, 1.08);
  const fitted = fitModelsToViewport(visible, {
    startZoom: state.targetZoom,
    minZoom: MIN_ZOOM,
    maxZoom: fitMaxZoom
  });

  state.filterHomeX = fitted.centerX;
  state.filterHomeY = fitted.centerY;
  state.filterHomeZoom = fitted.zoom;

  if (animate) {
    setTargetView(fitted.centerX, fitted.centerY, fitted.zoom);
  } else {
    state.viewX = fitted.centerX;
    state.viewY = fitted.centerY;
    state.viewZoom = fitted.zoom;
    setTargetView(fitted.centerX, fitted.centerY, fitted.zoom);
  }
}

function recenterFocusedProjectAtCurrentZoom(syncView = false) {
  if (focusStoredMediaTargetAtCurrentZoom(syncView)) {
    return true;
  }

  if (state.deepProjectSlug) {
    const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
    const isMobileViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
    if (isMobileViewport) {
      const visible = getVisibleModels();
      if (!visible.length) {
        return false;
      }
      const maxZoomLimit = getCurrentMaxZoom();
      const zoom = clamp(state.targetZoom || state.viewZoom || maxZoomLimit, MIN_ZOOM, maxZoomLimit);
      const fitted = fitModelsToViewport(visible, {
        startZoom: zoom,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM
      });
      state.filterHomeX = fitted.centerX;
      state.filterHomeY = fitted.centerY;
      state.filterHomeZoom = clamp(fitted.zoom, MIN_ZOOM, MAX_ZOOM);
      if (syncView) {
        state.viewX = fitted.centerX;
        state.viewY = fitted.centerY;
        state.viewZoom = zoom;
      }
      setTargetView(fitted.centerX, fitted.centerY, zoom, maxZoomLimit);
      return true;
    }
  }

  const slug = state.focusedSlug;
  if (!slug) {
    return false;
  }

  const model = modelBySlug.get(slug);
  if (!model || !model.visible) {
    return false;
  }

  const project = getDisplayProject(model);
  const hasMedia = Array.isArray(project.media) && project.media.length > 0;
  const focusMaxZoom = hasMedia ? MAX_ZOOM : MAX_TEXT_ONLY_FOCUS_ZOOM;
  const zoom = clamp(state.targetZoom || state.viewZoom || project.focusZoom || focusMaxZoom, MIN_ZOOM, focusMaxZoom);
  const position = getModelPositionAtZoom(model, zoom);
  const visualCenter = state.deepProjectSlug ? null : getRootProjectFocusCenterAtZoom(model, zoom);
  const focusPoint = state.deepProjectSlug ? getProjectFocusPoint(model, zoom) : null;
  const nextX =
    visualCenter && Number.isFinite(visualCenter.x)
      ? visualCenter.x
      : position.x + ((focusPoint?.x ?? model.centerX) - model.centerX);
  const nextY =
    visualCenter && Number.isFinite(visualCenter.y)
      ? visualCenter.y
      : position.y + ((focusPoint?.y ?? model.centerY) - model.centerY);

  if (syncView) {
    state.viewX = nextX;
    state.viewY = nextY;
    state.viewZoom = zoom;
  }

  setTargetView(nextX, nextY, zoom, focusMaxZoom);
  return true;
}

function getFocusedViewCenterAtZoom(zoom = state.viewZoom) {
  const slug = state.focusedSlug;
  if (!slug) {
    return null;
  }

  const model = modelBySlug.get(slug);
  if (!model || !model.visible) {
    return null;
  }

  const safeZoom = clamp(Number(zoom) || state.viewZoom || state.targetZoom || MIN_ZOOM, MIN_ZOOM, getCurrentMaxZoom());
  const mediaIndex = Number.isFinite(Number(state.focusedMediaIndex))
    ? Math.max(0, Math.round(Number(state.focusedMediaIndex)))
    : -1;

  if (mediaIndex >= 0) {
    const center = getMediaWorldCenterAtZoom(model, mediaIndex, safeZoom);
    if (center) {
      const node = nodeBySlug.get(slug);
      const mediaElement = node?.querySelector(`.project-media[data-media-index="${mediaIndex}"]`) || null;
      const noteElement = mediaElement ? getMediaNoteElementForMedia(mediaElement) : null;
      let offsetYPx = 0;
      if (noteElement) {
        const noteRect = noteElement.getBoundingClientRect();
        offsetYPx = noteRect.height > 0 ? (CONTENT_MEDIA_NOTE_GAP + noteRect.height) * 0.5 : 0;
      }
      return {
        x: center.x,
        y: center.y + offsetYPx / Math.max(0.0001, safeZoom)
      };
    }
  }

  const position = getModelPositionAtZoom(model, safeZoom);
  const visualCenter = state.deepProjectSlug ? null : getRootProjectFocusCenterAtZoom(model, safeZoom);
  const focusPoint = state.deepProjectSlug ? getProjectFocusPoint(model, safeZoom) : null;
  return {
    x:
      visualCenter && Number.isFinite(visualCenter.x)
        ? visualCenter.x
        : position.x + ((focusPoint?.x ?? model.centerX) - model.centerX),
    y:
      visualCenter && Number.isFinite(visualCenter.y)
        ? visualCenter.y
        : position.y + ((focusPoint?.y ?? model.centerY) - model.centerY)
  };
}

function getVisibleModels() {
  return [...modelBySlug.values()].filter((model) => model.visible);
}

function getActiveOverviewHome() {
  if (
    state.deepProjectSlug &&
    Number.isFinite(state.filterHomeX) &&
    Number.isFinite(state.filterHomeY) &&
    Number.isFinite(state.filterHomeZoom) &&
    state.filterHomeZoom > 0
  ) {
    return {
      x: state.filterHomeX,
      y: state.filterHomeY,
      zoom: state.filterHomeZoom
    };
  }

  if (
    state.activeType !== "all" &&
    Number.isFinite(state.filterHomeX) &&
    Number.isFinite(state.filterHomeY) &&
    Number.isFinite(state.filterHomeZoom) &&
    state.filterHomeZoom > 0
  ) {
    return {
      x: state.filterHomeX,
      y: state.filterHomeY,
      zoom: state.filterHomeZoom
    };
  }

  return {
    x: state.homeX,
    y: state.homeY,
    zoom: state.homeZoom
  };
}

function computeBounds(models, zoom = state.viewZoom || 0.68) {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const model of models) {
    const position = getModelPositionAtZoom(model, zoom);
    const size = getModelHalfSize(model, zoom);
    const padX = size.w * 1.04;
    const padY = size.h * 1.05;
    minX = Math.min(minX, position.x - padX);
    maxX = Math.max(maxX, position.x + padX);
    minY = Math.min(minY, position.y - padY);
    maxY = Math.max(maxY, position.y + padY);
  }

  return { minX, maxX, minY, maxY };
}

function focusProject(slug) {
  const model = modelBySlug.get(slug);
  if (!model || !model.visible) {
    return;
  }

  state.stepPullActive = false;
  state.stepPullClearFocus = false;
  state.focusedSlug = slug;
  clearFocusedMediaTarget();
  state.focusTrackActive = true;
  focusedModel = model;
  state.simHeat = 0;
  refreshFocusedClasses();

  const project = getDisplayProject(model);
  const hasMedia = Array.isArray(project.media) && project.media.length > 0;
  const focusMaxZoom = state.deepProjectSlug
    ? getCurrentMaxZoom()
    : hasMedia
      ? MAX_ZOOM
      : MAX_TEXT_ONLY_FOCUS_ZOOM;
  const focusZoomBase = state.deepProjectSlug ? focusMaxZoom : MAX_ZOOM;
  const zoom = clamp(project.focusZoom || focusZoomBase, 0.86, focusMaxZoom);
  const position = getModelPositionAtZoom(model, zoom);
  const visualCenter = state.deepProjectSlug ? null : getRootProjectFocusCenterAtZoom(model, zoom);
  const focusPoint = state.deepProjectSlug ? getProjectFocusPoint(model, zoom) : null;
  const nextX =
    visualCenter && Number.isFinite(visualCenter.x)
      ? visualCenter.x
      : position.x + ((focusPoint?.x ?? model.centerX) - model.centerX);
  const nextY =
    visualCenter && Number.isFinite(visualCenter.y)
      ? visualCenter.y
      : position.y + ((focusPoint?.y ?? model.centerY) - model.centerY);
  setTargetView(nextX, nextY, zoom, focusMaxZoom);
}

function refreshFocusedClasses() {
  applyFocusedClassesToMountedNodes();
  syncFocusedProjectContentPrewarm();
}

function refreshDetailsPointerInteractivity(detailsVisibility = state.lastDetailsVisibility) {
  const visibility = Number.isFinite(detailsVisibility) ? detailsVisibility : 0;
  const canInteractDetails = state.lodClass === "lod-close" && visibility >= DETAILS_INTERACTION_VISIBILITY_THRESHOLD;
  const focusedSlug = state.focusedSlug || "";
  const revision = Number(state.detailsInteractionRevision) || 0;
  if (
    state.lastDetailsInteractionEnabled === canInteractDetails &&
    state.lastDetailsInteractionFocusedSlug === focusedSlug &&
    state.lastDetailsInteractionRevision === revision
  ) {
    return;
  }
  state.lastDetailsInteractionEnabled = canInteractDetails;
  state.lastDetailsInteractionFocusedSlug = focusedSlug;
  state.lastDetailsInteractionRevision = revision;
  for (const [slug, node] of nodeBySlug.entries()) {
    const details = node.querySelector(".project-details");
    if (!details) {
      continue;
    }
    const model = modelBySlug.get(slug);
    const detailsInteractive = canInteractDetails && Boolean(model?.visible);
    details.style.pointerEvents = detailsInteractive ? "auto" : "none";
    details.classList.toggle("is-controls-enabled", detailsInteractive && slug === focusedSlug);
  }
}

function getProjectFocusPoint(model, zoom) {
  const focusX = Number.isFinite(model.focusX) ? model.focusX : model.centerX;
  const focusY = Number.isFinite(model.focusY) ? model.focusY : model.centerY;
  const project = getDisplayProject(model);
  if (isContentNodeProject(project)) {
    return { x: focusX, y: focusY };
  }
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  if (viewportWidth > MOBILE_TITLE_BREAKPOINT || !projectHasDetails(project)) {
    return { x: focusX, y: focusY };
  }

  const titleWidth = getMeasuredProjectTitleWidth(model.slug, project);
  const textBoxes = getProjectTextCollisionBoxes(project, titleWidth, model.slug);
  const closeBox = textBoxes?.close;
  if (!closeBox) {
    return { x: focusX, y: focusY };
  }

  // The text layer is inversely scaled by zoom, so its visual center must be converted
  // from local text coordinates into the rendered node coordinate space.
  const labelScale = 1 / Math.max(0.0001, zoom);
  return {
    x: ((closeBox.minX + closeBox.maxX) * 0.5) * labelScale,
    y: ((closeBox.minY + closeBox.maxY) * 0.5) * labelScale
  };
}

function onWheel(event) {
  event.preventDefault();
  collapseDeepProjectInfoOnGraphInteraction();
  const sensitivity = event.ctrlKey ? TRACKPAD_PINCH_ZOOM_SENSITIVITY : WHEEL_ZOOM_SENSITIVITY;
  const factor = Math.exp(-event.deltaY * sensitivity);
  zoomAtClientPoint(event.clientX, event.clientY, state.targetZoom * factor);
}

function isActiveProjectDetailsControl(target) {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(
    target.closest(
      ".project-details.is-controls-enabled .project-details-more, .project-details.is-controls-enabled .project-details-link"
    )
  );
}

function onPointerDown(event) {
  const target = event.target instanceof Element ? event.target : null;
  const insideProjectDetails = Boolean(target?.closest(".project-details"));
  const activeDetailsControl = isActiveProjectDetailsControl(target);
  if (activeDetailsControl) {
    return;
  }
  if (
    target?.closest("a, button, input, textarea, select, label") &&
    !target.closest(".project-anchor") &&
    !insideProjectDetails
  ) {
    // Keep native interactions for controls and links (for example SEE MORE).
    return;
  }
  event.preventDefault();
  collapseDeepProjectInfoOnGraphInteraction();
  clearBrowserSelection();
  inertia.x = 0;
  inertia.y = 0;
  stage.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, pointerType: event.pointerType || "" });

  if (pointers.size === 1) {
    state.stepPullActive = false;
    state.stepPullClearFocus = false;
    drag = {
      pointerId: event.pointerId,
      pointerType: event.pointerType || "",
      startTarget: target,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
      suppressApplied: false,
      velocityX: 0,
      velocityY: 0,
      time: performance.now()
    };
  }

  if (pointers.size === 2) {
    state.stepPullActive = false;
    state.stepPullClearFocus = false;
    state.focusTrackActive = false;
    drag = null;
    inertia.x = 0;
    inertia.y = 0;
    pinch = createPinchState();
  }
}

function onPointerMove(event) {
  if (!pointers.has(event.pointerId)) {
    return;
  }

  const currPoint = { x: event.clientX, y: event.clientY, pointerType: event.pointerType || "" };
  pointers.set(event.pointerId, currPoint);

  if (pinch && pointers.size >= 2) {
    updatePinchGesture();
    return;
  }

  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }

  const dx = currPoint.x - drag.lastX;
  const dy = currPoint.y - drag.lastY;
  const tapSlop = getPointerTapSlop(drag.pointerType || event.pointerType || "");
  const totalDx = currPoint.x - drag.startX;
  const totalDy = currPoint.y - drag.startY;
  if (Math.abs(totalDx) + Math.abs(totalDy) > tapSlop) {
    drag.moved = true;
    state.focusTrackActive = false;
    if (!drag.suppressApplied) {
      state.suppressClickUntil = performance.now() + 90;
      drag.suppressApplied = true;
    }
  }

  const panSpeed = getPanSpeedMultiplier(drag.pointerType || event.pointerType || "");
  state.targetX -= (dx * panSpeed) / state.targetZoom;
  state.targetY -= (dy * panSpeed) / state.targetZoom;
  wakeGraph(2);

  const now = performance.now();
  const dt = Math.max(16, now - drag.time);
  drag.velocityX = ((-(dx * panSpeed) / state.targetZoom) / dt) * 16;
  drag.velocityY = ((-(dy * panSpeed) / state.targetZoom) / dt) * 16;
  drag.lastX = currPoint.x;
  drag.lastY = currPoint.y;
  drag.time = now;
}

function onPointerUp(event) {
  if (stage.hasPointerCapture(event.pointerId)) {
    stage.releasePointerCapture(event.pointerId);
  }
  pointers.delete(event.pointerId);

  if (drag && drag.pointerId === event.pointerId) {
    const moved = drag.moved;
    const tapTarget = drag.startTarget;
    if (drag.moved) {
      state.suppressClickUntil = performance.now() + 120;
      inertia.x = 0;
      inertia.y = 0;
    }
    drag = null;

    if (!moved && pointers.size === 0 && !pinch) {
      handleTapAt(event.clientX, event.clientY, tapTarget);
    }
  }

  if (pinch && pointers.size < 2) {
    state.suppressClickUntil = performance.now() + 180;
    pinch = null;

    if (pointers.size === 1) {
      const [id, point] = [...pointers.entries()][0];
      drag = {
        pointerId: id,
        pointerType: point.pointerType || "",
        startTarget: null,
        startX: point.x,
        startY: point.y,
        lastX: point.x,
        lastY: point.y,
        moved: false,
        suppressApplied: false,
        velocityX: 0,
        velocityY: 0,
        time: performance.now()
      };
    }
  }

  if (pointers.size === 0 && !pinch && drag && drag.pointerId !== event.pointerId) {
    drag = null;
  }
}

function handleTapAt(clientX, clientY, preferredTarget = null) {
  if (performance.now() < state.suppressClickUntil) {
    return;
  }
  if (state.headModalOpen) {
    return;
  }

  const preferred =
    preferredTarget instanceof Element && preferredTarget.isConnected && stage.contains(preferredTarget)
      ? preferredTarget
      : null;
  const hit = preferred || document.elementFromPoint(clientX, clientY);
  if (!hit) {
    return;
  }
  if (isActiveProjectDetailsControl(hit)) {
    return;
  }

  const media = hit.closest(".project-media");
  if (media) {
    if (focusProjectMediaElement(media)) {
      return;
    }
    const mediaNode = media.closest(".project-node");
    if (mediaNode?.dataset.slug) {
      focusProject(mediaNode.dataset.slug);
      return;
    }
  }

  const details = hit.closest(".project-details");
  if (details) {
    const detailsNode = details.closest(".project-node");
    if (detailsNode?.dataset.slug) {
      focusProject(detailsNode.dataset.slug);
      return;
    }
  }

  const anchor = hit.closest(".project-anchor");
  if (anchor) {
    const anchorNode = anchor.closest(".project-node");
    if (anchorNode?.dataset.slug) {
      focusProject(anchorNode.dataset.slug);
      return;
    }
  }

  const node = hit.closest(".project-node");
  if (node && node.dataset.slug) {
    focusProject(node.dataset.slug);
    return;
  }

  if (hit.closest(".filters") || hit.closest(".brand")) {
    return;
  }
  if (hit.closest(".collision-toggle") || hit.closest(".site-info")) {
    return;
  }

  if (state.deepProjectSlug) {
    if (tryStepZoomOutAt(clientX, clientY)) {
      return;
    }
  } else if (tryStepZoomOutAt(clientX, clientY)) {
    return;
  }

  clearFocusedProjectState();
  refreshFocusedClasses();
}

function tryStepZoomOutAt(clientX, clientY) {
  const overviewHome = getActiveOverviewHome();
  const home = clamp(overviewHome.zoom || MIN_ZOOM, MIN_ZOOM, MAX_ZOOM);
  const midZoom = getOverviewStepMidZoom(home);
  const homeThreshold = clamp(home * 1.03, MIN_ZOOM, MAX_ZOOM);

  if (state.targetZoom <= homeThreshold) {
    return false;
  }

  // Two-stage empty-space zoom-out:
  // 1) from close view -> medium view (details hidden),
  // 2) from medium view -> home overview.
  if (state.targetZoom > midZoom + 0.02) {
    // First step uses one coupled trajectory:
    // zoom-out and center-pull are synchronized by zoom progress.
    const startX = state.targetX;
    const startY = state.targetY;
    const startZoom = state.targetZoom;
    const endX = lerp(startX, overviewHome.x, EMPTY_STEP_CENTER_PULL);
    const endY = lerp(startY, overviewHome.y, EMPTY_STEP_CENTER_PULL);
    setTargetView(state.targetX, state.targetY, midZoom);
    state.stepPullActive = true;
    state.stepPullStartZoom = startZoom;
    state.stepPullEndZoom = midZoom;
    state.stepPullStartX = startX;
    state.stepPullStartY = startY;
    state.stepPullEndX = endX;
    state.stepPullEndY = endY;
    state.stepPullClearFocus = true;
    return true;
  }

  state.stepPullActive = false;
  state.stepPullClearFocus = false;
  clearFocusedProjectState();
  refreshFocusedClasses();
  setTargetView(overviewHome.x, overviewHome.y, home);
  return true;
}

function getOverviewStepMidZoom(homeZoom) {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const isMobileViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
  const detailsLayoutStartZoom = clamp(
    Math.min(homeZoom || LOD_FAR, PROJECT_DETAILS_LAYOUT_FULL_ZOOM - 0.02),
    MIN_ZOOM,
    PROJECT_DETAILS_LAYOUT_FULL_ZOOM - 0.02
  );
  // First step:
  // - desktop: near the level where details are hidden;
  // - mobile: noticeably deeper zoom-out in one tap.
  const detailsHiddenT = clamp(PROJECT_DETAILS_FADE_START_T - 0.26, 0, 1);
  const stepT = isMobileViewport ? MOBILE_EMPTY_STEP_T : detailsHiddenT;
  return clamp(
    lerp(detailsLayoutStartZoom, PROJECT_DETAILS_LAYOUT_FULL_ZOOM, stepT),
    MIN_ZOOM,
    MAX_ZOOM
  );
}

function createPinchState() {
  const points = [...pointers.values()];
  return {
    startZoom: state.targetZoom,
    startDistance: getDistance(points[0], points[1]),
    lastCenter: getCenter(points[0], points[1])
  };
}

function updatePinchGesture() {
  if (!pinch) {
    return;
  }
  const [a, b] = [...pointers.values()];
  const center = getCenter(a, b);
  const distance = getDistance(a, b);
  if (pinch.startDistance <= 0) {
    return;
  }

  const scale = distance / pinch.startDistance;
  zoomAtClientPoint(center.x, center.y, pinch.startZoom * scale);

  const centerDx = center.x - pinch.lastCenter.x;
  const centerDy = center.y - pinch.lastCenter.y;
  const panSpeed = getPinchPanSpeedMultiplier();
  state.targetX -= (centerDx * panSpeed) / state.targetZoom;
  state.targetY -= (centerDy * panSpeed) / state.targetZoom;
  wakeGraph(2);
  pinch.lastCenter = center;
}

function getPanSpeedMultiplier(pointerType = "") {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  if (viewportWidth <= MOBILE_TITLE_BREAKPOINT && pointerType === "touch") {
    return MOBILE_TOUCH_PAN_SPEED;
  }
  return 1;
}

function getPointerTapSlop(pointerType = "") {
  return pointerType === "touch" ? POINTER_TAP_SLOP_TOUCH : POINTER_TAP_SLOP_MOUSE;
}

function getPinchPanSpeedMultiplier() {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  if (viewportWidth > MOBILE_TITLE_BREAKPOINT) {
    return 1;
  }
  const points = [...pointers.values()];
  if (points.length >= 2 && points.every((point) => point.pointerType === "touch")) {
    return MOBILE_TOUCH_PAN_SPEED;
  }
  return 1;
}

function getCenter(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function getDistance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function zoomAtClientPoint(clientX, clientY, nextZoom) {
  const overviewHome = getActiveOverviewHome();
  const rect = stage.getBoundingClientRect();
  const requestedZoom = Number(nextZoom) || state.targetZoom || MIN_ZOOM;
  const inputMaxZoom = Math.max(getCurrentMaxZoom(), state.targetZoom || 0, state.viewZoom || 0);
  const inputMinZoom = getCurrentInputMinZoom();
  const clampedZoom = clamp(requestedZoom, inputMinZoom, inputMaxZoom);

  const before = screenToWorld(clientX, clientY, rect, state.targetX, state.targetY, state.targetZoom);
  state.targetZoom = clampedZoom;
  const after = screenToWorld(clientX, clientY, rect, state.targetX, state.targetY, state.targetZoom);
  state.targetX += before.x - after.x;
  state.targetY += before.y - after.y;

  if (state.targetZoom <= overviewHome.zoom * HOME_SNAP_ZOOM_FACTOR && state.focusedSlug) {
    clearFocusedProjectState();
    refreshFocusedClasses();
  }

  wakeGraph();
}

function screenToWorld(clientX, clientY, rect, viewX, viewY, viewZoom) {
  return {
    x: viewX + (clientX - rect.left - rect.width / 2) / viewZoom,
    y: viewY + (clientY - rect.top - rect.height / 2) / viewZoom
  };
}

function setWorldNumberProperty(name, value, { epsilon = 0.0005, unit = "" } = {}) {
  if (!name || !Number.isFinite(value)) {
    return false;
  }
  const prev = worldCssVarCache.get(name);
  if (Number.isFinite(prev) && Math.abs(prev - value) <= epsilon) {
    return false;
  }
  worldCssVarCache.set(name, value);
  world.style.setProperty(name, `${value}${unit}`);
  return true;
}

function wakeGraph(frames = GRAPH_DIRTY_FRAME_COUNT) {
  const safeFrames = Math.max(1, Math.round(Number(frames) || GRAPH_DIRTY_FRAME_COUNT));
  graphDirtyFrames = Math.max(graphDirtyFrames, safeFrames);
  scheduleMainFrame();
}

function consumeGraphDirtyFrame() {
  if (graphDirtyFrames <= 0) {
    return false;
  }
  graphDirtyFrames -= 1;
  return true;
}

function getCameraTargetDelta() {
  return {
    pan: Math.hypot(state.targetX - state.viewX, state.targetY - state.viewY),
    zoom: Math.abs(state.targetZoom - state.viewZoom)
  };
}

function hasVisibleUnrenderedModel() {
  for (const model of modelBySlug.values()) {
    if (!model.visible) {
      continue;
    }
    if (!nodeBySlug.has(model.slug)) {
      continue;
    }
    if (!Number.isFinite(model.renderX) || !Number.isFinite(model.renderY)) {
      return true;
    }
  }
  return false;
}

function needsHomeStabilizationFrame() {
  if (drag || pinch) {
    return false;
  }

  const overviewHome = getActiveOverviewHome();
  const nearHome = state.targetZoom <= overviewHome.zoom * HOME_LOCK_ZOOM_FACTOR;
  if (!nearHome) {
    return false;
  }

  if (
    !state.stepPullActive &&
    !state.deepProjectSlug &&
    state.focusedSlug &&
    state.targetZoom <= overviewHome.zoom * HOME_SNAP_ZOOM_FACTOR
  ) {
    return true;
  }

  if (
    state.targetZoom <= overviewHome.zoom * HOME_SNAP_ZOOM_FACTOR &&
    Math.abs((overviewHome.zoom || MIN_ZOOM) - (state.targetZoom || MIN_ZOOM)) > GRAPH_ZOOM_SETTLE_EPS
  ) {
    return true;
  }

  const dx = overviewHome.x - state.targetX;
  const dy = overviewHome.y - state.targetY;
  if (Math.abs(dx) <= GRAPH_CAMERA_SETTLE_EPS && Math.abs(dy) <= GRAPH_CAMERA_SETTLE_EPS) {
    return false;
  }

  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const isMobileViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
  const isPhysicalOverview = state.activeType === "physical" && !state.deepProjectSlug;
  const zoom = Math.max(0.0001, state.targetZoom || state.viewZoom || overviewHome.zoom || MIN_ZOOM);
  const centerPullLeash =
    state.deepProjectSlug || isMobileViewport || isPhysicalOverview ? getAdaptiveCenterPullLeash(zoom) : { x: 0, y: 0 };
  const pullDx = getCenterPullAxisExcess(dx, centerPullLeash.x);
  const pullDy = getCenterPullAxisExcess(dy, centerPullLeash.y);

  if (isMobileViewport) {
    const offsetPx = Math.hypot(pullDx, pullDy) * zoom;
    const deadZonePx = MOBILE_HOME_PULL_DEADZONE_PX + (state.deepProjectSlug ? MOBILE_HOME_PULL_DEEP_BONUS_PX : 0);
    return offsetPx > deadZonePx + 1;
  }

  return Math.abs(pullDx) > GRAPH_CAMERA_SETTLE_EPS || Math.abs(pullDy) > GRAPH_CAMERA_SETTLE_EPS;
}

function shouldRunGraphFrame() {
  if (graphDirtyFrames > 0 || drag || pinch || state.stepPullActive || state.focusTrackActive) {
    return true;
  }

  if (Math.abs(inertia.x) > 0.0002 || Math.abs(inertia.y) > 0.0002) {
    return true;
  }

  const delta = getCameraTargetDelta();
  if (delta.pan > GRAPH_FRAME_CAMERA_EPS || delta.zoom > GRAPH_FRAME_ZOOM_EPS) {
    return true;
  }

  if (hasVisibleUnrenderedModel()) {
    return true;
  }

  return needsHomeStabilizationFrame();
}

function snapCameraIfSettled() {
  if (drag || pinch || state.stepPullActive) {
    return;
  }

  if (Math.abs(state.targetX - state.viewX) <= GRAPH_CAMERA_SETTLE_EPS) {
    state.viewX = state.targetX;
  }
  if (Math.abs(state.targetY - state.viewY) <= GRAPH_CAMERA_SETTLE_EPS) {
    state.viewY = state.targetY;
  }
  if (Math.abs(state.targetZoom - state.viewZoom) <= GRAPH_ZOOM_SETTLE_EPS) {
    state.viewZoom = state.targetZoom;
  }
}

function setTargetView(x, y, zoom, maxZoom = MAX_ZOOM) {
  state.targetX = x;
  state.targetY = y;
  state.targetZoom = clamp(zoom, MIN_ZOOM, maxZoom);
  wakeGraph();
}

function scheduleMainFrame() {
  if (mainRafId != null || document.hidden) {
    return;
  }
  mainRafId = requestAnimationFrame(tick);
}

function tick() {
  mainRafId = null;
  if (document.hidden) {
    return;
  }
  if (shouldRunGraphFrame()) {
    runGraphFrame();
  }
  updateHeadWidgetFrame();
  if (shouldRunGraphFrame() || shouldRunHeadFrame()) {
    scheduleMainFrame();
  }
}

function runGraphFrame() {
  const dirtyFrame = consumeGraphDirtyFrame();
  const zoomBeforeEasing = state.viewZoom;
  stabilizeHomeLayout();

  if (!drag && !pinch && state.stepPullActive) {
    const startZoom = state.stepPullStartZoom;
    const endZoom = state.stepPullEndZoom;
    const denom = endZoom - startZoom;
    const progress =
      Math.abs(denom) < 0.0001 ? 1 : clamp((state.viewZoom - startZoom) / denom, 0, 1);
    const eased = progress * progress * (3 - 2 * progress); // smoothstep
    state.targetX = lerp(state.stepPullStartX, state.stepPullEndX, eased);
    state.targetY = lerp(state.stepPullStartY, state.stepPullEndY, eased);
    if (progress >= 0.999 || Math.abs(state.viewZoom - endZoom) < 0.0015) {
      state.stepPullActive = false;
      state.targetX = state.stepPullEndX;
      state.targetY = state.stepPullEndY;
      if (state.stepPullClearFocus) {
        state.stepPullClearFocus = false;
        clearFocusedProjectState();
        refreshFocusedClasses();
      }
    }
  }

  if (!drag && !pinch) {
    state.targetX += inertia.x;
    state.targetY += inertia.y;
    inertia.x *= 0.9;
    inertia.y *= 0.9;
    if (Math.abs(inertia.x) < 0.0002) {
      inertia.x = 0;
    }
    if (Math.abs(inertia.y) < 0.0002) {
      inertia.y = 0;
    }
  }

  if (!drag && !pinch && state.focusTrackActive && state.focusedSlug && !state.stepPullActive) {
    const focusCenter = getFocusedViewCenterAtZoom(state.viewZoom);
    if (focusCenter && Number.isFinite(focusCenter.x) && Number.isFinite(focusCenter.y)) {
      state.targetX = focusCenter.x;
      state.targetY = focusCenter.y;
      const focusPanDelta = Math.hypot(state.targetX - state.viewX, state.targetY - state.viewY);
      const focusZoomDelta = Math.abs(state.targetZoom - state.viewZoom);
      if (focusPanDelta <= GRAPH_FRAME_CAMERA_EPS && focusZoomDelta <= GRAPH_FRAME_ZOOM_EPS) {
        state.focusTrackActive = false;
      }
    } else {
      state.focusTrackActive = false;
    }
  }

  const cameraDelta = Math.hypot(state.targetX - state.viewX, state.targetY - state.viewY);
  const zoomDelta = Math.abs(state.targetZoom - state.viewZoom);
  const motionT = clamp(Math.max(cameraDelta / 320, zoomDelta / 0.16), 0, 1);
  const panEasingBase = drag || pinch ? 0.095 : lerp(0.05, 0.068, motionT);
  const zoomEasingBase = drag || pinch ? 0.085 : lerp(0.043, 0.058, motionT);
  const panEasing = panEasingBase;
  const zoomEasing = zoomEasingBase;
  state.viewX += (state.targetX - state.viewX) * panEasing;
  state.viewY += (state.targetY - state.viewY) * panEasing;
  state.viewZoom += (state.targetZoom - state.viewZoom) * zoomEasing;
  snapCameraIfSettled();

  const width = state.stageWidth || stage.clientWidth || window.innerWidth || 1;
  const height = state.stageHeight || stage.clientHeight || window.innerHeight || 1;
  const tx = width / 2 - state.viewX * state.viewZoom;
  const ty = height / 2 - state.viewY * state.viewZoom;
  world.style.transform = `translate(${tx}px, ${ty}px) scale(${state.viewZoom})`;

  const mediaScale = state.deepProjectSlug
    ? getDeepModeMediaScaleAtZoom(state.viewZoom)
    : lerp(FAR_MEDIA_SCALE, CLOSE_MEDIA_SCALE, getZoomT(state.viewZoom));
  if (!Number.isFinite(state.lastMediaScale) || Math.abs(mediaScale - state.lastMediaScale) > 0.0005) {
    state.lastMediaScale = mediaScale;
    world.style.setProperty("--media-scale", `${mediaScale}`);
  }
  const detailsLayoutStartZoom = clamp(
    state.homeZoom || LOD_FAR,
    MIN_ZOOM,
    PROJECT_DETAILS_LAYOUT_FULL_ZOOM - 0.02
  );
  const closePhase = clamp(
    (state.viewZoom - detailsLayoutStartZoom) /
      Math.max(0.0001, PROJECT_DETAILS_LAYOUT_FULL_ZOOM - detailsLayoutStartZoom),
    0,
    1
  );
  const mediaLayoutT = state.deepProjectSlug
    ? Number.isFinite(state.deepEntryMediaLayoutT)
      ? state.deepEntryMediaLayoutT
      : closePhase * closePhase
    : closePhase * closePhase;
  if (!Number.isFinite(state.lastMediaLayoutT) || Math.abs(mediaLayoutT - state.lastMediaLayoutT) > 0.0005) {
    state.lastMediaLayoutT = mediaLayoutT;
    world.style.setProperty("--media-layout-t", `${mediaLayoutT}`);
  }
  const targetClosePhase = clamp(
    (state.targetZoom - detailsLayoutStartZoom) /
      Math.max(0.0001, PROJECT_DETAILS_LAYOUT_FULL_ZOOM - detailsLayoutStartZoom),
    0,
    1
  );
  let detailsPhase = closePhase;
  if (state.focusedSlug && state.targetZoom > state.viewZoom) {
    detailsPhase = Math.max(detailsPhase, lerp(closePhase, targetClosePhase, 0.42));
  }
  const detailsVisibility = clamp(
    (detailsPhase - PROJECT_DETAILS_FADE_START_T) / Math.max(0.0001, PROJECT_DETAILS_FADE_END_T - PROJECT_DETAILS_FADE_START_T),
    0,
    1
  );
  if (!Number.isFinite(state.lastDetailsVisibility) || Math.abs(detailsVisibility - state.lastDetailsVisibility) > 0.0005) {
    state.lastDetailsVisibility = detailsVisibility;
    world.style.setProperty("--details-visibility", `${detailsVisibility}`);
  }
  const labelScale = 1 / Math.max(0.0001, state.viewZoom);
  if (!Number.isFinite(state.lastLabelScale) || Math.abs(labelScale - state.lastLabelScale) > 0.0005) {
    state.lastLabelScale = labelScale;
    world.style.setProperty("--label-scale", `${labelScale}`);
  }
  const mediaScreenScale = Math.max(0.0001, mediaScale * state.viewZoom);
  const mediaReferenceZoom = state.deepProjectSlug ? getCurrentMaxZoom() : MAX_ZOOM;
  const mediaScaleAtMaxZoom = state.deepProjectSlug
    ? getDeepModeMediaScaleAtZoom(mediaReferenceZoom)
    : getMediaScaleAtZoom(mediaReferenceZoom);
  const mediaMaxScreenScale = Math.max(0.0001, mediaScaleAtMaxZoom * mediaReferenceZoom);

  const mediaNoteGapScreen = clamp(
    CONTENT_MEDIA_NOTE_GAP * mediaScreenScale,
    CONTENT_MEDIA_NOTE_GAP_MIN_SCREEN,
    CONTENT_MEDIA_NOTE_GAP
  );
  const mediaNoteGapLocal = mediaNoteGapScreen / mediaScreenScale;
  setWorldNumberProperty("--media-note-gap-local", mediaNoteGapLocal, { epsilon: 0.02, unit: "px" });
  const mediaNoteContentScale = 1 / mediaScreenScale;
  setWorldNumberProperty("--media-note-content-scale", mediaNoteContentScale);
  const mediaNoteWidthScale = mediaMaxScreenScale * CONTENT_MEDIA_NOTE_WIDTH_FACTOR;
  setWorldNumberProperty("--media-note-width-scale", mediaNoteWidthScale);
  setWorldNumberProperty("--media-max-screen-scale", mediaMaxScreenScale);
  let deepNoteHeadVisibility = detailsVisibility;
  let deepNoteBodyVisibility = detailsVisibility;
  if (state.deepProjectSlug) {
    const overviewHomeZoom = clamp(getActiveOverviewHome().zoom || MIN_ZOOM, MIN_ZOOM, MAX_ZOOM);
    const midZoom = getOverviewStepMidZoom(overviewHomeZoom);
    const headFadeStart = lerp(overviewHomeZoom, midZoom, DEEP_NOTE_HEAD_REVEAL_START_T);
    const headFadeRange = Math.max(0.0001, midZoom - headFadeStart);
    const bodyFadeStart = lerp(midZoom, PROJECT_DETAILS_LAYOUT_FULL_ZOOM, DEEP_NOTE_BODY_REVEAL_START_T);
    const bodyFadeRange = Math.max(0.0001, PROJECT_DETAILS_LAYOUT_FULL_ZOOM - bodyFadeStart);
    deepNoteHeadVisibility = clamp((state.viewZoom - headFadeStart) / headFadeRange, 0, 1);
    deepNoteBodyVisibility = clamp((state.viewZoom - bodyFadeStart) / bodyFadeRange, 0, 1);
  }
  setWorldNumberProperty("--deep-note-head-visibility", deepNoteHeadVisibility);
  setWorldNumberProperty("--deep-note-body-visibility", deepNoteBodyVisibility);
  if (state.activeType === "physical" && !state.deepProjectSlug && state.physicalOverviewTitlesHeldHidden) {
    const homeZoom = clamp(state.filterHomeZoom || getActiveOverviewHome().zoom || MIN_ZOOM, MIN_ZOOM, MAX_ZOOM);
    const zoomSettled =
      Math.abs((state.viewZoom || 0) - homeZoom) < 0.003 &&
      Math.abs((state.targetZoom || 0) - homeZoom) < 0.003;
    if (zoomSettled) {
      state.physicalOverviewTitlesHeldHidden = false;
    }
  }

  const overviewTitleVisibility =
    state.activeType === "physical" && !state.deepProjectSlug && state.physicalOverviewTitlesHeldHidden
      ? 0
      : getOverviewTitleVisibility(state.viewZoom);
  if (
    !Number.isFinite(state.lastOverviewTitleVisibility) ||
    Math.abs(overviewTitleVisibility - state.lastOverviewTitleVisibility) > 0.0005
  ) {
    state.lastOverviewTitleVisibility = overviewTitleVisibility;
    world.style.setProperty("--overview-title-visibility", `${overviewTitleVisibility}`);
  }

  const layoutZoomChanged =
    !Number.isFinite(lastGraphLayoutZoom) ||
    Math.abs(state.viewZoom - lastGraphLayoutZoom) > GRAPH_LAYOUT_ZOOM_EPS ||
    Math.abs(state.viewZoom - zoomBeforeEasing) > GRAPH_LAYOUT_ZOOM_EPS;
  if (dirtyFrame || layoutZoomChanged || hasVisibleUnrenderedModel()) {
    runGraphSimulation();
    renderNodePositions();
    lastGraphLayoutZoom = state.viewZoom;
  }

  updateLODClass(state.viewZoom);
  refreshDetailsPointerInteractivity(detailsVisibility);
}

function runGraphSimulation() {
  for (const model of modelBySlug.values()) {
    if (!model.visible) {
      continue;
    }
    const target = getModelPositionAtZoom(model, state.viewZoom);
    model.x = target.x;
    model.y = target.y;
    model.vx = 0;
    model.vy = 0;
  }
}

function renderNodePositions() {
  for (const model of modelBySlug.values()) {
    if (!model.visible) {
      continue;
    }
    const node = nodeBySlug.get(model.slug);
    if (!node) {
      continue;
    }
    const nextX = model.x - model.centerX;
    const nextY = model.y - model.centerY;
    if (Math.abs(nextX - model.renderX) < 0.04 && Math.abs(nextY - model.renderY) < 0.04) {
      continue;
    }
    model.renderX = nextX;
    model.renderY = nextY;
    node.style.transform = `translate(${nextX}px, ${nextY}px)`;
  }
}

function updateLODClass(zoom) {
  let nextClass = "lod-close";
  if (zoom < LOD_FAR) {
    nextClass = "lod-far";
  } else if (zoom < LOD_CLOSE) {
    nextClass = "lod-mid";
  }

  if (state.lodClass === nextClass) {
    return;
  }

  stage.classList.remove("lod-far", "lod-mid", "lod-close");
  stage.classList.add(nextClass);
  state.lodClass = nextClass;
}

function clearBrowserSelection() {
  const selection = window.getSelection ? window.getSelection() : null;
  if (selection && !selection.isCollapsed) {
    selection.removeAllRanges();
  }
}

function settleInitialLayout() {
  const models = getBaseGraphModels();
  if (!models.length) {
    return;
  }

  const settleZooms = [0.58, 0.78];
  for (const settleZoom of settleZooms) {
    resolveOverlapsRadial(models, settleZoom, {
      xKey: "x",
      yKey: "y",
      getHalfSize: getOverviewLayoutHalfSize,
      spacingX: settleZoom < 0.65 ? 1.12 : 1.15,
      spacingY: settleZoom < 0.65 ? 1.16 : 1.2,
      passes: settleZoom < 0.65 ? 170 : 120,
      strength: settleZoom < 0.65 ? 0.28 : 0.24,
      maxPush: settleZoom < 0.65 ? 30 : 24,
      pullStrength: 0.008
    });
    pullOverviewContentRootsTowardCenter(models, "x", "y", OVERVIEW_CONTENT_ROOT_INWARD_PULL);
  }

  enforceLayoutAspect(models, "x", "y", getTargetBaseAspectRatio(), 1.36);
  resolveOverlapsRadial(models, 0.64, {
    xKey: "x",
    yKey: "y",
    getHalfSize: getOverviewLayoutHalfSize,
    spacingX: 1.14,
    spacingY: 1.18,
    passes: 60,
    strength: 0.24,
    maxPush: 22,
    pullStrength: 0.006
  });
  pullOverviewContentRootsTowardCenter(models, "x", "y", OVERVIEW_CONTENT_ROOT_INWARD_PULL);
  resolveOverlapsStrict(models, 0.64, {
    xKey: "x",
    yKey: "y",
    spacingX: 1.024,
    spacingY: 1.03,
    passes: 6
  });

  const centroid = models.reduce(
    (acc, model) => {
      acc.x += model.x;
      acc.y += model.y;
      return acc;
    },
    { x: 0, y: 0 }
  );
  const cx = centroid.x / Math.max(1, models.length);
  const cy = centroid.y / Math.max(1, models.length);

  for (const model of models) {
    model.x -= cx;
    model.y -= cy;
    model.ax = model.x;
    model.ay = model.y;
    model.bx = model.x;
    model.by = model.y;
    model.baseLayoutSeedX = model.x;
    model.baseLayoutSeedY = model.y;
    model.vx = 0;
    model.vy = 0;
  }
}

function resetBaseGraphLayoutToSeeds(models) {
  if (!Array.isArray(models) || !models.length) {
    return;
  }

  for (const model of models) {
    const seedX = Number.isFinite(model.baseLayoutSeedX) ? model.baseLayoutSeedX : model.x;
    const seedY = Number.isFinite(model.baseLayoutSeedY) ? model.baseLayoutSeedY : model.y;
    model.x = seedX;
    model.y = seedY;
    model.ax = seedX;
    model.ay = seedY;
    model.bx = seedX;
    model.by = seedY;
  }
}

function stabilizeHomeLayout() {
  if (drag || pinch) {
    return;
  }

  const overviewHome = getActiveOverviewHome();
  const nearHome = state.targetZoom <= overviewHome.zoom * HOME_LOCK_ZOOM_FACTOR;
  if (!nearHome) {
    return;
  }

  if (
    !state.stepPullActive &&
    !state.deepProjectSlug &&
    state.focusedSlug &&
    state.targetZoom <= overviewHome.zoom * HOME_SNAP_ZOOM_FACTOR
  ) {
    clearFocusedProjectState();
    refreshFocusedClasses();
  }

  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const isMobileViewport = viewportWidth <= MOBILE_TITLE_BREAKPOINT;
  const isPhysicalOverview = state.activeType === "physical" && !state.deepProjectSlug;
  const dx = overviewHome.x - state.targetX;
  const dy = overviewHome.y - state.targetY;
  const zoom = Math.max(0.0001, state.targetZoom || state.viewZoom || overviewHome.zoom || MIN_ZOOM);
  const centerPullLeash =
    state.deepProjectSlug || isMobileViewport || isPhysicalOverview ? getAdaptiveCenterPullLeash(zoom) : { x: 0, y: 0 };
  const pullDx = getCenterPullAxisExcess(dx, centerPullLeash.x);
  const pullDy = getCenterPullAxisExcess(dy, centerPullLeash.y);
  let centerPullStrength = 0.055;
  let centerPullScale = 1;

  if (isMobileViewport) {
    const offsetPx = Math.hypot(pullDx, pullDy) * zoom;
    const deadZonePx = MOBILE_HOME_PULL_DEADZONE_PX + (state.deepProjectSlug ? MOBILE_HOME_PULL_DEEP_BONUS_PX : 0);
    centerPullStrength = MOBILE_HOME_PULL_STRENGTH;
    if (offsetPx <= deadZonePx) {
      centerPullScale = 0;
    } else {
      centerPullScale = clamp((offsetPx - deadZonePx) / Math.max(deadZonePx, 1), 0, 1);
    }
  }

  if (centerPullScale > 0 && (Math.abs(pullDx) > 0.0001 || Math.abs(pullDy) > 0.0001)) {
    const pull = centerPullStrength * centerPullScale;
    state.targetX += pullDx * pull;
    state.targetY += pullDy * pull;
  }

  if (state.targetZoom <= overviewHome.zoom * HOME_SNAP_ZOOM_FACTOR) {
    state.targetZoom += (overviewHome.zoom - state.targetZoom) * 0.05;
  }

  // Node positions are derived from anchors and zoom in runGraphSimulation().
  // Keeping this stabilizer camera-only avoids touching every visible DOM model
  // while the user is simply panning around the overview.
}

function getLayoutAspectFactors() {
  const rect = stage.getBoundingClientRect();
  const width = rect.width || window.innerWidth || 1440;
  const height = rect.height || window.innerHeight || 900;
  const aspect = width / Math.max(1, height);

  if (aspect >= 1) {
    const t = clamp((aspect - 1) / 1.3, 0, 1);
    return {
      x: 1 + t * 0.63,
      y: 1 - t * 0.46
    };
  }

  const t = clamp((1 - aspect) / 0.5, 0, 1);
  return {
    x: 1 - t * 0.18,
    y: 1 + t * 0.28
  };
}

function getAnchorCentroid(models) {
  if (!models.length) {
    return { x: 0, y: 0 };
  }
  const sum = models.reduce(
    (acc, model) => {
      acc.x += model.ax;
      acc.y += model.ay;
      return acc;
    },
    { x: 0, y: 0 }
  );
  return {
    x: sum.x / models.length,
    y: sum.y / models.length
  };
}

function getSpreadTForZoom(zoom) {
  const base = state.homeZoom || MIN_ZOOM;
  return clamp((zoom - base) / Math.max(0.0001, MAX_ZOOM - base), 0, 1);
}

function getSpreadEaseForZoom(zoom) {
  const t = getSpreadTForZoom(zoom);
  return t * t;
}

function getSpreadScaleForZoom(zoom) {
  return lerp(1, SPREAD_MAX, getSpreadEaseForZoom(zoom));
}

function getDeepSpreadTForZoom(zoom) {
  const maxZoom = getCurrentMaxZoom();
  const overviewHome = getActiveOverviewHome();
  const baseZoom = clamp(overviewHome.zoom || MIN_ZOOM, MIN_ZOOM, Math.max(MIN_ZOOM, maxZoom - 0.02));
  return clamp((zoom - baseZoom) / Math.max(0.0001, maxZoom - baseZoom), 0, 1);
}

function getDeepSpreadEaseForZoom(zoom) {
  const t = getDeepSpreadTForZoom(zoom);
  return t * t;
}

function getDeepSpreadScaleForZoom(zoom) {
  return lerp(1, DEEP_SPREAD_MAX, getDeepSpreadEaseForZoom(zoom));
}

function getExpandedAnchorPosition(model, zoom, centroid, spreadOverride) {
  const spread = spreadOverride ?? getSpreadScaleForZoom(zoom);
  return {
    x: centroid.x + (model.ax - centroid.x) * spread,
    y: centroid.y + (model.ay - centroid.y) * spread
  };
}

function getModelPositionAtZoom(model, zoom) {
  if (state.deepProjectSlug) {
    if (model.slug === state.deepProjectSlug) {
      return getDeepRootAnchorPosition(model);
    }
    if (hasContentParent(model.slug, state.deepProjectSlug)) {
      const deepRootModel = modelBySlug.get(state.deepProjectSlug);
      const deepRoot = deepRootModel ? getDeepRootAnchorPosition(deepRootModel) : { x: 0, y: 0 };
      const spread = getDeepSpreadScaleForZoom(zoom);
      return {
        x: deepRoot.x + (model.ax - deepRoot.x) * spread,
        y: deepRoot.y + (model.ay - deepRoot.y) * spread
      };
    }
  }

  const t = getSpreadEaseForZoom(zoom);
  const farX = state.activeType === "physical" && Number.isFinite(model.filterAx) ? model.filterAx : model.ax;
  const farY = state.activeType === "physical" && Number.isFinite(model.filterAy) ? model.filterAy : model.ay;
  const closeX =
    state.activeType === "physical" && Number.isFinite(model.filterBx) ? model.filterBx : model.bx ?? farX;
  const closeY =
    state.activeType === "physical" && Number.isFinite(model.filterBy) ? model.filterBy : model.by ?? farY;
  return {
    x: lerp(farX, closeX, t),
    y: lerp(farY, closeY, t)
  };
}

function fitModelsToViewport(models, { startZoom, minZoom = MIN_ZOOM, maxZoom = 0.94 } = {}) {
  const rect = stage.getBoundingClientRect();
  const { left, right, top, bottom } = getViewportFitPadding(rect);
  let zoom = clamp(startZoom || state.homeZoom || 0.66, minZoom, maxZoom);
  let bounds = computeBounds(models, zoom);

  for (let i = 0; i < 3; i += 1) {
    const spanX = Math.max(1, bounds.maxX - bounds.minX + left + right);
    const spanY = Math.max(1, bounds.maxY - bounds.minY + top + bottom);
    const zoomX = rect.width / spanX;
    const zoomY = rect.height / spanY;
    zoom = clamp(Math.min(zoomX, zoomY), minZoom, maxZoom);
    bounds = computeBounds(models, zoom);
  }

  const midX = (bounds.minX + bounds.maxX) / 2;
  const midY = (bounds.minY + bounds.maxY) / 2;
  const centerX = midX + (right - left) / Math.max(0.0001, 2 * zoom);
  let centerY = midY + (bottom - top) / Math.max(0.0001, 2 * zoom);
  if (window.innerWidth > 1024) {
    centerY -= DESKTOP_VISUAL_CENTER_SHIFT_Y / Math.max(0.0001, zoom);
  }

  return { centerX, centerY, zoom };
}

function getViewportFitPadding(rect) {
  const isMobileMenu = window.innerWidth <= 1024;
  let left = clamp(rect.width * 0.06, 54, 132);
  let right = left;
  let top = isMobileMenu ? clamp(rect.height * 0.08, 42, 92) : clamp(rect.height * 0.1, 72, 118);
  let bottom = isMobileMenu ? clamp(rect.height * 0.17, 96, 156) : clamp(rect.height * 0.1, 72, 118);

  if (isMobileMenu) {
    const uiGap = 16;
    const toggleRect = collisionToggleBtn?.getBoundingClientRect();
    const topBarRect = document.querySelector(".top-bar")?.getBoundingClientRect();

    if (toggleRect && toggleRect.height > 0 && toggleRect.width > 0) {
      top = Math.max(top, toggleRect.bottom - rect.top + uiGap);
    }
    if (topBarRect && topBarRect.height > 0 && topBarRect.width > 0) {
      bottom = Math.max(bottom, rect.bottom - topBarRect.top + uiGap);
    }

    // Keep side breathing room stable on narrow screens.
    const sidePad = 30;
    left = Math.max(left, sidePad);
    right = Math.max(right, sidePad);
  }

  return { left, right, top, bottom };
}

function getMobileHomeOverviewZoomScale() {
  const width = state.stageWidth || stage.clientWidth || window.innerWidth || 1;
  const height = state.stageHeight || stage.clientHeight || window.innerHeight || 1;
  const shortSide = Math.max(1, Math.min(width, height));
  // Smaller screens start farther out so the full graph reliably fits.
  return clamp(shortSide / 480, 0.78, 0.9);
}

function getCenterPullAxisExcess(offset, leash) {
  const safeLeash = Math.max(0, Number(leash) || 0);
  const magnitude = Math.max(0, Math.abs(Number(offset) || 0) - safeLeash);
  if (magnitude <= 0) {
    return 0;
  }
  return Math.sign(offset || 0) * magnitude;
}

function getAdaptiveCenterPullLeash(zoom = state.targetZoom || state.viewZoom || MIN_ZOOM) {
  const visible = getVisibleModels();
  if (!visible.length) {
    return { x: 0, y: 0 };
  }

  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return { x: 0, y: 0 };
  }

  const safeZoom = Math.max(0.0001, Number(zoom) || MIN_ZOOM);
  const bounds = computeBounds(visible, safeZoom);
  const { left, right, top, bottom } = getViewportFitPadding(rect);
  const availableWorldW = Math.max(1, (rect.width - left - right) / safeZoom);
  const availableWorldH = Math.max(1, (rect.height - top - bottom) / safeZoom);
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const overflowX = Math.max(0, spanX - availableWorldW);
  const overflowY = Math.max(0, spanY - availableWorldH);
  const slackWorld = 18 / safeZoom;
  const isPhysicalOverview = state.activeType === "physical" && !state.deepProjectSlug;

  return {
    x: overflowX * (isPhysicalOverview ? 0.8 : 0.5) + slackWorld * (isPhysicalOverview ? 3.2 : 1),
    y: overflowY * (isPhysicalOverview ? 0.8 : 0.5) + slackWorld * (isPhysicalOverview ? 3.2 : 1)
  };
}

function unionBox(a, b) {
  return {
    minX: Math.min(a.minX, b.minX),
    maxX: Math.max(a.maxX, b.maxX),
    minY: Math.min(a.minY, b.minY),
    maxY: Math.max(a.maxY, b.maxY)
  };
}

function scaleBoxAroundPoint(box, scale, cx, cy) {
  const halfW = (box.maxX - box.minX) * 0.5 * scale;
  const halfH = (box.maxY - box.minY) * 0.5 * scale;
  return {
    minX: cx - halfW,
    maxX: cx + halfW,
    minY: cy - halfH,
    maxY: cy + halfH
  };
}

function getZoomT(zoom) {
  return clamp((zoom - MIN_ZOOM) / Math.max(0.0001, MAX_ZOOM - MIN_ZOOM), 0, 1);
}

function getCurrentInputMinZoom() {
  if (!state.deepProjectSlug) {
    const overviewHome = getActiveOverviewHome();
    const homeZoom = clamp(overviewHome.zoom || MIN_ZOOM, MIN_ZOOM, MAX_ZOOM);
    if (homeZoom > MIN_ZOOM + OVERVIEW_ELASTIC_MIN_ZOOM_TRIGGER_RANGE) {
      return MIN_ZOOM;
    }
    return Math.max(OVERVIEW_ELASTIC_MIN_ZOOM_FLOOR, homeZoom - OVERVIEW_ELASTIC_MIN_ZOOM_SLACK);
  }

  const overviewHome = getActiveOverviewHome();
  const homeZoom = clamp(overviewHome.zoom || MIN_ZOOM, MIN_ZOOM, getCurrentMaxZoom());
  if (homeZoom > MIN_ZOOM + DEEP_ELASTIC_MIN_ZOOM_TRIGGER_RANGE) {
    return MIN_ZOOM;
  }

  return Math.max(DEEP_ELASTIC_MIN_ZOOM_FLOOR, homeZoom - DEEP_ELASTIC_MIN_ZOOM_SLACK);
}

function getCurrentMaxZoom() {
  return state.deepProjectSlug ? DEEP_MODE_MAX_ZOOM : MAX_ZOOM;
}

function getDeepRootObstacleBoxes(sourceModel, deepMaxZoom = getCurrentMaxZoom()) {
  if (!sourceModel) {
    return [];
  }

  const safeMaxZoom = clamp(Number(deepMaxZoom) || getCurrentMaxZoom(), MIN_ZOOM, getCurrentMaxZoom());
  const overviewHome = getActiveOverviewHome();
  const safeHomeZoom = clamp(overviewHome.zoom || MIN_ZOOM, MIN_ZOOM, safeMaxZoom);
  const midZoom = getOverviewStepMidZoom(safeHomeZoom);
  const zoomCandidates = [safeMaxZoom, midZoom, MIN_ZOOM];
  const zooms = [];
  for (const zoom of zoomCandidates) {
    const safeZoom = clamp(Number(zoom) || safeMaxZoom, MIN_ZOOM, safeMaxZoom);
    if (!zooms.some((value) => Math.abs(value - safeZoom) < 0.0001)) {
      zooms.push(safeZoom);
    }
  }

  const seen = new Set();
  const boxes = [];
  for (const zoom of zooms) {
    const snapshot = getModelMediaWorldBoxesAtZoom(sourceModel, zoom, {
      useDeepScale: true,
      includeNotes: true
    });
    for (const box of snapshot) {
      if (!box || !Number.isFinite(box.minX) || !Number.isFinite(box.maxX) || !Number.isFinite(box.minY) || !Number.isFinite(box.maxY)) {
        continue;
      }
      const key = [
        box.kind || "box",
        Number(box.mediaIndex) || 0,
        Math.round(box.minX * 10),
        Math.round(box.maxX * 10),
        Math.round(box.minY * 10),
        Math.round(box.maxY * 10)
      ].join(":");
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      boxes.push({
        minX: box.minX,
        maxX: box.maxX,
        minY: box.minY,
        maxY: box.maxY
      });
    }
  }

  return boxes;
}

function getModelHalfSize(model, zoom) {
  // Keep FAR size stable in overview and start expanding toward CLOSE only after LOD_FAR.
  const closePhase = clamp((zoom - LOD_FAR) / Math.max(0.0001, MAX_ZOOM - LOD_FAR), 0, 1);
  const sizeT = closePhase * closePhase;
  const farT = clamp((LOD_CLOSE - zoom) / Math.max(0.0001, LOD_CLOSE - MIN_ZOOM), 0, 1);
  const widthBlendT = sizeT;
  const heightBlendT = sizeT;
  // Uniform collision margin for all nodes (with/without media).
  const safePad = lerp(12, 20, sizeT);
  // Small additive compensation for dot+title in far view.
  // Important: additive, not multiplicative, so media projects are not over-inflated.
  const labelAddonX = lerp(14, 0, sizeT) * farT;
  const labelAddonY = lerp(8, 0, sizeT) * farT;
  const baseW = lerp(model.halfWFar, model.halfWClose, widthBlendT) + safePad;
  const baseH = lerp(model.halfHFar, model.halfHClose, heightBlendT) * lerp(1.05, 1, sizeT) + safePad;

  let deepMediaCollisionBoost = 1;
  if (
    state.deepProjectSlug &&
    Array.isArray(model.project?.media) &&
    model.project.media.length > 0 &&
    (
      hasContentParent(model.slug, state.deepProjectSlug) ||
      model.slug === state.deepProjectSlug
    )
  ) {
    const baseMediaScale = getMediaScaleAtZoom(zoom);
    const boostedMediaScale = getDeepModeMediaScaleAtZoom(zoom);
    deepMediaCollisionBoost = boostedMediaScale / Math.max(0.0001, baseMediaScale);
  }

  return {
    w: baseW * deepMediaCollisionBoost + labelAddonX,
    h: baseH * deepMediaCollisionBoost + labelAddonY
  };
}

function getModelTextHalfSize(model, zoom) {
  const closePhase = clamp((zoom - LOD_FAR) / Math.max(0.0001, MAX_ZOOM - LOD_FAR), 0, 1);
  const sizeT = closePhase * closePhase;
  const farT = clamp((LOD_CLOSE - zoom) / Math.max(0.0001, LOD_CLOSE - MIN_ZOOM), 0, 1);
  const safePad = lerp(12, 20, sizeT);
  const labelAddonX = lerp(14, 0, sizeT) * farT;
  const labelAddonY = lerp(8, 0, sizeT) * farT;
  const textFarW = Number.isFinite(model.textHalfWFar) ? model.textHalfWFar : model.halfWFar;
  const textFarH = Number.isFinite(model.textHalfHFar) ? model.textHalfHFar : model.halfHFar;
  const textCloseW = Number.isFinite(model.textHalfWClose) ? model.textHalfWClose : model.halfWClose;
  const textCloseH = Number.isFinite(model.textHalfHClose) ? model.textHalfHClose : model.halfHClose;
  const baseW = lerp(textFarW, textCloseW, sizeT) + safePad;
  const baseH = lerp(textFarH, textCloseH, sizeT) * lerp(1.05, 1, sizeT) + safePad;
  return {
    w: baseW + labelAddonX,
    h: baseH + labelAddonY
  };
}

function getOverviewLayoutHalfSize(model, zoom) {
  const fullSize = getModelHalfSize(model, zoom);
  if (state.deepProjectSlug) {
    return fullSize;
  }

  const project = getDisplayProject(model);
  if (!project || !Array.isArray(project.media) || !project.media.length) {
    return fullSize;
  }

  const textSize = getModelTextHalfSize(model, zoom);
  const spreadT = getSpreadEaseForZoom(clamp(Number(zoom) || MIN_ZOOM, MIN_ZOOM, MAX_ZOOM));
  const reliefT = lerp(OVERVIEW_MEDIA_LAYOUT_RELIEF_FAR, OVERVIEW_MEDIA_LAYOUT_RELIEF_CLOSE, spreadT);
  const overviewSize = {
    w: Math.max(fullSize.w * OVERVIEW_MEDIA_LAYOUT_MIN_SCALE_X, lerp(fullSize.w, textSize.w, reliefT)),
    h: Math.max(fullSize.h * OVERVIEW_MEDIA_LAYOUT_MIN_SCALE_Y, lerp(fullSize.h, textSize.h, reliefT))
  };
  if (!isOverviewContentRootModel(model)) {
    return overviewSize;
  }
  return {
    w: overviewSize.w * OVERVIEW_CONTENT_ROOT_COLLISION_BOOST_X,
    h: overviewSize.h * OVERVIEW_CONTENT_ROOT_COLLISION_BOOST_Y
  };
}

function pullOverviewContentRootsTowardCenter(models, xKey, yKey, strength = OVERVIEW_CONTENT_ROOT_INWARD_PULL) {
  if (state.deepProjectSlug || !Array.isArray(models) || !models.length) {
    return;
  }

  const targets = models.filter(isOverviewContentRootModel);
  if (!targets.length) {
    return;
  }

  const centroid = models.reduce(
    (acc, model) => {
      acc.x += Number(model[xKey]) || 0;
      acc.y += Number(model[yKey]) || 0;
      return acc;
    },
    { x: 0, y: 0 }
  );
  const centerX = centroid.x / models.length;
  const centerY = centroid.y / models.length;
  const radii = models
    .map((model) => Math.hypot((Number(model[xKey]) || 0) - centerX, (Number(model[yKey]) || 0) - centerY))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (!radii.length) {
    return;
  }

  const targetIndex = clamp(Math.round((radii.length - 1) * OVERVIEW_CONTENT_ROOT_TARGET_RADIUS_RATIO), 0, radii.length - 1);
  const targetRadius = Math.max(80, radii[targetIndex]);
  const safeStrength = clamp(Number(strength) || 0, 0, 1);

  for (const model of targets) {
    let dx = (Number(model[xKey]) || 0) - centerX;
    let dy = (Number(model[yKey]) || 0) - centerY;
    let dist = Math.hypot(dx, dy);
    if (dist < 0.0001) {
      const angle = pairAngleJitter(model.slug, "__overview-content-root__", 0);
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      dist = 1;
    }
    if (dist <= targetRadius) {
      continue;
    }
    const nextDist = lerp(dist, targetRadius, safeStrength);
    const scale = nextDist / dist;
    model[xKey] = centerX + dx * scale;
    model[yKey] = centerY + dy * scale;
  }
}

function getOverviewTitleVisibility(zoom) {
  const viewportWidth = state.stageWidth || stage.clientWidth || window.innerWidth || 0;
  const isPhysicalOverview = state.activeType === "physical" && !state.deepProjectSlug;
  if (viewportWidth > MOBILE_TITLE_BREAKPOINT && !isPhysicalOverview) {
    return 1;
  }
  const overviewHome = getActiveOverviewHome();
  const homeZoom = clamp(overviewHome.zoom || state.homeZoom || MIN_ZOOM, MIN_ZOOM, MAX_ZOOM);
  const revealStart = clamp(homeZoom * MOBILE_TITLE_REVEAL_START_FACTOR, MIN_ZOOM, MAX_ZOOM);
  const revealEnd = clamp(homeZoom * MOBILE_TITLE_REVEAL_END_FACTOR, revealStart + 0.04, MAX_ZOOM);
  return clamp((zoom - revealStart) / Math.max(0.0001, revealEnd - revealStart), 0, 1);
}

function rebuildBaseLayout() {
  const models = getBaseGraphModels();
  if (!models.length) {
    return;
  }

  resetBaseGraphLayoutToSeeds(models);

  // Solve overlaps for a slightly lower zoom too, so mobile/overview keeps separation.
  const baseZoom = clamp(Math.min(0.62, state.homeZoom || 0.62), MIN_ZOOM, 0.62);
  resolveOverlapsRadial(models, baseZoom, {
    xKey: "ax",
    yKey: "ay",
    getHalfSize: getOverviewLayoutHalfSize,
    spacingX: 1.16,
    spacingY: 1.2,
    passes: 44,
    strength: 0.27,
    maxPush: 26,
    pullStrength: 0.03,
    pullXKey: "x",
    pullYKey: "y"
  });
  pullOverviewContentRootsTowardCenter(models, "ax", "ay", OVERVIEW_CONTENT_ROOT_INWARD_PULL);

  enforceLayoutAspect(models, "ax", "ay", getTargetBaseAspectRatio(), 1.34);
  resolveOverlapsRadial(models, baseZoom, {
    xKey: "ax",
    yKey: "ay",
    getHalfSize: getOverviewLayoutHalfSize,
    spacingX: 1.18,
    spacingY: 1.22,
    passes: 16,
    strength: 0.24,
    maxPush: 20,
    pullStrength: 0.015,
    pullXKey: "x",
    pullYKey: "y"
  });
  pullOverviewContentRootsTowardCenter(models, "ax", "ay", OVERVIEW_CONTENT_ROOT_INWARD_PULL);

  resolveOverlapsRadial(models, baseZoom, {
    xKey: "ax",
    yKey: "ay",
    getHalfSize: getOverviewLayoutHalfSize,
    spacingX: 1.24,
    spacingY: 1.28,
    passes: 24,
    strength: 0.2,
    maxPush: 18,
    pullStrength: 0.006,
    pullXKey: "x",
    pullYKey: "y"
  });
  pullOverviewContentRootsTowardCenter(models, "ax", "ay", OVERVIEW_CONTENT_ROOT_INWARD_PULL);

  resolveOverlapsStrict(models, baseZoom, {
    xKey: "ax",
    yKey: "ay",
    spacingX: 1.022,
    spacingY: 1.028,
    passes: 6
  });

  for (const model of models) {
    model.x = model.ax;
    model.y = model.ay;
  }
}

function rebuildSpreadLayout() {
  const models = getBaseGraphModels();
  if (!models.length) {
    return;
  }

  const centroid = getAnchorCentroid(models);
  const maxSpread = getSpreadScaleForZoom(MAX_ZOOM);
  for (const model of models) {
    const expanded = getExpandedAnchorPosition(model, MAX_ZOOM, centroid, maxSpread);
    model.bx = expanded.x;
    model.by = expanded.y;
  }

  resolveOverlapsRadial(models, MAX_ZOOM, {
    xKey: "bx",
    yKey: "by",
    getHalfSize: getOverviewLayoutHalfSize,
    spacingX: 1.58,
    spacingY: 1.62,
    passes: 68,
    strength: 0.28,
    maxPush: 30,
    pullStrength: 0.05,
    pullXKey: "ax",
    pullYKey: "ay",
    pullScale: maxSpread
  });
  pullOverviewContentRootsTowardCenter(models, "bx", "by", OVERVIEW_CONTENT_ROOT_SPREAD_PULL);

  enforceLayoutAspect(models, "bx", "by", getTargetSpreadAspectRatio(), 1.42);
  resolveOverlapsRadial(models, MAX_ZOOM, {
    xKey: "bx",
    yKey: "by",
    getHalfSize: getOverviewLayoutHalfSize,
    spacingX: 1.62,
    spacingY: 1.66,
    passes: 24,
    strength: 0.27,
    maxPush: 26,
    pullStrength: 0.025,
    pullXKey: "ax",
    pullYKey: "ay",
    pullScale: maxSpread
  });
  pullOverviewContentRootsTowardCenter(models, "bx", "by", OVERVIEW_CONTENT_ROOT_SPREAD_PULL);

  resolveOverlapsRadial(models, MAX_ZOOM, {
    xKey: "bx",
    yKey: "by",
    getHalfSize: getOverviewLayoutHalfSize,
    spacingX: 1.7,
    spacingY: 1.74,
    passes: 20,
    strength: 0.22,
    maxPush: 22,
    pullStrength: 0.012,
    pullXKey: "ax",
    pullYKey: "ay",
    pullScale: maxSpread
  });
  pullOverviewContentRootsTowardCenter(models, "bx", "by", OVERVIEW_CONTENT_ROOT_SPREAD_PULL);

  resolveOverlapsStrict(models, MAX_ZOOM, {
    xKey: "bx",
    yKey: "by",
    spacingX: 1.018,
    spacingY: 1.024,
    passes: 8
  });
}

function rebuildLayoutsForViewport() {
  rebuildBaseLayout();
  rebuildSpreadLayout();
}

function resolveOverlapsRadial(
  models,
  zoom,
  {
    xKey,
    yKey,
    getHalfSize = null,
    spacingX = 1.1,
    spacingY = 1.1,
    passes = 24,
    strength = 0.24,
    maxPush = 24,
    pullStrength = 0,
    pullXKey = null,
    pullYKey = null,
    pullScale = 1
  }
) {
  if (!models.length) {
    return;
  }

  const sizeResolver = typeof getHalfSize === "function" ? getHalfSize : getModelHalfSize;
  const halfSizeBySlug = new Map(models.map((model) => [model.slug, sizeResolver(model, zoom)]));

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (let i = 0; i < models.length; i += 1) {
      const a = models[i];
      for (let j = i + 1; j < models.length; j += 1) {
        const b = models[j];
        let dx = b[xKey] - a[xKey];
        let dy = b[yKey] - a[yKey];
        const aSize = halfSizeBySlug.get(a.slug) || sizeResolver(a, zoom);
        const bSize = halfSizeBySlug.get(b.slug) || sizeResolver(b, zoom);
        const reqX = Math.max(1, (aSize.w + bSize.w) * spacingX);
        const reqY = Math.max(1, (aSize.h + bSize.h) * spacingY);

        let nx = dx / reqX;
        let ny = dy / reqY;
        let normDist = Math.hypot(nx, ny);
        if (normDist >= 1) {
          continue;
        }

        if (Math.hypot(dx, dy) < 0.0001) {
          const angle = pairAngleJitter(a.slug, b.slug, pass);
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          nx = dx / reqX;
          ny = dy / reqY;
          normDist = Math.hypot(nx, ny);
        }

        const dirLen = Math.hypot(dx, dy) || 1;
        const ux = dx / dirLen;
        const uy = dy / dirLen;
        const overlap = 1 - normDist;
        const directionalReq = Math.hypot(ux * reqX, uy * reqY);
        const correction = Math.min(directionalReq * overlap * strength, maxPush);

        a[xKey] -= ux * correction * 0.5;
        a[yKey] -= uy * correction * 0.5;
        b[xKey] += ux * correction * 0.5;
        b[yKey] += uy * correction * 0.5;
        moved = true;
      }
    }

    if (pullStrength > 0) {
      for (const model of models) {
        const tx = pullXKey ? model[pullXKey] * pullScale : 0;
        const ty = pullYKey ? model[pullYKey] * pullScale : 0;
        model[xKey] += (tx - model[xKey]) * pullStrength;
        model[yKey] += (ty - model[yKey]) * pullStrength;
      }
    }

    if (!moved && pass > 5) {
      break;
    }
  }
}

function resolveOverlapsStrict(
  models,
  zoom,
  { xKey, yKey, getHalfSize = null, spacingX = 1.03, spacingY = 1.04, passes = 16 }
) {
  if (!models.length) {
    return;
  }

  const sizeResolver = typeof getHalfSize === "function" ? getHalfSize : getModelHalfSize;
  const halfSizeBySlug = new Map(models.map((model) => [model.slug, sizeResolver(model, zoom)]));

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (let i = 0; i < models.length; i += 1) {
      const a = models[i];
      for (let j = i + 1; j < models.length; j += 1) {
        const b = models[j];
        let dx = b[xKey] - a[xKey];
        let dy = b[yKey] - a[yKey];
        const aSize = halfSizeBySlug.get(a.slug) || sizeResolver(a, zoom);
        const bSize = halfSizeBySlug.get(b.slug) || sizeResolver(b, zoom);
        const reqX = Math.max(1, (aSize.w + bSize.w) * spacingX);
        const reqY = Math.max(1, (aSize.h + bSize.h) * spacingY);

        let nx = dx / reqX;
        let ny = dy / reqY;
        let normDist = Math.hypot(nx, ny);
        if (normDist >= 1) {
          continue;
        }

        if (Math.hypot(dx, dy) < 0.0001) {
          const angle = pairAngleJitter(a.slug, b.slug, pass + 77);
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          nx = dx / reqX;
          ny = dy / reqY;
          normDist = Math.hypot(nx, ny);
        }

        const dirLen = Math.hypot(dx, dy) || 1;
        const ux = dx / dirLen;
        const uy = dy / dirLen;
        const overlap = 1 - normDist;
        const directionalReq = Math.hypot(ux * reqX, uy * reqY);
        const correction = directionalReq * overlap;

        a[xKey] -= ux * correction * 0.5;
        a[yKey] -= uy * correction * 0.5;
        b[xKey] += ux * correction * 0.5;
        b[yKey] += uy * correction * 0.5;
        moved = true;
      }
    }

    if (!moved && pass > 3) {
      break;
    }
  }
}

function getModelFallbackWorldBoundsAtZoom(model, zoom) {
  const position = getModelPositionAtZoom(model, zoom);
  const size = getModelHalfSize(model, zoom);
  return {
    minX: position.x - size.w,
    maxX: position.x + size.w,
    minY: position.y - size.h,
    maxY: position.y + size.h
  };
}

function getModelWorldBoundsSnapshot(models, zoom, { useDeepScale = false, includeNotes = false } = {}) {
  const out = new Map();
  for (const model of models) {
    const rawBounds =
      getModelMediaWorldBoundsAtZoom(model, zoom, { useDeepScale, includeNotes }) ||
      getModelFallbackWorldBoundsAtZoom(model, zoom);
    out.set(model.slug, {
      minX: rawBounds.minX,
      maxX: rawBounds.maxX,
      minY: rawBounds.minY,
      maxY: rawBounds.maxY
    });
  }
  return out;
}

function countWorldBoundsOverlaps(models, zoom, { useDeepScale = false, includeNotes = false, gap = 0 } = {}) {
  if (!Array.isArray(models) || models.length < 2) {
    return 0;
  }

  const snapshot = getModelWorldBoundsSnapshot(models, zoom, { useDeepScale, includeNotes });
  let overlaps = 0;
  for (let i = 0; i < models.length; i += 1) {
    const aBoxRaw = snapshot.get(models[i].slug);
    if (!aBoxRaw) {
      continue;
    }
    for (let j = i + 1; j < models.length; j += 1) {
      const bBoxRaw = snapshot.get(models[j].slug);
      if (!bBoxRaw) {
        continue;
      }
      const overlapX = Math.min(aBoxRaw.maxX + gap, bBoxRaw.maxX + gap) - Math.max(aBoxRaw.minX - gap, bBoxRaw.minX - gap);
      const overlapY = Math.min(aBoxRaw.maxY + gap, bBoxRaw.maxY + gap) - Math.max(aBoxRaw.minY - gap, bBoxRaw.minY - gap);
      if (overlapX > 0 && overlapY > 0) {
        overlaps += 1;
      }
    }
  }
  return overlaps;
}

function shiftWorldBoundsBox(box, dx = 0, dy = 0) {
  if (!box || (!dx && !dy)) {
    return box;
  }
  box.minX += dx;
  box.maxX += dx;
  box.minY += dy;
  box.maxY += dy;
  return box;
}

function resolveWorldBoundsOverlaps(
  models,
  zoom,
  { useDeepScale = false, includeNotes = false, gap = 8, passes = 12, maxPush = 20 } = {}
) {
  if (!Array.isArray(models) || models.length < 2) {
    return;
  }

  const worldBoundsBySlug = new Map();
  const getBounds = (model) => {
    let bounds = worldBoundsBySlug.get(model.slug);
    if (!bounds) {
      const rawBounds =
        getModelMediaWorldBoundsAtZoom(model, zoom, { useDeepScale, includeNotes }) ||
        getModelFallbackWorldBoundsAtZoom(model, zoom);
      bounds = {
        minX: rawBounds.minX,
        maxX: rawBounds.maxX,
        minY: rawBounds.minY,
        maxY: rawBounds.maxY
      };
      worldBoundsBySlug.set(model.slug, bounds);
    }
    return bounds;
  };

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (let i = 0; i < models.length; i += 1) {
      const a = models[i];
      for (let j = i + 1; j < models.length; j += 1) {
        const b = models[j];
        const aBoxRaw = getBounds(a);
        const bBoxRaw = getBounds(b);

        const aBox = {
          minX: aBoxRaw.minX - gap,
          maxX: aBoxRaw.maxX + gap,
          minY: aBoxRaw.minY - gap,
          maxY: aBoxRaw.maxY + gap
        };
        const bBox = {
          minX: bBoxRaw.minX - gap,
          maxX: bBoxRaw.maxX + gap,
          minY: bBoxRaw.minY - gap,
          maxY: bBoxRaw.maxY + gap
        };

        const overlapX = Math.min(aBox.maxX, bBox.maxX) - Math.max(aBox.minX, bBox.minX);
        const overlapY = Math.min(aBox.maxY, bBox.maxY) - Math.max(aBox.minY, bBox.minY);
        if (overlapX <= 0 || overlapY <= 0) {
          continue;
        }

        let dx = (a.ax || 0) - (b.ax || 0);
        let dy = (a.ay || 0) - (b.ay || 0);
        if (Math.hypot(dx, dy) < 0.0001) {
          const angle = pairAngleJitter(a.slug, b.slug, pass + 211);
          dx = Math.cos(angle);
          dy = Math.sin(angle);
        }

        if (overlapX <= overlapY) {
          const sx = dx >= 0 ? 1 : -1;
          const push = Math.min(maxPush, overlapX * 0.52);
          const aDx = sx * push * 0.5;
          const bDx = -sx * push * 0.5;
          a.ax += aDx;
          b.ax += bDx;
          shiftWorldBoundsBox(aBoxRaw, aDx, 0);
          shiftWorldBoundsBox(bBoxRaw, bDx, 0);
        } else {
          const sy = dy >= 0 ? 1 : -1;
          const push = Math.min(maxPush, overlapY * 0.52);
          const aDy = sy * push * 0.5;
          const bDy = -sy * push * 0.5;
          a.ay += aDy;
          b.ay += bDy;
          shiftWorldBoundsBox(aBoxRaw, 0, aDy);
          shiftWorldBoundsBox(bBoxRaw, 0, bDy);
        }
        moved = true;
      }
    }

    if (!moved && pass > 2) {
      break;
    }
  }
}

function getDeepModeMediaScaleAtZoom(zoom) {
  return getMediaScaleAtZoom(zoom);
}

function getMediaNoteDataForModelMedia(project, model, media, mediaIndex) {
  if (!project || !model || !media) {
    return null;
  }

  if (model.nodeType === "content") {
    if (mediaIndex !== 0) {
      return null;
    }
    const label = typeof project.title === "string" ? project.title.trim() : "";
    const description = typeof project.detailsText === "string" ? project.detailsText.trim() : "";
    if (!label && !description) {
      return null;
    }
    return { label, description };
  }

  const item = getProjectContentItemBySrc(project, media.src);
  if (!item) {
    return null;
  }
  const label = typeof item.label === "string" ? item.label.trim() : "";
  const description = typeof item.description === "string" ? item.description.trim() : "";
  if (!label && !description) {
    return null;
  }
  return { label, description };
}

function estimateWrappedLineCount(text, charsPerLine) {
  if (typeof text !== "string" || !text.length) {
    return 0;
  }
  const safeCharsPerLine = Math.max(1, Math.floor(charsPerLine));
  let lines = 0;
  for (const row of text.split(/\r?\n/)) {
    if (!row.length) {
      lines += 1;
      continue;
    }
    lines += Math.max(1, Math.ceil(row.length / safeCharsPerLine));
  }
  return lines;
}

function getEstimatedMediaNoteWorldHeight(noteData, noteWidthWorld, zoom) {
  if (!noteData) {
    return 0;
  }

  const safeZoom = Math.max(0.0001, zoom);
  const lineHeightWorld = 20 / safeZoom;
  let height = 0;

  if (noteData.label) {
    height += lineHeightWorld;
  }

  if (noteData.description) {
    const noteWidthScreen = Math.max(1, noteWidthWorld * safeZoom);
    const charsPerLine = Math.max(10, Math.floor(noteWidthScreen / TITLE_CHAR_WIDTH));
    const bodyLines = estimateWrappedLineCount(noteData.description, charsPerLine);
    height += CONTENT_MEDIA_NOTE_GAP / safeZoom;
    height += Math.max(1, bodyLines) * lineHeightWorld;
  }

  return height;
}

function getModelMediaWorldBoxesAtZoom(
  model,
  zoom,
  { useDeepScale = false, includeNotes = false, useModelPosition = false } = {}
) {
  if (!model) {
    return [];
  }
  const project = getDisplayProject(model);
  const mediaLayoutFar = mediaLayoutBySlug.get(model.slug) || project?.media || [];
  const mediaLayoutClose = mediaLayoutCloseBySlug.get(model.slug) || mediaLayoutFar;
  if (!Array.isArray(mediaLayoutFar) || !mediaLayoutFar.length) {
    return [];
  }

  const origin = getMediaLayoutOrigin(mediaLayoutFar);
  const scale = useDeepScale ? getDeepModeMediaScaleAtZoom(zoom) : getMediaScaleAtZoom(zoom);
  const layoutT = state.deepProjectSlug
    ? Number.isFinite(state.deepEntryMediaLayoutT)
      ? state.deepEntryMediaLayoutT
      : 0
    : getMediaLayoutTAtZoom(zoom);
  const safeZoom = Math.max(0.0001, zoom);
  const anchorPosition = useModelPosition
    ? getModelPositionAtZoom(model, zoom)
    : state.deepProjectSlug && model.slug === state.deepProjectSlug
      ? getDeepRootAnchorPosition(model)
      : {
          x: Number.isFinite(model.ax) ? model.ax : model.x,
          y: Number.isFinite(model.ay) ? model.ay : model.y
        };
  const baseX = anchorPosition.x - model.centerX;
  const baseY = anchorPosition.y - model.centerY;
  const boxes = [];

  const maxReferenceZoom = useDeepScale ? getCurrentMaxZoom() : MAX_ZOOM;
  const maxReferenceScale = useDeepScale
    ? getDeepModeMediaScaleAtZoom(maxReferenceZoom)
    : getMediaScaleAtZoom(maxReferenceZoom);
  const mediaMaxScreenScale = maxReferenceScale * maxReferenceZoom;

  for (const [mediaIndex, media] of mediaLayoutFar.entries()) {
    const mediaClose = mediaLayoutClose[mediaIndex] || media;
    const x = lerp(Number(media?.x) || 0, Number(mediaClose?.x) || 0, layoutT);
    const y = lerp(Number(media?.y) || 0, Number(mediaClose?.y) || 0, layoutT);
    const w = Math.max(1, Number(media?.w) || Number(mediaClose?.w) || 180);
    const h = Math.max(1, Number(media?.h) || Number(mediaClose?.h) || 180);

    const scaledX = origin.x + (x - origin.x) * scale;
    const scaledY = origin.y + (y - origin.y) * scale;
    const scaledW = w * scale;
    const scaledH = h * scale;
    const mediaBox = {
      kind: "media",
      mediaIndex,
      minX: baseX + scaledX,
      maxX: baseX + scaledX + scaledW,
      minY: baseY + scaledY,
      maxY: baseY + scaledY + scaledH
    };
    boxes.push(mediaBox);

    if (!includeNotes) {
      continue;
    }
    const noteData = getMediaNoteDataForModelMedia(project, model, media, mediaIndex);
    if (!noteData) {
      continue;
    }

    const noteWidthWorld = Math.max(1, (w * mediaMaxScreenScale) / safeZoom);
    const noteHeightWorld = getEstimatedMediaNoteWorldHeight(noteData, noteWidthWorld, safeZoom);
    if (noteHeightWorld <= 0) {
      continue;
    }

    const noteGapWorld = CONTENT_MEDIA_NOTE_GAP / safeZoom;
    const noteBox = {
      kind: "note",
      mediaIndex,
      minX: mediaBox.minX,
      maxX: mediaBox.minX + noteWidthWorld,
      minY: mediaBox.maxY + noteGapWorld,
      maxY: mediaBox.maxY + noteGapWorld + noteHeightWorld
    };
    boxes.push(noteBox);
  }

  return boxes;
}

function getModelMediaWorldBoundsAtZoom(
  model,
  zoom,
  { useDeepScale = false, includeNotes = false, useModelPosition = false } = {}
) {
  const boxes = getModelMediaWorldBoxesAtZoom(model, zoom, { useDeepScale, includeNotes, useModelPosition });
  if (!boxes.length) {
    return null;
  }
  let worldBounds = null;
  for (const box of boxes) {
    worldBounds = worldBounds
      ? unionBox(worldBounds, box)
      : { minX: box.minX, maxX: box.maxX, minY: box.minY, maxY: box.maxY };
  }
  return worldBounds;
}

function pushModelsOutsideWorldBox(
  models,
  worldBox,
  zoom,
  { marginX = 1.02, marginY = 1.03, passes = 10, maxPush = 36, edgePad = 8 } = {}
) {
  if (!worldBox || !models.length) {
    return;
  }

  const halfSizeBySlug = new Map(models.map((model) => [model.slug, getModelHalfSize(model, zoom)]));

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (const model of models) {
      const size = halfSizeBySlug.get(model.slug) || getModelHalfSize(model, zoom);
      const minX = worldBox.minX - size.w * marginX;
      const maxX = worldBox.maxX + size.w * marginX;
      const minY = worldBox.minY - size.h * marginY;
      const maxY = worldBox.maxY + size.h * marginY;
      const cx = model.ax;
      const cy = model.ay;

      if (!(cx > minX && cx < maxX && cy > minY && cy < maxY)) {
        continue;
      }

      const leftPen = cx - minX;
      const rightPen = maxX - cx;
      const topPen = cy - minY;
      const bottomPen = maxY - cy;
      const minPen = Math.min(leftPen, rightPen, topPen, bottomPen);
      const correction = Math.min(maxPush, minPen + edgePad);

      if (minPen === leftPen) {
        model.ax -= correction;
      } else if (minPen === rightPen) {
        model.ax += correction;
      } else if (minPen === topPen) {
        model.ay -= correction;
      } else {
        model.ay += correction;
      }
      moved = true;
    }

    if (!moved && pass > 2) {
      break;
    }
  }
}

function pushModelWorldBoundsOutsideBox(
  models,
  worldBox,
  zoom,
  { useDeepScale = false, includeNotes = false, gap = 0, passes = 10, maxPush = 30 } = {}
) {
  if (!worldBox || !models.length) {
    return false;
  }

  const expanded = {
    minX: worldBox.minX - gap,
    maxX: worldBox.maxX + gap,
    minY: worldBox.minY - gap,
    maxY: worldBox.maxY + gap
  };
  const boxCenterX = (expanded.minX + expanded.maxX) * 0.5;
  const boxCenterY = (expanded.minY + expanded.maxY) * 0.5;
  const worldBoundsBySlug = new Map();
  const getBounds = (model) => {
    let bounds = worldBoundsBySlug.get(model.slug);
    if (!bounds) {
      const rawBounds =
        getModelMediaWorldBoundsAtZoom(model, zoom, { useDeepScale, includeNotes }) ||
        getModelFallbackWorldBoundsAtZoom(model, zoom);
      bounds = {
        minX: rawBounds.minX,
        maxX: rawBounds.maxX,
        minY: rawBounds.minY,
        maxY: rawBounds.maxY
      };
      worldBoundsBySlug.set(model.slug, bounds);
    }
    return bounds;
  };
  let movedAny = false;

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (const model of models) {
      const worldBounds = getBounds(model);

      const overlapX = Math.min(worldBounds.maxX, expanded.maxX) - Math.max(worldBounds.minX, expanded.minX);
      const overlapY = Math.min(worldBounds.maxY, expanded.maxY) - Math.max(worldBounds.minY, expanded.minY);
      if (overlapX <= 0 || overlapY <= 0) {
        continue;
      }

      let dx = (worldBounds.minX + worldBounds.maxX) * 0.5 - boxCenterX;
      let dy = (worldBounds.minY + worldBounds.maxY) * 0.5 - boxCenterY;
      if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
        const angle = pairAngleJitter(model.slug, "__root__", pass + 341);
        dx = Math.cos(angle);
        dy = Math.sin(angle);
      }

      if (overlapX <= overlapY) {
        const sx = dx >= 0 ? 1 : -1;
        const correction = Math.min(maxPush, overlapX + 0.5);
        const moveX = sx * correction;
        model.ax += moveX;
        shiftWorldBoundsBox(worldBounds, moveX, 0);
      } else {
        const sy = dy >= 0 ? 1 : -1;
        const correction = Math.min(maxPush, overlapY + 0.5);
        const moveY = sy * correction;
        model.ay += moveY;
        shiftWorldBoundsBox(worldBounds, 0, moveY);
      }
      moved = true;
      movedAny = true;
    }

    if (!moved && pass > 2) {
      break;
    }
  }

  return movedAny;
}

function pushModelWorldBoundsOutsideBoxes(
  models,
  worldBoxes,
  zoom,
  { useDeepScale = false, includeNotes = false, gap = 0, passes = 8, maxPush = 20 } = {}
) {
  if (!Array.isArray(worldBoxes) || !worldBoxes.length || !models.length) {
    return;
  }

  const boxes = worldBoxes
    .filter((box) => box && Number.isFinite(box.minX) && Number.isFinite(box.maxX) && Number.isFinite(box.minY) && Number.isFinite(box.maxY))
    .map((box) => ({
      minX: box.minX,
      maxX: box.maxX,
      minY: box.minY,
      maxY: box.maxY
    }));
  if (!boxes.length) {
    return;
  }

  for (let pass = 0; pass < passes; pass += 1) {
    let moved = false;
    for (const box of boxes) {
      const boxMoved = pushModelWorldBoundsOutsideBox(models, box, zoom, {
        useDeepScale,
        includeNotes,
        gap,
        passes: 1,
        maxPush
      });
      moved = moved || boxMoved;
    }
    if (!moved && pass > 2) {
      break;
    }
  }
}

function getDenseDeepLayoutPassCount(childCount = 0) {
  if (childCount >= 72) {
    return 4;
  }
  if (childCount >= 52) {
    return 3;
  }
  if (childCount >= 36) {
    return 2;
  }
  if (childCount >= 24) {
    return 1;
  }
  return 0;
}

function expandModelsAwayFromPoint(models, originX, originY, scale = 1.06, minStep = 0) {
  if (!Array.isArray(models) || !models.length) {
    return;
  }

  const safeScale = Math.max(1, Number(scale) || 1);
  const safeStep = Math.max(0, Number(minStep) || 0);
  for (const model of models) {
    let dx = model.ax - originX;
    let dy = model.ay - originY;
    let dist = Math.hypot(dx, dy);
    if (dist < 0.0001) {
      const angle = pairAngleJitter(model.slug, "__dense-expand__", 0);
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      dist = 1;
    }
    const targetDist = dist * safeScale + safeStep;
    const factor = targetDist / dist;
    model.ax = originX + dx * factor;
    model.ay = originY + dy * factor;
  }
}

function relaxDenseDeepLayout(
  models,
  rootX,
  rootY,
  zoom,
  {
    useDeepScale = false,
    includeNotes = false,
    rootMediaBounds = null,
    rootObstacleBoxes = [],
    deepLayoutZoom = zoom,
    passes = 2,
    baseGap = 10
  } = {}
) {
  if (!Array.isArray(models) || models.length < 2 || passes <= 0) {
    return;
  }

  let overlapCount = countWorldBoundsOverlaps(models, zoom, {
    useDeepScale,
    includeNotes,
    gap: baseGap
  });
  if (overlapCount <= 0) {
    return;
  }

  for (let pass = 0; pass < passes; pass += 1) {
    const densityT = clamp(overlapCount / Math.max(1, models.length * 0.45), 0, 1);
    expandModelsAwayFromPoint(models, rootX, rootY, lerp(1.04, 1.12, densityT), lerp(2, 10, densityT));

    resolveWorldBoundsOverlaps(models, zoom, {
      useDeepScale,
      includeNotes,
      gap: baseGap + pass * 2,
      passes: 6 + pass * 2,
      maxPush: 18 + pass * 4
    });
    resolveOverlapsStrict(models, zoom, {
      xKey: "ax",
      yKey: "ay",
      spacingX: 1.01,
      spacingY: 1.016,
      passes: 3 + pass
    });

    if (rootMediaBounds) {
      pushModelsOutsideWorldBox(models, rootMediaBounds, deepLayoutZoom, {
        marginX: 1.006 + pass * 0.002,
        marginY: 1.01 + pass * 0.002,
        passes: 2 + pass,
        maxPush: 12 + pass * 3,
        edgePad: 4 + pass
      });
    }
    if (Array.isArray(rootObstacleBoxes) && rootObstacleBoxes.length) {
      pushModelWorldBoundsOutsideBoxes(models, rootObstacleBoxes, deepLayoutZoom, {
        useDeepScale,
        includeNotes,
        gap: baseGap,
        passes: 2 + pass,
        maxPush: 16 + pass * 4
      });
    }

    const nextOverlapCount = countWorldBoundsOverlaps(models, zoom, {
      useDeepScale,
      includeNotes,
      gap: Math.max(4, baseGap - 2)
    });
    if (nextOverlapCount <= 0) {
      break;
    }
    overlapCount = nextOverlapCount;
  }
}

function constrainModelsToRing(models, rootX, rootY, minRadius, maxRadius, pass = 0) {
  if (!Array.isArray(models) || !models.length) {
    return;
  }

  const safeMin = Math.max(0, Number(minRadius) || 0);
  const safeMax = Math.max(safeMin + 1, Number(maxRadius) || safeMin + 1);

  for (const model of models) {
    let dx = model.ax - rootX;
    let dy = model.ay - rootY;
    let dist = Math.hypot(dx, dy);
    if (dist < 0.0001) {
      const angle = pairAngleJitter(model.slug, "__ring__", pass + 503);
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      dist = 1;
    }

    const targetDist = clamp(dist, safeMin, safeMax);
    if (Math.abs(targetDist - dist) < 0.01) {
      continue;
    }

    const scale = targetDist / dist;
    model.ax = rootX + dx * scale;
    model.ay = rootY + dy * scale;
  }
}

function getEllipseRadiusAtAngle(radiusX, radiusY, angle) {
  const safeRadiusX = Math.max(1, Number(radiusX) || 1);
  const safeRadiusY = Math.max(1, Number(radiusY) || 1);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const denom = Math.sqrt((cos * cos) / (safeRadiusX * safeRadiusX) + (sin * sin) / (safeRadiusY * safeRadiusY));
  if (!Number.isFinite(denom) || denom <= 0.000001) {
    return Math.max(safeRadiusX, safeRadiusY);
  }
  return 1 / denom;
}

function constrainModelsToEllipse(
  models,
  rootX,
  rootY,
  minRadiusX,
  minRadiusY,
  maxRadiusX,
  maxRadiusY,
  pass = 0
) {
  if (!Array.isArray(models) || !models.length) {
    return;
  }

  const safeMinX = Math.max(1, Number(minRadiusX) || 1);
  const safeMinY = Math.max(1, Number(minRadiusY) || 1);
  const safeMaxX = Math.max(safeMinX + 1, Number(maxRadiusX) || safeMinX + 1);
  const safeMaxY = Math.max(safeMinY + 1, Number(maxRadiusY) || safeMinY + 1);

  for (const model of models) {
    let dx = model.ax - rootX;
    let dy = model.ay - rootY;
    let dist = Math.hypot(dx, dy);
    if (dist < 0.0001) {
      const angle = pairAngleJitter(model.slug, "__ellipse__", pass + 677);
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      dist = 1;
    }

    const angle = Math.atan2(dy, dx);
    const innerBoundary = getEllipseRadiusAtAngle(safeMinX, safeMinY, angle);
    const outerBoundary = getEllipseRadiusAtAngle(safeMaxX, safeMaxY, angle);
    const targetDist = clamp(dist, innerBoundary, outerBoundary);
    if (Math.abs(targetDist - dist) < 0.01) {
      continue;
    }

    const scale = targetDist / dist;
    model.ax = rootX + dx * scale;
    model.ay = rootY + dy * scale;
  }
}

function enforceLayoutAspect(models, xKey, yKey, targetRatio, maxScale = 1.36) {
  if (models.length < 2) {
    return;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let cx = 0;
  let cy = 0;

  for (const model of models) {
    minX = Math.min(minX, model[xKey]);
    maxX = Math.max(maxX, model[xKey]);
    minY = Math.min(minY, model[yKey]);
    maxY = Math.max(maxY, model[yKey]);
    cx += model[xKey];
    cy += model[yKey];
  }

  cx /= models.length;
  cy /= models.length;

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const ratio = spanX / spanY;
  if (ratio <= 0) {
    return;
  }

  let scaleX = 1;
  let scaleY = 1;
  if (ratio < targetRatio) {
    scaleX = clamp(targetRatio / ratio, 1, maxScale);
    scaleY = clamp(1 - (scaleX - 1) * 0.14, 0.86, 1);
  } else if (ratio > targetRatio * 1.16) {
    scaleY = clamp(ratio / targetRatio, 1, maxScale);
    scaleX = clamp(1 - (scaleY - 1) * 0.1, 0.9, 1);
  } else {
    return;
  }

  for (const model of models) {
    model[xKey] = cx + (model[xKey] - cx) * scaleX;
    model[yKey] = cy + (model[yKey] - cy) * scaleY;
  }
}

function enforceLayoutAspectAroundPoint(models, xKey, yKey, originX, originY, targetRatio, maxScale = 1.36) {
  if (models.length < 2) {
    return;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const model of models) {
    const x = Number(model[xKey]);
    const y = Number(model[yKey]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      continue;
    }
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const ratio = spanX / spanY;
  if (ratio <= 0) {
    return;
  }

  let scaleX = 1;
  let scaleY = 1;
  if (ratio < targetRatio) {
    scaleX = clamp(targetRatio / ratio, 1, maxScale);
    scaleY = clamp(1 - (scaleX - 1) * 0.14, 0.84, 1);
  } else if (ratio > targetRatio * 1.16) {
    scaleY = clamp(ratio / targetRatio, 1, maxScale);
    scaleX = clamp(1 - (scaleY - 1) * 0.1, 0.9, 1);
  } else {
    return;
  }

  for (const model of models) {
    model[xKey] = originX + (model[xKey] - originX) * scaleX;
    model[yKey] = originY + (model[yKey] - originY) * scaleY;
  }
}

function getTargetBaseAspectRatio() {
  const rect = stage.getBoundingClientRect();
  const aspect = (rect.width || window.innerWidth || 1440) / Math.max(1, rect.height || window.innerHeight || 900);
  if (aspect >= 1.55) {
    return 1.92;
  }
  if (aspect >= 1.25) {
    return 1.68;
  }
  if (aspect >= 1) {
    return 1.48;
  }
  return 1.08;
}

function getTargetSpreadAspectRatio() {
  return getTargetBaseAspectRatio() + 0.1;
}

function getTargetDeepAspectRatio(childCount = 0) {
  const densityT = clamp((childCount - 8) / 32, 0, 1);
  if (isMobileViewport()) {
    return lerp(1.06, 1.2, densityT);
  }
  return getTargetBaseAspectRatio() + lerp(0.18, 0.42, densityT);
}

function getDeepLayoutAspectStretch(childCount = 0) {
  const targetRatio = getTargetDeepAspectRatio(childCount);
  const stretch = clamp(
    Math.sqrt(targetRatio),
    isMobileViewport() ? 1.02 : 1.08,
    isMobileViewport() ? 1.12 : 1.44
  );
  return {
    x: stretch,
    y: 1 / stretch
  };
}

function pairAngleJitter(slugA, slugB, pass) {
  const pair = slugA < slugB ? `${slugA}|${slugB}|${pass}` : `${slugB}|${slugA}|${pass}`;
  const hash = hashString(pair);
  return (hash % 6283) / 1000;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
