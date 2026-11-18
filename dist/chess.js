const lines = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
const knight = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const sliders = {Q:lines,R:lines.slice(0,4),B:lines.slice(4)};
export const nameOf = square => 'abcdefgh'[square%8]+(8-Math.floor(square/8));
export const squareOf = name => (8-Number(name[1]))*8+'abcdefgh'.indexOf(name[0]);
export const white = piece => piece===piece.toUpperCase();
const inside=(row,col)=>row>=0&&row<8&&col>=0&&col<8;

export function position(fen) {
  return [...fen.replaceAll('/','').replace(/[1-8]/g,d=>'.'.repeat(Number(d)))].map(c=>c==='.'?null:c);
}

function* destinations(board,from) {
  const type=board[from].toUpperCase();
  const dirs=type==='N'?knight:sliders[type]??lines;
  const row=Math.floor(from/8),col=from%8;
  const reach=sliders[type]?7:1;
  for(const [dy,dx] of dirs) for(let n=1;n<=reach;n++){
    const y=row+dy*n,x=col+dx*n;
    if(!inside(y,x)) break;
    const to=y*8+x;
    yield to;
    if(board[to]) break;
  }
}

export function inCheck(board,side) {
  const king=board.indexOf(side?'K':'k');
  return board.some((piece,from)=>{
    if(!piece||white(piece)===side) return false;
    for(const to of destinations(board,from)) if(to===king) return true;
    return false;
  });
}
export function play(board,move) {
  const next=board.slice();
  next[move.to]=next[move.from];
  next[move.from]=null;
  return next;
}
export function legal(board,side) {
  const moves=[];
  board.forEach((piece,from)=>{
    if(!piece||white(piece)!==side) return;
    for(const to of destinations(board,from)){
      if(board[to]&&(white(board[to])===side||board[to].toUpperCase()==='K')) continue;
      const move={from,to};
      if(!inCheck(play(board,move),side)) moves.push(move);
    }
  });
  return moves;
}
export function decode(uci) {
  return {from:squareOf(uci.slice(0,2)),to:squareOf(uci.slice(2,4))};
}
export const encode = move => nameOf(move.from)+nameOf(move.to);
export function notation(board,uci,side) {
  const move=decode(uci);
  const next=play(board,move);
  const suffix=inCheck(next,!side)?(legal(next,!side).length?'+':'#'):'';
  return board[move.from].toUpperCase()+' '+nameOf(move.from)+(board[move.to]?' × ':'–')+nameOf(move.to)+suffix;
}
