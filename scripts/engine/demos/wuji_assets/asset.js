// 静态资产。原创线描。走兽轮廓对照故宫院刊 2014 年第 2 期图一、图二，
// 以及故宫《太和殿》图库「太和殿脊兽」。照片不进这两张屋顶板。
// 正吻没有可用近景，按词条「大吻吞正脊」和官式卷尾、剑把来画，不把远景当近景。
(() => {
const INK = '#1C1914';
const PAPER = '#F3E6C4';
const GOLD = '#E2B33A';
const GOLD_D = '#A36B22';
const GLAZE = '#F4D78A';
const VERM = '#8E2E28';
const GREEN = '#2E7D4F';

const FL = { x: -8.2, y: 5.6, z: 0 };
const FR = { x: 7.6, y: 5.6, z: 0 };
const BL = { x: -11.4, y: -3.4, z: 0 };
const ridgeL = { x: -3.2, y: 0.9, z: 2.45 };
const ridgeR = { x: 4.4, y: 0.9, z: 2.45 };

const QUEUE = [
  ['xian', 0.05], ['dragon', 0.14], ['phoenix', 0.23], ['lion', 0.32],
  ['tianma', 0.40], ['haima', 0.48], ['suanni', 0.56], ['yayu', 0.64],
  ['xiezhi', 0.72], ['douniu', 0.80], ['xingshi', 0.86], ['chuishou', 0.94],
];

function lerp(a, b, t) { return a + (b - a) * t; }
function viewOf(mode) {
  if (mode === 'close') return { ox: 2140, oy: 700, s: 160, zs: 118 };
  return { ox: 1120, oy: 760, s: 62, zs: 78 };
}
function P(v, x, y, z) {
  return { x: v.ox + x * v.s - y * v.s * 0.55, y: v.oy + y * v.s * 0.34 - z * v.zs };
}
function hipAt(u) {
  return {
    x: lerp(FL.x, ridgeL.x, u),
    y: lerp(FL.y, ridgeL.y, u),
    z: lerp(FL.z, ridgeL.z, u) + 0.28,
  };
}
function poly(c, pts, fill, stroke, w) {
  c.beginPath();
  pts.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 2; c.lineJoin = 'round'; c.stroke(); }
}
function ink(c, w) {
  c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = w || 3.2;
  c.lineJoin = 'round'; c.lineCap = 'round';
}
function gold(c) { c.fillStyle = GOLD; c.strokeStyle = INK; c.lineWidth = 3.4; c.lineJoin = 'round'; }
function paint(c) { c.fill(); c.stroke(); }

function beast(c, kind) {
  gold(c);
  if (kind === 'xian') return drawXian(c);
  if (kind === 'dragon') return drawDragon(c);
  if (kind === 'phoenix') return drawPhoenix(c);
  if (kind === 'lion') return drawLion(c);
  if (kind === 'tianma') return drawHorse(c, false);
  if (kind === 'haima') return drawHorse(c, true);
  if (kind === 'suanni') return drawSuanni(c);
  if (kind === 'yayu') return drawYayu(c);
  if (kind === 'xiezhi') return drawXiezhi(c);
  if (kind === 'douniu') return drawDouniu(c);
  if (kind === 'xingshi') return drawXingshi(c);
  if (kind === 'chuishou') return drawChuishou(c);
}

function seat(c) {
  c.beginPath(); c.ellipse(2, -2, 28, 8, 0, 0, 7); c.fillStyle = GOLD_D; c.fill(); c.stroke();
  gold(c);
  c.beginPath(); c.ellipse(10, -28, 22, 24, 0, 0, 7); paint(c);
  c.beginPath();
  c.moveTo(-6, -18); c.lineTo(-16, -2); c.lineTo(-4, 2); c.lineTo(2, -16); c.closePath(); paint(c);
  c.beginPath();
  c.moveTo(18, -16); c.lineTo(26, 0); c.lineTo(12, 3); c.lineTo(8, -14); c.closePath(); paint(c);
}

function drawDragon(c) {
  seat(c);
  gold(c);
  c.beginPath();
  c.moveTo(2, -40);
  c.lineTo(-4, -62);
  c.lineTo(-36, -70);
  c.lineTo(-62, -58);
  c.lineTo(-48, -46);
  c.lineTo(-8, -42);
  c.closePath();
  paint(c);
  c.beginPath(); c.moveTo(-28, -52); c.lineTo(-58, -40); c.lineTo(-36, -38); c.stroke();
  ink(c, 5);
  c.beginPath(); c.moveTo(-20, -68); c.quadraticCurveTo(-8, -96, 8, -72); c.stroke();
  c.beginPath(); c.moveTo(-8, -64); c.quadraticCurveTo(10, -88, 18, -60); c.stroke();
  ink(c, 2.4); c.beginPath(); c.arc(-40, -58, 2.6, 0, 7); c.stroke();
}

function drawPhoenix(c) {
  gold(c);
  c.beginPath(); c.ellipse(4, -2, 26, 8, 0, 0, 7); c.fillStyle = GOLD_D; c.fill(); c.stroke();
  gold(c);
  c.beginPath(); c.ellipse(4, -26, 20, 18, 0, 0, 7); paint(c);
  c.beginPath();
  c.moveTo(-4, -36); c.quadraticCurveTo(-36, -58, -68, -34); c.lineTo(-78, -22); c.lineTo(-48, -28); c.closePath();
  paint(c);
  ink(c, 4);
  c.beginPath();
  c.moveTo(-18, -48); c.lineTo(-28, -86); c.lineTo(-8, -50);
  c.moveTo(-8, -46); c.lineTo(-2, -82);
  c.stroke();
  gold(c);
  c.beginPath(); c.moveTo(2, -34); c.quadraticCurveTo(28, -62, 22, -24); c.closePath(); paint(c);
  c.beginPath(); c.moveTo(12, -16); c.quadraticCurveTo(46, -30, 50, -4); c.quadraticCurveTo(28, -8, 14, -6); c.closePath(); paint(c);
}

function drawLion(c) {
  gold(c);
  c.beginPath(); c.ellipse(10, -2, 22, 8, 0, 0, 7); c.fillStyle = GOLD_D; c.fill(); c.stroke();
  gold(c);
  c.beginPath(); c.ellipse(16, -24, 15, 16, 0, 0, 7); paint(c);
  for (let i = 0; i < 8; i++) {
    const a = -0.6 + i * 0.42;
    c.beginPath();
    c.arc(-6 + Math.cos(a) * 24, -58 + Math.sin(a) * 20, 8, 0, 7);
    paint(c);
  }
  c.beginPath(); c.ellipse(-8, -56, 11, 9, 0, 0, 7); c.fillStyle = GLAZE; paint(c);
  ink(c, 2.6);
  c.beginPath(); c.arc(-12, -58, 2, 0, 7); c.stroke();
  c.beginPath(); c.moveTo(-18, -50); c.lineTo(-30, -48); c.lineTo(-18, -44); c.stroke();
}

function drawHorse(c, sea) {
  seat(c);
  gold(c);
  c.beginPath();
  c.moveTo(0, -48);
  c.lineTo(-8, -70);
  c.lineTo(-58, -78);
  c.lineTo(-82, -64);
  c.lineTo(-52, -58);
  c.lineTo(-4, -44);
  c.closePath();
  paint(c);
  ink(c, 3.4);
  c.beginPath(); c.moveTo(-18, -70); c.lineTo(-24, -92); c.lineTo(-10, -70); c.stroke();
  c.beginPath(); c.moveTo(-6, -66); c.lineTo(-2, -88); c.lineTo(6, -64); c.stroke();
  c.beginPath(); c.moveTo(-16, -68); c.quadraticCurveTo(6, -94, 18, -60); c.stroke();
  if (sea) {
    gold(c);
    c.beginPath(); c.moveTo(4, -50); c.lineTo(14, -78); c.lineTo(24, -44); c.closePath(); paint(c);
    ink(c, 2);
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-2 + i * 9, -30, 5, 0.4, 2.8); c.stroke(); }
  }
}

