const mediaPath = (filename) => new URL(`../memory/aumi/${filename}`, import.meta.url).href;
const contentMedia = (filename, options = {}) => ({
  src: mediaPath(filename),
  role: options.role || "",
  size: options.size || "m",
  w: options.w,
  h: options.h,
  r: options.r || "0deg"
});

const makeContentItem = (id, filename, label, description = "", mediaOptions = {}) => ({
  id,
  label,
  description,
  media: contentMedia(filename, mediaOptions)
});

const aumiContentItems = [
  makeContentItem("cover", "aumi-cover.png", "LOGO AUMI", "", { role: "logo", size: "l", w: 1976, h: 1118 }),
  makeContentItem("logo", "aumi-logo.svg", "LOGO AUMI", "", { role: "logo", size: "m", w: 384, h: 95 }),
  makeContentItem(
    "logo-concept",
    "aumi-logo-concept.png",
    "DRAWING",
    "As the foundation of the brand's form language, we chose a ring shape that became the letter A in \"AUMI\".",
    { size: "s", w: 1756, h: 996 }
  ),
  makeContentItem("visualization-1", "aumi-visualization-1.png", "LOGO AUMI", "", { size: "m", w: 1756, h: 992 }),
  makeContentItem("visualization-2", "aumi-visualization-2.png", "LOGO AUMI", "", { size: "m", w: 1828, h: 1032 }),
  makeContentItem("picasso", "Pablo_Picasso-La_Colombe-1949.jpg", "PABLO PICASSO - LA COLOMBE - 1949", "", {
    size: "s",
    w: 329,
    h: 249
  }),
  makeContentItem(
    "matisse-gerbe",
    "Henri_Matisse-La_Gerbe-1953.jpg",
    "HENRI MATISSE - NU BLEU II - 1952",
    "",
    { size: "s", w: 468, h: 600 }
  ),
  makeContentItem(
    "matisse-nu-bleu",
    "Henri_Matisse-Nu_bleu_II-1952.jpg",
    "HENRI MATISSE - LA GERBE - 1953",
    "",
    { size: "m", w: 1680, h: 1405 }
  ),
  makeContentItem(
    "candor",
    "Candor illaesus.jpg",
    "REFERENCE",
    "The name AUMI comes from the Pole Star: Alpha Ursae Minoris, or \"alpha UMi\".",
    { size: "s", w: 391, h: 600 }
  ),
  makeContentItem(
    "pleiades",
    "Pleiades Sidereus Nuncius.jpg",
    "REFERENCE",
    "\"Lucy in the sky with diamonds\", \"We're like diamonds in the sky\" - we often describe diamonds as stars in the sky. But this is not the only connection between jewelry and astronomy. Many precious metals did not originate on Earth. The formation of most heavy metals is the result of collisions between two neutron stars, a process that produces uranium, iridium, gold, and platinum. Jewelry is a fragment of distant stars that remains with us.",
    { size: "m", w: 737, h: 1024 }
  ),
  makeContentItem(
    "illustrations",
    "aumi-illustrations.png",
    "ILLUSTRATION",
    "The plastic language is inspired by Matisse's late works and the soft linework of Picasso. From this reference emerged a flat, silhouette-based illustration style upon which AUMI jewelry is carefully placed.",
    { size: "l", w: 1978, h: 1118 }
  ),
  makeContentItem("instagram", "aumi-jewelry-instagram.png", "@AUMI.JEWELRY", "", {
    size: "s",
    w: 1179,
    h: 2556
  }),
  makeContentItem(
    "pack-1",
    "aumi-pack-1.png",
    "PACK AUMI",
    "AUMI packaging is made from a single sheet of thick colored paper. The structure is unified and folds into a box without additional fasteners, glue, or locks.",
    { size: "l", w: 1400, h: 957 }
  ),
  makeContentItem("pack-2", "aumi-pack-2.png", "PACK AUMI", "", { size: "m", w: 1878, h: 1058 }),
  makeContentItem("pack-3", "aumi-pack-3.png", "PACK AUMI", "", { size: "m", w: 1876, h: 1064 }),
  makeContentItem("pack-4", "aumi-pack-4.png", "PACK AUMI", "", { size: "m", w: 1872, h: 1062 }),
  makeContentItem(
    "pack-5",
    "aumi-pack-5.png",
    "PACK AUMI",
    "The packaging color is based on stellar thermal spectrometry. The hotter the star, the cooler the color used to visualize it.",
    { size: "m", w: 2080, h: 1176 }
  ),
  makeContentItem("poster-1", "aumi-poster-1.jpg", "POSTER", "", { size: "m", w: 596, h: 843 }),
  makeContentItem("poster-2", "aumi-poster-2.jpg", "POSTER", "", { size: "m", w: 597, h: 845 })
];

export const projects = [
  {
    slug: "aumi",
    title: "AUMI",
    types: ["strategy", "naming", "identity", "physical"],
    client: "Aumi",
    location: "Russia",
    year: 2022,
    introText:
      "Moonlight illuminates my path as I walk, opening new points on the map. Cold air, warm hands. When the Moon sets, the star that is always with me will help me find the way.",
    focusZoom: 1.85,
    moreLabel: "SEE MORE",
    contentItems: aumiContentItems,
    media: [
      { src: mediaPath("aumi-logo.svg"), role: "logo", size: "m", x: 132, y: -176, w: 220, h: 94, r: "0deg" },
      { src: mediaPath("aumi-pack-1.png"), size: "l", x: -122, y: 22, w: 206, h: 141, r: "0deg" }
    ]
  },
  {
    slug: "fabble",
    title: "Fabble",
    types: ["naming"],
    client: "Fabble",
    location: "Russia",
    year: 2020
  },
  {
    slug: "i-love-supersport",
    title: "I Love SuperSport",
    types: ["naming"],
    client: "SuperSport",
    location: "Moscow",
    year: 2022,
    detailsText: "International sport school helping you to be Super and to be Sport."
  },
  {
    slug: "life-control",
    title: "Life Control",
    types: ["naming"],
    client: "Life Control",
    location: "Moscow",
    year: 2022
  },
  {
    slug: "mute",
    title: "Mute",
    types: ["naming"],
    client: "Mute",
    location: "Moscow",
    year: 2021
  },
  {
    slug: "noda",
    title: "Noda",
    types: ["naming"],
    client: "Noda",
    location: "New York",
    year: 2020
  },
  {
    slug: "nuum",
    title: "Nuum",
    types: ["naming"],
    client: "MTS",
    location: "Moscow",
    year: 2022
  },
  {
    slug: "sensorium",
    title: "Sensorium",
    types: ["naming"],
    client: "Sensorium",
    location: "Moscow",
    year: 2022,
    detailsText: "VR social platform that revolutionizes digital communications through a sense of presence."
  }
];
