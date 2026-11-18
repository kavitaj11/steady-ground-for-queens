import {catalog} from './books.js';

const $ = id => document.getElementById(id);
const make = (tag, text, classes) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (classes) node.className = classes;
  return node;
};
const glyphs={sun:'☀',lock:'♙'};
function icon(name) {
  const node = make('span',glyphs[name],'icon');
  node.dataset.glyph=name;
  node.setAttribute('aria-hidden','true');
  return node;
}
for (const node of document.querySelectorAll('[data-icon]')) node.replaceChildren(icon(node.dataset.icon));

const books = catalog.flatMap(series=>series.books);
let activeView='';

function bookLink(book) {
  const anchor=make('a',book.link??'Search on Amazon','book-link');
  const query=new URLSearchParams({k:book.title+' Kavita Jadhav'});
  anchor.href=book.url??'https://www.amazon.com/s?'+query;
  anchor.setAttribute('aria-label',anchor.textContent+' — '+book.title);
  anchor.target='_blank';
  anchor.rel='noopener noreferrer';
  return anchor;
}
for (const series of catalog) {
  const section=make('section',undefined,'reading-card series-card');
  const list=make('ul');
  for (const book of series.books) {
    const item=make('li');
    item.append(make('span',book.title,'catalog-title'),bookLink(book));
    list.append(item);
  }
  section.append(make('h2',series.name),list);
  $('catalog').append(section);
}
const dialog=$('dialog');
$('close-dialog').addEventListener('click',()=>dialog.close());
document.querySelector('[data-dialog="privacy"]').addEventListener('click',()=>dialog.showModal());
for(const target of document.querySelectorAll('[data-reading]')) {
  const book=books.find(item=>item.id===target.dataset.reading);
  if(book) target.append(bookLink(book));
}
const views=['today','reflection','books','career','spirituality','motherhood','puzzles','queens-gambits','math-puzzles','maze-puzzles','pattern-puzzles','gita','challenges'];
const parentViews={career:'today',spirituality:'today',motherhood:'today',puzzles:'reflection','queens-gambits':'reflection','math-puzzles':'reflection','maze-puzzles':'reflection','pattern-puzzles':'reflection',gita:'reflection',challenges:'reflection'};
function route(focus=false) {
  const hash=location.hash.slice(1);
  if(hash==='main') return;
  const target=$(hash);
  const section=target?.closest('.view');
  const view=views.includes(section?.id)?section.id:'today';
  const anchor=section && target!==section ? target : null;
  const changed=view!==activeView;
  if(changed){
    activeView=view;
    for(const id of views) $(id).hidden=id!==view;
    for(const link of document.querySelectorAll('[data-nav]')) {
      if(link.dataset.nav===(parentViews[view]??view)) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
  }
  if(anchor){
    anchor.scrollIntoView({block:'start',behavior:'instant'});
    if(focus) anchor.focus({preventScroll:true});
  } else if(focus&&changed){
    window.scrollTo({top:0,behavior:'instant'});
    $(view).querySelector('h1').focus({preventScroll:true});
  }
}
window.addEventListener('hashchange',()=>route(true));
route();
