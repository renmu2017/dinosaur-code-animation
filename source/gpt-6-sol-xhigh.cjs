function renderScene(t) {
  const q = (t % 8) / 8;
  const tau = Math.PI * 2;
  const fmt = v => Number(v.toFixed(2));
  const bikeAngle = 1440 * q;
  const pedalAngle = tau * 2 * q;
  const bob = 2.4 * Math.sin(tau * 4 * q);
  const tailAngle = 3.5 * Math.sin(tau * 2 * q - 0.5);
  const scarfWave = Math.sin(tau * 3 * q);
  const breeze = 5 * Math.sin(tau * q);

  const pt = (a, radius = 36) => ({
    x: 500 + radius * Math.cos(a),
    y: 486 + radius * Math.sin(a)
  });
  const nearPedal = pt(pedalAngle);
  const farPedal = pt(pedalAngle + Math.PI);

  function leg(hipX, hipY, foot, color, light, width) {
    const dx = foot.x - hipX;
    const dy = foot.y - hipY;
    const distance = Math.hypot(dx, dy);
    const reach = 86;
    const lift = Math.sqrt(Math.max(0, reach * reach - distance * distance / 4));
    const kneeX = (hipX + foot.x) / 2 + dy / distance * lift;
    const kneeY = (hipY + foot.y) / 2 - dx / distance * lift;
    const d = `M ${fmt(hipX)} ${fmt(hipY)} Q ${fmt(kneeX - 9)} ${fmt(kneeY - 9)} ${fmt(kneeX)} ${fmt(kneeY)} Q ${fmt(kneeX + 8)} ${fmt(kneeY + 24)} ${fmt(foot.x)} ${fmt(foot.y - 5)}`;
    return `<path d="${d}" fill="none" stroke="#426961" stroke-width="${width + 4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/><path d="M ${fmt(kneeX - 7)} ${fmt(kneeY + 1)} q 8 -5 16 1" fill="none" stroke="${light}" stroke-width="3" stroke-linecap="round"/><ellipse cx="${fmt(foot.x + 7)}" cy="${fmt(foot.y - 3)}" rx="18" ry="10" transform="rotate(-8 ${fmt(foot.x + 7)} ${fmt(foot.y - 3)})" fill="${color}" stroke="#426961" stroke-width="3"/><path d="M ${fmt(foot.x + 14)} ${fmt(foot.y - 8)} l 7 1 M ${fmt(foot.x + 13)} ${fmt(foot.y - 2)} l 8 2" stroke="#e9e6c8" stroke-width="2.7" stroke-linecap="round"/>`;
  }

  function wheel(cx, cy) {
    const spokes = Array.from({ length: 16 }, (_, i) => {
      const a = tau * i / 16;
      return `<line x1="${fmt(12 * Math.cos(a))}" y1="${fmt(12 * Math.sin(a))}" x2="${fmt(75 * Math.cos(a))}" y2="${fmt(75 * Math.sin(a))}"/>`;
    }).join('');
    return `<g transform="translate(${cx} ${cy})"><circle r="83" fill="#f5efd9" stroke="#3d655f" stroke-width="10"/><circle r="76" fill="none" stroke="#a1c9af" stroke-width="4"/><g transform="rotate(${fmt(bikeAngle)})" stroke="#8eae9f" stroke-width="2" stroke-linecap="round">${spokes}<circle r="72" fill="none" stroke="#bbccaf" stroke-width="2"/></g><circle r="11" fill="#e7a877" stroke="#3d655f" stroke-width="3"/><circle r="4" fill="#fff5da"/></g>`;
  }

  function flower(x, y, scale, petal, phase = 0) {
    const sway = 3 * Math.sin(tau * q + phase);
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M 0 18 Q ${fmt(sway)} 5 0 -12" fill="none" stroke="#597d67" stroke-width="3" stroke-linecap="round"/><path d="M 1 5 q 9 -8 14 -5 q -7 6 -13 7 M -1 10 q -10 -8 -14 -5 q 6 7 14 7" fill="#779c70"/><g transform="translate(${fmt(sway)} -14)" fill="${petal}"><ellipse cx="0" cy="-8" rx="5" ry="8"/><ellipse cx="8" cy="0" rx="8" ry="5"/><ellipse cx="0" cy="8" rx="5" ry="8"/><ellipse cx="-8" cy="0" rx="8" ry="5"/></g><circle cx="${fmt(sway)}" cy="-14" r="4" fill="#f2b75d"/></g>`;
  }

  const cloudShift = 7 * Math.sin(tau * q);
  const hillShift = 7 * Math.sin(tau * q + 0.5);
  const fieldShift = 12 * Math.sin(tau * q + 1.6);
  const sunRays = Array.from({ length: 12 }, (_, i) => {
    const a = tau * i / 12;
    return `<line x1="${fmt(69 * Math.cos(a))}" y1="${fmt(69 * Math.sin(a))}" x2="${fmt(82 * Math.cos(a))}" y2="${fmt(82 * Math.sin(a))}"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" width="960" height="640">
<defs>
  <linearGradient id="g6sky" x2="0" y2="1"><stop stop-color="#a8d8e3"/><stop offset="1" stop-color="#e6f0d5"/></linearGradient>
  <linearGradient id="g6path" x2="0" y2="1"><stop stop-color="#f6deb1"/><stop offset="1" stop-color="#eebf9a"/></linearGradient>
  <linearGradient id="g6mint" x2="0" y2="1"><stop stop-color="#a9e5c4"/><stop offset="1" stop-color="#74bfa9"/></linearGradient>
  <linearGradient id="g6body" x1="0" x2="1" y2="1"><stop stop-color="#a8c49a"/><stop offset="1" stop-color="#82a98d"/></linearGradient>
  <clipPath id="g6bodyclip"><path d="M 410 311 C 414 279 449 267 486 275 C 516 276 543 296 555 320 C 566 351 548 383 511 391 C 473 403 436 386 417 358 C 409 344 406 327 410 311 Z"/></clipPath>
</defs>
<path fill="url(#g6sky)" d="M0 0H960V640H0Z"/>
<g transform="translate(790 105)" fill="none" stroke="#ffe2a0" stroke-width="4" stroke-linecap="round">${sunRays}</g>
<circle cx="790" cy="105" r="54" fill="#ffe7ac"/><circle cx="790" cy="105" r="43" fill="#ffefc5" opacity=".72"/>
<g transform="translate(${fmt(cloudShift)} 0)" fill="#f8f8e9" opacity=".91">
  <path d="M 90 130 C 80 111 96 96 115 100 C 123 78 157 78 169 103 C 190 97 205 113 199 130 Z"/>
  <path d="M 304 92 C 300 76 312 65 327 69 C 337 51 362 52 373 70 C 392 68 404 80 401 92 Z" opacity=".78"/>
  <path d="M 685 177 C 676 161 691 145 708 149 C 720 130 743 133 752 151 C 769 147 780 161 777 177 Z" opacity=".8"/>
</g>
<path d="M0 350 C150 279 251 295 373 348 C495 285 609 292 755 345 C840 306 899 314 960 337 V640 H0Z" fill="#bdd6b2" transform="translate(${fmt(hillShift)} 0)"/>
<path d="M0 394 C152 353 271 369 385 399 C515 342 646 357 748 392 C850 354 907 363 960 373 V640 H0Z" fill="#9dbf9b" transform="translate(${fmt(fieldShift)} 0)"/>
<path d="M0 441 C136 407 256 427 360 446 C536 401 700 419 833 453 C894 437 932 431 960 436 V640 H0Z" fill="#82ad8a"/>
<path d="M0 474 C180 448 286 452 404 473 C557 439 738 454 960 486 V640 H0Z" fill="#6e9d7d"/>
<g fill="none" stroke="#e7e8bb" opacity=".7" stroke-linecap="round">
  <path d="M15 422 C123 391 224 404 304 419" stroke-width="3"/>
  <path d="M706 420 C800 397 881 399 962 416" stroke-width="3"/>
  <path d="M96 472 C172 451 236 453 284 461" stroke-width="2"/>
</g>
<path d="M-10 592 C172 525 308 532 449 557 C599 580 770 548 970 492 L970 650 H-10Z" fill="url(#g6path)"/>
<path d="M0 586 C154 531 309 532 449 557 C603 578 785 541 960 493" fill="none" stroke="#fff1d1" stroke-width="7" opacity=".85"/>
<path d="M0 626 C176 571 284 574 438 601 C624 633 778 579 960 535" fill="none" stroke="#dba98d" stroke-width="3" opacity=".43"/>
<path d="M0 559 C161 506 296 513 411 530" fill="none" stroke="#568d77" stroke-width="4" opacity=".38"/>
<g fill="#f4e0ab" opacity=".7"><ellipse cx="120" cy="583" rx="13" ry="3"/><ellipse cx="196" cy="613" rx="8" ry="3"/><ellipse cx="802" cy="598" rx="15" ry="3"/><ellipse cx="874" cy="548" rx="9" ry="3"/></g>
<g fill="none" stroke="#557f68" stroke-width="3" stroke-linecap="round" opacity=".75">
  <path d="M65 494 l-5 -9 m5 9 l5 -12 m-5 12 l-12 -5"/><path d="M155 478 l-6 -10 m6 10 l9 -11 m-9 11 l-10 -3"/>
  <path d="M832 479 l-5 -9 m5 9 l7 -11 m-7 11 l-12 -3"/><path d="M903 456 l-5 -8 m5 8 l9 -10 m-9 10 l-11 -3"/>
</g>
${flower(96, 502, 0.9, '#f5e9d4', 0.6)}${flower(171, 494, 0.65, '#f2b9aa', 2.2)}${flower(839, 482, 0.8, '#f9e4a2', 1.5)}${flower(899, 469, 0.6, '#eac1c2', 2.9)}
<g opacity=".22" fill="#58705e"><ellipse cx="351" cy="577" rx="92" ry="10"/><ellipse cx="654" cy="577" rx="92" ry="10"/><ellipse cx="511" cy="559" rx="157" ry="9"/></g>
${wheel(350, 494)}${wheel(655, 494)}
<g fill="none" stroke="#426a64" stroke-width="17" stroke-linecap="round" stroke-linejoin="round">
  <path d="M350 494 L452 410 L500 486 Z M452 410 L607 411 L500 486 M607 411 L655 494"/>
</g>
<g fill="none" stroke="url(#g6mint)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
  <path d="M350 494 L452 410 L500 486 Z M452 410 L607 411 L500 486 M607 411 L655 494"/>
</g>
<path d="M439 398 L452 410 L471 369" fill="none" stroke="#426a64" stroke-width="8" stroke-linecap="round"/>
<path d="M440 398 L452 410 L471 369" fill="none" stroke="#a4dec0" stroke-width="4" stroke-linecap="round"/>
<path d="M412 399 Q446 389 474 400 Q474 411 458 413 L428 412 Q413 412 412 399Z" fill="#567e73" stroke="#3c625e" stroke-width="3"/>
<path d="M608 412 L628 372 L664 372" fill="none" stroke="#3d655f" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M608 412 L628 372 L664 372" fill="none" stroke="#a8dcc0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M658 372 L676 371" stroke="#3d655f" stroke-width="11" stroke-linecap="round"/>
<path d="M658 372 L676 371" stroke="#edb58b" stroke-width="6" stroke-linecap="round"/>
<circle cx="500" cy="486" r="24" fill="#f4eacb" stroke="#3d655f" stroke-width="5"/>
<circle cx="500" cy="486" r="13" fill="#a1d9b7" stroke="#3d655f" stroke-width="3"/>
<g fill="none" stroke="#3e665f" stroke-width="7" stroke-linecap="round"><path d="M500 486 L${fmt(nearPedal.x)} ${fmt(nearPedal.y)}"/><path d="M500 486 L${fmt(farPedal.x)} ${fmt(farPedal.y)}"/></g>
<g fill="#e7b68a" stroke="#3d655f" stroke-width="3"><rect x="${fmt(nearPedal.x - 19)}" y="${fmt(nearPedal.y - 3)}" width="39" height="7" rx="3"/><rect x="${fmt(farPedal.x - 19)}" y="${fmt(farPedal.y - 3)}" width="39" height="7" rx="3"/></g>
${leg(459, 354 + bob, farPedal, '#789d84', '#a8c79b', 17)}
<g transform="rotate(${fmt(tailAngle)} 437 ${fmt(334 + bob)})">
  <path d="M440 ${fmt(322 + bob)} C397 ${fmt(293 + bob)} 360 ${fmt(305 + bob)} 295 ${fmt(274 + bob)} C316 ${fmt(312 + bob)} 353 ${fmt(352 + bob)} 429 ${fmt(357 + bob)} Z" fill="#8aaf8b" stroke="#426961" stroke-width="4" stroke-linejoin="round"/>
  <path d="M322 ${fmt(296 + bob)} C356 ${fmt(325 + bob)} 390 ${fmt(326 + bob)} 425 ${fmt(337 + bob)}" fill="none" stroke="#b5cda1" stroke-width="7" stroke-linecap="round" opacity=".8"/>
  <path d="M356 ${fmt(313 + bob)} l-7 -10 M386 ${fmt(321 + bob)} l-8 -11" stroke="#6f9d7b" stroke-width="5" stroke-linecap="round"/>
</g>
<g transform="translate(0 ${fmt(bob)})">
  <path d="M410 311 C414 279 449 267 486 275 C516 276 543 296 555 320 C566 351 548 383 511 391 C473 403 436 386 417 358 C409 344 406 327 410 311Z" fill="url(#g6body)" stroke="#426961" stroke-width="4"/>
  <g clip-path="url(#g6bodyclip)" fill="#6d9a7a" opacity=".67"><ellipse cx="444" cy="292" rx="8" ry="5" transform="rotate(-28 444 292)"/><ellipse cx="471" cy="287" rx="9" ry="5" transform="rotate(18 471 287)"/><ellipse cx="498" cy="296" rx="8" ry="5" transform="rotate(26 498 296)"/><ellipse cx="435" cy="313" rx="7" ry="4"/><ellipse cx="522" cy="313" rx="6" ry="4"/></g>
  <path d="M429 347 C448 361 465 373 495 374 C517 375 536 367 548 354 C537 381 509 393 478 391 C455 389 438 373 429 347Z" fill="#c6d5aa" opacity=".78"/>
  <path d="M436 367 q 8 5 16 5" fill="none" stroke="#6e997b" stroke-width="3" stroke-linecap="round"/>
  <path d="M531 318 C550 309 564 322 572 335 C585 350 613 361 636 373" fill="none" stroke="#426961" stroke-width="23" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M531 318 C550 309 564 322 572 335 C585 350 613 361 636 373" fill="none" stroke="#83a98c" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M536 308 C527 276 531 242 546 218 C534 199 550 178 569 182 C576 165 600 161 611 180 C631 164 654 176 656 196 C679 200 685 220 672 237 C683 258 666 277 648 279 C641 305 619 318 595 310 C567 317 548 300 536 278Z" fill="#97b796" stroke="#426961" stroke-width="4" stroke-linejoin="round"/>
  <path d="M544 253 C543 231 558 214 574 209 M553 287 C563 303 580 308 592 302 M634 296 C651 289 659 273 656 261" fill="none" stroke="#c6d5ac" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  <path d="M566 251 C571 228 593 215 624 223 C647 227 663 242 668 263 C670 273 666 280 661 285 C674 286 687 292 690 304 C692 320 678 331 661 329 C648 327 643 323 634 319 C620 328 597 326 583 314 C567 300 561 272 566 251Z" fill="#a8c59d" stroke="#426961" stroke-width="4"/>
  <path d="M636 292 C651 287 672 292 684 302 C681 317 667 322 649 315 C642 312 638 303 636 292Z" fill="#c9d7ad"/>
  <path d="M682 304 Q695 310 691 319 Q683 330 666 325 Q678 320 682 304Z" fill="#eed9b3" stroke="#426961" stroke-width="3"/>
  <path d="M645 315 Q658 323 671 318" fill="none" stroke="#567e70" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M559 222 C568 184 602 169 625 177 C644 180 653 198 653 216 C622 207 591 209 559 235Z" fill="#2c8888" stroke="#315e60" stroke-width="4"/>
  <path d="M563 215 C578 206 617 202 649 213 L652 221 C613 213 587 219 558 236Z" fill="#56aaa4" stroke="#315e60" stroke-width="3"/>
  <path d="M578 202 q 6 -14 19 -16 M607 187 q 12 -3 20 7" fill="none" stroke="#8bc8b9" stroke-width="5" stroke-linecap="round"/>
  <path d="M584 229 L596 172 Q600 161 608 170 L610 225Z" fill="#efe4c5" stroke="#426961" stroke-width="3" stroke-linejoin="round"/>
  <path d="M618 228 L645 174 Q650 165 657 175 L645 235Z" fill="#fff0cd" stroke="#426961" stroke-width="3" stroke-linejoin="round"/>
  <path d="M667 272 L702 250 Q711 245 711 255 L685 284Z" fill="#f6e7c6" stroke="#426961" stroke-width="3" stroke-linejoin="round"/>
  <path d="M593 268 Q606 254 622 263" fill="none" stroke="#698f79" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="620" cy="270" rx="13" ry="15" fill="#f9f1d7"/><ellipse cx="623" cy="271" rx="6.5" ry="9" fill="#344c46"/><circle cx="626" cy="267" r="3" fill="#fff9e9"/>
  <path d="M606 250 Q622 241 635 249" fill="none" stroke="#527765" stroke-width="3" stroke-linecap="round"/>
  <circle cx="666" cy="293" r="3.3" fill="#557b68"/><ellipse cx="609" cy="297" rx="14" ry="7" fill="#d5978e" opacity=".45"/>
  <path d="M548 303 Q538 291 526 300 Q521 311 536 319 L548 325" fill="#db6f68" stroke="#794d51" stroke-width="3"/>
  <path d="M542 315 Q508 ${fmt(315 + 5 * scarfWave)} 478 ${fmt(334 + 7 * scarfWave)} Q501 ${fmt(343 + 4 * scarfWave)} 533 336 L553 324Z" fill="#e5776d" stroke="#794d51" stroke-width="3"/>
  <path d="M486 ${fmt(331 + 7 * scarfWave)} l-10 ${fmt(12 + 2 * scarfWave)} M496 ${fmt(332 + 6 * scarfWave)} l-8 12 M505 ${fmt(332 + 5 * scarfWave)} l-7 12" fill="none" stroke="#f5b095" stroke-width="2" stroke-linecap="round"/>
</g>
${leg(477, 356 + bob, nearPedal, '#96b795', '#c5d8ac', 22)}
<g>
  <path d="M537 ${fmt(326 + bob)} C555 ${fmt(324 + bob)} 569 ${fmt(339 + bob)} 586 ${fmt(349 + bob)} L635 373" fill="none" stroke="#426961" stroke-width="23" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M537 ${fmt(326 + bob)} C555 ${fmt(324 + bob)} 569 ${fmt(339 + bob)} 586 ${fmt(349 + bob)} L635 373" fill="none" stroke="#9abb96" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="638" cy="373" rx="15" ry="10" transform="rotate(-10 638 373)" fill="#9abb96" stroke="#426961" stroke-width="3"/>
  <path d="M645 368 l5 5 M641 367 l5 6" stroke="#d4dec1" stroke-width="2" stroke-linecap="round"/>
</g>
<g>
  <path d="M674 372 Q683 386 692 390" fill="none" stroke="#426961" stroke-width="6" stroke-linecap="round"/>
  <path d="M687 384 Q729 368 780 384 L773 436 Q736 453 699 435Z" fill="#c88f62" stroke="#754f47" stroke-width="4" stroke-linejoin="round"/>
  <path d="M696 389 Q730 379 773 390" fill="none" stroke="#f1c398" stroke-width="5" stroke-linecap="round"/>
  <path d="M701 404 Q738 415 778 405 M701 420 Q736 433 776 420" fill="none" stroke="#a76e56" stroke-width="3" opacity=".75"/>
  <path d="M711 389 L718 440 M731 385 L735 446 M753 386 L752 444 M767 389 L765 439" fill="none" stroke="#e5b187" stroke-width="3" opacity=".82"/>
  <path d="M694 385 Q699 378 707 377 L777 379 Q784 382 780 391 Q739 383 696 393Z" fill="#e8b789" stroke="#754f47" stroke-width="3"/>
  <g stroke="#5b896b" stroke-width="3" fill="none" stroke-linecap="round"><path d="M715 387 Q705 361 703 352"/><path d="M733 384 Q733 350 725 340"/><path d="M750 385 Q757 357 766 349"/><path d="M764 385 Q779 363 785 360"/><path d="M743 385 Q744 366 740 354"/></g>
  <g fill="#77a478"><path d="M714 372 q-10 -9 -16 -3 q5 8 15 7 M732 362 q-12 -8 -15 -2 q5 8 17 7 M751 372 q9 -10 16 -4 q-7 8 -17 9 M770 370 q8 -8 14 -3 q-5 7 -14 7"/></g>
  ${flower(704, 351, 0.62, '#f7eee0', 0.3)}${flower(726, 339, 0.7, '#f2aa9e', 1.1)}${flower(767, 350, 0.68, '#faf0bd', 2)}${flower(786, 360, 0.5, '#e6c6d0', 3)}${flower(740, 356, 0.53, '#f4cf94', 1.7)}
</g>
<g fill="#f7e9bc" opacity=".85"><circle cx="223" cy="451" r="2"/><circle cx="268" cy="432" r="2"/><circle cx="825" cy="426" r="2"/><circle cx="888" cy="407" r="2"/></g>
<path d="M19 20 H941 V620 H19Z" fill="none" stroke="#f9efdc" stroke-width="3" opacity=".38"/>
</svg>`;
}

module.exports = { renderScene };
