/** TU ELEMENTO — V11 base limpia */
var MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var DOW=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
var $=function(s){return document.querySelector(s);};

function activarApariciones(scope){
  var raiz=scope&&scope.querySelectorAll?scope:document;
  var nodos=raiz.querySelectorAll('.revela');
  for(var i=0;i<nodos.length;i++){
    nodos[i].classList.add('revela-prep','revela-viva');
    if(nodos[i].style){nodos[i].style.filter='none';nodos[i].style.transform='none';nodos[i].style.opacity='1';}
  }
}
function aplicarPaletaUI(paleta){if(!paleta||!paleta.length||!document.documentElement)return;var s=document.documentElement.style;s.setProperty('--acento',paleta[2]||paleta[0]);s.setProperty('--acento-2',paleta[1]||paleta[0]);s.setProperty('--acento-3',paleta[0]);}
function pintarFondo(paleta,semilla,opac){var f=$('#fondo');if(!f)return;aplicarPaletaUI(paleta);var svg=fondoAcuarela(paleta,1200,1600,{semilla:semilla,opacidad:opac==null?1.35:opac});try{f.style.backgroundImage='url("data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg).replace(/'/g,'%27').replace(/"/g,'%22')+'")';f.innerHTML='';}catch(e){f.innerHTML=svg;}}
function ir(id){var vivas=document.querySelectorAll('.pantalla.viva');for(var i=0;i<vivas.length;i++)vivas[i].classList.remove('viva');var d=$('#'+id);if(d)d.classList.add('viva');window.scrollTo(0,0);}
function faltantes(requiere){var falta=[];for(var arch in requiere)if(typeof globalThis[requiere[arch]]==='undefined')falta.push(arch);if(!falta.length)return false;document.querySelector('main').innerHTML='<div style="max-width:520px;text-align:left"><h1 style="font-size:28px">Faltan archivos</h1><p>La aplicación necesita estos módulos:</p><ul>'+falta.map(function(f){return '<li><code>'+f+'</code></li>';}).join('')+'</ul></div>';return true;}
function descargarSVG(svg,nombre){if(!svg)return;var w=parseInt(svg.getAttribute('width'),10)||1080;var h=parseInt(svg.getAttribute('height'),10)||1350;var s=new XMLSerializer().serializeToString(svg);var url=URL.createObjectURL(new Blob([s],{type:'image/svg+xml;charset=utf-8'}));var img=new Image();img.onload=function(){var c=document.createElement('canvas');c.width=w;c.height=h;var ctx=c.getContext('2d');ctx.fillStyle='#FBF7F0';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);URL.revokeObjectURL(url);c.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=nombre+'.png';a.click();});};img.onerror=function(){URL.revokeObjectURL(url);};img.src=url;}

var TE_SCHEMA_KEY='tuelemento.schema';
var TE_SCHEMA_VALUE='11-clean-20260821';
var LLAVE_PERFILES='tuelemento.v11.perfiles';
(function resetV11(){try{if(localStorage.getItem(TE_SCHEMA_KEY)===TE_SCHEMA_VALUE)return;var borrar=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(k.indexOf('tuelemento.')===0||k.indexOf('tuElemento.')===0||k.indexOf('te.')===0))borrar.push(k);}for(var j=0;j<borrar.length;j++)localStorage.removeItem(borrar[j]);localStorage.setItem(TE_SCHEMA_KEY,TE_SCHEMA_VALUE);}catch(e){}})();

