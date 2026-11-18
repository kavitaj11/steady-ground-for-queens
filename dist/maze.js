// The first layout is in the HTML so it remains visible before the game starts.
const initialMap = document.getElementById('maze-preview').textContent.trim().split(/\s+/)
  .map(row => row.replaceAll('■', '#').replaceAll('·', '.'));

const mazes = [
  {
    title: 'The Switchbacks · 15 × 15',
    checkpoints: 'A',
    par: 62,
    map: initialMap
  },
  {
    title: 'The Crossroads · 19 × 19',
    checkpoints: 'AB',
    par: 114,
    map: [
      '###################',
      'S.....#.......#...#',
      '#####.#.#.#.#.#.###',
      '#.#...#...#...#...#',
      '#.#.#####.#.#.###.#',
      '#.#...#...#.#...#.#',
      '#.###.#.#.#.###.#.#',
      '#.#...#.....#...#.#',
      '#.#.###.#.#.#.###.#',
      '#.#...#A..#.....#.#',
      '#.###.#.#.#.###.#.#',
      '#...#.#.#.....#.#.#',
      '###.#.#.###.#.#.#.#',
      '#...#.#.....#.#...#',
      '#.###.#####.#.###.#',
      '#...#B....#...#...#',
      '#.#.#####.###.#.###',
      '#.#...........#...G',
      '###################'
    ]
  },
  {
    title: 'The Long Circuit · 23 × 23',
    checkpoints: 'ABC',
    par: 146,
    map: [
      '#######################',
      'S...#.................#',
      '###.#.#####.#########.#',
      '#.#.#.........#.......#',
      '#.#.###.#####.#.#.#.#.#',
      '#.#...#.#..C#........A#',
      '#.###.###.#.#######.#.#',
      '#.........#.......#.#.#',
      '#.###############.###.#',
      '#.........#.....#.#...#',
      '###.#####.#.#####.#.#.#',
      '#...#...#.#.........#.#',
      '#.###.#.#.#####.#####.#',
      '#.....#.#.........#.#.#',
      '###.#.#####.#####.#.#.#',
      '#...#.....#.#...#...#.#',
      '#.#####.#.#.#.#.#.###.#',
      '#.#...#.#.....#.......#',
      '#.#.#.#.#####.###.#.###',
      '#...#.#.#...#.#B#...#.#',
      '#.###.###.#.#.#.#####.#',
      '#...#.....#...........G',
      '#######################'
    ]
  },
];

const directions = {up: [-1, 0], left: [0, -1], down: [1, 0], right: [0, 1]};
const arrowDirections = {ArrowUp: 'up', ArrowLeft: 'left', ArrowDown: 'down', ArrowRight: 'right'};
const mazeBoard = document.getElementById('maze-board');
const mazePicker = document.getElementById('maze-pick');
const mazeMoves = document.getElementById('maze-moves');
const mazeCheckpoints = document.getElementById('maze-checkpoints');
const mazePar = document.getElementById('maze-par');
const mazeMessage = document.getElementById('maze-message');
const mazeNext = document.getElementById('maze-next');
const solutionPanel = document.getElementById('maze-solution');
const solutionBoard = document.getElementById('maze-solution-board');
const solutionStep = document.getElementById('maze-solution-step');
const solutionPrev = document.getElementById('maze-solution-prev');
const solutionNext = document.getElementById('maze-solution-next');
const solutionStatus = document.getElementById('maze-solution-status');
let maze, row, col, moveCount, checkpointIndex, finished, cells;
let drag, solution, solutionCells, solutionMarker;

function describeCheckpoint() {
  const next = maze.checkpoints[checkpointIndex];
  const order = [...maze.checkpoints].join(' → ');
  mazeCheckpoints.textContent = next
    ? 'Checkpoints: ' + order + '. Next: ' + next + '.'
    : 'Checkpoints complete. Exit G is unlocked.';
}

function tileAt(r, c) {
  return maze.map[r]?.[c];
}

function canEnter(tile, stage = checkpointIndex) {
  return Boolean(tile && tile !== '#' && (tile !== 'G' || stage === maze.checkpoints.length));
}

function afterCheckpoint(tile, stage) {
  return stage + Number(tile === maze.checkpoints[stage]);
}

function findShortestRoute() {
  const startRow = maze.map.findIndex(line => line.includes('S'));
  const startCol = maze.map[startRow].indexOf('S');
  const queue = [{r: startRow, c: startCol, stage: 0}];
  const seen = new Set([startRow + ',' + startCol + ',0']);
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (tileAt(current.r, current.c) === 'G') {
      const route = [];
      for (let node = current; node; node = node.previous) route.push(node);
      return route.reverse();
    }
    for (const [direction, [dr, dc]] of Object.entries(directions)) {
      const r = current.r + dr;
      const c = current.c + dc;
      const tile = tileAt(r, c);
      if (!canEnter(tile, current.stage)) continue;
      const stage = afterCheckpoint(tile, current.stage);
      const key = [r, c, stage].join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({r, c, stage, direction, previous: current});
    }
  }
  return [];
}

