// Create the global registry if it doesn't exist

window.PRODUCT_REGISTRY = window.PRODUCT_REGISTRY || {
  configs: {},

  calculators: {},
};

// Register this product's configuration

window.PRODUCT_REGISTRY.configs["ASA-SOFF"] = {
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

  ROWS: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],

  ROW_LABELS: {
    8: "1/2''",

    9: "3/4''",

    10: "1''",

    11: "1.5''",

    12: "2''",

    13: "2.5''",

    14: "3''",

    15: "4''",

    16: "5''",

    17: "6''",

    18: "8''",

    19: "10''",
  },

  DEFAULTS: {
    8: {
      B: 90.0,
      C: 22.5,
      D: 10.0,
      E: 4,
      F: 16.0,
      H: 1.5,
      S: 57.0,
      T: 36.5,
      U: 36.0,
      Y: 12.0,
    },

    9: {
      B: 98.5,
      C: 27.7,
      D: 11.5,
      E: 4,
      F: 16.0,
      H: 1.5,
      S: 57.0,
      T: 36.5,
      U: 36.0,
      Y: 12.0,
    },

    10: {
      B: 108.0,
      C: 34.5,
      D: 13.0,
      E: 4,
      F: 16.0,
      H: 1.0,
      S: 61.0,
      T: 36.5,
      U: 36.0,
      Y: 15.0,
    },

    11: {
      B: 127.0,
      C: 55.0,
      D: 16.0,
      E: 4,
      F: 16.0,
      H: 1.5,
      S: 62.0,
      T: 38.0,
      U: 36.0,
      Y: 18.0,
    },

    12: {
      B: 152.0,
      C: 62.0,
      D: 17.5,
      E: 4,
      F: 19.0,
      H: 1.5,
      S: 63.0,
      T: 38.0,
      U: 36.0,
      Y: 20.0,
    },

    13: {
      B: 177.0,
      C: 78.0,
      D: 22.4,
      E: 4,
      F: 19.0,
      H: 1.5,
      S: 64.0,
      T: 38.0,
      U: 36.0,
      Y: 25.0,
    },

    14: {
      B: 190.5,
      C: 90.7,
      D: 22.0,
      E: 4,
      F: 19.0,
      H: 1.5,
      S: 65.0,
      T: 38.0,
      U: 36.0,
      Y: 25.0,
    },

    15: {
      B: 228.0,
      C: 116.5,
      D: 22.0,
      E: 8,
      F: 19.0,
      H: 1.5,
      S: 65.0,
      T: 55.0,
      U: 36.0,
      Y: 25.0,
    },

    16: {
      B: 254.0,
      C: 144.0,
      D: 23.9,
      E: 8,
      F: 22.0,
      H: 1.5,
      S: 65.0,
      T: 38.0,
      U: 36.0,
      Y: 18.0,
    },

    17: {
      B: 279.0,
      C: 170.7,
      D: 23.0,
      E: 8,
      F: 22.0,
      H: 1.5,
      S: 65.0,
      T: 55.0,
      U: 36.0,
      Y: 30.0,
    },

    18: {
      B: 343.0,
      C: 221.5,
      D: 26.0,
      E: 8,
      F: 22.0,
      H: 1.5,
      S: 68.0,
      T: 55.0,
      U: 36.0,
      Y: 35.0,
    },

    19: {
      B: 406.0,
      C: 276.3,
      D: 30.2,
      E: 12,
      F: 25.4,
      H: 1.5,
      S: 62.0,
      T: 38.0,
      U: 36.0,
      Y: 30.0,
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

window.PRODUCT_REGISTRY.calculators["ASA-SOFF"] = function (
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
    ((PI * J * (C + 12) * (C + 12)) / 4) * DENS - ((PI * J * C * C) / 4) * DENS;

  const M = ((PI * H * B * B) / 4) * DENS - ((PI * H * C * C) / 4) * DENS;

  const N = ((PI * D * I * I) / 4) * DENS - ((PI * D * B * B) / 4) * DENS;

  const O = ((PI * F * F * D) / 4) * DENS * E;

  const P = 0;

  const Q = L + M + N + O + P;

  const R = ((PI * J * (C - 12) * (C - 12)) / 4) * DENS;

  const V = Q * U * 0.95;

  const W = R * T;

  const X = K * S;

  const Z = X + Y - W - V;

  const AA = Z * 1.1;

  const AB = K - R - Q;

  return { I, J, K, L, M, N, O, P, Q, R, V, W, X, Z, AA, AB };
};
