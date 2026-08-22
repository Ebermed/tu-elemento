'use strict';
const fs=require('fs');
const replacements=require('./copy-v2-style-cleanup.js');

const files=[
  'copy-v2-preview.js',
  'pilares-personalizados-preview.js',
  'carta-general-v2.js',
  'carta-profunda-ui.js',
  'lectura.js',
  'traduccion.js',
  'lectura-mensual.js',
  'mes.js',
  'reglas.js',
  'calendario.js',
  'ciclos-page.js'
].filter(f=>fs.existsSync(__dirname+'/'+f));

const patterns=[
  ['no-es-que',/\bno es que\b/i],
  ['no-significa',/\bno significa\b/i],
  ['no-porque-sino',/\bno porque\b[^.!?]{0,140}\bsino\b/i],
  ['no-x-sino-y',/\bno\b[^.!?]{1,120}\bsino\b/i],
  ['no-es-x-es-y',/\bno es\b[^.!?]{1,170}(?:[.:;—-]|\s)\s*(?:es|son|significa)\b/i],
  ['no-son-x-son-y',/\bno son\b[^.!?]{1,170}(?:[.:;—-]|\s)\s*(?:son|forman|describen)\b/i],
  ['no-eres-x-eres-y',/\bno eres\b[^.!?]{1,170}[.!?]\s*eres\b/i]
];

function strings(line){
  const out=[];
  const rx=/(['"`])((?:\\.|(?!\1).)*)\1/g;
  let m;
  while((m=rx.exec(line))) out.push(m[2]);
  return out;
}
function cubierto(s){
  return replacements.some(r=>s.includes(r[0])||r[0].includes(s));
}

const unresolved=[];
let covered=0;
for(const file of files){
  const lines=fs.readFileSync(__dirname+'/'+file,'utf8').split(/\r?\n/);
  lines.forEach((line,i)=>{
    for(const s of strings(line)){
      for(const [name,rx] of patterns){
        if(rx.test(s)){
          if(cubierto(s)) covered++;
          else unresolved.push(`${file}:${i+1} [${name}] ${s}`);
          break;
        }
      }
    }
  });
}

if(unresolved.length){
  console.error('\nConstrucciones antitéticas sin resolver:\n'+unresolved.map(x=>' - '+x).join('\n')+'\n');
  process.exit(1);
}
console.log(`Editorial antithesis guard: OK · ${covered} construcciones antiguas cubiertas por la barrida`);
