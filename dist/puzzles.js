const mathPuzzles = [
  {
    title: 'The missing factor',
    question: 'A number tripled, then increased by 6, equals 33. What is the number?',
    answer: 9,
    hint: 'Undo the addition first.',
    explanation: 'Subtract 6 from 33 to get 27, then divide by 3 to get 9.'
  },
  {
    title: 'Two baskets',
    question: 'Two baskets hold 34 oranges altogether. One basket has 6 more oranges than the other. How many oranges are in the smaller basket?',
    answer: 14,
    hint: 'Set aside the 6 extra oranges so the baskets hold equal amounts.',
    explanation: 'After setting aside 6, there are 28 oranges left, split equally. The smaller basket holds 14.'
  },
  {
    title: 'Pages left',
    question: 'You read one third of a 90-page book on Monday and one fifth of the whole book on Tuesday. How many pages are still unread?',
    answer: 42,
    hint: 'Find both fractions using 90 as the starting total.',
    explanation: 'You read 30 pages on Monday and 18 on Tuesday, leaving 90 − 48 = 42 pages.'
  },
  {
    title: 'A two-digit mystery',
    question: 'My two digits add to 11. My tens digit is 3 more than my ones digit. What number am I?',
    answer: 74,
    hint: 'If you take 3 away from the tens digit, both digits are equal and their new sum is 8.',
    explanation: 'The ones digit is 4 and the tens digit is 7. The number is 74.'
  }
];

const shapes = {
  circle: '●', square: '■', triangle: '▲', diamond: '◆'
};

const patternPuzzles = [
  {
    title: 'Take turns',
    sequence: ['circle', 'square', 'circle', 'square', 'circle'],
    answer: 'square',
    hint: 'Compare the shapes in the even-numbered positions.',
    explanation: 'The circle and square alternate, so a square follows the last circle.'
  },
  {
    title: 'Three at a time',
    sequence: ['triangle', 'triangle', 'diamond', 'triangle', 'triangle'],
    answer: 'diamond',
    hint: 'Try dividing the sequence into groups of three.',
    explanation: 'Each group has two triangles followed by a diamond.'
  },
  {
    title: 'Back and forth',
    sequence: ['circle', 'square', 'triangle', 'square', 'circle', 'square', 'triangle'],
    answer: 'square',
    hint: 'The square sits between the circle and triangle in both directions.',
    explanation: 'The sequence goes circle, square, triangle, square, then starts again.'
  },
  {
    title: 'A growing line',
    sequence: ['circle', 'diamond', 'circle', 'circle', 'diamond', 'circle', 'circle', 'circle', 'diamond', 'circle'],
    answer: 'circle',
    hint: 'Count the circles before each diamond. How does the count change?',
    explanation: 'Each group adds one circle before its diamond. The last group starts with four circles.'
  }
];

function fillPicker(picker, items) {
  picker.replaceChildren(...items.map(({title}, index) => new Option(title, index)));
}

function setupQuiz(panel, puzzles) {
  const pick = panel.querySelector('[data-pick]');
  const question = panel.querySelector('[data-question]');
  const form = panel.querySelector('form');
  const answer = panel.querySelector('[data-answer]');
  const choices = panel.querySelector('[data-choices]');
  const hint = panel.querySelector('[data-hint]');
  const hintButton = panel.querySelector('[data-hint-button]');
  const nextButton = panel.querySelector('[data-next]');
  const feedback = panel.querySelector('[data-feedback]');

  function loadPuzzle() {
    const puzzle = puzzles[pick.value];
    form.reset();
    hint.hidden = true;
    hintButton.textContent = 'Show hint';
    hintButton.setAttribute('aria-expanded', 'false');
    feedback.textContent = '';
    nextButton.hidden = true;
    const prompt = puzzle.question ?? 'Which shape comes next?';
    question.textContent = puzzle.title + ' — ' + prompt;
    if (choices) {
      const row = document.createElement('span');
      row.className = 'pattern-sequence';
      row.setAttribute('aria-label', puzzle.sequence.join(', ') + ', unknown');
      for (const shape of [...puzzle.sequence, '?']) {
        const symbol = document.createElement('span');
        symbol.setAttribute('aria-hidden', 'true');
        symbol.textContent = shapes[shape] ?? shape;
        row.append(symbol);
      }
      question.append(row);
    }
    hint.textContent = puzzle.hint;
  }

  if (choices) {
    for (const [shape, symbol] of Object.entries(shapes)) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'shape';
      input.value = shape;
      input.required = true;
      label.append(input, ' ' + symbol + ' ' + shape);
      choices.append(label);
    }
  }
  fillPicker(pick, puzzles);
  pick.addEventListener('change', loadPuzzle);
  hintButton.addEventListener('click', () => {
    hint.hidden = !hint.hidden;
    hintButton.textContent = hint.hidden ? 'Show hint' : 'Hide hint';
    hintButton.setAttribute('aria-expanded', String(!hint.hidden));
  });
  form.addEventListener('input', () => {
    feedback.textContent = '';
    nextButton.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const puzzle = puzzles[pick.value];
    const guess = answer ? Number(answer.value) : new FormData(form).get('shape');
    const correct = guess === puzzle.answer;
    const last = pick.selectedIndex === puzzles.length - 1;
    feedback.textContent = correct ? 'Correct! ' + puzzle.explanation : 'Try again, or open the hint for a clue.';
    nextButton.hidden = !correct || last;
  });
  nextButton.addEventListener('click', () => {
    pick.selectedIndex++;
    loadPuzzle();
    question.focus();
  });
  loadPuzzle();
}

