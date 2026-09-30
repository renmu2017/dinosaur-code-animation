'use strict';

function renderScene(t) {
  t = ((t % 8) + 8) % 8;
  const TAU = Math.PI * 2;
  const phase = TAU * t;
  const bob = Math.sin(phase * 2) * 1.8;
  const f = n => Number(n.toFixed(3));
  const P = (x, y) => `${f(x)},${f(y)}`;
  const ink = '#365c53';
  const cream = '#fff5d9';
  const hip = { x: 445, y: 357 + bob };
  const crank = { x: 485, y: 445 };
  const foot = a => ({ x: crank.x + 25 * Math.cos(a), y: crank.y + 25 * Math.sin(a) });
  const nearFoot = foot(phase + 0.6);
  const farFoot = foot(phase + 0.6 + Math.PI);
  function knee(h, p, a, b) {
    const dx = p.x - h.x, dy = p.y - h.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    const q = (a * a - b * b + d * d) / (2 * d);
    const z = Math.sqrt(Math.max(0, a * a - q * q));
    return { x: h.x + dx * q / d + dy * z / d, y: h.y + dy * q / d - dx * z / d };
  }
  function leg(h, p, color, width) {
    const k = knee(h, p, 65, 66);
    return `<path d="M${P(h.x,h.y)} Q${P(k.x-7,k.y-3)} ${P(k.x,k.y)} Q${P(k.x+3,k.y+12)} ${P(p.x-2,p.y-3)}" fill="none" stroke="${ink}" stroke-width="${width+4}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${P(h.x,h.y)} Q${P(k.x-7,k.y-3)} ${P(k.x,k.y)} Q${P(k.x+3,k.y+12)} ${P(p.x-2,p.y-3)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${P(p.x-10,p.y-8)} Q${P(p.x-2,p.y-17)} ${P(p.x+6,p.y-8)} L${P(p.x+19,p.y-3)} Q${P(p.x+23,p.y+4)} ${P(p.x+12,p.y+5)} L${P(p.x-9,p.y+4)} Q${P(p.x-16,p.y+1)} ${P(p.x-10,p.y-8)}Z" fill="${color}" stroke="${ink}" stroke-width="2.5"/>
      <path d="M${P(p.x+10,p.y-4)} l-1,6 M${P(p.x+16,p.y-1)} l-1,3" stroke="${ink}" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M${P(p.x-10,p.y+7)} h29" stroke="#344f4d" stroke-width="5" stroke-linecap="round"/>`;
  }
  function wheel(x) {
    let spokes = '';
    for (let i = 0; i < 12; i++) {
      const a = i * TAU / 12;
      spokes += `<path d="M0,0 L${P(Math.cos(a)*68,Math.sin(a)*68)}"/>`;
    }
    return `<g transform="translate(${x} 478)">
      <circle r="78" fill="#e7eddc" fill-opacity=".38" stroke="#37534e" stroke-width="11"/>
      <circle r="72" fill="none" stroke="#f9eed4" stroke-width="4"/>
      <circle r="68.5" fill="none" stroke="#83a49a" stroke-width="1.5"/>
      <g transform="rotate(${f(t*540)})" stroke="#8baba2" stroke-width="1.65">${spokes}<path d="M-51,-46 L-43,-39" stroke="#fff8df" stroke-width="5" stroke-linecap="round"/><path d="M34,59 l-3,-6" stroke="#dcae6b" stroke-width="4"/></g>
      <circle r="9" fill="#e9dfbf" stroke="#365c53" stroke-width="3"/><circle r="3" fill="#52776b"/>
      <path d="M-59,-50 A77,77 0 0 1 61,-47" fill="none" stroke="#fff6db" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
    </g>`;
  }
  function flower(x, y, scale, col, tilt=0) {
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(tilt)}) scale(${scale})"><path d="M0,0 Q-4,-13 0,-27" fill="none" stroke="#678c65" stroke-width="2.5"/><path d="M-1,-9 Q-16,-20 -13,-9 Q-10,-4 -1,-7 M-1,-14 Q12,-27 13,-16 Q10,-10 -1,-11" fill="#8cab6e"/>
      <g transform="translate(0 -29)" fill="${col}"><ellipse cy="-5" rx="3.9" ry="6"/><ellipse cy="5" rx="3.9" ry="6"/><ellipse cx="-5" rx="6" ry="3.9"/><ellipse cx="5" rx="6" ry="3.9"/><circle r="3.6" fill="#dfa451"/></g></g>`;
  }
  let foreground = '';
  const drift = t * 120;
  for (let i = -1; i < 6; i++) {
    const x = i * 240 - (drift % 240);
    foreground += `<g transform="translate(${f(x)} 0)"><path d="M29,591 q-2,-13 -9,-18 M29,591 q2,-19 9,-23 M111,612 q-5,-11 -12,-14 M112,612 q5,-14 10,-16 M190,576 q0,-10 -5,-13" stroke="#8faa6c" stroke-width="2" stroke-linecap="round" fill="none"/><ellipse cx="66" cy="576" rx="5" ry="2" fill="#d8ca93"/>${flower(173,612,.75,'#fff5d9',-12)}${flower(190,615,.6,'#efb9a1',9)}${flower(41,566,.5,'#fff6df',8)}</g>`;
  }
  let hills = '';
  const hillShift = t * 60;
  for (let i = -1; i < 4; i++) {
    const x = i * 480 - hillShift;
    hills += `<g transform="translate(${f(x)} 0)"><path d="M0,370 C70,359 123,292 223,297 C333,302 365,362 480,370 V460 H0Z" fill="#adc9a0"/><path d="M0,397 C90,418 152,354 252,352 C337,351 402,404 480,397 V466 H0Z" fill="#c2d6a6"/><g fill="#8ba987"><path d="M74,345 q-10,-15 0,-36 q12,16 0,36Z"/><path d="M82,343 q-6,-12 3,-28 q8,14 -3,28Z"/></g><path d="M74,340 v15 M84,340 v12" stroke="#879f79" stroke-width="2"/><path d="M337,374 q14,-9 31,-1 M345,381 l21,-1" fill="none" stroke="#acc695" stroke-width="2" stroke-linecap="round"/></g>`;
  }
  const flutter = Math.sin(phase * 1.5);
  const flutter2 = Math.cos(phase * 1.5);
  const tail = Math.sin(phase / 2) * 6;
  const farHip = {x:455,y:353+bob};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
    <defs>
      <linearGradient id="tri-sky" x2="0" y2="1"><stop stop-color="#d7edef"/><stop offset="1" stop-color="#f4f1d9"/></linearGradient>
      <linearGradient id="tri-grass" x2="0" y2="1"><stop stop-color="#d5dfac"/><stop offset="1" stop-color="#e7e5b6"/></linearGradient>
      <linearGradient id="tri-body" x1=".2" y1="0" x2=".8" y2="1"><stop stop-color="#b1c597"/><stop offset="1" stop-color="#8eac80"/></linearGradient>
      <linearGradient id="tri-frill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c2cc9f"/><stop offset="1" stop-color="#91af84"/></linearGradient>
      <linearGradient id="tri-helmet" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="#4fa9a5"/><stop offset="1" stop-color="#287f7d"/></linearGradient>
      <linearGradient id="tri-basket" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#edd7a4"/><stop offset="1" stop-color="#d5b67b"/></linearGradient>
      <clipPath id="tri-frameclip"><rect width="960" height="640" rx="0"/></clipPath>
    </defs>
    <g clip-path="url(#tri-frameclip)" stroke-linecap="round" stroke-linejoin="round">
      <path fill="url(#tri-sky)" d="M0,0H960V640H0Z"/>
      <g transform="translate(803 107)">
        <g stroke="#ead99c" stroke-width="3.5">${Array.from({length:12},(_,i)=>{const a=i*TAU/12;return `<path d="M${P(Math.cos(a)*57,Math.sin(a)*57)} L${P(Math.cos(a)*65,Math.sin(a)*65)}"/>`;}).join('')}</g>
        <circle r="43" fill="#f5d57d"/><circle cx="-12" cy="2" r="2.5" fill="#9e8559"/><circle cx="12" cy="2" r="2.5" fill="#9e8559"/><path d="M-7,12 Q0,19 7,12" fill="none" stroke="#9e8559" stroke-width="2"/><ellipse cx="-24" cy="10" rx="7" ry="4" fill="#edbc7c"/><ellipse cx="24" cy="10" rx="7" ry="4" fill="#edbc7c"/>
      </g>
      <g fill="#fffbee" opacity=".92" transform="translate(${f(9*Math.sin(TAU*t/8))} 0)">
        <path d="M109,145 C90,145 88,128 103,123 C100,107 123,102 134,115 C142,91 178,95 181,118 C204,115 217,130 205,140 C192,149 132,145 109,145Z"/>
        <path d="M342,93 C323,90 330,73 346,75 C355,52 382,56 388,78 C406,69 424,82 417,93Z"/>
        <path d="M699,194 C681,194 677,179 693,173 C687,154 715,145 728,162 C744,146 767,158 767,177 C791,172 803,188 787,196Z"/>
      </g>
      <path d="M0,338 C117,292 175,331 273,318 C383,301 447,284 558,310 C685,340 728,279 832,294 C886,300 923,315 960,306 V450 H0Z" fill="#c8dcd1"/>
      <path d="M0,358 C118,346 166,292 268,310 C348,324 394,357 486,342 C599,324 682,329 760,348 C844,365 904,331 960,338 V449 H0Z" fill="#b9d1bc"/>
      ${hills}
      <path d="M0,424 C170,405 319,430 494,419 C676,407 817,416 960,408 V640 H0Z" fill="url(#tri-grass)"/>
      <path d="M960,377 C847,381 795,398 799,417 C802,437 871,447 960,452 L960,492 C799,475 714,453 738,420 C758,395 858,379 960,371Z" fill="#efe4bc"/>
      <path d="M0,476 C178,461 294,478 460,469 C657,458 817,468 960,457 V549 C824,544 685,561 499,555 C299,547 146,555 0,546Z" fill="#eadbb6"/>
      <path d="M0,484 C175,469 323,486 495,477 C686,468 828,476 960,466" fill="none" stroke="#f5e8c7" stroke-width="3"/>
      <path d="M0,547 C210,556 288,547 451,554 C651,563 797,546 960,549" fill="none" stroke="#d8d19f" stroke-width="2"/>
      <g opacity=".64" fill="#c7ba98">
        <ellipse cx="276" cy="528" rx="4" ry="1.8"/><ellipse cx="701" cy="518" rx="5" ry="2"/><ellipse cx="751" cy="494" rx="3" ry="1.5"/><ellipse cx="190" cy="502" rx="4" ry="1.5"/>
      </g>
      <ellipse cx="497" cy="555" rx="227" ry="13" fill="#728269" opacity=".13"/>
      <ellipse cx="351" cy="556" rx="63" ry="6" fill="#60725c" opacity=".13"/><ellipse cx="649" cy="556" rx="63" ry="6" fill="#60725c" opacity=".13"/>
      ${wheel(350)}${wheel(648)}
      <path d="M280,441 A79,79 0 0 1 416,433 M581,434 A79,79 0 0 1 715,437" fill="none" stroke="#436f60" stroke-width="7"/>
      <path d="M280,439 A79,79 0 0 1 416,431 M581,432 A79,79 0 0 1 715,435" fill="none" stroke="#abd1b4" stroke-width="4"/>
      <path d="M350,478 L321,430 M648,478 L681,426" fill="none" stroke="#66887a" stroke-width="2"/>
      <path d="M${P(485,445)} L${P(farFoot.x,farFoot.y)}" stroke="#506c5c" stroke-width="6"/>
      ${leg(farHip,farFoot,'#7e9d76',19)}
      <g fill="none">
        <path d="M350,478 L434,383 L485,445 L350,478 M434,383 L594,373 L610,413 L485,445 M601,394 L648,478" stroke="#3b6b5b" stroke-width="11"/>
        <path d="M350,478 L434,383 L485,445 L350,478 M434,383 L594,373 L610,413 L485,445 M601,394 L648,478" stroke="#90c8a8" stroke-width="7"/>
        <path d="M435,381 L425,359 M600,390 L588,343 Q586,337 595,333 L622,326 Q632,324 638,332" stroke="#55776b" stroke-width="7"/>
        <path d="M600,390 L588,343 Q586,337 595,333 L622,326 Q632,324 638,332" stroke="#dbdec4" stroke-width="3"/>
        <path d="M617,327 L632,328" stroke="#354f4a" stroke-width="9"/>
        <path d="M626,334 C618,351 628,357 617,387" stroke="#527467" stroke-width="1.8"/>
        <path d="M642,366 L624,351 M652,410 L640,433" stroke="#7f9580" stroke-width="3"/>
      </g>
      <path d="M409,353 C421,353 435,356 451,354 Q459,355 456,362 C444,369 422,366 409,365 Q400,363 409,353Z" fill="#9a6852" stroke="#4b6655" stroke-width="2.8"/>
      <path d="M410,357 Q434,362 451,358" fill="none" stroke="#d29a77" stroke-width="2"/>
      <path d="M350,478 Q401,483 485,465 Q503,461 506,448 Q506,432 483,426 L351,465Z" fill="#a7c9ab" stroke="#527667" stroke-width="2.8"/>
      <path d="M367,470 L474,439" fill="none" stroke="#c8dfba" stroke-width="2"/>
      <circle cx="485" cy="445" r="18" fill="#cfdbc0" stroke="#557868" stroke-width="2.5"/><circle cx="485" cy="445" r="10" fill="#92b698"/>
      <path d="M485,445 L${P(nearFoot.x,nearFoot.y)}" stroke="#4c6a59" stroke-width="6"/>
      <path d="M485,445 L${P(nearFoot.x,nearFoot.y)}" stroke="#e0dfbf" stroke-width="2.5"/>
      <g transform="translate(0 ${f(bob)})">
        <path d="M382,311 C332,324 300,354 230,${f(334+tail)} C247,${f(359+tail)} 307,386 388,354Z" fill="#97af80" stroke="${ink}" stroke-width="3"/>
        <path d="M243,${f(344+tail)} C290,365 332,357 359,346" fill="none" stroke="#c2cd99" stroke-width="5"/>
        <path d="M366,306 C386,278 424,279 465,292 C489,297 506,284 522,277 C540,291 539,320 522,344 C509,368 467,379 420,370 C384,376 351,346 366,306Z" fill="url(#tri-body)" stroke="${ink}" stroke-width="3.3"/>
        <path d="M388,351 C412,371 469,370 501,349 C480,355 465,336 437,341 C417,343 398,343 388,351Z" fill="#ced3a4" opacity=".85"/>
        <path d="M380,306 C398,291 421,291 439,295" fill="none" stroke="#d2d8ad" stroke-width="4" opacity=".75"/>
        <g fill="#7e9f76" opacity=".65"><ellipse cx="390" cy="316" rx="10" ry="6" transform="rotate(-27 390 316)"/><ellipse cx="411" cy="307" rx="7" ry="5"/><ellipse cx="430" cy="318" rx="10" ry="6" transform="rotate(20 430 318)"/><ellipse cx="398" cy="334" rx="6" ry="4"/><ellipse cx="348" cy="349" rx="8" ry="3"/><ellipse cx="329" cy="356" rx="4" ry="2.5"/></g>
        <path d="M509,303 C483,298 473,${f(280+flutter*6)} 436,${f(294+flutter*4)} L448,${f(304+flutter2*3)} L437,${f(312+flutter*4)} C470,${f(301+flutter*5)} 486,328 513,319Z" fill="#dc7464" stroke="#975e53" stroke-width="2.2"/>
        <path d="M500,311 C483,319 469,${f(310+flutter*5)} 449,${f(323+flutter2*4)} L462,${f(328+flutter*5)} L459,${f(338+flutter2*3)} C479,${f(326+flutter*3)} 493,334 513,318Z" fill="#ed8b73" stroke="#975e53" stroke-width="2"/>
        <path d="M448,298 Q473,${f(292+flutter*5)} 494,310" fill="none" stroke="#f4aa8b" stroke-width="3"/>
        <path d="M519,212 C508,201 497,206 492,215 C477,210 466,218 468,231 C453,238 454,250 463,258 C451,270 458,285 471,287 C469,304 482,312 494,308 C502,322 518,319 523,308 C537,311 547,301 544,286 L551,243Z" fill="url(#tri-frill)" stroke="${ink}" stroke-width="3"/>
        <path d="M510,223 C495,215 484,225 485,236 C470,238 469,251 479,258 C469,269 477,281 489,280 C486,291 499,303 509,294 C517,302 528,292 528,280 L532,240Z" fill="#a6bd8e" stroke="#dce0b2" stroke-width="3"/>
        <g fill="none" stroke="#8ca97c" stroke-width="2" opacity=".65"><path d="M489,236 L516,253 M480,258 L514,263 M489,280 L516,274"/></g>
        <path d="M538,227 C554,224 578,233 589,251 C605,263 618,270 632,285 C646,292 662,297 659,311 C654,326 630,332 608,325 C588,329 560,327 545,313 C522,306 514,289 516,268 C513,248 520,234 538,227Z" fill="url(#tri-body)" stroke="${ink}" stroke-width="3.2"/>
        <path d="M543,298 C565,314 591,307 610,313 C623,317 638,315 649,310 C642,327 616,327 603,321 C578,326 556,320 543,308Z" fill="#d3d8ad"/>
        <path d="M621,287 Q637,270 657,260 Q652,284 639,299Z" fill="${cream}" stroke="${ink}" stroke-width="2.7"/>
        <path d="M640,300 Q658,297 664,305 Q664,316 652,323 L650,315 Q642,315 640,300Z" fill="#698d74" stroke="${ink}" stroke-width="2.5"/>
        <ellipse cx="594" cy="278" rx="10" ry="12.8" fill="#f5f0d6"/>
        <ellipse cx="597" cy="279" rx="5.8" ry="8.5" fill="#2e5049"/>
        <circle cx="599" cy="275" r="2.1" fill="#fffdf1"/>
        <path d="M584,262 Q591,256 598,262" fill="none" stroke="${ink}" stroke-width="2.7"/>
        <ellipse cx="622" cy="302" rx="2.4" ry="3" fill="#426857" transform="rotate(-30 622 302)"/>
        <ellipse cx="579" cy="301" rx="10" ry="5.8" fill="#dab099" opacity=".7"/>
        <path d="M606,313 Q624,322 642,311" fill="none" stroke="${ink}" stroke-width="2.3"/>
        <path d="M607,309 q-3,3 0,6" fill="none" stroke="${ink}" stroke-width="1.8"/>
        <g fill="#7f9f76" opacity=".64"><circle cx="546" cy="271" r="4"/><circle cx="552" cy="283" r="2.4"/><circle cx="538" cy="283" r="2"/></g>
        <path d="M517,292 Q524,311 545,315 L539,328 Q517,326 506,307Z" fill="#e8836e" stroke="#975e53" stroke-width="2.3"/>
        <path d="M515,298 Q523,316 539,319" fill="none" stroke="#f3af92" stroke-width="3"/>
        <path d="M511,300 Q501,301 504,310 Q510,319 518,312 Q520,305 511,300Z" fill="#eb907a" stroke="#975e53" stroke-width="2"/>
        <path d="M521,223 Q526,267 543,292 L564,284 L580,238" fill="none" stroke="#345d58" stroke-width="4.5"/>
        <path d="M535,276 l12,15 l12,-5" fill="none" stroke="#d4b67c" stroke-width="4"/>
        <path d="M505,222 C501,190 521,174 550,177 C579,179 591,193 599,216 L590,232 Q548,222 505,228Z" fill="url(#tri-helmet)" stroke="#2c6260" stroke-width="3"/>
        <path d="M510,204 C520,183 539,183 550,184" fill="none" stroke="#8ad0bd" stroke-width="5"/>
        <path d="M554,183 Q565,200 565,223" fill="none" stroke="#74b9aa" stroke-width="2.5"/>
        <path d="M523,202 l5,-9 M542,201 l2,-10 M578,205 l-5,-10" fill="none" stroke="#266764" stroke-width="5"/>
        <path d="M505,221 Q548,215 600,224 Q608,227 601,232 L589,235 Q547,224 509,232 Q502,231 505,221Z" fill="#66b5a6" stroke="#2c6260" stroke-width="2.5"/>
        <path d="M512,225 Q550,222 587,229" fill="none" stroke="#a1d5bd" stroke-width="2"/>
        <path d="M555,243 Q575,216 609,200 Q599,233 575,254Z" fill="#e8dec0" stroke="${ink}" stroke-width="2.5"/>
        <path d="M574,251 C587,238 609,227 638,216 C627,241 610,258 591,266Z" fill="${cream}" stroke="${ink}" stroke-width="2.7"/>
        <path d="M586,256 Q615,240 632,224" stroke="#dbccab" stroke-width="2" fill="none"/>
      </g>
      ${leg(hip,nearFoot,'#a3bb8b',25)}
      <path d="M${P(501,323+bob)} Q${P(516,349+bob*.5)} 552,347 Q578,343 605,331" fill="none" stroke="${ink}" stroke-width="22"/>
      <path d="M${P(501,323+bob)} Q${P(516,349+bob*.5)} 552,347 Q578,343 605,331" fill="none" stroke="#adc192" stroke-width="17"/>
      <path d="M${P(503,320+bob)} Q${P(510,328+bob)} 517,332" fill="none" stroke="#c7d1a4" stroke-width="4"/>
      <path d="M596,328 Q600,320 609,323 L622,327 Q627,332 621,338 Q614,343 607,337 L600,338Z" fill="#afc397" stroke="${ink}" stroke-width="2.5"/>
      <path d="M610,327 l-1,7 M616,328 l-1,7" fill="none" stroke="${ink}" stroke-width="1.7"/>
      <g transform="rotate(${f(Math.sin(phase)*.5)} 673 383)">
        <path d="M645,368 Q641,343 674,342 Q707,343 704,369" fill="none" stroke="#ae8c61" stroke-width="3"/>
        <path d="M673,374 L659,325 M677,375 L694,317 M675,375 L677,321 M664,373 L646,338 M681,374 L708,338" fill="none" stroke="#6a9068" stroke-width="2.5"/>
        <path d="M668,350 Q650,331 647,350 Q655,360 668,350 M681,352 Q699,332 705,345 Q700,358 681,352 M678,337 Q663,324 664,339 Q670,346 678,337" fill="#83a574"/>
        ${flower(659,355,.95,'#edab9b',-12)}${flower(695,350,.9,'#fff6da',13)}${flower(679,350,1,'#e8c965',3)}${flower(707,366,.63,'#d2b6ca',15)}${flower(648,367,.7,'#fff4dc',-17)}
        <path d="M639,363 L711,363 L702,402 Q673,416 648,402Z" fill="url(#tri-basket)" stroke="#9c835d" stroke-width="2.5"/>
        <g fill="none" stroke="#bc9b68" stroke-width="1.5"><path d="M646,375 H707 M648,385 H705 M650,395 H703 M654,365 L661,406 M665,365 L669,409 M677,365 V410 M689,365 L686,408 M701,365 L695,405"/></g>
        <path d="M640,365 L710,365" stroke="#fae7bb" stroke-width="7"/>
        <path d="M640,362 L710,362 M641,368 L709,368" stroke="#a78a5e" stroke-width="2"/>
        <path d="M653,400 Q677,410 698,400" fill="none" stroke="#eed9ac" stroke-width="2"/>
      </g>
      <g opacity=".88">${foreground}</g>
      <g transform="translate(${f(140+10*Math.sin(TAU*t/8))} ${f(273+5*Math.cos(TAU*t/8))}) rotate(${f(-7+5*Math.sin(TAU*t/8))})">
        <path d="M0,0 C-14,-17 -21,-8 -9,0 C-22,8 -10,17 0,2 C13,14 20,4 7,0 C21,-8 12,-18 0,0Z" fill="#e6b582"/>
        <path d="M0,-3 v8" stroke="#779079" stroke-width="2"/>
      </g>
      <g stroke="#97b9b2" stroke-width="2" fill="none"><path d="M279,188 q6,-6 12,0 q6,-6 12,0"/><path d="M306,174 q5,-5 10,0 q5,-5 10,0"/></g>
    </g>
  </svg>`;
}

module.exports = { renderScene };