function drawSuanni(c) {
  seat(c);
  gold(c);
  c.beginPath(); c.ellipse(-8, -60, 16, 14, 0, 0, 7); paint(c);
  ink(c, 3.5);
  c.beginPath();
  c.moveTo(-16, -72);
  c.quadraticCurveTo(-28, -102, -6, -78);
  c.quadraticCurveTo(2, -106, 12, -74);
  c.stroke();
}

function drawYayu(c) {
  seat(c);
  gold(c);
  c.beginPath(); c.ellipse(-16, -58, 18, 14, -0.3, 0, 7); paint(c);
  c.beginPath(); c.arc(-32, -56, 6, 0, 7); c.stroke();
  c.beginPath(); c.moveTo(-4, -66); c.lineTo(6, -90); c.lineTo(16, -52); c.closePath(); paint(c);
  ink(c, 2.2); c.fillStyle = INK;
  c.beginPath(); c.arc(-20, -60, 2.4, 0, 7); c.fill();
}

function drawXiezhi(c) {
  seat(c);
  gold(c);
  c.beginPath(); c.ellipse(-8, -58, 16, 14, 0, 0, 7); paint(c);
  ink(c, 4.5);
  c.beginPath(); c.moveTo(-8, -72); c.lineTo(-6, -108); c.stroke();
}