function _estadoVacio(){return{version:11,perfiles:[],principalId:null,calendarioId:null};}
function _idPerfil(){return'p_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}
function _nacimientoValido(d){return!!(d&&d.anio&&d.mes&&d.dia&&d.zona&&isFinite(Number(d.lon)));}
function _limpiarNacimiento(d){return{anio:Number(d.anio),mes:Number(d.mes),dia:Number(d.dia),hora:Number(d.hora==null?12:d.hora),minuto:Number(d.minuto||0),sinHora:!!d.sinHora,zona:String(d.zona||''),lon:Number(d.lon),ciudad:String(d.ciudad||''),sexo:String(d.sexo||'')};}
function _guardarEstado(e){try{localStorage.setItem(LLAVE_PERFILES,JSON.stringify(e));return true;}catch(err){return false;}}
function estadoPerfiles(){try{var bruto=localStorage.getItem(LLAVE_PERFILES);if(!bruto)return _estadoVacio();var e=JSON.parse(bruto);if(!e||e.version!==11||!Array.isArray(e.perfiles))return _estadoVacio();e.principalId=e.principalId||null;e.calendarioId=e.calendarioId||null;e.perfiles=e.perfiles.filter(function(p){return p&&p.id&&_nacimientoValido(p.nacimiento);});return e;}catch(err){return _estadoVacio();}}
function listarPerfiles(){return estadoPerfiles().perfiles.slice();}
function leerPerfil(id){var ps=listarPerfiles();for(var i=0;i<ps.length;i++)if(ps[i].id===id)return ps[i];return null;}
function leerPerfilEnEstado(e,id){for(var i=0;i<e.perfiles.length;i++)if(e.perfiles[i].id===id)return e.perfiles[i];return null;}
function etiquetaPerfil(p){if(!p)return'Carta';return p.tipo==='yo'?'Tu carta':(p.nombre||'Otra carta');}
function guardarPerfil(datos){datos=datos||{};if(!_nacimientoValido(datos.nacimiento))return null;var e=estadoPerfiles();var ahora=Date.now();var principalAnterior=e.principalId;var tipo=datos.tipo==='otra'?'otra':'yo';var nombre=tipo==='yo'?'Tu carta':String(datos.nombre||'Otra carta').trim();var existente=null;if(datos.id)existente=leerPerfilEnEstado(e,datos.id);if(!existente&&tipo==='yo'){for(var i=0;i<e.perfiles.length;i++)if(e.perfiles[i].tipo==='yo'){existente=e.perfiles[i];break;}}var p=existente||{id:_idPerfil(),creado:ahora};p.tipo=tipo;p.nombre=nombre;p.nacimiento=_limpiarNacimiento(datos.nacimiento);p.actualizado=ahora;if(!existente)e.perfiles.push(p);if(tipo==='yo'){e.principalId=p.id;if(!principalAnterior)e.calendarioId=p.id;}if(!e.calendarioId||!leerPerfilEnEstado(e,e.calendarioId))e.calendarioId=e.principalId||p.id;return _guardarEstado(e)?p:null;}
function perfilPrincipal(){var e=estadoPerfiles();var p=leerPerfilEnEstado(e,e.principalId);if(p)return p;for(var i=0;i<e.perfiles.length;i++)if(e.perfiles[i].tipo==='yo')return e.perfiles[i];return null;}
function perfilCalendario(){var e=estadoPerfiles();return leerPerfilEnEstado(e,e.calendarioId)||perfilPrincipal()||e.perfiles[0]||null;}
function seleccionarPerfilCalendario(id){var e=estadoPerfiles();var p=leerPerfilEnEstado(e,id);e.calendarioId=p?p.id:null;_guardarEstado(e);return p;}
function olvidarPerfil(id){var e=estadoPerfiles();e.perfiles=e.perfiles.filter(function(p){return p.id!==id;});if(e.principalId===id){e.principalId=null;for(var i=0;i<e.perfiles.length;i++)if(e.perfiles[i].tipo==='yo'){e.principalId=e.perfiles[i].id;break;}}if(e.calendarioId===id||!leerPerfilEnEstado(e,e.calendarioId))e.calendarioId=e.principalId||(e.perfiles[0]?e.perfiles[0].id:null);_guardarEstado(e);return e.perfiles.length;}
function cartaDesdePerfil(p){if(!p||!_nacimientoValido(p.nacimiento))return null;var d=p.nacimiento;try{return cuatroPilares({anio:d.anio,mes:d.mes,dia:d.dia,hora:d.sinHora?12:d.hora,minuto:d.sinHora?0:d.minuto,zona:d.zona,longitud:d.lon});}catch(e){return null;}}
(function(raiz){var api={MESES:MESES,DOW:DOW,$:$,activarApariciones:activarApariciones,aplicarPaletaUI:aplicarPaletaUI,pintarFondo:pintarFondo,ir:ir,faltantes:faltantes,descargarSVG:descargarSVG,estadoPerfiles:estadoPerfiles,listarPerfiles:listarPerfiles,leerPerfil:leerPerfil,etiquetaPerfil:etiquetaPerfil,guardarPerfil:guardarPerfil,perfilPrincipal:perfilPrincipal,perfilCalendario:perfilCalendario,seleccionarPerfilCalendario:seleccionarPerfilCalendario,olvidarPerfil:olvidarPerfil,cartaDesdePerfil:cartaDesdePerfil};if(typeof module!=='undefined'&&module.exports)module.exports=api;else for(var k in api)raiz[k]=api[k];})(typeof globalThis!=='undefined'?globalThis:this);
