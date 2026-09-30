function renderScene(t) {
  const time = ((Number.isFinite(t) ? t : 0) % 8 + 8) % 8;
  const tau = Math.PI * 2;
  const phase = tau * time / 8;
  const spin = 1440 * time / 8;
  const pedalAngle = 4 * phase - 0.35;
  const bob = 3.2 * Math.sin(4 * phase - 0.4);
  const tailSway = 8 * Math.sin(phase + 0.3);
  const scarfLift = 7 * Math.sin(2 * phase + 0.5);
  const cloudShift = 13 * Math.sin(phase);
  const farShift = 9 * Math.sin(phase + 0.4) - 9 * Math.sin(0.4);
  const nearShift = 17 * Math.sin(phase - 0.7) + 17 * Math.sin(0.7);
  const f = n => Number(n.toFixed(2));
  const px = 492, py = 470, pr = 38;
  const a = { x: f(px + pr * Math.cos(pedalAngle)), y: f(py + pr * Math.sin(pedalAngle)) };
  const b = { x: f(px - pr * Math.cos(pedalAngle)), y: f(py - pr * Math.sin(pedalAngle)) };

  function flower(x, y, size, color, lean = 0) {
    const cx = f(x + lean);
    return `<path d="M${x} ${y + size * 2.6} Q${f(x + lean * .5)} ${f(y + size * 1.4)} ${cx} ${y}" fill="none" stroke="#568c68" stroke-width="2.3" stroke-linecap="round"/>
      <path d="M${f(x + lean * .35)} ${f(y + size * 1.8)} q-9 -10 -14 -6 q5 9 14 8" fill="#74aa80"/>
      <g fill="${color}"><ellipse cx="${cx}" cy="${f(y - size * .73)}" rx="${f(size * .41)}" ry="${f(size * .7)}"/><ellipse cx="${f(cx + size * .7)}" cy="${f(y - size * .13)}" rx="${f(size * .65)}" ry="${f(size * .43)}"/><ellipse cx="${f(cx + size * .43)}" cy="${f(y + size * .61)}" rx="${f(size * .43)}" ry="${f(size * .64)}"/><ellipse cx="${f(cx - size * .43)}" cy="${f(y + size * .61)}" rx="${f(size * .43)}" ry="${f(size * .64)}"/><ellipse cx="${f(cx - size * .7)}" cy="${f(y - size * .13)}" rx="${f(size * .65)}" ry="${f(size * .43)}"/></g><circle cx="${cx}" cy="${y}" r="${f(size * .42)}" fill="#f4cb6c"/>`;
  }

  function wheel(cx, cy) {
    let spokes = '';
    for (let i = 0; i < 12; i++) {
      const an = tau * i / 12;
      spokes += `<path d="M${cx} ${cy} L${f(cx + 74 * Math.cos(an))} ${f(cy + 74 * Math.sin(an))}"/>`;
    }
    return `<g><circle cx="${cx}" cy="${cy}" r="87" fill="#e5eee8" stroke="#467368" stroke-width="12"/>
      <circle cx="${cx}" cy="${cy}" r="76" fill="#f7edce" fill-opacity=".45" stroke="#b5cbbb" stroke-width="2"/>
      <g transform="rotate(${f(spin)} ${cx} ${cy})" stroke="#8eb6a6" stroke-width="2.4" stroke-linecap="round">${spokes}<circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="#b8d4c5" stroke-width="1.5"/></g>
      <circle cx="${cx}" cy="${cy}" r="12" fill="#47766c"/><circle cx="${cx}" cy="${cy}" r="5" fill="#e8d8a6"/></g>`;
  }

  function leg(hx, hy, p, color, kneeOffset) {
    const kx = f(hx + (p.x - hx) * .42 + kneeOffset);
    const ky = f(hy + (p.y - hy) * .46 - 3);
    return `<path d="M${hx} ${f(hy + bob)} Q${f((hx + kx) / 2)} ${f((hy + ky) / 2 + bob)} ${kx} ${ky} Q${f((kx + p.x) / 2 + 4)} ${f((ky + p.y) / 2)} ${p.x} ${p.y}" fill="none" stroke="#658e70" stroke-width="31" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${hx} ${f(hy + bob)} Q${f((hx + kx) / 2)} ${f((hy + ky) / 2 + bob)} ${kx} ${ky} Q${f((kx + p.x) / 2 + 4)} ${f((ky + p.y) / 2)} ${p.x} ${p.y}" fill="none" stroke="${color}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="${p.x}" cy="${f(p.y - 1)}" rx="19" ry="10" transform="rotate(-8 ${p.x} ${p.y})" fill="${color}" stroke="#5c876c" stroke-width="2"/>`;
  }

  const basketFlowers = [
    flower(695, 291, 8, '#f7e8b8', -5), flower(711, 280, 8, '#e99b8a', 3),
    flower(729, 290, 7, '#fff3df', -2), flower(746, 282, 7, '#d2a4b4', 4),
    flower(681, 298, 6, '#e99b8a', 4)
  ].join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" width="960" height="640">
    <defs>
      <linearGradient id="tri-sky" x2="0" y2="1"><stop offset="0" stop-color="#b6dbe8"/><stop offset=".68" stop-color="#e8f2e9"/><stop offset="1" stop-color="#f7eed6"/></linearGradient>
      <linearGradient id="tri-hill" x2="0" y2="1"><stop stop-color="#a8caba"/><stop offset="1" stop-color="#77a897"/></linearGradient>
      <linearGradient id="tri-body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#afcba0"/><stop offset=".55" stop-color="#93b18a"/><stop offset="1" stop-color="#78a07e"/></linearGradient>
      <linearGradient id="tri-helmet" x2="0" y2="1"><stop stop-color="#74c1bb"/><stop offset="1" stop-color="#348d8e"/></linearGradient>
      <pattern id="tri-basket" width="12" height="9" patternUnits="userSpaceOnUse"><path d="M0 0L12 9M12 0L0 9" stroke="#a57551" stroke-width="1.3" opacity=".55"/></pattern>
    </defs>
    <rect width="960" height="640" fill="url(#tri-sky)"/>
    <circle cx="801" cy="119" r="59" fill="#f6d386" opacity=".22"/><circle cx="801" cy="119" r="42" fill="#ffe2a0"/>
    <path d="M776 117q25 17 50 0" fill="none" stroke="#eebd77" stroke-width="2" opacity=".55"/>
    <g fill="#fffaf0" opacity=".82" transform="translate(${f(cloudShift)} 0)">
      <path d="M65 146q-3-20 18-23q9-28 37-21q22-22 41-1q28-5 31 20q26 3 26 25Z"/>
      <path d="M311 91q0-15 20-18q8-20 30-13q16-14 32 0q21-4 25 14q18 2 18 17Z" opacity=".8"/>
      <path d="M687 202q0-12 15-15q7-17 22-11q15-11 26 1q18-1 20 13q14 2 15 12Z" opacity=".65"/>
    </g>
    <g transform="translate(${f(farShift)} 0)">
      <path d="M-35 399Q100 277 230 366Q344 292 461 367Q603 289 754 365Q879 296 996 359V537H-35Z" fill="#b6d2c4"/>
      <path d="M-34 457Q108 340 220 423Q340 354 461 416Q596 329 741 422Q873 355 998 405V554H-34Z" fill="url(#tri-hill)"/>
      <path d="M-20 472Q130 374 268 433M502 429Q650 356 774 416" fill="none" stroke="#d7e2c9" stroke-width="3" opacity=".55"/>
    </g>
    <g transform="translate(${f(nearShift)} 0)">
      <path d="M-30 492Q95 452 193 468Q331 422 470 474Q610 428 739 463Q883 423 994 476V640H-30Z" fill="#87ad8c"/>
      <path d="M-30 514Q126 467 259 504Q352 459 451 504Q579 465 681 497Q813 462 990 510V640H-30Z" fill="#a6bf91"/>
    </g>
    <path d="M0 536C144 508 266 534 368 540C486 548 561 517 672 524C787 529 863 564 960 544V640H0Z" fill="#e0cfaa"/>
    <path d="M0 551C143 526 260 544 368 551C478 556 559 531 671 536C804 538 864 577 960 555" fill="none" stroke="#f5e5c5" stroke-width="18" opacity=".78"/>
    <path d="M0 612C171 574 332 612 469 597C638 578 796 613 960 593V640H0Z" fill="#bfcb9a" opacity=".4"/>
    <g stroke="#639477" stroke-linecap="round" fill="none" opacity=".8">
      <path d="M51 528l-5-14m5 14l7-12M151 504l-3-11m3 11l8-11M844 516l-7-12m7 12l9-13M904 540l-6-15m6 15l9-11" stroke-width="2"/>
    </g>
    <g opacity=".88">${flower(84, 497, 5, '#f7e6b7', 3)}${flower(164, 490, 5, '#e8a79a', -3)}${flower(830, 496, 5, '#f5f1d9', 2)}${flower(888, 517, 5, '#dda6b3', -2)}</g>
    <ellipse cx="324" cy="581" rx="86" ry="11" fill="#7f8e70" opacity=".18"/><ellipse cx="654" cy="581" rx="87" ry="11" fill="#7f8e70" opacity=".18"/>
    ${wheel(324, 492)}${wheel(654, 492)}
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M324 492L444 361L492 470L324 492M444 361L582 363L492 470M582 363L654 492" stroke="#396d65" stroke-width="15"/>
      <path d="M324 492L444 361L492 470L324 492M444 361L582 363L492 470M582 363L654 492" stroke="#92cfb5" stroke-width="10"/>
      <path d="M444 361L432 336M582 363L600 329L623 329" stroke="#396d65" stroke-width="9"/>
      <path d="M444 361L432 336M582 363L600 329L623 329" stroke="#9fd4bb" stroke-width="5"/>
      <path d="M394 338Q427 330 458 340" stroke="#426d60" stroke-width="12"/>
      <path d="M395 338Q425 329 458 340" stroke="#6b8b75" stroke-width="7"/>
      <path d="M309 407Q322 399 337 407M640 405Q654 396 670 406" stroke="#eacb96" stroke-width="4" opacity=".8"/>
    </g>
    <circle cx="492" cy="470" r="21" fill="#4b8a79" stroke="#2f6d67" stroke-width="5"/>
    <circle cx="492" cy="470" r="9" fill="#ebd4a1"/>
    <path d="M492 470L${a.x} ${a.y}M492 470L${b.x} ${b.y}" fill="none" stroke="#456f67" stroke-width="7" stroke-linecap="round"/>
    <path d="M${f(a.x - 19)} ${f(a.y + 6)}h38M${f(b.x - 19)} ${f(b.y + 6)}h38" stroke="#3d716a" stroke-width="7" stroke-linecap="round"/>
    ${leg(470, 346, b, '#789b7d', -25)}
    <g transform="translate(0 ${f(bob)})">
      <path d="M438 310Q400 306 ${f(364 + tailSway)} ${f(286 + tailSway * .25)}Q383 317 428 343Q452 339 438 310Z" fill="#729b78" stroke="#608b70" stroke-width="3"/>
      <path d="M408 307Q393 302 ${f(373 + tailSway)} ${f(293 + tailSway * .25)}" fill="none" stroke="#adc99e" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="484" cy="314" rx="100" ry="66" fill="url(#tri-body)" stroke="#6c9674" stroke-width="3"/>
      <path d="M394 332Q443 365 507 366Q547 356 561 333Q517 369 466 348Q430 345 394 332Z" fill="#d4d8aa" opacity=".52"/>
      <g fill="#7da680" opacity=".53"><ellipse cx="414" cy="278" rx="8" ry="5" transform="rotate(-22 414 278)"/><ellipse cx="442" cy="263" rx="7" ry="4"/><ellipse cx="471" cy="253" rx="6" ry="4"/><ellipse cx="499" cy="257" rx="6" ry="4"/><ellipse cx="523" cy="271" rx="5" ry="3"/><ellipse cx="401" cy="302" rx="5" ry="3"/><ellipse cx="431" cy="294" rx="6" ry="4"/></g>
      <path d="M490 304Q506 300 517 312" fill="none" stroke="#d3ddae" stroke-width="4" opacity=".55"/>
    </g>
    ${leg(514, 351, a, '#a4c296', 20)}
    <g transform="translate(0 ${f(bob)})">
      <path d="M547 281Q527 268 510 283Q490 296 504 316Q516 327 536 316Z" fill="#83a887" stroke="#668c70" stroke-width="3"/>
      <path d="M523 280Q501 286 507 305" fill="none" stroke="#b9d0a7" stroke-width="4"/>
      <path d="M558 275Q530 273 525 235Q504 237 493 220Q484 201 502 187Q498 165 521 161Q531 137 555 150Q575 139 590 155Q612 151 618 172Q646 180 638 204Q649 223 629 240Q626 259 602 272Z" fill="#a9c299" stroke="#6d9879" stroke-width="4"/>
      <path d="M554 160Q538 184 544 222Q550 255 579 264" fill="none" stroke="#d3d8ad" stroke-width="15" opacity=".6"/>
      <g fill="#c9d5aa" stroke="#7e9f7e" stroke-width="2"><circle cx="518" cy="190" r="7"/><circle cx="517" cy="219" r="7"/><circle cx="546" cy="166" r="7"/><circle cx="600" cy="169" r="7"/><circle cx="625" cy="202" r="6"/></g>
      <path d="M555 184Q567 158 600 158Q633 157 647 181L651 193Q617 190 578 197Q562 196 555 190Z" fill="url(#tri-helmet)" stroke="#2d777b" stroke-width="3"/>
      <path d="M553 185Q595 176 649 184" fill="none" stroke="#a4dfcb" stroke-width="6" stroke-linecap="round"/>
      <path d="M563 194Q586 208 607 200" fill="none" stroke="#267c80" stroke-width="4"/>
      <path d="M590 191L592 236Q594 251 608 251" fill="none" stroke="#2e777a" stroke-width="3"/>
      <path d="M601 252Q629 262 651 245Q669 238 668 217Q666 194 648 184Q622 177 601 192Q580 209 583 232Q583 247 601 252Z" fill="#a9c699" stroke="#6d9879" stroke-width="3"/>
      <path d="M630 235Q649 225 665 237Q686 246 683 259Q681 272 657 277Q633 281 620 263Q616 247 630 235Z" fill="#c6d4aa" stroke="#6d9879" stroke-width="3"/>
      <path d="M662 264Q671 268 680 259Q679 276 662 281Q649 280 645 273Z" fill="#e9ca9e" stroke="#a8826b" stroke-width="2"/>
      <path d="M587 200Q578 184 577 145Q589 166 594 189Q599 201 587 200Z" fill="#fff2d9" stroke="#b9aa91" stroke-width="2"/>
      <path d="M621 199Q608 181 612 133Q629 159 632 185Q636 200 621 199Z" fill="#fff4de" stroke="#b9aa91" stroke-width="2"/>
      <path d="M653 232Q650 217 661 203Q663 222 666 230Q663 237 653 232Z" fill="#fff0d2" stroke="#b9aa91" stroke-width="2"/>
      <ellipse cx="636" cy="224" rx="9" ry="11" fill="#f5f6df"/><ellipse cx="639" cy="225" rx="4" ry="6" fill="#3d5c53"/><circle cx="640" cy="222" r="1.6" fill="white"/>
      <path d="M655 218Q662 214 668 219" fill="none" stroke="#719878" stroke-width="2"/>
      <ellipse cx="656" cy="252" rx="7" ry="4" fill="#e99e8e" opacity=".48"/>
      <circle cx="672" cy="253" r="2.8" fill="#58755c"/>
      <path d="M548 271Q562 266 573 273Q576 285 564 296Q550 292 543 281Z" fill="#dc796c" stroke="#ae5e62" stroke-width="2"/>
      <path d="M550 284Q506 ${f(300 + scarfLift * .4)} 462 ${f(285 + scarfLift)}Q482 ${f(302 + scarfLift)} 511 ${f(308 + scarfLift * .4)}Q536 311 557 293Z" fill="#d87970" stroke="#ad5b5f" stroke-width="2"/>
      <path d="M550 282Q515 ${f(293 + scarfLift * .4)} 473 ${f(287 + scarfLift)}" fill="none" stroke="#efaa91" stroke-width="3" opacity=".8"/>
      <path d="M548 299Q566 300 574 283" fill="none" stroke="#efaa91" stroke-width="3"/>
      <path d="M544 310Q560 313 570 325L597 338" fill="none" stroke="#668e72" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M544 310Q560 313 570 325L597 338" fill="none" stroke="#a1bd92" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <path d="M597 ${f(338 + bob)}Q610 341 617 331" fill="none" stroke="#a1bd92" stroke-width="18" stroke-linecap="round"/>
    <path d="M612 336q5 2 9 -2M607 341q6 3 12 -1" fill="none" stroke="#6f9576" stroke-width="2" stroke-linecap="round"/>
    <path d="M658 337L693 337M665 350L694 350" stroke="#46766c" stroke-width="5" stroke-linecap="round"/>
    <g>${basketFlowers}
      <path d="M667 314Q712 323 760 313L749 371Q713 380 676 370Z" fill="#bc8860" stroke="#916d50" stroke-width="3"/>
      <path d="M667 314Q712 323 760 313L749 371Q713 380 676 370Z" fill="url(#tri-basket)"/>
      <path d="M668 317Q712 326 760 317" fill="none" stroke="#e0b685" stroke-width="9" stroke-linecap="round"/>
      <path d="M683 337Q712 345 751 337M680 353Q714 360 746 353" fill="none" stroke="#e6b786" stroke-width="3" opacity=".75"/>
    </g>
    <g fill="none" stroke="#789c76" stroke-width="2" stroke-linecap="round" opacity=".9"><path d="M29 604l-5-12m5 12l6-10M186 619l-3-11m3 11l7-10M790 603l-5-11m5 11l7-13M922 613l-3-10m3 10l6-9"/></g>
    <g opacity=".72">${flower(72, 586, 6, '#f7e9c2', 2)}${flower(211, 603, 6, '#e7a79b', -3)}${flower(803, 582, 6, '#f5ecbf', 3)}${flower(915, 590, 6, '#e5a2a0', -3)}</g>
  </svg>`;
}

module.exports = { renderScene };