function drawDouniu(c) {
  seat(c);
  gold(c);
  c.beginPath(); c.ellipse(-6, -56, 18, 16, 0, 0, 7); paint(c);
  ink(c, 4);
  c.beginPath(); c.moveTo(-18, -66); c.quadraticCurveTo(-36, -78, -40, -100); c.stroke();
  c.beginPath(); c.moveTo(4, -66); c.quadraticCurveTo(18, -78, 22, -100); c.stroke();
}

function drawXingshi(c) {
  gold(c);
  c.beginPath(); c.ellipse(0, -2, 22, 7, 0, 0, 7); c.fillStyle = GOLD_D; c.fill(); c.stroke();
  gold(c);
  c.beginPath();
  c.moveTo(-14, -4); c.lineTo(-16, -40); c.quadraticCurveTo(-18, -62, -2, -68);
  c.lineTo(14, -68); c.quadraticCurveTo(20, -42, 14, -4); c.closePath();
  paint(c);
  c.beginPath(); c.ellipse(0, -36, 12, 16, 0, 0, 7); c.fillStyle = GLAZE; paint(c);
  gold(c);
  c.beginPath();
  c.moveTo(6, -58); c.quadraticCurveTo(42, -96, 58, -46); c.quadraticCurveTo(34, -42, 12, -36);
  c.closePath(); paint(c);
  ink(c, 2);
  c.beginPath(); c.moveTo(18, -66); c.lineTo(46, -70); c.moveTo(16, -54); c.lineTo(48, -52); c.moveTo(14, -44); c.lineTo(40, -40); c.stroke();
  gold(c);
  c.beginPath(); c.ellipse(0, -84, 15, 13, 0, 0, 7); paint(c);
  c.beginPath(); c.moveTo(-12, -80); c.lineTo(-28, -74); c.lineTo(-22, -64); c.lineTo(-6, -72); c.closePath(); paint(c);
  ink(c, 2.4); c.fillStyle = INK;
  c.beginPath(); c.arc(-6, -88, 1.8, 0, 7); c.fill();
  c.beginPath(); c.arc(5, -88, 1.8, 0, 7); c.fill();
  c.beginPath(); c.moveTo(-10, -4); c.lineTo(-16, 6); c.moveTo(0, -2); c.lineTo(0, 6); c.moveTo(10, -4); c.lineTo(16, 6); c.stroke();
  gold(c);
  c.beginPath(); c.moveTo(-18, -50); c.lineTo(-24, -8); c.lineTo(-10, -6); c.lineTo(-6, -48); c.closePath(); paint(c);
  c.beginPath(); c.ellipse(-16, -58, 14, 12, 0, 0, 7); paint(c);
  ink(c, 2); c.beginPath(); c.moveTo(-26, -56); c.lineTo(-6, -56); c.moveTo(-24, -50); c.lineTo(-8, -50); c.stroke();
}

function drawXian(c) {
  gold(c);
  c.beginPath(); c.ellipse(4, -2, 30, 9, 0, 0, 7); c.fillStyle = GOLD_D; c.fill(); c.stroke();
  gold(c);
  c.beginPath(); c.ellipse(2, -24, 24, 18, 0, 0, 7); paint(c);
  c.beginPath();
  c.moveTo(-8, -34); c.quadraticCurveTo(-30, -48, -52, -30); c.lineTo(-64, -18); c.lineTo(-40, -22); c.closePath();
  paint(c);
  ink(c, 4);
  c.beginPath(); c.moveTo(-22, -36); c.lineTo(-26, -62); c.lineTo(-12, -38); c.stroke();
  c.beginPath(); c.moveTo(-14, -34); c.lineTo(-10, -54); c.stroke();
  gold(c);
  c.beginPath(); c.moveTo(10, -20); c.quadraticCurveTo(42, -40, 48, -8); c.quadraticCurveTo(26, -12, 12, -8); c.closePath(); paint(c);
  c.fillStyle = GLAZE;
  c.beginPath(); c.moveTo(-8, -40); c.lineTo(-14, -22); c.lineTo(8, -20); c.lineTo(6, -40); c.closePath(); paint(c);
  c.beginPath(); c.ellipse(-2, -50, 8, 9, 0, 0, 7); paint(c);
  ink(c, 3); c.beginPath(); c.moveTo(-10, -54); c.quadraticCurveTo(-2, -70, 8, -54); c.stroke();
}

