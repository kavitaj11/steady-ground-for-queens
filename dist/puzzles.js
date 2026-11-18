const mathPuzzles = [
  {
    title: 'Intersecting remainders',
    question: 'A number between 100 and 350 leaves remainder 3 when divided by 4, remainder 5 when divided by 7, and remainder 2 when divided by 9. What is the number?',
    answer: 299,
    hint: 'Combine the conditions for 4 and 7 first. Any two numbers satisfying both are 28 apart.',
    explanation: 'The first two conditions give numbers of the form 19 + 28k. Modulo 9 this is 1 + k, so k must be 1 modulo 9. The only value in range is 19 + 28 × 10 = 299.'
  },
  {
    title: 'The restricted committee',
    question: 'A team of nine includes three specialists. A four-person committee must include at least one specialist. Two of the six nonspecialists cannot serve together. How many committees are possible?',
    answer: 96,
    hint: 'Start with all four-person committees. If you subtract two kinds of invalid group, some groups get subtracted twice.',
    explanation: 'There are 126 committees to start. Subtract the 15 with no specialist and the 21 with both incompatible members. Add back the 6 with both problems. That leaves 126 − 15 − 21 + 6 = 96.'
  },
  {
    title: 'Conditional draw',
    question: 'A bag holds six amber counters and four teal counters. You draw three at random without replacement. Given that at least one is amber, what is the probability that exactly two are amber? Enter the denominator of the fraction in lowest terms.',
    answer: 29,
    hint: 'Remove draws containing three teal counters from the total. How many remaining draws contain two amber and one teal?',
    explanation: 'There are 120 possible draws, 4 of them all teal. The favorable draws number 15 × 4 = 60. The conditional probability is 60/116 = 15/29.'
  },
  {
    title: 'Exact postage',
    question: 'You need exactly 151 cents in postage and can use any number of 7-, 11-, and 19-cent stamps. What is the fewest stamps you can use?',
    answer: 9,
    hint: 'Start by bounding the answer using the largest denomination. Then ask how much the total changes when you replace one large stamp.',
    explanation: 'Seven stamps can reach only 133 cents. Eight large stamps make 152, and each replacement lowers that by at least 8, so eight cannot make 151. Seven 19-cent stamps plus one 11-cent and one 7-cent stamp make 151 with nine stamps.'
  },
  {
    title: 'Routes with closures',
    question: 'Start at (0, 0) and reach (5, 4). Every move increases x or y by exactly 1. The points (2, 2) and (3, 3) are closed. How many routes avoid both?',
    answer: 42,
    hint: 'Count routes as arrangements of right and up steps. A route that visits both closed points appears in both groups you need to subtract.',
    explanation: 'There are 126 unrestricted routes. Each closed point lies on 60 routes. The 36 that visit both were counted twice, so 126 − 60 − 60 + 36 = 42.'
  }
];

