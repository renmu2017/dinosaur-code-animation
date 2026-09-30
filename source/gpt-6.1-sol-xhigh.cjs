'use strict';

const TAU = Math.PI * 2;
const f = n => (Math.abs(n) < 0.0005 ? 0 : n).toFixed(3);
const pt = p => `${f(p.x)},${f(p.y)}`;

function cloud(x, y, scale) {
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(scale)})"><path d="M3 31C-5 20 3 8 18 10C21-7 47-12 61 4C79-6 103 5 103 22C121 20 132 34 123 43C113 52 21 50 8 44C2 41 0 35 3 31Z" fill="#fffdf0"/><path d="M15 43C41 47 98 47 117 40" fill="none" stroke="#d9e9df" stroke-width="4" stroke-linecap="round" opacity=".5"/></g>`;
}

function blossom(x, y, r, color, count = 5, rotation = 0) {
  let petals = '';
  for (let i = 0; i < count; i++) {
    petals += `<ellipse cx="0" cy="${f(-r * .68)}" rx="${f(r * .49)}" ry="${f(r * .7)}" transform="rotate(${f(rotation + i * 360 / count)})" fill="${color}"/>`;
  }
  return `<g transform="translate(${f(x)} ${f(y)})">${petals}<circle r="${f(r * .34)}" fill="#e8b94e"/><circle cx="${f(-r * .1)}" cy="${f(-r * .1)}" r="${f(r * .12)}" fill="#fff1b2"/></g>`;
}

function terrain(base, amplitude, period, shift, harmonic, fill) {
  const points = [];
  for (let x = -100; x <= 1060; x += 40) {
    const u = TAU * (x + shift) / period;
    points.push({ x, y: base + amplitude * Math.sin(u) + harmonic * Math.sin(u * 2 + .75) });
  }
  let d = `M${pt(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[i];
    const c = points[i + 1];
    const e = points[Math.min(points.length - 1, i + 2)];
    d += `C${f(b.x + (c.x - a.x) / 6)},${f(b.y + (c.y - a.y) / 6)} ${f(c.x - (e.x - b.x) / 6)},${f(c.y - (e.y - b.y) / 6)} ${pt(c)}`;
  }
  return `<path d="${d}L1060 640H-100Z" fill="${fill}"/>`;
}

function tree(x, y, size, color) {
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(size)})"><path d="M0 0L-1-51M-1-28L-17-43M-1-20L15-39" fill="none" stroke="#739d7f" stroke-width="5" stroke-linecap="round"/><path d="M-22-24C-40-34-36-53-23-58C-26-77-5-91 7-78C26-81 38-64 30-49C44-29 24-12 10-19C0-12-14-15-22-24Z" fill="${color}"/><path d="M-23-53C-18-65-9-71 1-68" fill="none" stroke="#e2ebc0" stroke-width="5" stroke-linecap="round" opacity=".28"/></g>`;
}

function wheel(x, y, angle) {
  let spokes = '';
  let tread = '';
  for (let i = 0; i < 12; i++) {
    const a = TAU * i / 12;
    const b = a + .22;
    spokes += `<path d="M${f(9 * Math.cos(b))} ${f(9 * Math.sin(b))}L${f(77 * Math.cos(a))} ${f(77 * Math.sin(a))}"/>`;
    tread += `<path d="M${f(84 * Math.cos(a))} ${f(84 * Math.sin(a))}L${f(88 * Math.cos(a + .022))} ${f(88 * Math.sin(a + .022))}"/>`;
  }
  return `<g transform="translate(${x} ${y})"><circle r="85" fill="none" stroke="#486451" stroke-width="12"/><circle r="86" fill="none" stroke="#799080" stroke-width="2"/><circle r="78" fill="none" stroke="#eaf0d5" stroke-width="5"/><circle r="75" fill="none" stroke="#8ea992" stroke-width="1.5"/><g transform="rotate(${f(angle)})"><g fill="none" stroke="#839b89" stroke-width="1.7" opacity=".83">${spokes}</g><g fill="none" stroke="#a8bba0" stroke-width="1.3" opacity=".45">${tread}</g><path d="M-4-76V-68" stroke="#425e4f" stroke-width="3" stroke-linecap="round"/><circle cx="56" cy="44" r="4.5" fill="#f5d975" stroke="#648b74" stroke-width="1.5"/></g><path d="M-68-50A85 85 0 0 1-42-74" fill="none" stroke="#c7dac0" stroke-width="2.5" stroke-linecap="round" opacity=".55"/><circle r="11" fill="#e9efcf" stroke="#4a6e58" stroke-width="3"/><circle r="4" fill="#739581"/></g>`;
}