function showSolutionStep(step) {
  const node = solution[step];
  solutionMarker?.classList.remove('maze-player');
  solutionMarker = solutionCells[node.r][node.c];
  solutionMarker.classList.add('maze-player');
  solutionStep.value = step;
  solutionPrev.disabled = step === 0;
  solutionNext.disabled = step === solution.length - 1;
  const checkpoints = maze.checkpoints.slice(0, node.stage);
  const action = node.direction ? 'Move ' + node.direction + '.' : 'Start at S.';
  const location = ' Row ' + (node.r + 1) + ', column ' + (node.c + 1) + '.';
  const progress = checkpoints ? ' Visited ' + [...checkpoints].join(', ') + '.' : '';
  const goal = tileAt(node.r, node.c) === 'G' ? ' Exit reached.' : '';
  solutionStatus.textContent = 'Step ' + step + ' of ' + (solution.length - 1) + '. ' + action + location + progress + goal;
  solutionStep.setAttribute('aria-valuetext', solutionStatus.textContent);
}

function renderSolution() {
  if (solutionCells) return;
  solution = findShortestRoute();
  solutionCells = renderMazeBoard(solutionBoard);
  const available = solution.length > 0;
  solutionStep.disabled = !available;
  solutionPrev.disabled = !available;
  solutionNext.disabled = !available;
  if (!available) {
    solutionStatus.textContent = 'No route was found.';
    return;
  }
  for (const {r, c} of solution) solutionCells[r][c].classList.add('maze-route');
  solutionStep.max = solution.length - 1;
  showSolutionStep(0);
}

function describePosition() {
  const available = Object.entries(directions)
    .filter(([, [dr, dc]]) => canEnter(tileAt(row + dr, col + dc)))
    .map(([direction]) => direction);
  return 'Row ' + (row + 1) + ', column ' + (col + 1) + '. Open directions: ' + available.join(', ') + '.';
}

function renderMazeBoard(board) {
  board.style.setProperty('--maze-size', maze.map[0].length);
  const grid = maze.map.map((line, r) => [...line].map((tile, c) => {
    const cell = document.createElement('span');
    cell.className = 'maze-cell';
    cell.classList.toggle('maze-wall', tile === '#');
    cell.classList.toggle('maze-goal', tile === 'G');
    cell.classList.toggle('maze-checkpoint', maze.checkpoints.includes(tile));
    cell.textContent = /[A-Z]/.test(tile) ? tile : '';
    cell.setAttribute('aria-hidden', 'true');
    cell.dataset.row = r;
    cell.dataset.col = c;
    return cell;
  }));
  board.replaceChildren(...grid.flat());
  return grid;
}

function loadMaze() {
  finishMazeDrag();
  const selected = mazes[mazePicker.value];
  if (maze !== selected) {
    maze = selected;
    solutionCells = null;
    solutionMarker = null;
    if (solutionPanel.open) renderSolution();
  }
  row = maze.map.findIndex(line => line.includes('S'));
  col = maze.map[row].indexOf('S');
  checkpointIndex = 0;
  moveCount = 0;
  finished = false;
  mazeNext.hidden = true;
  cells = renderMazeBoard(mazeBoard);
  cells[row][col].classList.add('maze-player', 'maze-visited');
  mazeMoves.textContent = '0 moves';
  describeCheckpoint();
  mazePar.textContent = 'Shortest route: ' + maze.par + ' moves.';
  mazeMessage.textContent = 'At start S. ' + describePosition();
}

function stepMaze(nextRow, nextCol) {
  if (finished || Math.abs(nextRow - row) + Math.abs(nextCol - col) !== 1) return false;
  const target = tileAt(nextRow, nextCol);
  const next = maze.checkpoints[checkpointIndex];
  if (!canEnter(target)) {
    mazeMessage.textContent = target === 'G'
      ? 'Exit locked. Visit checkpoint ' + next + ' first.'
      : 'That way is blocked. ' + describePosition();
    return false;
  }
  cells[row][col].classList.remove('maze-player');
  row = nextRow;
  col = nextCol;
  const cell = cells[row][col];
  cell.classList.add('maze-player', 'maze-visited');
  let checkpointMessage = '';
  if (target === next) {
    checkpointIndex = afterCheckpoint(target, checkpointIndex);
    cell.classList.add('maze-collected');
    describeCheckpoint();
    checkpointMessage = 'Checkpoint ' + target + ' collected. ';
    if (checkpointIndex === maze.checkpoints.length) checkpointMessage += 'Exit G unlocked. ';
  } else if (maze.checkpoints.indexOf(target) > checkpointIndex) {
    checkpointMessage = 'Visit checkpoint ' + next + ' before collecting ' + target + '. ';
  }
  moveCount++;
  const count = moveCount + (moveCount === 1 ? ' move' : ' moves');
  mazeMoves.textContent = count;
  finished = target === 'G';
  mazeNext.hidden = !finished || mazePicker.selectedIndex === mazes.length - 1;
  mazeMessage.textContent = finished
    ? 'You reached the exit in ' + count + '. ' + (moveCount === maze.par ? 'You matched the shortest route!' : 'The shortest route is ' + maze.par + ' moves.')
    : checkpointMessage + describePosition();
  return true;
}

