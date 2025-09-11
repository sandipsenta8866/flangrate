// Create the global registry if it doesn't exist

window.PRODUCT_REGISTRY = window.PRODUCT_REGISTRY || {
  configs: {},

  calculators: {},
};

// Register this product's configuration

window.PRODUCT_REGISTRY.configs["TABLE-E"] = {
  INPUT_COLS: ["B", "C", "D", "E", "F", "H", "S", "T", "U", "Y"],

  INPUT_HEADERS: {
    B: "OD OF FLANGE (mm)",

    C: "ID (BORE) OF FLANGE (mm)",

    D: "FINAL THICKNESS (mm)",

    E: "NOS. OF HOLES",

    F: "HOLE DIA. (mm)",

    H: "FACE MACHINIG (1/2)",

    S: "PROFILE CUTTING RATE",

    T: "ID SCRAP RATE",

    U: "CHIPS RATE",

    Y: "TOTAL M/C RATE",
  },

  ROWS: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],

  ROW_LABELS: {
    8: "1/2''",
    9: "3/4''",
    10: "1''",
    11: "1.25''",
    12: "1.5''",
    13: "2''",
    14: "2.5''",
    15: "3''",
    16: "4''",
    17: "5''",
    18: "6''",
    19: "8''",
    20: "10''",
    21: "12''",
  },

  DEFAULTS: {
    8: {
      B: 95.25,

      C: 22.5,

      D: 6.5,

      E: 4,

      F: 14,

      H: 1.5,

      S: 58,

      T: 32.5,

      U: 32.5,

      Y: 10,
    },

    9: {
      B: 101.6,

      C: 28.5,

      D: 6.5,

      E: 4,

      F: 14,

      H: 1.5,

      S: 58,

      T: 32.5,

      U: 32.5,

      Y: 10,
    },

    10: {
      B: 114.28,

      C: 35.5,

      D: 7,

      E: 4,

      F: 14,

      H: 1.5,

      S: 58,

      T: 32.5,

      U: 32.5,

      Y: 11,
    },

    11: {
      B: 120.7,

      C: 44,

      D: 8,

      E: 4,

      F: 14,

      H: 1.5,

      S: 65,

      T: 44,

      U: 42,

      Y: 12,
    },

    12: {
      B: 133.4,

      C: 50.5,

      D: 8.5,

      E: 4,

      F: 14,

      H: 1.5,

      S: 58,

      T: 35.5,

      U: 32.5,

      Y: 12,
    },

    13: {
      B: 152.4,

      C: 62.5,

      D: 9.5,

      E: 4,

      F: 17.5,

      H: 1.5,

      S: 58,

      T: 35.5,

      U: 32.5,

      Y: 14,
    },

    14: {
      B: 165.1,

      C: 78,

      D: 10,

      E: 4,

      F: 17.5,

      H: 1.5,

      S: 58,

      T: 35.5,

      U: 32.5,

      Y: 15,
    },

    15: {
      B: 184.15,

      C: 91,

      D: 11,

      E: 4,

      F: 17.5,

      H: 1.5,

      S: 58,

      T: 35.5,

      U: 32.5,

      Y: 17,
    },

    16: {
      B: 215.9,

      C: 116,

      D: 12.5,

      E: 8,

      F: 17.5,

      H: 1.5,

      S: 58,

      T: 50,

      U: 32.5,

      Y: 18,
    },

    17: {
      B: 254.0,

      C: 144,

      D: 12.7,

      E: 8,

      F: 17.5,

      H: 1.5,

      S: 58,

      T: 50,

      U: 32.5,

      Y: 20,
    },

    18: {
      B: 279.4,

      C: 171.5,

      D: 12.7,

      E: 8,

      F: 22.2,

      H: 1.5,

      S: 58,

      T: 50,

      U: 32.5,

      Y: 25,
    },

    19: {
      B: 336.55,

      C: 222,

      D: 19,

      E: 8,

      F: 22.2,

      H: 1.5,

      S: 60,

      T: 50,

      U: 32.5,

      Y: 30,
    },

    20: {
      B: 406.4,

      C: 276,

      D: 22,

      E: 12,

      F: 22.2,

      H: 1.5,

      S: 65,

      T: 44,

      U: 42,

      Y: 35,
    },

    21: {
      B: 457.2,

      C: 327.2,

      D: 25.4,

      E: 12,

      F: 25.4,

      H: 1.5,

      S: 65,

      T: 44,

      U: 42,

      Y: 35,
    },
  },

  OUTPUT_ORDER: [
    "I",

    "J",

    "K",

    "L",

    "M",

    "N",

    "O",

    "Q",

    "R",

    "V",

    "W",

    "X",

    "Z",

    "AA",

    "AB",
  ],

  OUTPUT_LABELS: {
    I: "OD OF CIRCLE (mm)",

    J: "THICKNESS OF CIRCLE (mm)",

    K: "CIRCLE WEIGHT (KG)",

    L: "ID CHIPS WEIGHT(KG)",

    M: "FACING CHIPS WEIGHT (KG)",

    N: "OD CHIPS WEIGHT (KG)",

    O: "HOLE CHIPS WEIGHT (KG)",

    Q: "TOTAL CHIPS WEIGHT (KG)",

    R: "ID WEIGHT",

    V: "SCRAP CHIPS RATE",

    W: "ID RATE",

    X: "RAW CIRCLE RATE",

    Z: "MFG RATE",

    AA: "FINAL RATE",

    AB: "WEIGHT OF FLANGE",
  },

  PDF_SPEC_COLS: ["B", "C", "D", "E", "F"],
};

// Register this product's calculation function

window.PRODUCT_REGISTRY.calculators["TABLE-E"] = function (
  IN,

  { n, PI, DENS }
) {
  const B = n(IN.B),
    C = n(IN.C),
    D = n(IN.D),
    E = n(IN.E),
    F = n(IN.F),
    H = n(IN.H),
    S = n(IN.S),
    T = n(IN.T),
    U = n(IN.U),
    Y = n(IN.Y);

  const I = B + 4;

  const J = D + H;

  const K = ((1.02 * PI * I * I * J) / 4) * DENS;

  const L =
    ((PI * J * C * C) / 4) * DENS - ((PI * J * (C - 14) * (C - 14)) / 4) * DENS;

  const M = ((PI * H * B * B) / 4) * DENS - ((PI * H * C * C) / 4) * DENS;

  const N = ((PI * D * I * I) / 4) * DENS - ((PI * D * B * B) / 4) * DENS;

  const O = ((PI * F * F * D) / 4) * DENS * E;

  const P = 0;

  const Q = L + M + N + O + P;

  const R = ((PI * J * (C - 14) * (C - 14)) / 4) * DENS;

  const V = Q * U * 0.95;

  const W = R * T * 0.98;

  const X = K * S;

  const Z = X + Y - W - V;

  const AA = Z * 1.1;

  const AB = K - R - Q;

  return { I, J, K, L, M, N, O, P, Q, R, V, W, X, Z, AA, AB };
};
