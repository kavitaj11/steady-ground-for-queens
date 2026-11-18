import {strategies,puzzles} from './puzzle-data.js';
import {position,nameOf,white,legal,play,decode,encode,inCheck,notation} from './chess.js';

const $=id=>document.getElementById('queen-'+id);
const board=$('board');
const names={K:'king',Q:'queen',R:'rook',B:'bishop',N:'knight'};
const glyphs={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞'};
const solved=new Set();
let active=0;
let start=[];
let snapshot=[];
let selected=null;
let cursor=0;
let replay=null;
let ply=0;
let last=null;
let moveOptions=[];
const squares=[];

function addOption(select,text,value){
  const option=document.createElement('option');
  option.textContent=text;
  option.value=String(value);
  select.append(option);
}
function coordinate(css,text){
  const item=document.createElement('span');
  item.className='board-coordinate '+css;
  item.setAttribute('aria-hidden','true');
  item.textContent=text;
  return item;
}
for(let i=0;i<64;i++){
  const button=document.createElement('button');
  button.type='button';
  const piece=document.createElement('span');
  piece.setAttribute('aria-hidden','true');
  button.append(piece);
  if(i%8===0)button.append(coordinate('board-rank',String(8-Math.floor(i/8))));
  if(i>=56)button.append(coordinate('board-file',nameOf(i)[0]));
  button.addEventListener('click',()=>chooseSquare(i));
  button.addEventListener('keydown',event=>{
    const offsets={ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8};
    const offset=offsets[event.key];
    if(offset===undefined) return;
    event.preventDefault();
    const next=i+offset;
    if(next<0||next>=64||(Math.abs(offset)===1&&Math.floor(i/8)!==Math.floor(next/8))) return;
    setCursor(next);
    squares[next].button.focus();
  });
  squares.push({button,piece});
  board.append(button);
}

function setCursor(next){
  squares[cursor].button.tabIndex=-1;
  cursor=next;
  squares[cursor].button.tabIndex=0;
}
function draw(){
  const available=new Set(moveOptions.filter(move=>move.from===selected).map(move=>move.to));
  squares.forEach(({button,piece},i)=>{
    const value=snapshot[i];
    const light=(Math.floor(i/8)+i%8)%2===0;
    const classes=['board-square'];
    if(!light)classes.push('dark');
    if(i===selected)classes.push('selected');
    if(last&&(last.from===i||last.to===i))classes.push('last');
    if(available.has(i))classes.push('legal');
    if(value)classes.push('occupied');
    button.className=classes.join(' ');
    button.tabIndex=i===cursor?0:-1;
    button.setAttribute('aria-pressed',String(i===selected));
    const side=value&&white(value)?'white':'black';
    button.setAttribute('aria-label',nameOf(i)+(value?', '+side+' '+names[value.toUpperCase()]:', empty')+(available.has(i)?', legal destination':''));
    piece.className='chess-piece '+side;
    piece.textContent=value?glyphs[value.toUpperCase()]:'';
  });
  $('turn').textContent=replay?'Replay · '+ply+' of '+replay.moves.length+' moves':'White to move · Select a piece, then its destination.';
}

function chooseSquare(i){
  setCursor(i);
  if(replay)return;
  const value=snapshot[i];
  if(value&&white(value)){
    selected=selected===i?null:i;
    $('status').textContent='';
    draw();
    return;
  }
  if(selected===null){
    $('status').textContent='Select a white piece to begin.';
    return;
  }
  const move=moveOptions.find(candidate=>candidate.from===selected&&candidate.to===i);
  if(!move){
    $('status').textContent='That move is unavailable. The dots show legal destinations.';
    return;
  }
  const puzzle=puzzles[active], uci=encode(move);
  const line=puzzle.lines.find(option=>option.moves[0]===uci);
  if(line){
    solved.add(active);
    updateProgress();
    showReplay(line,'Solved. Step through the line to see why it works.',1);
    return;
  }
  const next=play(start,move);
  if(!inCheck(next,false)&&legal(next,false).length===0){
    $('status').textContent='Stalemate. Black has no legal move and is out of check. Try again.';
  } else if(puzzle.otherWins?.includes(uci)){
    $('status').textContent='That also forces mate. For this lesson, find a line where Black takes the queen.';
  } else {
    $('status').textContent='That move is legal. Look for a move that meets this puzzle’s goal.';
  }
  selected=null;
  draw();
}

function updateProgress(){
  $('progress').textContent=solved.size+' of '+puzzles.length+' solved';
}
function resetBoard(){
  start=position(puzzles[active].fen);
  snapshot=start;
  replay=null;
  ply=0;
  last=null;
  selected=null;
  cursor=start.indexOf('Q');
  moveOptions=legal(start,true);
  $('replay').hidden=true;
  $('hint').disabled=false;
  $('hint').textContent='Show hint';
  $('hint').setAttribute('aria-expanded','false');
  $('solution').hidden=true;
  $('hint-text').hidden=true;
  $('status').textContent='';
  draw();
}

function openPuzzle(index){
  active=index;
  const puzzle=puzzles[active];
  $('level').value=String(puzzle.group);
  $('puzzle').replaceChildren();
  puzzles.forEach((item,i)=>{if(item.group===puzzle.group)addOption($('puzzle'),item.title,i);});
  $('puzzle').value=String(index);
  const strategy=strategies[puzzle.group];
  $('strategy').textContent=strategy.name;
  $('title').textContent=puzzle.title;
  $('lesson').textContent=strategy.lesson;
  $('objective').textContent=strategy.goal;
  $('hint-text').textContent=puzzle.hint;
  resetBoard();
}

function showReplay(line,message,step){
  replay=line;
  selected=null;
  moveOptions=[];
  $('status').textContent=message;
  $('explanation').textContent=puzzles[active].why;
  $('replay').hidden=false;
  $('hint').disabled=true;
  $('hint-text').hidden=true;
  $('hint').setAttribute('aria-expanded','false');
  $('solution').hidden=true;
  $('next-puzzle').textContent=active===puzzles.length-1?'Return to first puzzle':'Next puzzle';
  $('moves').replaceChildren();
  let state=start;
  line.moves.forEach((uci,i)=>{
    const item=document.createElement('li');
    const button=document.createElement('button');
    button.type='button';
    button.textContent=(i%2===0?'White ':'Black ')+notation(state,uci,i%2===0);
    button.addEventListener('click',()=>setPly(i+1));
    item.append(button);
    $('moves').append(item);
    state=play(state,decode(uci));
  });
  setPly(step);
}

function setPly(value){
  ply=value;
  snapshot=start;
  last=null;
  for(const uci of replay.moves.slice(0,ply)){
    last=decode(uci);
    snapshot=play(snapshot,last);
  }
  for(const [i,item] of [...$('moves').children].entries()){
    const button=item.firstElementChild;
    if(i+1===ply)button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
  }
  $('prev').disabled=ply===0;
  $('next').disabled=ply===replay.moves.length;
  const notes=[
    'Starting position.',
    replay.moves.length===1?'Checkmate. Black has no legal reply.':
      replay.replies===1?'Black has one legal reply.':'Black has '+replay.replies+' legal replies. This replay shows one of the strongest.',
    'Black’s reply is on the board. Step forward to see White’s finish.',
    replay.target?'White wins the piece on '+replay.target+'.':'Checkmate.'
  ];
  $('replay-note').textContent=notes[ply];
  draw();
}

strategies.forEach((strategy,i)=>addOption($('level'),strategy.name,i));
$('level').addEventListener('change',()=>openPuzzle(puzzles.findIndex(p=>p.group===Number($('level').value))));
$('puzzle').addEventListener('change',()=>openPuzzle(Number($('puzzle').value)));
$('hint').setAttribute('aria-controls','queen-hint-text');
$('hint').addEventListener('click',()=>{
  const show=$('hint-text').hidden;
  $('hint-text').hidden=!show;
  $('hint').textContent=show?'Hide hint':'Show hint';
  $('hint').setAttribute('aria-expanded',String(show));
  if(show)$('solution').hidden=false;
});
$('solution').addEventListener('click',()=>showReplay(puzzles[active].lines[0],'Solution shown. You can reset the board and try it yourself.',0));
$('reset').addEventListener('click',resetBoard);
$('prev').addEventListener('click',()=>setPly(ply-1));
$('next').addEventListener('click',()=>setPly(ply+1));
$('next-puzzle').addEventListener('click',()=>{
  openPuzzle((active+1)%puzzles.length);
  $('level').focus();
});
updateProgress();
openPuzzle(0);