function moveMaze(direction) {
  const [dr, dc] = directions[direction];
  stepMaze(row + dr, col + dc);
}

function mazePointerPosition(event) {
  const first = cells[0][0].getBoundingClientRect();
  const last = cells.at(-1).at(-1).getBoundingClientRect();
  const cols = maze.map[0].length;
  const rows = maze.map.length;
  const x = (event.clientX - first.left) * cols / (last.right - first.left);
  const y = (event.clientY - first.top) * rows / (last.bottom - first.top);
  return x >= 0 && x < cols && y >= 0 && y < rows ? {x, y} : null;
}

function traceMazeDrag(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let r = Math.floor(from.y);
  let c = Math.floor(from.x);
  const endRow = Math.floor(to.y);
  const endCol = Math.floor(to.x);
  const colStep = Math.sign(dx);
  const rowStep = Math.sign(dy);
  // Visit crossed squares in order so a fast drag cannot skip walls or checkpoints.
  while (r !== endRow || c !== endCol) {
    const crossCol = c === endCol ? Infinity : (c + (colStep > 0 ? 1 : 0) - from.x) / dx;
    const crossRow = r === endRow ? Infinity : (r + (rowStep > 0 ? 1 : 0) - from.y) / dy;
    if (Math.abs(crossCol - crossRow) < 1e-8) return; // A corner alone is not a shared edge.
    const onPlayer = r === row && c === col;
    if (crossCol < crossRow) c += colStep;
    else r += rowStep;
    if (onPlayer && !stepMaze(r, c)) return;
  }
}

function updateMazeDrag(event) {
  if (drag?.id !== event.pointerId) return;
  const next = mazePointerPosition(event);
  if (drag.position && next) traceMazeDrag(drag.position, next);
  drag.position = next;
}

function finishMazeDrag() {
  if (!drag) return;
  const {id} = drag;
  drag = null;
  mazeBoard.classList.remove('maze-dragging');
  if (mazeBoard.hasPointerCapture(id)) mazeBoard.releasePointerCapture(id);
}

mazeBoard.addEventListener('pointerdown', event => {
  if (drag || finished || event.button !== 0 || !event.target.closest('.maze-player')) return;
  drag = {id: event.pointerId, position: mazePointerPosition(event)};
  mazeBoard.classList.add('maze-dragging');
  mazeBoard.setPointerCapture(event.pointerId);
  mazeBoard.focus({preventScroll: true});
});
mazeBoard.addEventListener('pointermove', updateMazeDrag);
mazeBoard.addEventListener('pointerup', event => {
  if (drag?.id !== event.pointerId) return;
  updateMazeDrag(event);
  finishMazeDrag();
});
for (const type of ['pointercancel', 'lostpointercapture']) {
  mazeBoard.addEventListener(type, event => {
    if (drag?.id === event.pointerId) finishMazeDrag();
  });
}

solutionPanel.addEventListener('toggle', () => {
  if (solutionPanel.open) renderSolution();
});
solutionStep.addEventListener('input', () => showSolutionStep(Number(solutionStep.value)));
solutionPrev.addEventListener('click', () => showSolutionStep(Number(solutionStep.value) - 1));
solutionNext.addEventListener('click', () => showSolutionStep(Number(solutionStep.value) + 1));

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
const moveButtons = document.querySelectorAll('[data-maze-move]');
for (const button of moveButtons) {
  button.addEventListener('click', () => moveMaze(button.dataset.mazeMove));
}
const resetButton = document.getElementById('maze-reset');
resetButton.addEventListener('click', loadMaze);
mazePicker.addEventListener('change', loadMaze);
mazeNext.addEventListener('click', () => {
  mazePicker.selectedIndex++;
  loadMaze();
  mazeBoard.focus();
});
mazePicker.replaceChildren(...mazes.map(({title}, index) => new Option(title, index)));
loadMaze();
for (const control of [mazePicker, resetButton, ...moveButtons]) control.disabled = false;
solutionPanel.hidden = false;
