export const strategies = [
  {
    "name": "The Chase",
    "lesson": "Use the queen to restrict the opposing king. Bring your own king close enough to support the finish.",
    "goal": "White to move. Force checkmate in two White moves."
  },
  {
    "name": "The Fork",
    "lesson": "Use one queen move to check the king and attack a second target.",
    "goal": "White to move. Find a check that lets the queen win the target on its next move."
  },
  {
    "name": "The Sacrifice",
    "lesson": "Offer the queen with check when accepting it leaves another piece with mate.",
    "goal": "White to move. Give up the queen with check, then let another piece deliver checkmate."
  },
  {
    "name": "The Stalemate Trap",
    "lesson": "A king with no legal move draws unless it is in check. Leave an escape square or finish with check.",
    "goal": "White to move. Checkmate now or force it on your next move without stalemating Black."
  }
];

export const puzzles = [
  {
    "group": 0,
    "title": "Two paths to the edge",
    "fen": "8/8/8/8/k7/2K5/8/7Q",
    "hint": "Find a quiet queen move that leaves the black king only a3.",
    "why": "The queen seals the fifth rank, steering Black toward a3. The white king on c3 controls b2, b3, and b4, so the queen can finish on the a-file.",
    "lines": [
      {
        "moves": [
          "h1h5",
          "a4a3",
          "h5a5"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h1d5",
          "a4a3",
          "d5a5"
        ],
        "replies": 1
      }
    ]
  },
  {
    "group": 0,
    "title": "The shrinking box",
    "fen": "8/8/8/8/6Q1/2K5/8/1k6",
    "hint": "Try a quiet queen move that blocks one side of the black king. Look for a reply to every remaining escape.",
    "why": "The queen confines the king to the bottom edge. The white king on c3 helps cover the second rank, so whichever square Black chooses, the queen can deliver mate.",
    "lines": [
      {
        "moves": [
          "g4g2",
          "b1a1",
          "g2b2"
        ],
        "replies": 2
      },
      {
        "moves": [
          "g4a4",
          "b1c1",
          "a4a1"
        ],
        "replies": 1
      },
      {
        "moves": [
          "g4e2",
          "b1a1",
          "e2b2"
        ],
        "replies": 2
      }
    ]
  },
  {
    "group": 0,
    "title": "Bring the king closer",
    "fen": "1k6/3KQ3/8/8/8/8/8/8",
    "hint": "The queen already covers the seventh rank. Bring the white king one square closer to the corner.",
    "why": "Kc6 brings the white king close enough to protect b7. The queen can then mate on b7 after either escape, with the king covering nearby squares.",
    "lines": [
      {
        "moves": [
          "d7c6",
          "b8a8",
          "e7b7"
        ],
        "replies": 2
      }
    ]
  },
  {
    "group": 1,
    "title": "A rook in two lines",
    "fen": "3k4/8/7Q/8/8/2r5/8/5K2",
    "hint": "Look for a queen check along the eighth rank or along the diagonal to d8.",
    "why": "The queen checks the black king and hits the rook on c3 at the same time. Every legal reply leaves the rook available to capture.",
    "lines": [
      {
        "moves": [
          "h6h8",
          "d8d7",
          "h8c3"
        ],
        "replies": 3,
        "target": "c3"
      },
      {
        "moves": [
          "h6f6",
          "d8d7",
          "f6c3"
        ],
        "replies": 4,
        "target": "c3"
      }
    ]
  },
  {
    "group": 1,
    "title": "Catch the bishop",
    "fen": "5Q2/8/K1k5/8/8/7b/8/8",
    "hint": "Look for a checking square on the third rank that also sees h3.",
    "why": "Qf3+ checks the king on c6 along a diagonal and attacks the bishop on h3 along the third rank. Black has to answer the check before it can save the bishop.",
    "lines": [
      {
        "moves": [
          "f8f3",
          "c6c7",
          "f3h3"
        ],
        "replies": 4,
        "target": "h3"
      }
    ]
  },
  {
    "group": 1,
    "title": "The knight on the rim",
    "fen": "5k2/8/8/K7/8/4Q3/8/7n",
    "hint": "Find a checking move that also keeps a line to the knight on h1.",
    "why": "The queen uses separate lines for the check and the attack on h1. Black’s reply saves the king and leaves the knight for the queen.",
    "lines": [
      {
        "moves": [
          "e3f3",
          "f8e8",
          "f3h1"
        ],
        "replies": 4,
        "target": "h1"
      },
      {
        "moves": [
          "e3h6",
          "f8f7",
          "h6h1"
        ],
        "replies": 4,
        "target": "h1"
      }
    ]
  },
  {
    "group": 2,
    "title": "Lure the king into the corner",
    "fen": "8/8/8/6r1/1N6/4R3/5K1k/Q7",
    "hint": "The queen can check from h1. If the king takes it, look at the rook on e3.",
    "why": "Qh1+ forces Kxh1. Rh3# then checks down the h-file. The white king on f2 covers g1 and g2, so the black king has no way out.",
    "lines": [
      {
        "moves": [
          "a1h1",
          "h2h1",
          "e3h3"
        ],
        "replies": 1
      }
    ],
    "otherWins": [
      "a1h8"
    ]
  },
  {
    "group": 2,
    "title": "Deflect the knight",
    "fen": "2R5/8/7B/8/8/3Kn2Q/8/3k4",
    "hint": "Find a queen check on the first rank. The knight is the only piece that can take it.",
    "why": "Qf1+ forces the knight away from e3. After Nxf1, Rc1# checks along the first rank while White’s king and bishop take away the escape squares.",
    "lines": [
      {
        "moves": [
          "h3f1",
          "e3f1",
          "c8c1"
        ],
        "replies": 1
      }
    ],
    "otherWins": [
      "h6e3",
      "d3e3",
      "h3h5",
      "h3h2",
      "h3h1",
      "h3f3",
      "h3g4",
      "h3g2"
    ]
  },
  {
    "group": 2,
    "title": "Clear the rook’s path",
    "fen": "8/8/8/6r1/4Q3/5K1k/1R6/8",
    "hint": "Offer the queen on h4, then look for a rook check from the second rank.",
    "why": "Qh4+ draws the king to h4. Rh2# controls the h-file, White’s king covers g3 and g4, and Black’s own rook occupies g5.",
    "lines": [
      {
        "moves": [
          "e4h4",
          "h3h4",
          "b2h2"
        ],
        "replies": 1
      }
    ],
    "otherWins": [
      "e4f4",
      "e4h7"
    ]
  },
  {
    "group": 3,
    "title": "Stalemate on the a-file",
    "fen": "8/8/2Q5/8/8/k1K5/8/8",
    "hint": "Qc4 would leave Black with no legal move. Try giving check on the a-file instead.",
    "why": "The white king covers the b-file beside Black’s king. A check on the a-file can finish immediately, while a safe waiting move can force mate on the next turn.",
    "lines": [
      {
        "moves": [
          "c6a6"
        ],
        "replies": 0
      },
      {
        "moves": [
          "c6a8"
        ],
        "replies": 0
      },
      {
        "moves": [
          "c6b6",
          "a3a2",
          "b6b2"
        ],
        "replies": 2
      },
      {
        "moves": [
          "c6e6",
          "a3a4",
          "e6a6"
        ],
        "replies": 1
      },
      {
        "moves": [
          "c6b7",
          "a3a2",
          "b7b2"
        ],
        "replies": 2
      },
      {
        "moves": [
          "c6b5",
          "a3a2",
          "b5b2"
        ],
        "replies": 1
      }
    ]
  },
  {
    "group": 3,
    "title": "Leave a square open",
    "fen": "7k/8/7K/8/7Q/8/8/8",
    "hint": "Qg4 takes the last escape without checking. Look along the eighth rank for a queen check.",
    "why": "Black’s king is already close to being boxed in. A check along the eighth rank or a move that leaves a forced escape keeps the position winning.",
    "lines": [
      {
        "moves": [
          "h4d8"
        ],
        "replies": 0
      },
      {
        "moves": [
          "h6g6",
          "h8g8",
          "h4d8"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h4h5",
          "h8g8",
          "h5e8"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h4e4",
          "h8g8",
          "e4e8"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h4d4",
          "h8g8",
          "d4g7"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h4a4",
          "h8g8",
          "a4e8"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h4f6",
          "h8g8",
          "f6g7"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h4e7",
          "h8g8",
          "e7e8"
        ],
        "replies": 1
      },
      {
        "moves": [
          "h4e1",
          "h8g8",
          "e1e8"
        ],
        "replies": 1
      }
    ]
  },
  {
    "group": 3,
    "title": "The quiet move that draws",
    "fen": "8/8/8/8/8/1K6/4Q3/2k5",
    "hint": "Qd3 looks tidy, but Black would have no legal move. Look for a queen check or move your king toward c3.",
    "why": "A queen check on the first rank or on c2 can mate immediately. A careful king move leaves Black one legal square and sets up the queen’s finish.",
    "lines": [
      {
        "moves": [
          "e2e1"
        ],
        "replies": 0
      },
      {
        "moves": [
          "e2c2"
        ],
        "replies": 0
      },
      {
        "moves": [
          "b3a3",
          "c1b1",
          "e2b2"
        ],
        "replies": 1
      },
      {
        "moves": [
          "b3c3",
          "c1b1",
          "e2b2"
        ],
        "replies": 1
      }
    ]
  }
];
