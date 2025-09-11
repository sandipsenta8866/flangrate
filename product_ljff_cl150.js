// Create the global registry if it doesn't exist
window.PRODUCT_REGISTRY = window.PRODUCT_REGISTRY || {
  configs: {},
  calculators: {},
};

// Register this product's configuration
window.PRODUCT_REGISTRY.configs["LJFF-CL150"] = {
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

  ROWS: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],

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
    20: "12''",
  },

  DEFAULTS: {
    8: {
      B: 90,
      C: 22.9,
      D: 16,
      E: 4,
      F: 16,
      H: 1.5,
      S: 64,
      T: 40,
      U: 38,
      Y: 15,
    },
    9: {
      B: 98.5,
      C: 28.2,
      D: 16,
      E: 4,
      F: 16,
      H: 1.5,
      S: 64,
      T: 40,
      U: 38,
      Y: 15,
    },
    10: {
      B: 108,
      C: 35.1,
      D: 17,
      E: 4,
      F: 16,
      H: 1.0,
      S: 64,
      T: 40,
      U: 38,
      Y: 18,
    },
    11: {
      B: 127,
      C: 50.0,
      D: 22,
      E: 4,
      F: 16,
      H: 1.0,
      S: 65,
      T: 40,
      U: 38,
      Y: 20,
    },
    12: {
      B: 152.4,
      C: 62.5,
      D: 25,
      E: 4,
      F: 19,
      H: 1.0,
      S: 65,
      T: 40,
      U: 38,
      Y: 24,
    },
    13: {
      B: 177.8,
      C: 75.4,
      D: 29,
      E: 4,
      F: 19,
      H: 1.5,
      S: 68.5,
      T: 40,
      U: 38,
      Y: 25,
    },
    14: {
      B: 190.5,
      C: 91.4,
      D: 30,
      E: 4,
      F: 19,
      H: 1.5,
      S: 72,
      T: 50,
      U: 38,
      Y: 30,
    },
    15: {
      B: 228.5,
      C: 116.8,
      D: 33,
      E: 8,
      F: 19,
      H: 1.5,
      S: 73.5,
      T: 55,
      U: 38,
      Y: 40,
    },
    16: {
      B: 254,
      C: 144.5,
      D: 36,
      E: 8,
      F: 22,
      H: 1.5,
      S: 75,
      T: 55,
      U: 38,
      Y: 60,
    },
    17: {
      B: 279,
      C: 171.5,
      D: 40,
      E: 8,
      F: 22,
      H: 1.5,
      S: 78,
      T: 55,
      U: 38,
      Y: 80,
    },
    18: {
      B: 343,
      C: 222.3,
      D: 44,
      E: 8,
      F: 22,
      H: 1.5,
      S: 78,
      T: 55,
      U: 38,
      Y: 100,
    },
    19: {
      B: 406,
      C: 277.4,
      D: 49,
      E: 12,
      F: 25.4,
      H: 1.5,
      S: 80,
      T: 55,
      U: 38,
      Y: 120,
    },
    20: {
      B: 482.6,
      C: 328.2,
      D: 56,
      E: 12,
      F: 25.4,
      H: 1.5,
      S: 80,
      T: 55,
      U: 38,
      Y: 150,
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
window.PRODUCT_REGISTRY.calculators["LJFF-CL150"] = function (
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