const patternPuzzles = [
  {
    title: 'Two sequences, one line',
    question: 'Odd and even positions follow different rules. In each subsequence, successive differences change by a constant amount. Find the missing tenth term.',
    values: [3, 30, 7, 28, 13, 24, 21, 18, 31, '?'],
    answer: 10,
    hint: 'Write down positions 2, 4, 6, and 8 on their own, then compare successive differences.',
    explanation: 'The even terms change by −2, −4, and −6, so the next change is −8 and the missing term is 10. The odd terms change by +4, +6, +8, and +10.'
  },
  {
    title: 'Alternating operations',
    question: 'Each row applies the same two operations to its first two numbers, in the order shown. Every operation uses both original inputs. Fill in the missing result.',
    headers: ['Input A', 'Input B', 'Result 1', 'Result 2'],
    rows: [[2, 5, 9, 23], [3, 4, 13, 13], [5, 7, 32, 44], [4, 9, 25, '?']],
    answer: 77,
    hint: 'Each result squares a different input. Compare the squared input with the result to see what happens to the other one.',
    explanation: 'Result 1 is A² + B and Result 2 is B² − A. For the final row that gives 4² + 9 = 25 and 9² − 4 = 77.'
  },
  {
    title: 'The overlapping boards',
    question: 'Two boards combine using the same cell-by-cell rule in each row. Deduce how the rule treats overlapping squares, then choose the missing board.',
    headers: ['First board', 'Second board', 'Result'],
    rows: [
      [[2, 3, 4, 8], [3, 5, 8, 9], [2, 4, 5, 9]],
      [[1, 4, 5, 9], [2, 4, 7, 9], [1, 2, 5, 7]],
      [[1, 2, 5, 8], [2, 3, 5, 7, 9], '?']
    ],
    choices: [[1, 2, 3, 5, 7, 8, 9], [2, 5], [1, 3, 7, 8, 9], [1, 3, 5, 7, 8, 9]],
    answer: 'C',
    hint: 'In the first example, look at the top-right square. It is filled in both inputs and empty in the result.',
    explanation: 'A square survives when exactly one input fills it. This cancels cells 2 and 5 in the last row and leaves cells 1, 3, 7, 8, and 9.'
  },
  {
    title: 'The double transformation',
    question: 'Every board is transformed in two steps. One step changes the orientation and the other changes a single square. Which board completes the last row?',
    headers: ['Before', 'After'],
    rows: [
      [[1, 2, 5, 9], [3, 6, 7]],
      [[1, 4, 6, 8], [2, 3, 4, 5, 8]],
      [[2, 4, 7], '?']
    ],
    choices: [[1, 2, 6], [1, 2, 5, 6], [4, 5, 8, 9], [2, 3, 5, 8]],
    answer: 'B',
    hint: 'Try a quarter-turn. Then compare what happens to the center in both examples.',
    explanation: 'Rotate the board 90° clockwise to move the three filled cells to 1, 2, and 6. Then flip the center from empty to filled, which adds cell 5.'
  },
  {
    title: 'The reflected mask',
    question: 'Apply the second board as a mask to the first. The two examples reveal the direction of the reflection and which cells the mask removes. Find the missing result.',
    headers: ['Starting board', 'Mask', 'Result'],
    rows: [
      [[1, 2, 4, 5, 9], [2, 6, 7], [1, 5]],
      [[2, 3, 5, 6, 7], [1, 2, 6], [5, 6, 7]],
      [[1, 3, 4, 5, 6, 7, 8, 9], [2, 3, 4, 8], '?']
    ],
    choices: [[1, 4, 5, 6, 7, 9], [1, 6, 8], [1, 3, 4, 5, 7, 9], [3, 4, 5, 7, 9]],
    answer: 'D',
    hint: 'Reflect the mask left to right. Then compare the filled squares of the reflected mask with the filled squares on the starting board.',
    explanation: 'Mirror the mask left to right to get cells 1, 2, 6, and 8. Remove those locations from the starting board. Cells 3, 4, 5, 7, and 9 remain.'
  }
];

function fillPicker(picker, items) {
  picker.replaceChildren(...items.map(({title}, index) => new Option(title, index)));
}

function makePuzzleValue(value) {
  if (!Array.isArray(value)) return document.createTextNode(value);
  const grid = document.createElement('span');
  grid.className = 'pattern-board';
  grid.setAttribute('role', 'img');
  grid.setAttribute('aria-label', 'Filled cells: ' + value.join(', '));
  for (let cell = 1; cell <= 9; cell++) {
    const dot = document.createElement('span');
    dot.classList.toggle('pattern-cell-filled', value.includes(cell));
    grid.append(dot);
  }
  return grid;
}

function renderPuzzleFigure(figure, puzzle) {
  figure.replaceChildren();
  if (puzzle.values) {
    const list = document.createElement('ol');
    list.className = 'pattern-sequence';
    for (const value of puzzle.values) {
      const item = document.createElement('li');
      item.textContent = value;
      list.append(item);
    }
    figure.append(list);
  }
  if (puzzle.rows) {
    const table = document.createElement('table');
    table.className = 'pattern-table';
    const heading = table.createTHead().insertRow();
    for (const text of puzzle.headers) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = text;
      heading.append(cell);
    }
    const body = table.createTBody();
    for (const row of puzzle.rows) {
      const entry = body.insertRow();
      for (const value of row) entry.insertCell().append(makePuzzleValue(value));
    }
    figure.append(table);
  }
}

function setupQuiz(panel, puzzles) {
  const pick = panel.querySelector('[data-pick]');
  const question = panel.querySelector('[data-question]');
  const prompt = panel.querySelector('[data-prompt]');
  const form = panel.querySelector('form');
  const answer = panel.querySelector('[data-answer]');
  const answerLabel = answer.closest('label');
  const figure = panel.querySelector('[data-figure]');
  const options = panel.querySelector('[data-choices]');
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
    question.textContent = puzzle.title;
    prompt.textContent = puzzle.question;
    hint.textContent = puzzle.hint;

    answer.disabled = Boolean(puzzle.choices);
    answerLabel.hidden = answer.disabled;
    if (figure) renderPuzzleFigure(figure, puzzle);
    if (!options) return;
    options.replaceChildren();
    options.closest('fieldset').hidden = !puzzle.choices;
    for (const [index, board] of (puzzle.choices ?? []).entries()) {
      const letter = 'ABCD'[index];
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'board';
      input.value = letter;
      input.required = true;
      label.append(input, letter, makePuzzleValue(board));
      options.append(label);
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
    const guess = puzzle.choices ? new FormData(form).get('board') : Number(answer.value);
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
