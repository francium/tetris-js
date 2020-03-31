export type TetroRotation = 0 | 1 | 2 | 3;
export type TetroShapeT = 'I' | 'J' | 'L' | 'S' | 'T' | 'Z';
export type TetroBitmap = number[][];

export class TetroShape {
  private static readonly _I: TetroBitmap[] = [
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
  ];
  private static readonly _J: TetroBitmap[] = [
    [
      [0, 0, 1],
      [0, 0, 1],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ],
  ];
  private static readonly _L: TetroBitmap[] = [
    [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  ];
  private static readonly _S: TetroBitmap[] = [
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  ];
  private static readonly _T: TetroBitmap[] = [
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ];
  private static readonly _Z: TetroBitmap[] = [
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  ];

  private static readonly _shapes: {[key in TetroShapeT]: TetroBitmap[]} = {
    I: TetroShape._I,
    J: TetroShape._J,
    L: TetroShape._L,
    S: TetroShape._S,
    T: TetroShape._T,
    Z: TetroShape._Z,
  };

  public constructor(
    private readonly _shapeT: TetroShapeT,
    private readonly _rotation: TetroRotation,
  ) {}

  get bitmap(): TetroBitmap {
    return TetroShape._shapes[this._shapeT][this._rotation];
  }
}