function knee(hip, ankle, upper, lower) {
  const dx = ankle.x - hip.x;
  const dy = ankle.y - hip.y;
  const d = Math.hypot(dx, dy);
  const a = (upper * upper - lower * lower + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, upper * upper - a * a));
  return { x: hip.x + dx * a / d + dy * h / d, y: hip.y + dy * a / d - dx * h / d };
}

function leg(hip, pedal, far) {
  const ankle = { x: pedal.x - 11, y: pedal.y - 14 };
  const k = knee(hip, ankle, 86, 84);
  const color = far ? '#89a26e' : 'url(#ts61-body)';
  const outline = far ? '#627b57' : '#526d4d';
  const upper = `M${pt(hip)}L${pt(k)}`;
  const lower = `M${pt(k)}L${pt(ankle)}`;
  return `<g stroke-linecap="round" stroke-linejoin="round"><path d="${upper}" fill="none" stroke="${outline}" stroke-width="37"/><path d="${lower}" fill="none" stroke="${outline}" stroke-width="29"/><path d="${lower}" fill="none" stroke="${color}" stroke-width="23"/><path d="${upper}" fill="none" stroke="${color}" stroke-width="31"/><circle cx="${f(k.x)}" cy="${f(k.y)}" r="15.4" fill="${color}"/><path d="M${f(k.x - 5)} ${f(k.y - 8)}Q${f(k.x + 1)} ${f(k.y - 12)} ${f(k.x + 6)} ${f(k.y - 7)}" fill="none" stroke="${far ? '#a8b885' : '#d1d9a7'}" stroke-width="3" opacity=".8"/><circle cx="${f(hip.x + 17)}" cy="${f(hip.y + 13)}" r="3.5" fill="#78945f" opacity=".5"/></g>`;
}

function foot(p, far) {
  const x = p.x;
  const y = p.y;
  return `<g><rect x="${f(x - 24)}" y="${f(y - 1)}" width="48" height="7" rx="3" fill="#476555"/><path d="M${f(x - 20)} ${f(y + 2)}H${f(x + 20)}" stroke="#cddfc2" stroke-width="2" stroke-linecap="round"/><path d="M${f(x - 23)} ${f(y - 10)}C${f(x - 22)} ${f(y - 23)} ${f(x - 8)} ${f(y - 25)} ${f(x + 2)} ${f(y - 16)}C${f(x + 9)} ${f(y - 15)} ${f(x + 23)} ${f(y - 15)} ${f(x + 25)} ${f(y - 7)}Q${f(x + 24)} ${f(y - 2)} ${f(x + 15)} ${f(y - 2)}H${f(x - 17)}Q${f(x - 25)} ${f(y - 2)} ${f(x - 23)} ${f(y - 10)}Z" fill="${far ? '#95ac79' : '#b4c18d'}" stroke="${far ? '#617a56' : '#526d4d'}" stroke-width="3"/><path d="M${f(x + 9)} ${f(y - 9)}V${f(y - 3)}M${f(x + 17)} ${f(y - 8)}V${f(y - 3)}" fill="none" stroke="#6f865b" stroke-width="1.6" stroke-linecap="round"/><path d="M${f(x - 14)} ${f(y - 17)}Q${f(x - 8)} ${f(y - 20)} ${f(x - 3)} ${f(y - 17)}" fill="none" stroke="#e5e7ba" stroke-width="2.5" stroke-linecap="round" opacity=".7"/></g>`;
}

