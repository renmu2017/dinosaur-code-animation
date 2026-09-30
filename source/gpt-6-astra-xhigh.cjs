'use strict';
const TAU = Math.PI * 2;
const n = v => String(Math.round(v * 1000) / 1000);
const pt = p => `${n(p.x)} ${n(p.y)}`;
function leg(hip, pedal, near) {
  const ankle = { x: pedal.x - 7, y: pedal.y - 11 };
  const dx = ankle.x - hip.x, dy = ankle.y - hip.y, d = Math.hypot(dx, dy);
  const l1 = 71, l2 = 69, a = (l1*l1-l2*l2+d*d)/(2*d), h = Math.sqrt(Math.max(0,l1*l1-a*a));
  const knee = { x: hip.x+dx/d*a+dy/d*h, y: hip.y+dy/d*a-dx/d*h };
  const fill=near?'#9CAC77':'#768E65', outline=near?'#526E58':'#526C56';
  return `<g stroke-linecap="round" stroke-linejoin="round">
    <path d="M${pt(hip)} Q${n(knee.x-9)} ${n(knee.y-4)} ${pt(knee)} Q${n(knee.x+8)} ${n(knee.y+17)} ${pt(ankle)}" fill="none" stroke="${outline}" stroke-width="31"/>
    <path d="M${pt(hip)} Q${n(knee.x-9)} ${n(knee.y-4)} ${pt(knee)} Q${n(knee.x+8)} ${n(knee.y+17)} ${pt(ankle)}" fill="none" stroke="${fill}" stroke-width="26"/>
    ${near?`<path d="M${n(hip.x+2)} ${n(hip.y+5)} Q${n(knee.x-11)} ${n(knee.y+1)} ${n(knee.x-3)} ${n(knee.y+8)}" fill="none" stroke="#BEC995" stroke-width="8" opacity=".75"/>`:''}
    <path d="M${n(pedal.x-17)} ${n(pedal.y-16)} Q${n(pedal.x-5)} ${n(pedal.y-21)} ${n(pedal.x+7)} ${n(pedal.y-13)} Q${n(pedal.x+22)} ${n(pedal.y-10)} ${n(pedal.x+23)} ${n(pedal.y-2)} Q${n(pedal.x+23)} ${n(pedal.y+3)} ${n(pedal.x+12)} ${n(pedal.y+3)} L${n(pedal.x-17)} ${n(pedal.y+1)} Q${n(pedal.x-23)} ${n(pedal.y-4)} ${n(pedal.x-17)} ${n(pedal.y-16)}Z" fill="${fill}" stroke="${outline}" stroke-width="2.4"/>
    <path d="M${n(pedal.x+10)} ${n(pedal.y-7)} l1 7 M${n(pedal.x+17)} ${n(pedal.y-5)} l1 5" stroke="#D9DDAC" stroke-width="3.7"/>
    <path d="M${n(pedal.x-18)} ${n(pedal.y+5)} h39" stroke="#354F49" stroke-width="6"/>
    <path d="M${n(pedal.x-13)} ${n(pedal.y+4)} h12" stroke="#D5B978" stroke-width="2"/>
  </g>`;
}
function wheel(x,y,angle) {
  let spokes='';
  for(let i=0;i<10;i++){const a=angle+i*TAU/10;spokes+=`<path d="M${x} ${y} L${n(x+Math.cos(a)*74)} ${n(y+Math.sin(a)*74)}"/>`;}
  const marks=[angle+.18,angle+Math.PI+.18].map(a=>`<path d="M${n(x+Math.cos(a)*84)} ${n(y+Math.sin(a)*84)} A84 84 0 0 1 ${n(x+Math.cos(a+.22)*84)} ${n(y+Math.sin(a+.22)*84)}" fill="none" stroke="#71928B" stroke-width="3"/>`).join('');
  const r=angle+.9;
  return `<g><circle cx="${x}" cy="${y}" r="78" fill="#FFF5DC" fill-opacity=".38"/>
    <g stroke="#8FAE9D" stroke-width="1.7" opacity=".86">${spokes}</g>
    <circle cx="${x}" cy="${y}" r="84" fill="none" stroke="#345A54" stroke-width="15"/>
    <circle cx="${x}" cy="${y}" r="77.5" fill="none" stroke="#DBDFC1" stroke-width="3.5"/>
    <circle cx="${x}" cy="${y}" r="73.5" fill="none" stroke="#91B8A7" stroke-width="2.5"/>${marks}
    <g transform="translate(${n(x+Math.cos(r)*49)} ${n(y+Math.sin(r)*49)}) rotate(${n(r*180/Math.PI)})"><rect x="-9" y="-3.2" width="18" height="6.4" rx="2.5" fill="#F4C568" stroke="#FFF5D8" stroke-width="1.5"/></g>
    <circle cx="${x}" cy="${y}" r="9" fill="#577B6A" stroke="#D3E6CD" stroke-width="3"/><circle cx="${x}" cy="${y}" r="3.3" fill="#FFF4DB"/>
  </g>`;
}
function flower(x,y,scale,color,phase) {
  const bend=Math.sin(phase)*2.4;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(scale)})">
    <path d="M0 0 Q${n(bend-4)} -16 ${n(bend)} -32" stroke="#658B68" stroke-width="2.2" fill="none"/>
    <path d="M-1 -10 Q-17 -22 -14 -12 Q-10 -5 -1 -8 M-1 -19 Q10 -30 12 -22 Q10 -15 -1 -16" fill="#7EAA79"/>
    <g transform="translate(${n(bend)} -33) rotate(${n(Math.sin(phase)*8)})" fill="${color}">
      <ellipse cy="-5.5" rx="3.7" ry="6.1"/><ellipse cy="-5.5" rx="3.7" ry="6.1" transform="rotate(72)"/><ellipse cy="-5.5" rx="3.7" ry="6.1" transform="rotate(144)"/><ellipse cy="-5.5" rx="3.7" ry="6.1" transform="rotate(216)"/><ellipse cy="-5.5" rx="3.7" ry="6.1" transform="rotate(288)"/><circle r="3.6" fill="#E9AC4F"/>
    </g></g>`;
}
function renderScene(t) {
  const time=((t%8)+8)%8, u=time/8, phase=TAU*u, bob=2.25*Math.sin(phase*4), pedalAngle=phase*4+.35;
  const crank={x:487,y:459};
  const pedal=a=>({x:crank.x+Math.cos(a)*29,y:crank.y+Math.sin(a)*29});
  const nearPedal=pedal(pedalAngle), farPedal=pedal(pedalAngle+Math.PI), tail=Math.sin(phase*2+.4)*5;
  let farHills='',nearHills='',trees='',foreground='';
  for(let i=-1;i<=3;i++) {
    farHills+=`<path transform="translate(${n(i*460-u*460)} 0)" d="M0 355 C80 355 111 285 200 292 C282 298 348 355 460 355 V640 H0Z" fill="#C9DCAF"/>`;
    nearHills+=`<path transform="translate(${n(i*620-u*620)} 0)" d="M0 401 C113 401 140 347 258 350 C369 354 476 401 620 401 V640 H0Z" fill="#AACB96"/>`;
    const tx=i*620-u*620;
    trees+=`<g transform="translate(${n(tx)} 0)"><path d="M117 376 V348 M144 382 V355" fill="none" stroke="#829A77" stroke-width="4"/><path d="M115 312 C101 327 98 342 104 351 C109 359 123 357 129 350 C135 340 127 323 115 312Z" fill="#88AF85"/><path d="M143 333 C133 343 131 354 135 361 C140 367 151 365 154 357 C155 348 149 338 143 333Z" fill="#96B786"/><path d="M466 380 q17 -7 35 -3 M483 387 q12 -5 23 -3" fill="none" stroke="#96BD88" stroke-width="3" stroke-linecap="round"/></g>`;
  }
  for(let tile=-1;tile<=3;tile++) {
    const shift=tile*480-u*480;
    foreground+=`<g transform="translate(${n(shift)} 0)"><path d="M27 635 l-5 -11 M27 635 l6 -14 M49 642 l-3 -12 M49 642 l9 -8 M171 632 l-5 -10 M171 632 l5 -14 M309 642 l-4 -17 M309 642 l8 -11 M427 637 l-7 -13 M427 637 l3 -17" stroke="#6C976D" stroke-width="2.5" fill="none" stroke-linecap="round"/>${flower(93,642,.66,'#FFF3D4',phase+.7)}${flower(277,639,.51,'#F0B69F',phase+1.4)}${flower(390,646,.78,'#FFF0C7',phase+2.1)}</g>`;
  }
  const scarfWave=Math.sin(phase*3)*5, butterflyX=791+Math.sin(phase)*10, butterflyY=255+Math.sin(phase*2)*5, wing=.65+.28*Math.cos(phase*8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" role="img" aria-label="A young triceratops in a teal helmet cycles through spring hills with a basket of flowers.">
  <defs>
    <linearGradient id="axh-sky" x2="0" y2="1"><stop stop-color="#CCE6E9"/><stop offset="1" stop-color="#F6EFD5"/></linearGradient>
    <linearGradient id="axh-body" x1=".15" y1="0" x2=".7" y2="1"><stop stop-color="#B5C58E"/><stop offset="1" stop-color="#97AD76"/></linearGradient>
    <linearGradient id="axh-helmet" x1=".2" y1="0" x2=".8" y2="1"><stop stop-color="#64B7AD"/><stop offset="1" stop-color="#31867F"/></linearGradient>
    <linearGradient id="axh-basket" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#E9C38A"/><stop offset="1" stop-color="#D4A76C"/></linearGradient>
    <clipPath id="axh-artboard"><rect width="960" height="640"/></clipPath>
  </defs>
  <g clip-path="url(#axh-artboard)" stroke-linejoin="round" stroke-linecap="round">
    <rect width="960" height="640" fill="url(#axh-sky)"/>
    <g transform="translate(147 122)"><g stroke="#E9B75E" stroke-width="4.5" opacity=".8"><path d="M0 -59 v-11 M29 -51 l6 -10 M51 -29 l10 -6 M59 0 h11 M51 29 l10 6 M29 51 l6 10 M0 59 v11 M-29 51 l-6 10 M-51 29 l-10 6 M-59 0 h-11 M-51 -29 l-10 -6 M-29 -51 l-6 -10"/></g><circle r="43" fill="#F4CC76"/><circle cx="-12" cy="1" r="2.6" fill="#A67B46"/><circle cx="12" cy="1" r="2.6" fill="#A67B46"/><path d="M-7 13 Q0 19 7 13" fill="none" stroke="#A67B46" stroke-width="2.3"/><ellipse cx="-21" cy="11" rx="5.5" ry="3.1" fill="#EBAB70"/><ellipse cx="21" cy="11" rx="5.5" ry="3.1" fill="#EBAB70"/></g>
    <g transform="translate(${n(Math.sin(phase)*5)} ${n(Math.cos(phase)*1.2)})" fill="#FFF9E8"><path d="M266 138 C250 138 247 119 260 112 C258 94 280 85 293 98 C304 78 335 84 338 106 C359 100 373 117 364 131 C376 145 355 151 343 148 H272 C267 148 263 143 266 138Z"/><path d="M728 158 C710 158 707 141 719 133 C716 115 735 106 749 116 C757 93 790 96 796 118 C812 111 830 122 828 138 C845 139 848 154 835 161 C815 170 746 168 728 158Z"/></g>
    <path d="M48 279 Q66 266 83 278 M100 262 Q113 252 127 264" fill="none" stroke="#85AFAC" stroke-width="2" opacity=".7"/>
    <path d="M0 378 C156 339 239 366 358 341 C496 304 583 350 705 330 C823 306 890 335 960 345 V640 H0Z" fill="#DCE4BD"/>
    ${farHills}${trees}${nearHills}
    <path d="M0 447 C182 409 300 432 459 421 C647 408 803 412 960 437 V640 H0Z" fill="#B8CE95"/>
    <path d="M803 369 C691 393 654 418 721 443 C790 468 799 488 683 510 C505 540 345 518 261 570 C232 588 211 614 199 640 H960 V557 C881 509 856 468 765 442 C688 416 741 391 833 369Z" fill="#EAD3A6"/>
    <path d="M813 372 C705 400 681 420 745 447 C811 475 826 487 746 511" fill="none" stroke="#F7E7C5" stroke-width="8" opacity=".7"/>
    <path d="M254 589 C299 548 390 543 454 543 M758 594 q52 4 88 20" fill="none" stroke="#D4BC93" stroke-width="2" opacity=".6"/>
    <g fill="#D4BC91" opacity=".8"><ellipse cx="294" cy="604" rx="5" ry="2"/><ellipse cx="674" cy="581" rx="4" ry="1.7"/><ellipse cx="787" cy="545" rx="4" ry="1.6"/><ellipse cx="547" cy="602" rx="3" ry="1.5"/></g>
    <g fill="none" stroke="#9CBB85" stroke-width="2.2"><path d="M44 458 l-4 -9 M44 458 l7 -7 M113 499 l-4 -10 M113 499 l6 -6 M862 451 l-3 -8 M862 451 l7 -7 M921 491 l-4 -10 M921 491 l7 -6"/></g>
    <g transform="translate(${n(butterflyX)} ${n(butterflyY)}) rotate(-13)"><g transform="scale(${n(wing)} 1)" fill="#E9A783"><path d="M0 0 C-17 -19 -25 -4 -13 4 C-26 10 -13 22 0 5Z"/><path d="M0 0 C17 -19 25 -4 13 4 C26 10 13 22 0 5Z"/></g><path d="M0 -3 v13 M0 -3 l-3 -4 M0 -3 l3 -4" stroke="#857954" stroke-width="1.8"/></g>
    <ellipse cx="501" cy="568" rx="222" ry="16" fill="#A69371" opacity=".13"/><ellipse cx="497" cy="567" rx="168" ry="9" fill="#A69371" opacity=".11"/>
    ${wheel(348,478,phase*4)}${wheel(646,478,phase*4)}
    <path d="M348 468 L488 440 C515 440 517 480 488 480 L348 491 C330 491 329 468 348 468Z" fill="none" stroke="#7B8F76" stroke-width="3"/>
    <circle cx="348" cy="478" r="16" fill="#C4CBB0" stroke="#6E8C76" stroke-width="2.5"/>
    <path d="M487 459 L${pt(farPedal)}" stroke="#58786A" stroke-width="7"/>${leg({x:443,y:357+bob},farPedal,false)}
    <g fill="none"><path d="M348 478 L444 389 L487 459 L348 478 M444 389 L612 385 L487 459 M612 385 L646 478" stroke="#3A8174" stroke-width="12"/><path d="M348 478 L444 389 L487 459 L348 478 M444 389 L612 385 L487 459 M612 385 L646 478" stroke="#91CDB0" stroke-width="7.5"/><path d="M449 388 L604 385 M360 469 L441 396 M618 401 L642 469" stroke="#D1E8C0" stroke-width="2.1"/><path d="M444 389 L435 372 M612 385 L624 350 Q628 343 640 344 L654 347" stroke="#4B7165" stroke-width="7"/><path d="M616 372 L624 350 Q628 343 640 344" stroke="#C6D8BE" stroke-width="2.3"/><path d="M646 350 Q665 374 624 395" stroke="#687F6E" stroke-width="2"/><path d="M636 344 L656 348" stroke="#A66C53" stroke-width="10"/><path d="M419 370 Q439 365 460 371" stroke="#725E4C" stroke-width="13"/><path d="M420 367 Q440 363 458 368" stroke="#B38765" stroke-width="4"/></g>
    <circle cx="487" cy="459" r="23" fill="#D5DDC0" stroke="#557F6D" stroke-width="3"/><circle cx="487" cy="459" r="16" fill="none" stroke="#A8BFA0" stroke-width="3"/><path d="M487 459 L${pt(nearPedal)}" stroke="#446E60" stroke-width="7"/><path d="M487 459 L${pt(nearPedal)}" stroke="#BED6B5" stroke-width="3"/><circle cx="487" cy="459" r="5.2" fill="#446D5E"/>
    <g transform="translate(0 ${n(bob)})"><path d="M439 328 C407 323 387 341 362 341 C333 341 310 ${n(326+tail)} 287 ${n(316+tail)} C306 ${n(341+tail)} 327 368 365 373 C395 378 423 370 440 353Z" fill="url(#axh-body)" stroke="#567159" stroke-width="2.6"/><path d="M302 ${n(329+tail)} C329 356 365 366 400 356" fill="none" stroke="#CCD3A2" stroke-width="5" opacity=".65"/><ellipse cx="378" cy="348" rx="7" ry="4.4" fill="#7F9B69" transform="rotate(-9 378 348)"/><ellipse cx="358" cy="350" rx="4.5" ry="3.1" fill="#8CA775"/></g>
    ${leg({x:458,y:355+bob},nearPedal,true)}
    <path d="M526 ${n(323+bob)} Q563 ${n(349+bob*.5)} 623 340" fill="none" stroke="#56745D" stroke-width="25"/><path d="M526 ${n(323+bob)} Q563 ${n(349+bob*.5)} 623 340" fill="none" stroke="#87A071" stroke-width="20"/><ellipse cx="624" cy="340" rx="14" ry="10" fill="#87A071" stroke="#56745D" stroke-width="2"/>
    <g transform="translate(0 ${n(bob)})">
      <path d="M411 320 C424 301 454 292 482 296 C511 294 534 311 543 332 C551 349 544 370 528 383 C510 399 479 397 453 382 C424 378 407 354 411 320Z" fill="url(#axh-body)" stroke="#567159" stroke-width="2.7"/><path d="M484 374 C503 385 526 375 532 360 C540 346 532 334 523 327 C523 350 506 360 484 360Z" fill="#CBD2A1" opacity=".7"/><path d="M426 325 Q442 309 462 310" fill="none" stroke="#CDD5A5" stroke-width="5"/>
      <g fill="#7F9967" opacity=".72"><ellipse cx="433" cy="335" rx="7" ry="5.4" transform="rotate(-24 433 335)"/><ellipse cx="452" cy="323" rx="5.2" ry="4.2"/><ellipse cx="466" cy="333" rx="7.5" ry="5.5"/><ellipse cx="439" cy="352" rx="4" ry="3.5"/><ellipse cx="479" cy="316" rx="3.2" ry="2.7"/></g>
      <path d="M513 316 C525 301 540 293 552 293 L578 327 C565 345 543 352 525 341Z" fill="#A6B981"/>
      <path d="M539 310 C521 310 508 ${n(309+scarfWave)} 492 ${n(298+scarfWave)} C477 ${n(287+scarfWave)} 466 ${n(297-scarfWave*.4)} 451 ${n(294-scarfWave*.4)} L463 ${n(308-scarfWave*.4)} L453 ${n(317-scarfWave*.4)} C472 ${n(326-scarfWave*.4)} 486 ${n(306+scarfWave)} 501 ${n(321+scarfWave)} C515 ${n(333+scarfWave)} 528 329 543 325Z" fill="#D86F5C" stroke="#AD5D4E" stroke-width="2"/>
      <path d="M462 ${n(301-scarfWave*.4)} C480 ${n(307-scarfWave*.4)} 484 ${n(299+scarfWave)} 501 ${n(311+scarfWave)} Q520 326 536 318" fill="none" stroke="#F09C7D" stroke-width="3"/>
      <path d="M550 222 C540 207 523 210 518 218 C505 209 490 219 492 232 C477 231 469 247 478 258 C464 266 469 285 481 288 C474 300 486 314 499 313 C503 328 520 331 530 320 C544 326 559 313 556 303 C570 287 567 248 550 222Z" fill="#B6C38E" stroke="#58725A" stroke-width="2.8"/>
      <path d="M544 229 C519 221 492 244 488 266 C484 292 509 310 530 309 C554 306 557 253 544 229Z" fill="#8FA575" stroke="#D3D7A7" stroke-width="7"/>
      <g fill="#DCE0AF"><ellipse cx="506" cy="229" rx="5.8" ry="8.5" transform="rotate(38 506 229)"/><ellipse cx="483" cy="249" rx="5" ry="7" transform="rotate(12 483 249)"/><ellipse cx="481" cy="277" rx="5.4" ry="6.5"/><ellipse cx="495" cy="302" rx="5.3" ry="6.4" transform="rotate(-35 495 302)"/><ellipse cx="519" cy="315" rx="6" ry="4.5"/></g>
      <path d="M540 242 Q519 250 513 267 M540 269 Q519 276 510 292" fill="none" stroke="#7F996B" stroke-width="2.5" opacity=".6"/>
      <path d="M547 240 C564 226 588 232 610 248 C627 259 630 278 648 289 C660 298 679 298 688 305 C698 312 698 324 687 334 C675 345 646 344 623 339 C612 347 589 345 574 335 C554 323 540 301 539 280 C536 263 540 249 547 240Z" fill="url(#axh-body)" stroke="#567159" stroke-width="2.8"/>
      <path d="M567 317 C586 336 610 337 625 329 C643 335 666 334 680 329" fill="none" stroke="#CBD3A1" stroke-width="9"/>
      <path d="M559 251 Q568 244 578 246" fill="none" stroke="#D2D9AB" stroke-width="4"/>
      <g fill="#7F9B6C" opacity=".62"><ellipse cx="564" cy="275" rx="4.8" ry="6.3" transform="rotate(-20 564 275)"/><ellipse cx="574" cy="263" rx="3.2" ry="4.3"/><ellipse cx="554" cy="292" rx="3.8" ry="4.3"/></g>
      <path d="M584 250 C597 232 606 215 619 207 C619 229 614 246 604 260Z" fill="#EBDDB4" stroke="#58725A" stroke-width="2.2"/>
      <path d="M518 235 C518 204 538 184 564 184 C589 184 608 203 612 226 L607 238 C579 224 547 227 520 244Z" fill="url(#axh-helmet)" stroke="#366E66" stroke-width="2.7"/>
      <path d="M525 221 C533 200 550 191 568 191" fill="none" stroke="#97D0BB" stroke-width="5"/>
      <path d="M547 198 Q541 210 541 218 M568 196 Q564 205 565 215 M588 204 Q586 209 588 216" fill="none" stroke="#326F68" stroke-width="6.8"/>
      <path d="M520 240 Q559 221 609 235" fill="none" stroke="#285F5B" stroke-width="6"/>
      <path d="M528 241 L557 310 Q564 326 575 326 L589 317 M572 233 L557 307" fill="none" stroke="#397068" stroke-width="4"/>
      <rect x="560" y="313" width="12" height="9" rx="2.5" transform="rotate(25 566 317)" fill="#E5D8AE" stroke="#3F6E61" stroke-width="2"/>
      <path d="M607 259 C622 235 635 217 649 211 C644 235 636 256 624 270Z" fill="#FFF0CD" stroke="#58725A" stroke-width="2.4"/><path d="M619 260 Q637 232 644 221 Q637 247 627 263Z" fill="#E4D2A7"/>
      <path d="M659 299 C663 286 668 275 676 269 C678 283 678 295 673 306Z" fill="#FFF0CD" stroke="#58725A" stroke-width="2.3"/>
      <path d="M681 304 C690 305 698 311 699 317 Q695 327 683 331 Q687 318 681 304Z" fill="#D5D1A3" stroke="#58725A" stroke-width="2.2"/>
      <path d="M613 274 Q623 270 630 277" fill="none" stroke="#63795B" stroke-width="2.8"/>
      <ellipse cx="621" cy="286" rx="8.4" ry="10.1" fill="#FBF4D9"/><ellipse cx="624" cy="287" rx="5.5" ry="7" fill="#354E44"/><circle cx="625.4" cy="283.9" r="2.1" fill="#FFFDF0"/>
      <ellipse cx="613" cy="307" rx="12" ry="6.5" fill="#D7A384" opacity=".66"/><ellipse cx="674" cy="309" rx="2.8" ry="2" transform="rotate(15 674 309)" fill="#667B59"/>
      <path d="M650 322 Q664 333 681 323" fill="none" stroke="#57705A" stroke-width="2.4"/><path d="M650 322 q-3 -2 -5 1" fill="none" stroke="#57705A" stroke-width="2"/>
      <path d="M545 318 Q553 327 573 328 L572 338 Q554 341 541 330Z" fill="#E7826A" stroke="#AD5D4E" stroke-width="2"/><path d="M538 320 Q544 314 548 322 L551 332 Q547 339 540 333Z" fill="#F29E80" stroke="#AD5D4E" stroke-width="2"/>
    </g>
    <path d="M535 ${n(337+bob)} Q563 ${n(373+bob*.4)} 588 359 L635 348" fill="none" stroke="#567159" stroke-width="29"/><path d="M535 ${n(337+bob)} Q563 ${n(373+bob*.4)} 588 359 L635 348" fill="none" stroke="#A8BA82" stroke-width="24"/><path d="M541 ${n(339+bob)} Q563 ${n(361+bob*.4)} 577 357" fill="none" stroke="#C6D09C" stroke-width="6"/>
    <path d="M630 337 Q641 333 649 340 Q656 346 650 354 Q645 360 631 357 Q623 350 630 337Z" fill="#A8BA82" stroke="#567159" stroke-width="2.4"/><path d="M641 347 l5 6 M635 350 l4 6" stroke="#D6D9A9" stroke-width="3.5"/>
    <g><path d="M650 367 L708 400 M647 383 L704 414" fill="none" stroke="#6D8C76" stroke-width="3.5"/>
      <path d="M695 375 Q697 345 727 343 Q754 344 759 374" fill="none" stroke="#AC8054" stroke-width="4"/>
      <path d="M711 378 Q704 350 696 333 M720 376 Q717 344 727 316 M730 379 Q739 349 752 335 M741 380 Q745 357 736 339" fill="none" stroke="#679575" stroke-width="2.5"/>
      <path d="M710 358 Q693 357 693 347 Q705 345 711 356 M720 348 Q708 339 710 331 Q723 335 720 348 M734 363 Q747 345 754 351 Q752 363 734 363 M739 373 Q754 366 760 371 Q752 380 739 373 M724 369 Q707 356 701 367 Q709 376 724 372" fill="#80A47C"/>
      ${flower(714,380,1.17,'#FFF1CD',phase+.6)}${flower(744,382,1.35,'#E4A99D',phase+1.1)}${flower(729,375,1.52,'#FFF3DD',phase+2.2)}
      <g fill="#A698BB"><circle cx="696" cy="330" r="5.1"/><circle cx="691" cy="336" r="4.5"/><circle cx="700" cy="337" r="4.8"/><circle cx="704" cy="344" r="4.3"/><circle cx="697" cy="345" r="4.5"/></g>
      <path d="M688 369 L768 369 L758 414 Q728 424 697 414Z" fill="url(#axh-basket)" stroke="#A77C53" stroke-width="2.8"/>
      <path d="M700 377 l6 34 M713 377 l4 38 M726 377 v39 M739 377 l-3 38 M753 377 l-6 34" fill="none" stroke="#BE8F59" stroke-width="3"/>
      <path d="M695 383 Q728 390 763 383 M697 394 Q728 401 761 394 M699 405 Q729 412 758 405" fill="none" stroke="#F1CE96" stroke-width="3.4"/>
      <path d="M688 369 Q728 376 768 369" fill="none" stroke="#A77C53" stroke-width="8"/><path d="M688 367 Q728 374 768 367" fill="none" stroke="#F2D4A0" stroke-width="5"/>
      <path d="M724 374 v14 q5 5 10 0 v-14" fill="#B28554" stroke="#A4774C" stroke-width="1.5"/><circle cx="729" cy="384" r="2" fill="#F0D09C"/>
    </g>
    <path d="M0 618 C96 604 133 626 219 632 C329 638 431 623 553 633 C692 646 820 617 960 622 V640 H0Z" fill="#9FBE86"/>
    ${foreground}
    <g transform="translate(55 606)"><path d="M0 0 Q-13 -23 -10 -41 M2 0 Q9 -21 18 -29 M-2 -5 Q-26 -18 -25 -26" fill="none" stroke="#6B946F" stroke-width="2.5"/><path d="M-6 -19 Q-27 -40 -26 -23 Q-20 -12 -6 -19 M4 -12 Q24 -28 26 -14 Q19 -4 4 -12" fill="#88AA79"/>${flower(-8,-2,.95,'#FFF3D7',phase+.5)}${flower(16,6,.74,'#EBA68F',phase+1)}</g>
    <g transform="translate(884 625)">${flower(0,0,1.07,'#FFF0CB',phase+2)}${flower(28,7,.74,'#E9AF99',phase+2.5)}<path d="M7 0 Q-18 -26 -23 -12 Q-15 1 7 0 M21 6 Q34 -10 39 -5 Q35 6 21 6" fill="#759D72"/></g>
  </g></svg>`;
}
module.exports={renderScene};