function drawChuishou(c) {
  gold(c);
  c.beginPath(); c.ellipse(0, 0, 36, 10, 0, 0, 7); c.fillStyle = GOLD_D; c.fill(); c.stroke();
  gold(c);
  c.beginPath();
  c.moveTo(16, -8);
  c.bezierCurveTo(40, -24, 34, -78, -4, -88);
  c.bezierCurveTo(-40, -94, -62, -60, -54, -28);
  c.quadraticCurveTo(-20, -8, 16, -8);
  c.closePath();
  paint(c);
  c.fillStyle = PAPER;
  c.beginPath(); c.moveTo(-16, -30); c.lineTo(-66, -16); c.lineTo(-46, -4); c.lineTo(-8, -16); c.closePath(); paint(c);
  ink(c, 5);
  c.beginPath(); c.moveTo(-8, -80); c.quadraticCurveTo(8, -118, 24, -86); c.stroke();
  c.beginPath();
  c.moveTo(-20, -84); c.lineTo(-30, -104); c.lineTo(-6, -82);
  c.moveTo(0, -86); c.lineTo(8, -108);
  c.stroke();
  c.beginPath(); c.moveTo(12, -60); c.quadraticCurveTo(52, -78, 40, -28); c.stroke();
  ink(c, 2.4); c.beginPath(); c.arc(-16, -58, 3, 0, 7); c.stroke();
}

function chiwen(c, v, at, dir) {
  const p = P(v, at.x, at.y, at.z + 0.05);
  const sc = v.zs * 0.016;
  c.save();
  c.translate(p.x, p.y);
  c.scale(dir * sc, sc);
  drawChiwenLocal(c);
  c.restore();
}

function grooves(c, v, topA, topB, botB, botA, n) {
  c.save();
  c.strokeStyle = 'rgba(92,64,32,0.45)'; c.lineWidth = Math.max(1.3, v.s * 0.018);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const a = P(v, lerp(topA.x, topB.x, t), lerp(topA.y, topB.y, t), lerp(topA.z, topB.z, t));
    const b = P(v, lerp(botA.x, botB.x, t), lerp(botA.y, botB.y, t), lerp(botA.z, botB.z, t));
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
  }
  c.restore();
}

function discs(c, v, A, B, n) {
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const p = P(v, lerp(A.x, B.x, t), lerp(A.y, B.y, t), lerp(A.z, B.z, t));
    c.beginPath();
    c.arc(p.x, p.y + v.zs * 0.08, Math.max(5, v.s * 0.09), 0, 7);
    c.fillStyle = GOLD; c.fill();
    c.strokeStyle = INK; c.lineWidth = 1.4; c.stroke();
  }
}