function arm(shoulder, hand, far, bob) {
  const elbow = { x: far ? 530 : 537, y: (far ? 328 : 338) + bob * .35 };
  const d = `M${pt(shoulder)}Q${f(elbow.x - 9)} ${f(elbow.y - 3)} ${pt(elbow)}Q${f(elbow.x + 21)} ${f(elbow.y + 8)} ${pt(hand)}`;
  return `<g stroke-linecap="round" stroke-linejoin="round"><path d="${d}" fill="none" stroke="${far ? '#5d7755' : '#526d4d'}" stroke-width="${far ? 24 : 28}"/><path d="${d}" fill="none" stroke="${far ? '#8ea776' : 'url(#ts61-body)'}" stroke-width="${far ? 18 : 22}"/>${far ? '' : `<path d="M${f(elbow.x - 5)} ${f(elbow.y - 5)}Q${f(elbow.x + 1)} ${f(elbow.y - 7)} ${f(elbow.x + 5)} ${f(elbow.y - 3)}" fill="none" stroke="#d0d9a5" stroke-width="2.8" opacity=".7"/>`}<path d="M${f(hand.x - 13)} ${f(hand.y - 7)}Q${f(hand.x - 10)} ${f(hand.y - 15)} ${f(hand.x - 2)} ${f(hand.y - 11)}L${f(hand.x + 11)} ${f(hand.y - 6)}Q${f(hand.x + 17)} ${f(hand.y + 2)} ${f(hand.x + 8)} ${f(hand.y + 7)}L${f(hand.x - 10)} ${f(hand.y + 7)}Q${f(hand.x - 17)} ${f(hand.y + 3)} ${f(hand.x - 13)} ${f(hand.y - 7)}Z" fill="${far ? '#96ac7c' : '#b5c391'}" stroke="#526d4d" stroke-width="2.6"/><path d="M${f(hand.x + 2)} ${f(hand.y - 5)}L${f(hand.x + 1)} ${f(hand.y + 1)}M${f(hand.x + 8)} ${f(hand.y - 2)}L${f(hand.x + 6)} ${f(hand.y + 3)}" stroke="#6f865b" stroke-width="1.6" fill="none"/></g>`;
}

function roadsideFlower(x, y, height, color, size, wave) {
  const topX = x + wave;
  const topY = y - height;
  return `<g><path d="M${f(x)} ${f(y)}Q${f(x - 3)} ${f(y - height * .55)} ${f(topX)} ${f(topY)}" fill="none" stroke="#7b9c6b" stroke-width="2.4" stroke-linecap="round"/><path d="M${f(x - 1)} ${f(y - height * .3)}Q${f(x - 18)} ${f(y - height * .64)} ${f(x - 17)} ${f(y - height * .36)}Q${f(x - 11)} ${f(y - height * .2)} ${f(x - 1)} ${f(y - height * .3)}M${f(x - 1)} ${f(y - height * .43)}Q${f(x + 14)} ${f(y - height * .78)} ${f(x + 16)} ${f(y - height * .59)}Q${f(x + 14)} ${f(y - height * .4)} ${f(x - 1)} ${f(y - height * .43)}" fill="#91af78"/>${blossom(topX, topY, size, color)}</g>`;
}

