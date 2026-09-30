'use strict';

const TAU = Math.PI * 2;
const n = x => Number(x.toFixed(3));
const pt = p => `${n(p.x)},${n(p.y)}`;
const mix = (a, b, q) => a + (b - a) * q;

function flower(x, y, size, color, lean = 0) {
  const cx = x + lean;
  let petals = '';
  for (let i = 0; i < 5; i++) {
    const a = i * TAU / 5 - Math.PI / 2;
    petals += `<ellipse cx="${n(cx + Math.cos(a) * size * .63)}" cy="${n(y + Math.sin(a) * size * .63)}" rx="${n(size * .49)}" ry="${n(size * .62)}" transform="rotate(${n(a * 180 / Math.PI + 90)} ${n(cx + Math.cos(a) * size * .63)} ${n(y + Math.sin(a) * size * .63)})" fill="${color}"/>`;
  }
  return `<path d="M${n(x)} ${n(y + size * 4)} Q${n(x - 4)} ${n(y + size * 2)} ${n(cx)} ${n(y)}" fill="none" stroke="#638a67" stroke-width="${n(Math.max(1.5, size * .2))}" stroke-linecap="round"/><path d="M${n(x - 1)} ${n(y + size * 2.9)} q${n(-size * 1.8)} ${n(-size * 1.9)} ${n(-size * 2)} ${n(-size * .4)} q${n(size * .4)} ${n(size * 1.3)} ${n(size * 2)} ${n(size * .4)}" fill="#81a879"/>${petals}<circle cx="${n(cx)}" cy="${n(y)}" r="${n(size * .39)}" fill="#e9b659"/>`;
}

function wheel(x, y, angle) {
  let spokes = '';
  for (let i = 0; i < 12; i++) {
    const a = i * TAU / 12;
    spokes += `<path d="M0 0 L${n(Math.cos(a) * 72)} ${n(Math.sin(a) * 72)}"/>`;
  }
  return `<g transform="translate(${x} ${y})"><circle r="82" fill="#f9f6e9" fill-opacity=".42" stroke="#355d59" stroke-width="11"/><circle r="76" fill="none" stroke="#fbf3d9" stroke-width="3"/><g transform="rotate(${n(angle)})" stroke="#90aca0" stroke-width="1.8">${spokes}<path d="M0 -72 L0 -64" stroke="#355d59" stroke-width="3"/><path d="M-56 45 A72 72 0 0 0 -39 60" fill="none" stroke="#f5cb70" stroke-width="4" stroke-linecap="round"/></g><circle r="8" fill="#f7edcf" stroke="#355d59" stroke-width="3"/></g>`;
}

function knee(hip, ankle, bend) {
  const dx = ankle.x - hip.x, dy = ankle.y - hip.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  const upper = 60, lower = 62;
  const along = (upper * upper - lower * lower + d * d) / (2 * d);
  const across = Math.sqrt(Math.max(0, upper * upper - along * along));
  return { x: hip.x + dx / d * along + dy / d * across * bend,
    y: hip.y + dy / d * along - dx / d * across * bend };
}

function leg(hip, pedal, far) {
  const ankle = { x: pedal.x - 4, y: pedal.y - 7 };
  const k = knee(hip, ankle, 1);
  const edge = far ? '#537b61' : '#537a59';
  const fill = far ? '#83a783' : '#a7c58f';
  return `<g><path d="M${pt(hip)} L${pt(k)} L${pt(ankle)}" fill="none" stroke="${edge}" stroke-width="31" stroke-linecap="round" stroke-linejoin="round"/><path d="M${pt(hip)} L${pt(k)} L${pt(ankle)}" fill="none" stroke="${fill}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/><path d="M${n(ankle.x - 10)} ${n(ankle.y - 4)} Q${n(ankle.x - 6)} ${n(ankle.y - 16)} ${n(ankle.x + 7)} ${n(ankle.y - 8)} L${n(ankle.x + 23)} ${n(ankle.y + 2)} Q${n(ankle.x + 29)} ${n(ankle.y + 11)} ${n(ankle.x + 18)} ${n(ankle.y + 12)} L${n(ankle.x - 7)} ${n(ankle.y + 12)} Q${n(ankle.x - 15)} ${n(ankle.y + 7)} ${n(ankle.x - 10)} ${n(ankle.y - 4)}Z" fill="${fill}" stroke="${edge}" stroke-width="2.3"/><path d="M${n(ankle.x + 14)} ${n(ankle.y + 5)} l2 5 m-9 -7 l2 7" fill="none" stroke="${edge}" stroke-width="1.7" stroke-linecap="round"/></g>`;
}