function roof(c, v, withChiwen) {
  const L = P(v, ridgeL.x, ridgeL.y, ridgeL.z);
  const R = P(v, ridgeR.x, ridgeR.y, ridgeR.z);
  const fl = P(v, FL.x, FL.y, FL.z);
  const fr = P(v, FR.x, FR.y, FR.z);
  const bl = P(v, BL.x, BL.y, BL.z);
  poly(c, [L, fl, bl], '#D9B56E', INK, 2.2);
  grooves(c, v, ridgeL, ridgeL, BL, FL, 4);
  poly(c, [L, R, fr, fl], '#F6E4B8', INK, 2.4);
  grooves(c, v, ridgeL, ridgeR, FR, FL, 8);

  // 正脊：有厚度的脊筒，不是一条线
  const cap = 0.34;
  const topL = P(v, ridgeL.x, ridgeL.y, ridgeL.z + cap);
  const topR = P(v, ridgeR.x, ridgeR.y, ridgeR.z + cap);
  const backL = P(v, ridgeL.x, ridgeL.y - 0.55, ridgeL.z + cap * 0.4);
  const backR = P(v, ridgeR.x, ridgeR.y - 0.55, ridgeR.z + cap * 0.4);
  poly(c, [L, R, topR, topL], '#C9842A', INK, 2);
  poly(c, [topL, topR, backR, backL], '#E2B15A', INK, 1.6);

  // 戗脊：凸起的承托面
  const n = 14;
  const band = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const a = hipAt(u);
    band.push(P(v, a.x, a.y, a.z));
  }
  c.beginPath();
  band.forEach((p, i) => i ? c.lineTo(p.x, p.y + v.zs * 0.22) : c.moveTo(p.x, p.y + v.zs * 0.22));
  for (let i = n; i >= 0; i--) c.lineTo(band[i].x, band[i].y - v.zs * 0.06);
  c.closePath();
  c.fillStyle = '#C9842A'; c.fill();
  c.strokeStyle = INK; c.lineWidth = 2; c.stroke();

  // 檐口厚度
  c.beginPath();
  c.moveTo(fl.x, fl.y); c.lineTo(fr.x, fr.y); c.lineTo(fr.x, fr.y + 16); c.lineTo(fl.x, fl.y + 16); c.closePath();
  c.fillStyle = VERM; c.fill(); c.strokeStyle = INK; c.lineWidth = 1.6; c.stroke();
  discs(c, v, FL, FR, 9);
  for (let i = 0; i < 6; i++) {
    const t = 0.12 + i * 0.14;
    const p = P(v, lerp(FL.x, FR.x, t), lerp(FL.y, FR.y, t), 0);
    c.fillStyle = GREEN;
    c.fillRect(p.x - 8, p.y + 20, 16, 8);
    c.fillRect(p.x - 13, p.y + 28, 26, 6);
    c.strokeStyle = INK; c.lineWidth = 1.2;
    c.strokeRect(p.x - 8, p.y + 20, 16, 8);
    c.strokeRect(p.x - 13, p.y + 28, 26, 6);
  }
  if (withChiwen !== false) {
    chiwen(c, v, { x: ridgeL.x - 0.55, y: ridgeL.y - 0.2, z: ridgeL.z }, 1);
    chiwen(c, v, { x: ridgeR.x + 0.55, y: ridgeR.y - 0.2, z: ridgeR.z }, -1);
  }
}

function placeQueue(c, v, mul) {
  const sc = v.zs * mul;
  const order = [...QUEUE].reverse();
  for (const [kind, u] of order) {
    const w = hipAt(u);
    const p = P(v, w.x, w.y, w.z);
    c.save();
    c.translate(p.x, p.y);
    const k = kind === 'chuishou' ? sc * 1.35 : kind === 'xian' ? sc * 1.05 : sc;
    c.scale(k, k);
    beast(c, kind);
    c.restore();
  }
}

function tag(c, text, x, y, ax, ay) {
  c.save();
  c.strokeStyle = INK; c.lineWidth = 1.3;
  c.beginPath(); c.moveTo(x, y); c.lineTo(ax, ay); c.stroke();
  c.font = '54px "LXGWWenKai-500"';
  const w = c.measureText(text).width + 24;
  c.fillStyle = 'rgba(247,241,222,0.94)';
  c.fillRect(x - w / 2, y - 46, w, 58);
  c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(text, x, y - 16);
  c.restore();
}

function platePan(c, v) {
  roof(c, v);
  placeQueue(c, v, 0.0082);
  const mouth = P(v, ridgeL.x - 0.2, ridgeL.y, ridgeL.z + 1.5);
  const ridgeMid = P(v, 0, ridgeL.y, ridgeL.z + 0.55);
  const hipMid = P(v, ...Object.values({ x: hipAt(0.45).x, y: hipAt(0.45).y, z: hipAt(0.45).z }));
  const h = hipAt(0.45);
  const hp = P(v, h.x, h.y, h.z);
  const beastP = P(v, hipAt(0.3).x, hipAt(0.3).y, hipAt(0.3).z + 0.7);
  tag(c, '正吻', 250, 150, mouth.x, mouth.y);
  tag(c, '正脊', ridgeMid.x, 150, ridgeMid.x, ridgeMid.y - 10);
  tag(c, '戗脊', 180, 430, hp.x - 20, hp.y);
  tag(c, '走兽', 220, 620, beastP.x, beastP.y);
}

