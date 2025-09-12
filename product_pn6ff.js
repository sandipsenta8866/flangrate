// Create the global registry if it doesn't exist
window.PRODUCT_REGISTRY = window.PRODUCT_REGISTRY || {
  configs: {},
  calculators: {},
};

// Register this product's configuration
window.PRODUCT_REGISTRY.configs["PN-6-FF"] = {
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
      B: 80,
      C: 22,
      D: 12,
      E: 4,
      F: 14,
      H: 1.5,
      S: 60.5,
      T: 34,
      U: 34,
      Y: 15,
    },
    9: {
      B: 90,
      C: 27.5,
      D: 14,
      E: 4,
      F: 14,
      H: 1.5,
      S: 60.5,
      T: 34,
      U: 34,
      Y: 15,
    },
    10: {
      B: 100,
      C: 34.5,
      D: 14,
      E: 4,
      F: 14,
      H: 1.0,
      S: 60.5,
      T: 34,
      U: 34,
      Y: 18,
    },
    11: {
      B: 120,
      C: 43.5,
      D: 16,
      E: 4,
      F: 14,
      H: 1.0,
      S: 56.0,
      T: 35,
      U: 31,
      Y: 18,
    },
    12: {
      B: 130,
      C: 49.5,
      D: 16,
      E: 4,
      F: 14,
      H: 1.0,
      S: 56.0,
      T: 35,
      U: 31,
      Y: 18,
    },
    13: {
      B: 140,
      C: 61.5,
      D: 16,
      E: 4,
      F: 14,
      H: 1.0,
      S: 56.0,
      T: 35,
      U: 31,
      Y: 18,
    },
    14: {
      B: 160,
      C: 77.5,
      D: 16,
      E: 4,
      F: 14,
      H: 1.0,
      S: 56.0,
      T: 35,
      U: 31,
      Y: 20,
    },
    15: {
      B: 190,
      C: 90.5,
      D: 18,
      E: 4,
      F: 18,
      H: 1.0,
      S: 57.0,
      T: 35,
      U: 31,
      Y: 24,
    },
    16: {
      B: 210,
      C: 116,
      D: 18,
      E: 4,
      F: 18,
      H: 1.0,
      S: 57.0,
      T: 45,
      U: 31,
      Y: 28,
    },
    17: {
      B: 240,
      C: 141.5,
      D: 20,
      E: 8,
      F: 18,
      H: 1.0,
      S: 58.0,
      T: 58,
      U: 31,
      Y: 30,
    },
    18: {
      B: 265,
      C: 170.5,
      D: 20,
      E: 8,
      F: 18,
      H: 1.0,
      S: 58.0,
      T: 48,
      U: 31,
      Y: 35,
    },
    19: {
      B: 320,
      C: 221.5,
      D: 22,
      E: 8,
      F: 18,
      H: 1.0,
      S: 61.0,
      T: 50,
      U: 31,
      Y: 40,
    },
    20: {
      B: 375,
      C: 276.5,
      D: 24,
      E: 12,
      F: 18,
      H: 1.0,
      S: 61.0,
      T: 50,
      U: 31,
      Y: 50,
    },
    21: {
      B: 440,
      C: 327.5,
      D: 24,
      E: 12,
      F: 22,
      H: 1.5,
      S: 63.5,
      T: 55,
      U: 31,
      Y: 60,
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
window.PRODUCT_REGISTRY.calculators["PN-6-FF"] = function (
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

  // Geometry
  const I = B + 4;
  const J = D + H;

  // Weights
  const K = ((1.02 * PI * I * I * J) / 4) * DENS;
  const L =
    ((PI * J * C * C) / 4) * DENS - ((PI * J * (C - 14) * (C - 14)) / 4) * DENS;
  const M = ((PI * H * B * B) / 4) * DENS - ((PI * H * C * C) / 4) * DENS;
  const N = ((PI * D * I * I) / 4) * DENS - ((PI * D * B * B) / 4) * DENS;
  const O = ((PI * F * F * D) / 4) * DENS * E;

  // Flat face (no raised-face chips)
  const P = 0;

  const Q = L + M + N + O + P;
  const R = ((PI * J * (C - 14) * (C - 14)) / 4) * DENS;

  // Rates per sheet
  const V = Q * U * 0.95; // Scrap factor 0.95 confirmed from sheet
  const W = R * T; // No 0.98 factor for ID rate in this sheet
  const X = K * S;

  const Z = X + Y - W - V;
  const AA = Z * 1.1;
  const AB = K - R - Q;

  return { I, J, K, L, M, N, O, P, Q, R, V, W, X, Z, AA, AB };
};
