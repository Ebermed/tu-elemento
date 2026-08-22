/** TU ELEMENTO V2 — normalización de datos conocidos para Carta profunda. */
(function (raiz) {
  'use strict';

  var ELEMENTOS=['madera','fuego','tierra','metal','agua'];

  function conteoConocido(carta,sinHora){
    if(!sinHora)return carta.balanceElementos;
    var c={madera:0,fuego:0,tierra:0,metal:0,agua:0};
    ['anio','mes','dia'].forEach(function(k){
      var p=carta.pilares[k];
      if(p&&p.tallo&&c[p.tallo.elemento]!==undefined)c[p.tallo.elemento]++;
      if(p&&p.rama&&c[p.rama.elemento]!==undefined)c[p.rama.elemento]++;
    });
    return c;
  }

  function normalizarCartaProfunda(carta,sinHora){
    if(!carta||!sinHora)return carta;
    var copia={};for(var k in carta)copia[k]=carta[k];
    copia.balanceElementos=conteoConocido(carta,true);
    return copia;
  }

  var apiBase=raiz&&raiz.analizarCartaProfunda;
  function analizarConDatosConocidos(carta,opciones){
    opciones=opciones||{};
    var base=apiBase;
    if(!base&&typeof require!=='undefined'){
      try{base=require('./carta-profunda').analizarCartaProfunda;}catch(e){}
    }
    if(!base)throw new Error('Falta carta-profunda.js');
    return base(normalizarCartaProfunda(carta,!!opciones.sinHora),opciones);
  }

  var api={conteoConocido:conteoConocido,normalizarCartaProfunda:normalizarCartaProfunda,analizarCartaProfunda:analizarConDatosConocidos};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else{
    raiz.conteoConocidoCartaProfunda=conteoConocido;
    raiz.normalizarCartaProfunda=normalizarCartaProfunda;
    raiz.analizarCartaProfunda=analizarConDatosConocidos;
  }
})(typeof globalThis!=='undefined'?globalThis:this);