setupQuiz(document.querySelector('[data-quiz="math"]'), mathPuzzles);
setupQuiz(document.querySelector('[data-quiz="pattern"]'), patternPuzzles);

const mazes = [
  {
    title: 'Garden Path · 7 × 7',
    map: [
      '#######',
      'S...#.#',
      '###.#.#',
      '#.#...#',
      '#.###.#',
      '#.....G',
      '#######'
    ]
  },
  {
    title: 'Winding Trail · 9 × 9',
    map: [
      '#########',
      'S.#.....#',
      '#.#.###.#',
      '#.#...#.#',
      '#.###.#.#',
      '#.....#.#',
      '#######.#',
      '#.......G',
      '#########'
    ]
  },
  {
    title: 'Labyrinth · 11 × 11',
    map: [
      '###########',
      'S.#...#...#',
      '#.#.#.#.#.#',
      '#...#.#.#.#',
      '#####.###.#',
      '#...#...#.#',
      '#.#.###.#.#',
      '#.#...#...#',
      '#.#.#####.#',
      '#.#.......G',
      '###########'
    ]
  }
];

const directions = {up: [-1, 0], left: [0, -1], down: [1, 0], right: [0, 1]};
const arrowDirections = {ArrowUp: 'up', ArrowLeft: 'left', ArrowDown: 'down', ArrowRight: 'right'};
const mazeBoard = document.getElementById('maze-board');
const mazePicker = document.getElementById('maze-pick');
const mazeMoves = document.getElementById('maze-moves');
const mazeMessage = document.getElementById('maze-message');
const mazeNext = document.getElementById('maze-next');
let map, row, col, moveCount, finished, cells;

function loadMaze() {
  map = mazes[mazePicker.value].map;
  row = map.findIndex(line => line.includes('S'));
  col = map[row].indexOf('S');
  moveCount = 0;
  finished = false;
  mazeNext.hidden = true;
  mazeBoard.style.setProperty('--maze-size', map[0].length);
  cells = map.map((line, r) => [...line].map((tile, c) => {
    const cell = document.createElement('span');
    cell.className = 'maze-cell';
    cell.classList.toggle('maze-wall', tile === '#');
    cell.classList.toggle('maze-start', tile === 'S');
    cell.classList.toggle('maze-goal', tile === 'G');
    cell.textContent = tile === 'S' || tile === 'G' ? tile : '';
    cell.setAttribute('aria-hidden', 'true');
    cell.dataset.row = r;
    cell.dataset.col = c;
    return cell;
  }));
  mazeBoard.replaceChildren(...cells.flat());
  cells[row][col].classList.add('maze-player', 'maze-visited');
  mazeMoves.textContent = '0 moves';
  mazeMessage.textContent = 'At the start. Move right to enter.';
}

function stepMaze(nextRow, nextCol) {
  if (finished) return;
  const target = map[nextRow]?.[nextCol];
  if (!target || target === '#') {
    mazeMessage.textContent = 'That way is blocked.';
    return;
  }
  cells[row][col].classList.remove('maze-player');
  row = nextRow;
  col = nextCol;
  cells[row][col].classList.add('maze-player', 'maze-visited');
  moveCount++;
  const count = moveCount + (moveCount === 1 ? ' move' : ' moves');
  mazeMoves.textContent = count;
  finished = target === 'G';
  mazeNext.hidden = !finished || mazePicker.selectedIndex === mazes.length - 1;
  mazeMessage.textContent = finished
    ? 'You reached the goal in ' + count + '!'
    : 'Row ' + (row + 1) + ', column ' + (col + 1) + '.';
}

function moveMaze(direction) {
  const [dr, dc] = directions[direction];
  stepMaze(row + dr, col + dc);
}

mazeBoard.addEventListener('click', event => {
  const cell = event.target.closest('.maze-cell');
  if (!cell || finished) return;
  const nextRow = Number(cell.dataset.row);
  const nextCol = Number(cell.dataset.col);
  const distance = Math.abs(nextRow - row) + Math.abs(nextCol - col);
  if (distance === 1) stepMaze(nextRow, nextCol);
  else if (distance > 1) mazeMessage.textContent = 'Choose a square next to your current position.';
});
mazeBoard.addEventListener('keydown', event => {
  const direction = arrowDirections[event.key];
  if (!direction) return;
  event.preventDefault();
  moveMaze(direction);
});
for (const button of document.querySelectorAll('[data-maze-move]')) {
  button.addEventListener('click', () => moveMaze(button.dataset.mazeMove));
}
document.getElementById('maze-reset').addEventListener('click', loadMaze);
mazePicker.addEventListener('change', loadMaze);
mazeNext.addEventListener('click', () => {
  mazePicker.selectedIndex++;
  loadMaze();
  mazeBoard.focus();
});
fillPicker(mazePicker, mazes);
loadMaze();
