// Create the global registry if it doesn't exist

window.PRODUCT_REGISTRY = window.PRODUCT_REGISTRY || {
  configs: {},

  calculators: {},
};

// Register this product's configuration

window.PRODUCT_REGISTRY.configs["IS"] = {
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

  ROWS: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],

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

    22: "14''",

    23: "16''",

    24: "18''",

    25: "20''",
  },

  DEFAULTS: {
    8: {
      B: 95,
      C: 22.5,
      D: 14,
      E: 4,
      F: 14,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 10,
    },

    9: {
      B: 101,
      C: 28.5,
      D: 16,
      E: 4,
      F: 14,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 10,
    },

    10: {
      B: 115,
      C: 35.5,
      D: 16,
      E: 4,
      F: 14,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 10,
    },

    11: {
      B: 140,
      C: 44,
      D: 16,
      E: 4,
      F: 18,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 11,
    },

    12: {
      B: 150,
      C: 50.5,
      D: 16,
      E: 4,
      F: 18,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 12,
    },

    13: {
      B: 165,
      C: 62.5,
      D: 18,
      E: 4,
      F: 19,
      H: 1.5,
      S: 63,
      T: 38,
      U: 33,
      Y: 14,
    },

    14: {
      B: 185,
      C: 78,
      D: 18,
      E: 4,
      F: 19,
      H: 1.5,
      S: 63,
      T: 38,
      U: 33,
      Y: 15,
    },

    15: {
      B: 200,
      C: 91.5,
      D: 20,
      E: 4,
      F: 19,
      H: 1.5,
      S: 59,
      T: 39,
      U: 37,
      Y: 15,
    },

    16: {
      B: 220,
      C: 116.5,
      D: 20,
      E: 8,
      F: 19,
      H: 1.5,
      S: 59,
      T: 50,
      U: 36,
      Y: 18,
    },

    17: {
      B: 250,
      C: 144,
      D: 22,
      E: 8,
      F: 19,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 20,
    },

    18: {
      B: 285,
      C: 171.5,
      D: 22,
      E: 8,
      F: 22,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 25,
    },

    19: {
      B: 340,
      C: 222,
      D: 24,
      E: 8,
      F: 22,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 30,
    },

    20: {
      B: 395,
      C: 277,
      D: 26,
      E: 12,
      F: 22,
      H: 1,
      S: 62,
      T: 38,
      U: 36,
      Y: 35,
    },

    21: {
      B: 445,
      C: 327.2,
      D: 28,
      E: 12,
      F: 22,
      H: 1,
      S: 62,
      T: 38,
      U: 36,
      Y: 20,
    },

    22: {
      B: 505,
      C: 359.5,
      D: 28,
      E: 16,
      F: 22,
      H: 1,
      S: 62,
      T: 38,
      U: 36,
      Y: 22,
    },

    23: {
      B: 565,
      C: 410,
      D: 28,
      E: 16,
      F: 25,
      H: 1,
      S: 62,
      T: 38,
      U: 36,
      Y: 25,
    },

    24: {
      B: 615,
      C: 460,
      D: 31,
      E: 20,
      F: 25,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 19,
    },

    25: {
      B: 670,
      C: 513,
      D: 33,
      E: 20,
      F: 25,
      H: 1.5,
      S: 62,
      T: 38,
      U: 36,
      Y: 19,
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

window.PRODUCT_REGISTRY.calculators["IS"] = function (
  IN,

  { n, PI, DENS }
) {
  // Inputs

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

  // Derived geometry from Excel

  const I = B + 4; // OD OF CIRCLE (mm)

  const J = D + H; // THICKNESS OF CIRCLE (mm)

  // Weights per Excel logic

  const K = ((1.02 * PI * I * I * J) / 4) * DENS; // CIRCLE WEIGHT

  const L =
    ((PI * J * (C + 12) * (C + 12)) / 4) * DENS - ((PI * J * C * C) / 4) * DENS; // ID CHIPS

  const M = ((PI * H * B * B) / 4) * DENS - ((PI * H * C * C) / 4) * DENS; // FACING CHIPS

  const N = ((PI * D * I * I) / 4) * DENS - ((PI * D * B * B) / 4) * DENS; // OD CHIPS

  const O = ((PI * F * F * D) / 4) * DENS * E; // HOLE CHIPS

  const P = 0; // Extra chips (if any)

  const Q = L + M + N + O + P; // TOTAL CHIPS

  const R = ((PI * J * (C - 12) * (C - 12)) / 4) * DENS; // ID WEIGHT

  // Rates per Excel logic

  const V = Q * U * 0.95; // SCRAP CHIPS RATE = TOTAL CHIPS × CHIPS RATE × 0.95

  const W = R * T; // ID RATE = ID WEIGHT × ID SCRAP RATE

  const X = K * S; // RAW CIRCLE RATE = CIRCLE WEIGHT × PROFILE CUTTING RATE

  const Z = X + Y - W - V; // MFG RATE = RAW + M/C − ID RATE − SCRAP CHIPS RATE

  const AA = Z * 1.1; // FINAL RATE = MFG × 1.10

  const AB = K - R - Q; // WEIGHT OF FLANGE = CIRCLE − ID − TOTAL CHIPS

  return { I, J, K, L, M, N, O, P, Q, R, V, W, X, Z, AA, AB };
};