function renderScene(t) {
  const time = ((t % 8) + 8) % 8;
  const w = TAU * time / 8;
  const bob = 1.9 * Math.sin(8 * w) + .65 * Math.sin(2 * w);
  const bikeBob = .7 * Math.sin(2 * w);
  const tail = Math.sin(w + .35);
  const flutter = Math.sin(6 * w);
  const flutter2 = Math.sin(6 * w + 1.5);
  const crank = { x: 467, y: 483 };
  const a = 8 * w - Math.PI / 4;
  const nearPedal = { x: crank.x + 29 * Math.cos(a), y: crank.y + 29 * Math.sin(a) };
  const farPedal = { x: crank.x - 29 * Math.cos(a), y: crank.y - 29 * Math.sin(a) };
  const farHip = { x: 447, y: 352 + bob };
  const nearHip = { x: 429, y: 352 + bob };

  let backgroundTrees = '';
  const treeLocations = [77, 378, 705, 850];
  for (let tile = -1; tile < 3; tile++) {
    for (let i = 0; i < treeLocations.length; i++) {
      const wx = treeLocations[i] + tile * 900;
      const x = wx - 900 * time / 8;
      const u = TAU * wx / 900;
      const y = 378 + 30 * Math.sin(u) + 8 * Math.sin(u * 2 + .75);
      backgroundTrees += tree(x, y + 17, [ .58, .42, .66, .37 ][i], [ '#7eb596', '#8cbc97', '#80b997', '#83b793' ][i]);
    }
  }

  let meadow = '';
  for (let tile = -1; tile < 3; tile++) {
    for (let i = 0; i < 10; i++) {
      const x = tile * 960 + 39 + i * 97 - time * 120;
      const y = 454 + (i % 3) * 17;
      meadow += `<path d="M${f(x)} ${y}q3-9 7-13m-5 12q6-7 11-7" fill="none" stroke="#80ad79" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
      if (i % 3 === 1) meadow += blossom(x + 6, y - 16, 3.4, '#f8efbf', 5, 18);
    }
  }

  let roadMarks = '';
  let foreground = '';
  for (let tile = -1; tile < 3; tile++) {
    const shift = tile * 960 - time * 120;
    for (let i = 0; i < 8; i++) {
      const x = shift + i * 124 + 41;
      const y = 588 + (i % 3) * 16;
      roadMarks += `<path d="M${f(x)} ${y}h${16 + i % 4 * 8}" stroke="#dfbe85" stroke-width="2.4" stroke-linecap="round" opacity=".36"/><ellipse cx="${f(x + 57)}" cy="${y + 12}" rx="3.5" ry="1.7" fill="#d7b989" opacity=".45"/>`;
    }
    foreground += roadsideFlower(shift + 65, 642, 42, '#fff8dc', 6.5, Math.sin(w + .6) * 2);
    foreground += roadsideFlower(shift + 104, 642, 28, '#ed9c88', 5.4, Math.sin(w + 1.2) * 2);
    foreground += roadsideFlower(shift + 785, 638, 37, '#f7e9a8', 6, Math.sin(w + 2) * 2);
    foreground += roadsideFlower(shift + 823, 638, 51, '#b8a8c6', 6.5, Math.sin(w + 2.7) * 2);
    foreground += `<path d="M${f(shift + 18)} 640q2-21 11-31m-9 31q11-16 22-20m${f(shift + 872 - (shift + 22))} 20q4-25 14-34m-11 34q14-15 23-16" fill="none" stroke="#92ad77" stroke-width="3" stroke-linecap="round"/>`;
  }

  let chainRivets = '';
  for (let i = 0; i < 8; i++) {
    const r = TAU * i / 8;
    chainRivets += `<circle cx="${f(18 * Math.cos(r))}" cy="${f(18 * Math.sin(r))}" r="2.1" fill="#c3ddbe"/>`;
  }

  const frame = 'M311 485L431 390L467 483L311 485M431 390L613 369L627 401L467 483M627 401L670 485';
  const bouquetWave = 1.8 * Math.sin(2 * w + .2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
<defs>
  <linearGradient id="ts61-sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c1e1e6"/><stop offset=".7" stop-color="#e6eddf"/><stop offset="1" stop-color="#fff2d7"/></linearGradient>
  <linearGradient id="ts61-road" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4e2b5"/><stop offset="1" stop-color="#f8e7bf"/></linearGradient>
  <linearGradient id="ts61-body" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="#c1ce9b"/><stop offset=".5" stop-color="#afbf8b"/><stop offset="1" stop-color="#97ad78"/></linearGradient>
  <linearGradient id="ts61-frill" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#c8d3a2"/><stop offset="1" stop-color="#9fb580"/></linearGradient>
  <linearGradient id="ts61-helmet" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="#6dbbad"/><stop offset=".48" stop-color="#3f9d91"/><stop offset="1" stop-color="#2e7f77"/></linearGradient>
  <linearGradient id="ts61-horn" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#fff8dd"/><stop offset=".65" stop-color="#eee3b9"/><stop offset="1" stop-color="#d5c999"/></linearGradient>
  <linearGradient id="ts61-basket" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eac998"/><stop offset="1" stop-color="#cea576"/></linearGradient>
  <filter id="ts61-shadow" x="-.2" y="-1" width="1.4" height="3"><feGaussianBlur stdDeviation="6"/></filter>
  <pattern id="ts61-paper" width="9" height="11" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".48" fill="#566b55"/><circle cx="7" cy="9" r=".35" fill="#fffdf2"/></pattern>
  <clipPath id="ts61-basket-clip"><path d="M648 344H733L722 396Q689 408 659 396Z"/></clipPath>
</defs>
<rect width="960" height="640" fill="url(#ts61-sky)"/>
<g transform="translate(822 100)">
  <circle r="54" fill="#fff0ad" opacity=".4"/>
  <g stroke="#edc360" stroke-width="3" stroke-linecap="round"><path d="M0-51V-59M35-35L42-42M51 0H59M35 35L42 42M0 51V59M-35 35L-42 42M-51 0H-59M-35-35L-42-42"/></g>
  <circle r="37" fill="#f5d174"/>
  <path d="M-12-4q3-5 6 0M7-4q3-5 6 0" fill="none" stroke="#af8640" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M-5 10Q1 16 7 10" fill="none" stroke="#af8640" stroke-width="2.2" stroke-linecap="round"/>
  <ellipse cx="-18" cy="7" rx="5" ry="3" fill="#eda97b" opacity=".65"/><ellipse cx="19" cy="7" rx="5" ry="3" fill="#eda97b" opacity=".65"/>
</g>
${cloud(114 + 12 * Math.sin(w), 110, 1.12)}
${cloud(310 + 8 * Math.sin(w + .9), 59, .76)}
${cloud(701 + 7 * Math.sin(w + 2), 166, .65)}
<path d="M${f(659 + 5 * Math.sin(w))} 95q8-8 16 0q8-8 16 0M${f(711 + 4 * Math.sin(w + .4))} 119q5-5 10 0q5-5 10 0" fill="none" stroke="#8eada5" stroke-width="2.2" stroke-linecap="round"/>
${terrain(330, 27, 640, time * 80, 8, '#bed5b5')}
${terrain(378, 30, 900, time * 112.5, 8, '#a4caa3')}
${backgroundTrees}
${terrain(438, 19, 1120, time * 140, 6, '#bed89f')}
<path d="M0 473Q227 447 458 476T960 466V640H0Z" fill="#c7dda7"/>
${meadow}
<path d="M723 365C767 370 855 382 845 405C831 432 687 444 629 467C571 490 711 493 793 510C864 524 925 536 960 550V640H0V531C201 502 369 515 539 492C579 486 571 463 612 447C681 418 800 412 808 398C817 386 758 378 702 372Z" fill="url(#ts61-road)"/>
<path d="M0 530C201 501 369 514 539 491C579 485 571 462 612 446C681 417 800 411 808 397" fill="none" stroke="#e5d19b" stroke-width="2" opacity=".6"/>
${roadMarks}
<ellipse cx="492" cy="578" rx="244" ry="15" fill="#708965" opacity=".18" filter="url(#ts61-shadow)"/>
<ellipse cx="311" cy="574" rx="50" ry="5" fill="#7b8c69" opacity=".18"/><ellipse cx="670" cy="574" rx="50" ry="5" fill="#7b8c69" opacity=".18"/>
<g transform="translate(0 ${f(bikeBob)})">
  ${wheel(311, 485, time * 90)}
  ${wheel(670, 485, time * 90)}
  ${leg(farHip, farPedal, true)}
  <path d="M467 483L${pt(farPedal)}" fill="none" stroke="#5e7866" stroke-width="7" stroke-linecap="round"/>
  ${foot(farPedal, true)}
  ${arm({ x: 487, y: 301 + bob }, { x: 581, y: 334 }, true, bob)}
  <path d="M228 478A84 84 0 0 1 389 452" fill="none" stroke="#729982" stroke-width="8" stroke-linecap="round"/>
  <path d="M229 476A84 84 0 0 1 389 450" fill="none" stroke="#b7d8ad" stroke-width="4" stroke-linecap="round"/>
  <path d="M312 485L467 483" fill="none" stroke="#526e56" stroke-width="14" stroke-linecap="round"/>
  <path d="M312 480L467 478" fill="none" stroke="#e3ebc9" stroke-width="1.8" opacity=".7"/>
  <path d="${frame}" fill="none" stroke="#4b8775" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${frame}" fill="none" stroke="#94cbb2" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M435 386L608 366M466 477L622 395M315 481L429 386" fill="none" stroke="#d7edcc" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>
  <path d="M670 485L631 402L616 359" fill="none" stroke="#4b8775" stroke-width="13" stroke-linecap="round"/>
  <path d="M670 485L631 402L616 359" fill="none" stroke="#9dd0b5" stroke-width="8" stroke-linecap="round"/>
  <path d="M431 390L418 365" stroke="#6c8d77" stroke-width="9" stroke-linecap="round"/>
  <path d="M431 390L418 365" stroke="#d0dfbd" stroke-width="3" stroke-linecap="round"/>
  <path d="M392 362C403 354 432 352 451 362Q456 367 446 373L400 372Q386 369 392 362Z" fill="#785e4c" stroke="#59674e" stroke-width="3"/>
  <path d="M399 361Q422 357 443 364" fill="none" stroke="#b79975" stroke-width="2" stroke-linecap="round"/>
  <path d="M616 359L606 336Q603 329 593 330H580" fill="none" stroke="#537765" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M616 357L606 334Q603 327 593 328H580" fill="none" stroke="#c5debc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M578 330H600" stroke="#485c4e" stroke-width="11" stroke-linecap="round"/>
  <path d="M602 341C633 357 635 394 616 416" fill="none" stroke="#687d60" stroke-width="2.3"/>
  <g transform="translate(467 483) rotate(${f(a * 180 / Math.PI)})"><circle r="29" fill="#7aab8c" stroke="#4f7e66" stroke-width="3"/><circle r="23" fill="#a5ccab" stroke="#d3e6c5" stroke-width="2"/>${chainRivets}<circle r="10" fill="#789b80"/><path d="M0 0H29" stroke="#e0e9ce" stroke-width="7" stroke-linecap="round"/><path d="M0-1H27" stroke="#647f69" stroke-width="2" stroke-linecap="round"/><circle r="4.5" fill="#e6edcf" stroke="#597c61" stroke-width="1.5"/></g>
  <g transform="translate(0 ${f(bob)})">
    <path d="M388 322C344 325 319 ${f(352 + tail * 3)} 275 ${f(350 + tail * 5)}C238 ${f(349 + tail * 7)} 221 ${f(334 + tail * 9)} 190 ${f(331 + tail * 10)}C214 ${f(357 + tail * 8)} 237 ${f(374 + tail * 6)} 271 ${f(375 + tail * 4)}C317 ${f(377 + tail * 2)} 353 353 393 356Z" fill="url(#ts61-body)" stroke="#526d4d" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M211 ${f(342 + tail * 9)}C250 ${f(372 + tail * 5)} 295 ${f(369 + tail * 3)} 335 351" fill="none" stroke="#d0d8a1" stroke-width="4" stroke-linecap="round" opacity=".8"/>
    <ellipse cx="317" cy="350" rx="8" ry="4.4" transform="rotate(-16 317 350)" fill="#839c66" opacity=".45"/>
    <ellipse cx="290" cy="358" rx="5.5" ry="3.4" fill="#839c66" opacity=".45"/>
    <path d="M377 301C379 271 406 260 438 269C466 277 486 292 501 315C518 338 503 357 481 368C463 380 421 375 399 366C375 356 367 326 377 301Z" fill="url(#ts61-body)" stroke="#526d4d" stroke-width="3.5"/>
    <path d="M408 337C425 320 466 324 487 343C490 355 474 368 450 369C424 370 407 357 408 337Z" fill="#d5d9a5" opacity=".74"/>
    <path d="M390 295Q406 278 427 284" fill="none" stroke="#dce1b5" stroke-width="4" stroke-linecap="round" opacity=".75"/>
    <g fill="#7f9964" opacity=".44"><ellipse cx="395" cy="306" rx="9" ry="6" transform="rotate(-26 395 306)"/><ellipse cx="415" cy="296" rx="6.5" ry="4.5"/><ellipse cx="430" cy="307" rx="7" ry="5" transform="rotate(20 430 307)"/><ellipse cx="395" cy="328" rx="5.4" ry="4"/><ellipse cx="455" cy="305" rx="5.5" ry="4.2"/></g>
    <path d="M469 322C470 296 478 280 494 264L527 270C531 302 516 326 496 337Z" fill="url(#ts61-body)" stroke="#526d4d" stroke-width="3"/>
    <path d="M494 157C477 143 460 144 451 153C433 151 423 164 425 178C411 182 406 198 412 211C401 222 404 240 415 249C413 266 424 280 439 280C447 297 465 303 480 295C496 306 517 293 521 278C535 263 537 241 528 225C531 196 519 172 494 157Z" fill="url(#ts61-frill)" stroke="#526d4d" stroke-width="3.5"/>
    <path d="M486 168C471 157 459 157 451 167C438 165 432 178 437 187C422 191 419 204 428 215C417 226 422 237 433 242C428 257 440 270 452 266C458 285 476 289 486 277C503 288 516 274 513 260C525 242 519 211 510 194Z" fill="#a5bd88" stroke="#d7dfae" stroke-width="3.2"/>
    <g fill="none" stroke="#c5d49e" stroke-width="2.6" stroke-linecap="round" opacity=".78"><path d="M482 229L455 177M480 237L435 199M479 246L432 230M485 253L447 259M492 257L479 276"/></g>
    <path d="M496 176C516 164 549 167 564 185C577 201 578 215 602 221C617 221 630 232 630 247C632 262 617 275 599 279C579 287 561 282 545 289C525 300 505 289 491 272C475 253 473 227 479 208C483 195 485 183 496 176Z" fill="url(#ts61-body)" stroke="#526d4d" stroke-width="3.5"/>
    <path d="M523 269C548 279 568 272 584 274C570 284 553 286 544 289C533 290 526 285 523 269Z" fill="#d2d8a6" opacity=".72"/>
    <g fill="#809c68" opacity=".44"><ellipse cx="492" cy="212" rx="5.5" ry="8" transform="rotate(-16 492 212)"/><ellipse cx="501" cy="196" rx="5" ry="4"/><ellipse cx="503" cy="230" rx="6" ry="4.5"/><ellipse cx="516" cy="204" rx="3.6" ry="3"/></g>
    <path d="M477 173L516 270L546 250L549 173" fill="none" stroke="#477f70" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M515 267L522 273L529 267" fill="none" stroke="#eddec0" stroke-width="5" stroke-linecap="round"/>
    <path d="M466 174C460 155 472 129 493 119C514 108 538 124 547 144C552 155 552 168 546 176C522 187 487 186 466 174Z" fill="url(#ts61-helmet)" stroke="#396e64" stroke-width="3.5"/>
    <path d="M477 151C483 133 501 120 517 126" fill="none" stroke="#b3ddd0" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    <path d="M480 155L487 142M502 144L507 130M525 147L521 134M538 161L533 151" fill="none" stroke="#2b7f75" stroke-width="7" stroke-linecap="round"/>
    <path d="M465 174C488 185 520 188 547 175" fill="none" stroke="#2e6d65" stroke-width="7" stroke-linecap="round"/>
    <path d="M469 174C491 183 520 183 543 175" fill="none" stroke="#86c7b5" stroke-width="2" stroke-linecap="round"/>
    <path d="M531 196C535 174 546 147 558 134C560 153 552 179 551 198Q541 205 531 196Z" fill="url(#ts61-horn)" stroke="#64734f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M542 192C543 172 549 153 554 143" fill="none" stroke="#fff9e2" stroke-width="2" stroke-linecap="round"/>
    <path d="M557 201C561 184 582 157 600 141C597 165 585 190 575 211Q564 211 557 201Z" fill="url(#ts61-horn)" stroke="#64734f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M566 202C573 181 586 160 596 148" fill="none" stroke="#fffbed" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M599 236C599 223 610 204 622 192C624 208 618 229 614 242Q605 244 599 236Z" fill="url(#ts61-horn)" stroke="#64734f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M605 234L619 200" stroke="#fff8e0" stroke-width="2" stroke-linecap="round"/>
    <path d="M550 210Q560 203 571 211" fill="none" stroke="#688454" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="561" cy="228" rx="11.5" ry="14" fill="#fff9df" stroke="#5a744e" stroke-width="2.3"/>
    <ellipse cx="565" cy="230" rx="6.5" ry="9" fill="#3d5142"/>
    <circle cx="567" cy="226" r="2.8" fill="#fffef1"/>
    <circle cx="560" cy="233" r="1.3" fill="#c8d9bb"/>
    <ellipse cx="557" cy="252" rx="13.5" ry="7.5" fill="#d89979" opacity=".36"/>
    <path d="M610 244C623 241 636 249 639 257L624 260C630 267 625 277 616 279C603 274 600 258 610 244Z" fill="#eee0aa" stroke="#66744f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M618 248Q627 248 631 253" fill="none" stroke="#fff4cc" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="612" cy="247" rx="3.5" ry="2.6" fill="#6e8054" transform="rotate(-14 612 247)"/>
    <path d="M572 263Q589 275 609 263" fill="none" stroke="#60764e" stroke-width="2.7" stroke-linecap="round"/>
    <path d="M571 260L573 266" stroke="#60764e" stroke-width="2" stroke-linecap="round"/>
    <path d="M493 298C470 ${f(278 + flutter * 3)} 447 ${f(282 + flutter2 * 5)} 411 ${f(266 + flutter * 7)}L421 ${f(282 + flutter * 7)}L414 ${f(292 + flutter * 6)}C446 ${f(302 + flutter2 * 5)} 466 ${f(287 + flutter * 3)} 493 309Z" fill="#df7966" stroke="#b75d50" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M488 304C461 ${f(303 + flutter2 * 3)} 449 ${f(315 + flutter * 4)} 423 ${f(309 + flutter2 * 7)}L429 ${f(321 + flutter2 * 7)}L424 ${f(330 + flutter2 * 7)}C450 ${f(333 + flutter * 4)} 472 ${f(319 + flutter2 * 3)} 497 314Z" fill="#e58a73" stroke="#b75d50" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M433 ${f(286 + flutter * 5)}C455 ${f(296 + flutter2 * 4)} 470 287 487 304M438 ${f(320 + flutter2 * 6)}Q462 ${f(322 + flutter * 4)} 485 310" fill="none" stroke="#f5b194" stroke-width="2.8" stroke-linecap="round" opacity=".65"/>
    <path d="M482 281Q504 295 526 277L533 290C519 309 500 313 479 298Z" fill="#eb8a74" stroke="#b75d50" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M486 286Q505 299 523 286" fill="none" stroke="#f7bea2" stroke-width="3" stroke-linecap="round"/>
    <path d="M487 295Q500 289 503 302Q503 314 490 315Q480 306 487 295Z" fill="#d97260" stroke="#b75d50" stroke-width="2.3"/>
    <path d="M488 299Q494 296 498 300" fill="none" stroke="#f2a38c" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  ${leg(nearHip, nearPedal, false)}
  <g transform="translate(0 ${f(bob)})"><path d="M406 338C411 323 430 316 443 326C453 333 455 343 449 353" fill="url(#ts61-body)"/><path d="M409 338Q415 322 431 326" fill="none" stroke="#cdd6a2" stroke-width="3.5" stroke-linecap="round" opacity=".7"/><ellipse cx="425" cy="340" rx="6" ry="4" fill="#7e9965" opacity=".35"/></g>
  ${foot(nearPedal, false)}
  ${arm({ x: 494, y: 310 + bob }, { x: 590, y: 337 }, false, bob)}
  <path d="M621 345H662M634 372L656 374" fill="none" stroke="#567d65" stroke-width="4" stroke-linecap="round"/>
  <g transform="rotate(${f(bouquetWave)} 690 347)">
    <g fill="none" stroke="#6f9365" stroke-width="2.5" stroke-linecap="round"><path d="M684 350Q671 322 665 292M687 352Q689 321 697 285M697 351Q712 323 722 306M692 351Q685 330 681 310M681 350Q662 327 650 319M700 354Q706 332 711 324"/></g>
    <g fill="#82a374"><path d="M678 331Q655 332 653 315Q672 314 678 331M692 317Q710 315 709 300Q694 298 692 317M704 335Q725 336 726 322Q711 321 704 335M679 337Q676 322 687 320Q693 331 679 337M665 326Q652 330 648 339Q662 344 665 326"/></g>
    ${blossom(665, 292, 9, '#fff8df', 6, 12)}
    ${blossom(697, 285, 7.5, '#dda59e', 5, 18)}
    ${blossom(722, 306, 7, '#a9a4c2', 5, 0)}
    ${blossom(681, 310, 7, '#f5d778', 6, 13)}
    ${blossom(650, 319, 5.8, '#ee9c86', 5, 14)}
    ${blossom(711, 324, 6, '#fff8dc', 5, 0)}
    <path d="M665 292l-3-6M697 285l-2-5" stroke="#fff4d4" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
  </g>
  <path d="M648 344H733L722 396Q689 408 659 396Z" fill="url(#ts61-basket)" stroke="#977654" stroke-width="3" stroke-linejoin="round"/>
  <g clip-path="url(#ts61-basket-clip)">
    <g fill="none" stroke="#b18b5f" stroke-width="2.4" opacity=".8"><path d="M644 356Q690 365 739 356M647 369Q691 378 736 369M650 382Q692 391 733 381M656 395Q689 403 728 394M660 342L672 405M674 342L682 408M690 342V411M706 342L701 408M722 342L713 406"/></g>
    <g fill="none" stroke="#f6dfb4" stroke-width="1.4" opacity=".7"><path d="M646 353Q690 362 738 353M649 366Q691 375 735 366M652 379Q692 388 732 378M658 392Q689 400 726 391M663 342L675 405M678 342L685 408M694 342V411M710 342L704 408M726 342L716 406"/></g>
  </g>
  <path d="M647 344Q690 350 734 344" fill="none" stroke="#987552" stroke-width="8" stroke-linecap="round"/>
  <path d="M647 342Q690 348 734 342" fill="none" stroke="#edcc95" stroke-width="5" stroke-linecap="round"/>
  <path d="M663 344V364Q663 369 668 369H673Q678 369 678 364V346M710 346V365Q710 370 715 370H720Q725 370 725 365V344" fill="none" stroke="#a47c56" stroke-width="4"/>
  <path d="M670 357V361M717 357V361" stroke="#f2dfb7" stroke-width="2.3" stroke-linecap="round"/>
  <circle cx="670" cy="361" r="2" fill="#8a6c4f"/><circle cx="717" cy="361" r="2" fill="#8a6c4f"/>
</g>
${foreground}
<rect width="960" height="640" fill="url(#ts61-paper)" opacity=".065" pointer-events="none"/>
</svg>`;
}

module.exports = { renderScene };