function renderScene(t) {
  const time = ((t % 8) + 8) % 8;
  const u = time / 8, phase = TAU * u;
  const crank = phase * 4;
  const rideBob = n(Math.sin(phase * 4) * 1.3);
  const bob = n(Math.sin(phase * 4 + .3) * 2.1);
  const tail = n(Math.sin(phase * 2 - .5) * 5);
  const wind = Math.sin(phase * 3);
  const a = { x: 475 + Math.cos(crank) * 25, y: 465 + Math.sin(crank) * 25 };
  const b = { x: 475 - Math.cos(crank) * 25, y: 465 - Math.sin(crank) * 25 };
  const nearHip = { x: 465, y: 365 + bob };
  const farHip = { x: 458, y: 362 + bob };
  const farLeg = leg(farHip, b, true), nearLeg = leg(nearHip, a, false);
  let clouds = '';
  for (let i = -1; i < 3; i++) {
    const x = n(i * 660 - u * 660);
    clouds += `<g transform="translate(${x} 0)"><path d="M73 145 C57 145 55 125 72 121 C67 99 96 87 111 107 C124 90 151 98 150 118 C176 115 183 145 161 147Z" fill="#fffcf0"/><path d="M315 91 C301 89 305 70 319 72 C318 46 354 40 366 62 C389 53 406 70 400 86 C423 87 422 104 400 106 L327 105 Q303 103 315 91Z" fill="#fffcf0" opacity=".84"/></g>`;
  }
  let distant = '', middle = '', grasses = '', flowers = '';
  for (let i = -1; i < 4; i++) {
    distant += `<path transform="translate(${n(i * 600 - u * 600)} 0)" d="M0 329 C100 320 116 250 227 257 C351 265 398 333 600 329 L600 470 L0 470Z" fill="#b7d4b3"/>`;
    middle += `<path transform="translate(${n(i * 480 - u * 480)} 0)" d="M0 381 C93 360 123 322 218 328 C334 337 354 391 480 381 L480 505 L0 505Z" fill="#95bd94"/><g transform="translate(${n(i * 480 - u * 480)} 0)"><path d="M169 331 l0 -33" stroke="#709573" stroke-width="5"/><path d="M144 307 C125 283 144 264 159 271 C163 249 194 249 199 270 C221 269 229 296 211 309 C194 319 161 320 144 307Z" fill="#78a981"/><path d="M277 350 l0 -23" stroke="#709573" stroke-width="4"/><ellipse cx="278" cy="322" rx="21" ry="25" fill="#78a981"/></g>`;
  }
  for (let i = -1; i < 4; i++) {
    const shift = n(i * 480 - u * 960);
    grasses += `<g transform="translate(${shift} 0)" stroke="#aac187" stroke-width="2" stroke-linecap="round"><path d="M46 448 l-3 -11 m3 11 l6 -8 M192 420 l-4 -9 m4 9 l6 -12 M379 442 l-5 -12 m5 12 l5 -7 M101 579 l-5 -15 m5 15 l8 -10 M414 594 l-4 -12 m4 12 l8 -15"/></g>`;
    flowers += `<g transform="translate(${shift} 0)">${flower(52, 539, 5, '#fff7df', 2)}${flower(83, 554, 4, '#e7a29a', -1)}${flower(378, 577, 6, '#fff7df', 2)}${flower(403, 560, 5, '#ddb469', -2)}${flower(217, 410, 3.2, '#fff8e1', 1)}${flower(429, 435, 3.5, '#edb3a7', -1)}</g>`;
  }
  let sunRays = '';
  for (let i = 0; i < 12; i++) {
    const q = i * TAU / 12;
    sunRays += `<path d="M${n(798 + Math.cos(q) * 48)} ${n(106 + Math.sin(q) * 48)} L${n(798 + Math.cos(q) * 56)} ${n(106 + Math.sin(q) * 56)}"/>`;
  }
  let basketFlowers = '';
  const flowerData = [[673,329,6,'#fff7dd'],[696,315,7,'#e58e88'],[707,331,5,'#eebd5e'],[685,308,5,'#b1a6d5'],[718,320,5,'#fff6df']];
  for (const [x,y,s,c] of flowerData) basketFlowers += flower(x,y,s,c,n(Math.sin(phase*2+x)*1.2));
  const scarfY = n(287 + wind * 5);
  const scarfTipY = n(295 + Math.sin(phase * 3 + .8) * 7);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
  <defs>
    <linearGradient id="s61-sky" x2="0" y2="1"><stop stop-color="#c6e7e8"/><stop offset="1" stop-color="#eef2d9"/></linearGradient>
    <linearGradient id="s61-field" x2="0" y2="1"><stop stop-color="#c1d3a1"/><stop offset="1" stop-color="#d8dda9"/></linearGradient>
    <linearGradient id="s61-road" x2="0" y2="1"><stop stop-color="#efe1b8"/><stop offset="1" stop-color="#f7edcf"/></linearGradient>
    <linearGradient id="s61-body" x1=".2" y1="0" x2=".8" y2="1"><stop stop-color="#bdd1a3"/><stop offset="1" stop-color="#8eaf7e"/></linearGradient>
    <linearGradient id="s61-frill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#abc798"/><stop offset="1" stop-color="#85a879"/></linearGradient>
    <linearGradient id="s61-helmet" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="#4caaa3"/><stop offset="1" stop-color="#277e7b"/></linearGradient>
    <linearGradient id="s61-horn" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff7dd"/><stop offset="1" stop-color="#dbcb9e"/></linearGradient>
    <pattern id="s61-weave" width="10" height="9" patternUnits="userSpaceOnUse"><path d="M0 4.5 H10 M5 0 V9" stroke="#ae8050" stroke-width="1.4" opacity=".65"/></pattern>
  </defs>
  <rect width="960" height="640" fill="url(#s61-sky)"/>
  <g stroke="#ebbc5f" stroke-width="3.5" stroke-linecap="round" opacity=".75">${sunRays}</g>
  <circle cx="798" cy="106" r="35" fill="#f4cf76"/><circle cx="788" cy="101" r="2.1" fill="#ad8552"/><circle cx="807" cy="101" r="2.1" fill="#ad8552"/><path d="M790 113 Q798 120 806 113" fill="none" stroke="#ad8552" stroke-width="2" stroke-linecap="round"/>
  ${clouds}${distant}${middle}
  <path d="M0 413 Q219 384 467 411 T960 410 L960 640 H0Z" fill="url(#s61-field)"/>
  <path d="M755 358 C651 386 737 407 582 429 C407 454 237 440 161 498 C96 548 215 599 362 640 H960 C823 579 504 566 392 536 C242 496 457 478 648 459 C838 438 771 398 794 372Z" fill="url(#s61-road)"/>
  <path d="M755 359 C651 386 737 407 582 429 C407 454 237 440 161 498" fill="none" stroke="#e2d4a9" stroke-width="2" opacity=".75"/>
  ${grasses}
  <g fill="#c5bb92" opacity=".48"><ellipse cx="272" cy="526" rx="5" ry="1.5"/><ellipse cx="773" cy="495" rx="7" ry="1.7"/><ellipse cx="743" cy="567" rx="3" ry="1.3"/><ellipse cx="492" cy="573" rx="6" ry="1.4"/></g>
  <ellipse cx="492" cy="560" rx="226" ry="15" fill="#819278" opacity=".16"/>
  <g transform="translate(0 ${rideBob})" stroke-linejoin="round" stroke-linecap="round">
    ${wheel(340,474,u*1080)}${wheel(637,474,u*1080)}
    <path d="M334 402 Q288 412 283 465 M640 392 Q700 398 712 451" fill="none" stroke="#597c69" stroke-width="7"/><path d="M334 402 Q288 412 283 465 M640 392 Q700 398 712 451" fill="none" stroke="#b9dfc1" stroke-width="4"/>
    ${farLeg}
    <path d="M${pt(b)} L475 465" fill="none" stroke="#68867c" stroke-width="6"/><path d="M${n(b.x-12)} ${n(b.y+5)} h26" stroke="#395e57" stroke-width="6"/>
    <path d="M340 474 L446 381 L475 465 L340 474 L572 385 L475 465 M446 381 L572 385 M572 385 L637 474" fill="none" stroke="#3e786b" stroke-width="12"/><path d="M340 474 L446 381 L475 465 L340 474 L572 385 L475 465 M446 381 L572 385 M572 385 L637 474" fill="none" stroke="#a1d7bb" stroke-width="7"/>
    <path d="M446 381 L439 357 M572 385 L589 350 L612 340 L645 344" fill="none" stroke="#42665f" stroke-width="8"/><path d="M572 385 L589 350 L612 340" fill="none" stroke="#c4dec8" stroke-width="4"/>
    <path d="M617 341 L646 344" fill="none" stroke="#3c5f55" stroke-width="10"/>
    <path d="M601 345 Q650 389 611 448" fill="none" stroke="#6e8c7a" stroke-width="1.8"/>
    <path d="M409 357 Q416 348 440 350 L467 352 Q476 354 470 360 L421 364 Q410 365 409 357Z" fill="#a47752" stroke="#775c42" stroke-width="2.5"/>
    <path d="M340 474 Q406 458 477 454 Q492 456 492 468 Q490 482 476 482 L340 482Z" fill="#8bc5a6" stroke="#4b8974" stroke-width="2.5"/><circle cx="475" cy="465" r="18" fill="#b4dcc0" stroke="#3c7566" stroke-width="3"/><circle cx="475" cy="465" r="5" fill="#3c7566"/>
    <g transform="translate(0 ${bob})">
      <path d="M408 328 C366 314 329 331 301 339 C268 350 242 ${n(335+tail)} 230 ${n(325+tail)} C230 ${n(345+tail)} 261 ${n(364+tail)} 299 365 C343 367 364 360 406 372Z" fill="url(#s61-body)" stroke="#567c5d" stroke-width="2.7"/>
      <path d="M243 ${n(344+tail*.7)} C293 365 344 347 375 342" fill="none" stroke="#c2d6ab" stroke-width="4" opacity=".75"/>
      <path d="M412 315 C428 291 474 285 511 304 C544 319 547 348 521 371 C493 397 442 392 413 375 C395 364 396 335 412 315Z" fill="url(#s61-body)" stroke="#567c5d" stroke-width="2.8"/>
      <path d="M438 366 C454 383 490 385 510 369" fill="none" stroke="#c5d7ad" stroke-width="8" opacity=".5"/>
      <g fill="#789c71" opacity=".52"><ellipse cx="427" cy="324" rx="7" ry="5" transform="rotate(-25 427 324)"/><ellipse cx="447" cy="311" rx="5" ry="3.8"/><ellipse cx="455" cy="330" rx="4" ry="3"/><ellipse cx="404" cy="350" rx="4" ry="3"/><ellipse cx="344" cy="347" rx="5" ry="2.8"/><ellipse cx="317" cy="351" rx="3" ry="2"/></g>
      <path d="M494 314 Q512 291 529 280 L566 301 Q561 337 528 351Z" fill="url(#s61-body)" stroke="#567c5d" stroke-width="2.7"/>
      <path d="M527 289 C510 294 496 280 500 265 C489 251 495 230 510 227 C508 211 526 201 540 208 C551 192 573 195 578 208 C597 206 607 224 600 239 C614 253 607 272 594 278 C593 296 574 303 563 297 C551 308 533 305 527 289Z" fill="url(#s61-frill)" stroke="#567c5d" stroke-width="3"/>
      <path d="M528 275 C515 268 511 250 520 233 C531 212 558 210 575 224 C592 239 589 267 571 280 C556 290 539 285 528 275Z" fill="#c0d2a0" opacity=".75"/>
      <g fill="#8fae7f"><ellipse cx="512" cy="246" rx="4" ry="7" transform="rotate(15 512 246)"/><ellipse cx="527" cy="219" rx="6" ry="4" transform="rotate(-32 527 219)"/><ellipse cx="521" cy="278" rx="5" ry="4"/><ellipse cx="546" cy="291" rx="5" ry="3"/></g>
      <path d="M575 249 C586 238 601 243 614 258 C633 270 642 285 654 289 Q672 294 671 308 C670 324 646 329 625 327 C602 330 579 320 572 306 C562 291 562 264 575 249Z" fill="url(#s61-body)" stroke="#567c5d" stroke-width="2.8"/>
      <path d="M592 258 C595 237 614 223 630 205 C631 224 619 247 609 263Z" fill="url(#s61-horn)" stroke="#8d9773" stroke-width="2.2"/>
      <path d="M620 270 C632 247 651 237 666 222 C663 245 649 267 637 279Z" fill="url(#s61-horn)" stroke="#8d9773" stroke-width="2.2"/>
      <path d="M653 296 Q660 274 678 265 Q678 285 667 300Z" fill="url(#s61-horn)" stroke="#8d9773" stroke-width="2"/>
      <path d="M658 304 Q673 302 677 311 L671 323 Q660 328 649 325 Q658 319 658 304Z" fill="#d1bf87" stroke="#7c8b64" stroke-width="2"/>
      <ellipse cx="609" cy="289" rx="10" ry="12" fill="#f9f5df"/><ellipse cx="612" cy="290" rx="5.7" ry="7.9" fill="#314d41"/><circle cx="614" cy="287" r="2.1" fill="#fffef1"/>
      <path d="M598 272 Q607 267 615 274" fill="none" stroke="#5e805e" stroke-width="2.8"/>
      <ellipse cx="634" cy="306" rx="10" ry="6" fill="#d8a594" opacity=".58"/><ellipse cx="653" cy="303" rx="2.4" ry="1.8" fill="#5c7758"/>
      <path d="M635 318 Q645 323 653 317" fill="none" stroke="#557559" stroke-width="2"/>
      <path d="M530 224 C527 197 544 180 569 181 C595 181 610 196 611 218 L599 233 Q569 221 537 236Z" fill="url(#s61-helmet)" stroke="#356f69" stroke-width="2.8"/>
      <path d="M534 224 Q569 212 608 220 L611 229 Q568 218 534 239Z" fill="#1e6d69" stroke="#356f69" stroke-width="2"/>
      <path d="M546 210 Q550 194 559 190 M567 207 Q569 192 576 188 M588 207 Q589 195 586 190" fill="none" stroke="#b5ded0" stroke-width="5.5"/>
      <path d="M542 234 L567 276 L594 242" fill="none" stroke="#327c72" stroke-width="4"/><rect x="562" y="267" width="11" height="10" rx="3" fill="#edc279" transform="rotate(-10 567 272)"/>
      <path d="M546 301 C521 298 499 ${scarfY} 467 ${n(scarfY-3)} L475 ${n(scarfTipY+9)} L462 ${scarfTipY} C492 ${n(scarfTipY+9)} 518 320 546 316Z" fill="#e67e70" stroke="#bd645b" stroke-width="2"/>
      <path d="M540 309 C521 309 503 ${n(306+wind*3)} 483 ${n(311+wind*4)} L487 ${n(319+wind*3)} C507 ${n(318+wind*3)} 528 327 546 319Z" fill="#cf6e64"/>
      <path d="M537 298 Q548 302 558 313 L549 325 Q533 320 527 309Z" fill="#ee9580" stroke="#bd645b" stroke-width="2"/><path d="M537 308 l10 9" stroke="#ffd0a4" stroke-width="3"/>
    </g>
    <path d="M${n(525)} ${n(337+bob)} Q558 ${n(359+bob)} 587 350 L626 343" fill="none" stroke="#567c5d" stroke-width="24"/>
    <path d="M525 ${n(337+bob)} Q558 ${n(359+bob)} 587 350 L626 343" fill="none" stroke="#abc792" stroke-width="19"/>
    <path d="M621 335 Q631 331 640 339 L639 349 Q630 354 620 351Z" fill="#abc792" stroke="#567c5d" stroke-width="2.4"/><path d="M629 339 l0 8 m5 -7 l0 6" fill="none" stroke="#678a64" stroke-width="1.5"/>
    <path d="M647 345 L666 359 M657 388 L646 365" fill="none" stroke="#4c7365" stroke-width="3.5"/>
    <g>${basketFlowers}<path d="M664 350 L719 350 L711 390 Q690 399 673 390Z" fill="#d4aa70" stroke="#a57b4f" stroke-width="2.6"/><path d="M664 350 L719 350 L711 390 Q690 399 673 390Z" fill="url(#s61-weave)"/><path d="M662 350 Q690 354 721 350" stroke="#ecc990" stroke-width="6"/><path d="M666 358 L715 359" stroke="#e8bf84" stroke-width="2"/></g>
    <path d="M475 465 L${pt(a)}" fill="none" stroke="#577b6f" stroke-width="6"/><path d="M${n(a.x-12)} ${n(a.y+6)} h29" fill="none" stroke="#355e54" stroke-width="7"/>
    ${nearLeg}
  </g>
  ${flowers}
  <g transform="translate(${n(800+Math.sin(phase)*5)} ${n(262+Math.cos(phase*2)*4)})"><path d="M0 0 Q-14 -16 -18 -5 Q-19 5 -2 6 Q-5 17 -15 11 Q-19 5 -2 3" fill="#e3a58c"/><path d="M0 0 Q14 -14 17 -3 Q18 8 2 6 Q7 16 14 10 Q17 4 2 3" fill="#eac4a0"/><path d="M0 0 L0 9" stroke="#8f8e68" stroke-width="2" stroke-linecap="round"/></g>
  </svg>`;
}

module.exports = { renderScene };