function plateClose(c, v) {
  roof(c, v, false);
  placeQueue(c, v, 0.009);
  const xian = hipAt(0.05), dragon = hipAt(0.2), xing = hipAt(0.86), head = hipAt(0.94);
  const px = (w, dz) => P(v, w.x, w.y, w.z + dz);
  const a = px(xian, 1.05), b = px(dragon, 1.15), d = px(xing, 1.2), e = px(head, 1.35);
  tag(c, '仙人不计', a.x - 20, a.y - 150, a.x, a.y);
  tag(c, '十只走兽', b.x, b.y - 160, b.x, b.y);
  tag(c, '行什', d.x, d.y - 170, d.x, d.y);
  tag(c, '垂兽另类', e.x + 30, e.y - 180, e.x, e.y);
}

function plateSprites(c) {
  const items = [
    ['正吻', 'chiwen'], ['骑凤仙人', 'xian'], ['龙', 'dragon'],
    ['凤', 'phoenix'], ['狮子', 'lion'], ['行什', 'xingshi'],
  ];
  items.forEach((it, i) => {
    const col = i % 3, row = (i / 3) | 0;
    const x = 320 + col * 640, y = 430 + row * 520;
    c.save();
    c.translate(x, y);
    c.scale(1.55, 1.55);
    if (it[1] === 'chiwen') {
      c.scale(1.15, 1.15);
      // 局部重画：把口放在原点右侧
      c.translate(20, 10);
      c.scale(1.1, 1.1);
      drawChiwenLocal(c);
    } else beast(c, it[1]);
    c.restore();
    c.fillStyle = INK; c.font = '40px "PuHui-Bold"'; c.textAlign = 'center';
    c.fillText('原创 · ' + it[0], x, y + 130);
  });
}

function drawChiwenLocal(c) {
  // 大头在下，上下颚分开，中间留给正脊伸进去。卷尾很小，长在脑后。
  gold(c);
  c.beginPath(); c.moveTo(-16, 10); c.lineTo(72, 16); c.lineTo(72, 2); c.lineTo(-8, -2); c.closePath(); paint(c);
  c.beginPath(); c.moveTo(-12, -18); c.lineTo(78, -12); c.lineTo(76, -28); c.lineTo(-6, -30); c.closePath(); paint(c);
  c.beginPath(); c.ellipse(-22, -48, 36, 32, 0, 0, 7); paint(c);
  c.beginPath();
  c.moveTo(-6, -74); c.quadraticCurveTo(6, -108, 24, -100); c.quadraticCurveTo(34, -96, 22, -78); c.closePath();
  paint(c);
  ink(c, 7); c.strokeStyle = GOLD;
  c.beginPath(); c.arc(10, -92, 12, 0.6, 5.2); c.stroke();
  ink(c, 3); c.strokeStyle = INK;
  c.beginPath(); c.arc(10, -92, 12, 0.7, 5.0); c.stroke();
  c.beginPath(); c.moveTo(-36, -70); c.quadraticCurveTo(-58, -58, -46, -36); c.stroke();
  c.beginPath(); c.arc(-20, -50, 4.2, 0, 7); c.stroke();
  c.fillStyle = INK; c.beginPath(); c.arc(-20, -50, 1.8, 0, 7); c.fill();
  ink(c, 2.2);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-40, -16 - i * 14, 6, 0.2, 2.6); c.stroke(); }
  c.fillStyle = VERM; c.fillRect(-48, -112, 7, 26); c.strokeStyle = INK; c.strokeRect(-48, -112, 7, 26);
}

let ready = false;
const ASSET = window.ASSET = {
  init() {
    if (ready) return; ready = true;
    U.assertGlyphs('54px "LXGWWenKai-500"', '正吻正脊戗脊走兽仙人不计十只行什垂兽另类', '资产标签');
    U.assertGlyphs('40px "PuHui-Bold"', '原创骑凤仙人龙凤狮子行什正吻', '兽形样张');
  },
  plate(c, mode) {
    const tile = CL.paperTile('wuji_asset', PAPER, { amt: 11, fibers: 180, grain: 7, seed: 4, fiberCol: [150, 120, 70] });
    CL.fillPaper(c, tile, 0, 0, 1920, 1080);
    if (mode === 'sprites') { plateSprites(c); return; }
    const v = viewOf(mode);
    if (mode === 'close') plateClose(c, v);
    else platePan(c, v);
  },
};
})();
