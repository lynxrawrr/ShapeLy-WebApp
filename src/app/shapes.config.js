/* Shape init functions */
import { initCube } from "../shapes/cube/initCube.js";
import { initCuboid } from "../shapes/cuboid/initCuboid.js";
import { initCone } from "../shapes/cone/initCone.js";
import { initCylinder } from "../shapes/cylinder/initCylinder.js";
import { initPyramid } from "../shapes/pyramid/initPyramid.js";

/* Icons */
import { FiBox } from "react-icons/fi";
import { LuCuboid, LuCone } from "react-icons/lu";
import { GrCube } from "react-icons/gr";
import { TbCylinder, TbPyramid } from "react-icons/tb";

/* Shapes registry */
export const SHAPES = [
  {
    key: "cube",
    title: "Kubus",
    icon: GrCube,
    desc: "Bangun ruang sisi datar dengan enam sisi persegi yang kongruen dan dua belas rusuk sama panjang.",
    initFn: initCube,
    formulas: [
      { label: "Volume", value: "V = a³" },
      { label: "Luas Permukaan", value: "A = 6 × a²" },
    ],
    defaultExample: {
      lines: ["a = 10 cm", "V = 10³ = 1000 cm³", "A = 6 × 10² = 600 cm²"],
    },
  },

  {
    key: "cuboid",
    title: "Balok",
    icon: LuCuboid,
    desc: "Bangun ruang sisi datar dengan tiga pasang sisi persegi panjang yang berhadapan dan kongruen.",
    initFn: initCuboid,
    formulas: [
      { label: "Volume", value: "V = p × l × t" },
      { label: "Luas Permukaan", value: "A = 2(pl + pt + lt)" },
    ],
    defaultExample: {
      lines: ["p = 30 cm, l = 20 cm, t = 15 cm", "V = 9000 cm³", "A = 2700 cm²"],
    },
  },

  {
    key: "cone",
    title: "Kerucut",
    icon: LuCone,
    desc: "Bangun ruang sisi lengkung dengan alas berbentuk lingkaran dan selimut yang bertemu pada satu titik puncak.",
    initFn: initCone,
    formulas: [
      { label: "Volume", value: "V = (1/3)πr²h" },
      { label: "Luas Permukaan", value: "A = πr(r + s)" },
      { label: "Garis Pelukis", value: "s = √(r² + h²)" },
    ],
    defaultExample: {
      lines: [
        "r = 10 cm, h = 20 cm",
        "s = √(10² + 20²) = 22.36 cm",
        "V = (1/3)π·10²·20 = 2094.40 cm³",
        "A = π·10(10 + 22.36) = 1017.88 cm²",
      ],
    },
  },

  {
    key: "cylinder",
    title: "Tabung",
    icon: TbCylinder,
    desc: "Bangun ruang sisi lengkung dengan dua lingkaran sejajar sebagai alas dan tutup, serta selimut berbentuk persegi panjang jika dibentangkan.",
    initFn: initCylinder,
    formulas: [
      { label: "Volume", value: "V = πr²h" },
      { label: "Luas Sisi", value: "L = 2πrh" },
      { label: "Luas Permukaan", value: "A = 2πr(r + h)" },
    ],
    defaultExample: {
      lines: ["r = 10 cm, h = 20 cm", "V = 6283 cm³", "A = 1885 cm²"],
    },
  },

  {
    key: "pyramid",
    title: "Limas",
    icon: TbPyramid,
    desc: "Bangun ruang sisi datar dengan alas poligon dan sisi tegak berbentuk segitiga yang bertemu pada satu titik puncak.",
    initFn: initPyramid,
    formulas: [
      { label: "Volume", value: "V = (1/3) × Luas Alas × Tinggi" },
      { label: "Luas Permukaan", value: "A = s² + 4 × (1/2 × s × T.Segitiga)" },
    ],
    defaultExample: {
      lines: [
        "anggap s = 10 cm, t = 30 cm",
        "V = (1/3) × 10² × 30 = 1000 cm³",
        "A = 10² + 4 × (1/2 × 10 × 30) = 700 cm²",
      ],
    },
  },
];

/* Helpers */
export function getShapeNav(key) {
  const i = SHAPES.findIndex((s) => s.key === key);
  if (i < 0) return { prev: null, next: null };

  const prev = SHAPES[(i - 1 + SHAPES.length) % SHAPES.length];
  const next = SHAPES[(i + 1) % SHAPES.length];

  return {
    prev: `/shape/${prev.key}`,
    next: `/shape/${next.key}`,
  };
}

export function getShapeConfig(key) {
  return SHAPES.find((s) => s.key === key) ?? null;
}

/* Fallback icon */
export const DEFAULT_SHAPE_ICON = FiBox;