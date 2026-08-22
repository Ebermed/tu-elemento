'use strict';
const fs=require('fs');

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
  ['no-es-x-es-y',/\bno es\b[^.!?]{1,150}(?:[.:;—-]|\s)\s*(?:es|son)\b/i]
];

function strings(line){
  const out=[];
  const rx=/(['"`])((?:\\.|(?!\1).)*)\1/g;
  let m;
  while((m=rx.exec(line))) out.push(m[2]);
  return out;
}

const hits=[];
for(const file of files){
  const lines=fs.readFileSync(__dirname+'/'+file,'utf8').split(/\r?\n/);
  lines.forEach((line,i)=>{
    for(const s of strings(line)){
      for(const [name,rx] of patterns){
        if(rx.test(s)){hits.push(`${file}:${i+1} [${name}] ${s}`);break;}
      }
    }
  });
}

if(hits.length){
  console.error('\nConstrucciones antitéticas a revisar:\n'+hits.map(x=>' - '+x).join('\n')+'\n');
  process.exit(1);
}
console.log('Editorial antithesis guard: OK');
