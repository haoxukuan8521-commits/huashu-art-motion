// 样镜：冻结资产 v3p17 的 11 张透明图，只做缩放、落位和缓动。不改像素。
// 画风：米黄宣纸、墨色界画、琉璃黄屋面、朱红正吻、石绿檐口。运动只有慢推拉和平移。
(() => {
const { lerp, clamp } = U;
const INK = '#1C1914';
const SUB = '#6A6256';
const PAPER = '#F3E6C4';
const VERM = '#C23A2E';
const GLAZE = '#E8C56B';
const GLAZE_D = '#D2AE58';
const SIDE = '#CFA15A';
const RIDGE_TOP = '#F4D78A';
const RIDGE_FACE = '#C49844';
const GREEN = '#2C6B52';
const WALL = '#F7E7D8';
const FIG = 208;

const ASSET = 'demos/wuji/assets/';
const BEASTS = [
  { id: 'xianren', name: '仙人', cx: 359.5, foot: 1350, srcH: 1191 },
  { id: 'long', name: '龙', cx: 359.5, foot: 1350, srcH: 1188 },
  { id: 'feng', name: '凤', cx: 359.5, foot: 1350, srcH: 1191 },
  { id: 'shi', name: '狮子', cx: 359.5, foot: 1350, srcH: 1191 },
  { id: 'tianma', name: '天马', cx: 360, foot: 1390, srcH: 1226 },
  { id: 'haima', name: '海马', cx: 360, foot: 1350, srcH: 1200 },
  { id: 'suanni', name: '狻猊', cx: 359.5, foot: 1350, srcH: 1191 },
  { id: 'yayu', name: '狎鱼', cx: 359.5, foot: 1350, srcH: 1191 },
  { id: 'xiezhi', name: '獬豸', cx: 360, foot: 1350, srcH: 1169 },
  { id: 'douniu', name: '斗牛', cx: 221, foot: 1142, srcH: 1132 },
  { id: 'xingshi', name: '行什', cx: 359.5, foot: 1350, srcH: 1191 },
];
window.EXTRA_ASSETS = BEASTS.map(b => ASSET + b.id + '-unified-transparent.png');

const H0 = { x: 300, y: 1200 };
const H1 = { x: 820, y: 940 };
const H2 = { x: 1380, y: 680 };
const ridgeL = { x: 1860, y: 430 };
const ridgeR = { x: 2480, y: 320 };
const eaveR = { x: 2620, y: 980 };
const eaveMid = { x: 1500, y: 1460 };
const sideBack = { x: 1320, y: 250 };
const sideEave = { x: 560, y: 620 };
const chuishouPt = { x: 1580, y: 590 };

const SUBS = [
  { t0: 0.10, t1: 2.70, text: '屋顶上，为什么排着一队神兽？' },
  { t0: 2.99, t1: 5.90, text: '正脊两端的大构件，叫正吻。' },
  { t0: 6.25, t1: 8.75, text: '檐角这一小队，才叫走兽。' },
  { t0: 9.06, t1: 10.70, text: '以故宫太和殿为例：' },
  { t0: 10.73, t1: 14.40, text: '最前面是骑凤仙人，不算在十只里面。' },
  { t0: 14.74, t1: 17.65, text: '后面从龙、凤、狮子排起，' },
  { t0: 17.70, t1: 21.55, text: '经过狻猊、狎鱼、獬豸，直到行什。' },
  { t0: 21.94, t1: 24.75, text: '后方的兽头，也不加进计数。' },
  { t0: 25.10, t1: 27.18, text: '斜脊上的小兽，压住脊瓦，' },
  { t0: 27.23, t1: 29.30, text: '也寄托着平安的祈愿。' },
];

const CHIPS = [
  { t0: 3.15, t1: 6.15, text: '正吻' },
  { t0: 6.35, t1: 8.95, text: '檐角走兽' },
  { t0: 11.55, t1: 14.40, text: '仙人 · 不计' },
  { t0: 14.85, t1: 17.65, text: '龙 · 凤 · 狮子' },
  { t0: 18.05, t1: 18.88, text: '狻猊' },
  { t0: 18.88, t1: 19.72, text: '狎鱼' },
  { t0: 19.72, t1: 20.55, text: '獬豸' },
  { t0: 20.70, t1: 21.85, text: '行什' },
  { t0: 22.15, t1: 24.80, text: '兽头 · 另计' },
  { t0: 25.20, t1: 31.00, text: '祈愿，不是灭火' },
];

const HALO = [
  { i: 0, t0: 11.55, t1: 14.35 },
  { i: 1, t0: 15.25, t1: 15.92 },
  { i: 2, t0: 15.90, t1: 16.48 },
  { i: 3, t0: 16.45, t1: 17.60 },
  { i: 6, t0: 18.05, t1: 18.88 },
  { i: 7, t0: 18.85, t1: 19.72 },
  { i: 8, t0: 19.70, t1: 20.55 },
  { i: 10, t0: 20.70, t1: 21.90 },
];

const quad = (a, b, c, u) => {
  const k0 = (1 - u) * (1 - u), k1 = 2 * (1 - u) * u, k2 = u * u;
  return { x: k0 * a.x + k1 * b.x + k2 * c.x, y: k0 * a.y + k1 * b.y + k2 * c.y };
};
const lpt = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
const hip = (u) => quad(H0, H1, H2, clamp(u, 0, 1));
const eave = (u) => quad(H0, eaveMid, eaveR, clamp(u, 0, 1));
const ease = (t, a, b) => MO.smooth(MO.seg(t, a, b));
const fade = (t, a, b, c, d) => Math.min(ease(t, a, b), 1 - ease(t, c, d));

function beastU(i) { return 0.045 + i * 0.09; }
function beastPos(i) { return hip(beastU(i)); }

function sample(fn, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push(fn(i / n));
  return pts;
}

function ribbon(c, pts, half) {
  if (pts.length < 2) return;
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[Math.min(pts.length - 1, i + 1)];
    const r = pts[Math.max(0, i - 1)];
    let dx = q.x - r.x, dy = q.y - r.y;
    const m = Math.hypot(dx, dy) || 1;
    dx /= m; dy /= m;
    L.push({ x: p.x - dy * half, y: p.y + dx * half });
    R.push({ x: p.x + dy * half, y: p.y - dx * half });
  }
  c.beginPath();
  L.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  for (let i = R.length - 1; i >= 0; i--) c.lineTo(R[i].x, R[i].y);
  c.closePath();
}

function inkPath(c, w, color) {
  c.lineJoin = 'round'; c.lineCap = 'round';
  c.strokeStyle = color || INK; c.lineWidth = w;
}

function camAt(t) {
  const keys = [
    { t: 0.00, u: 0.18, z: 1.90, ox: 10, oy: -78 },
    { t: 2.40, u: 0.22, z: 1.78, ox: 0, oy: -70 },
    { t: 5.05, ax: 1480, ay: 760, z: 0.64 },
    { t: 8.55, ax: 1180, ay: 860, z: 0.74 },
    { t: 12.20, u: 0.06, z: 1.62, ox: 30, oy: -96 },
    { t: 15.35, u: 0.14, z: 1.52, ox: 8, oy: -100, ease: 'linear' },
    { t: 21.15, u: 0.86, z: 1.58, ox: -70, oy: -36 },
    { t: 24.55, ax: 1420, ay: 760, z: 1.18 },
    { t: 26.50, ax: 1420, ay: 800, z: 0.66 },
    { t: 31.00, ax: 1420, ay: 800, z: 0.66 },
  ];
  let i = 0;
  while (i < keys.length - 2 && t >= keys[i + 1].t) i++;
  const a = keys[i], b = keys[i + 1];
  const p = MO.seg(t, a.t, b.t);
  const e = a.ease === 'linear' ? p : MO.smooth(p);
  const pa = a.ax != null ? { x: a.ax, y: a.ay } : lpt(hip(a.u), { x: hip(a.u).x + a.ox, y: hip(a.u).y + a.oy }, 1);
  const pb = b.ax != null ? { x: b.ax, y: b.ay } : lpt(hip(b.u), { x: hip(b.u).x + b.ox, y: hip(b.u).y + b.oy }, 1);
  return { x: lerp(pa.x, pb.x, e), y: lerp(pa.y, pb.y, e), z: CAM.zlerp(a.z, b.z, e) };
}

function wall(c) {
  const top = sample(eave, 18);
  c.beginPath();
  top.forEach((p, i) => i ? c.lineTo(p.x, p.y + 10) : c.moveTo(p.x, p.y + 10));
  c.lineTo(eaveR.x + 30, eaveR.y + 210);
  c.lineTo(H0.x + 40, H0.y + 230);
  c.closePath();
  c.fillStyle = WALL;
  c.fill();
  inkPath(c, 2.2); c.stroke();
  const cols = [0.18, 0.40, 0.62, 0.84];
  for (const u of cols) {
    const p = eave(u);
    c.fillStyle = '#F3D2C8';
    c.fillRect(p.x - 10, p.y + 16, 20, 150);
    inkPath(c, 1.6);
    c.strokeRect(p.x - 10, p.y + 16, 20, 150);
  }
}

function slopes(c) {
  const hipPts = sample(u => hip(u), 16);
  c.beginPath();
  c.moveTo(sideBack.x, sideBack.y);
  c.lineTo(ridgeL.x, ridgeL.y);
  for (let i = hipPts.length - 1; i >= 0; i--) c.lineTo(hipPts[i].x, hipPts[i].y);
  c.lineTo(sideEave.x, sideEave.y);
  c.closePath();
  c.fillStyle = SIDE;
  c.fill();
  inkPath(c, 2.4); c.stroke();
  inkPath(c, 1.15, '#8A6230');
  for (let row = 1; row <= 4; row++) {
    const v = row / 5;
    c.beginPath();
    for (let k = 0; k <= 7; k++) {
      const u = k / 7;
      const top = lpt(sideBack, ridgeL, u);
      const bot = lpt(sideEave, H0, u);
      const p = lpt(top, bot, v);
      c.moveTo(p.x - 14, p.y);
      c.quadraticCurveTo(p.x, p.y + 8, p.x + 14, p.y);
    }
    c.stroke();
  }

  const ev = sample(eave, 18);
  c.beginPath();
  c.moveTo(ridgeL.x + 36, ridgeL.y + 42);
  c.lineTo(ridgeR.x + 30, ridgeR.y + 38);
  c.lineTo(eaveR.x, eaveR.y);
  for (let i = ev.length - 1; i >= 0; i--) c.lineTo(ev[i].x, ev[i].y);
  c.closePath();
  c.fillStyle = GLAZE;
  c.fill();
  inkPath(c, 2.6); c.stroke();

  inkPath(c, 1.15, SUB);
  for (let row = 1; row <= 5; row++) {
    const v = row / 6;
    c.beginPath();
    for (let k = 0; k <= 16; k++) {
      const u = k / 16;
      const top = lpt({ x: ridgeL.x + 36, y: ridgeL.y + 42 }, { x: ridgeR.x + 30, y: ridgeR.y + 38 }, u);
      const bot = eave(u);
      const p = lpt(top, bot, v);
      const ww = 18 - v * 4;
      c.moveTo(p.x - ww, p.y);
      c.quadraticCurveTo(p.x, p.y + 10, p.x + ww, p.y);
    }
    c.stroke();
  }
}

function ridges(c) {
  const topL = ridgeL, topR = ridgeR;
  const fL = { x: ridgeL.x + 48, y: ridgeL.y + 46 };
  const fR = { x: ridgeR.x + 42, y: ridgeR.y + 40 };
  c.beginPath();
  c.moveTo(topL.x, topL.y); c.lineTo(topR.x, topR.y); c.lineTo(fR.x, fR.y); c.lineTo(fL.x, fL.y);
  c.closePath();
  c.fillStyle = RIDGE_TOP;
  c.fill();
  inkPath(c, 2.4); c.stroke();
  c.beginPath();
  c.moveTo(fL.x, fL.y); c.lineTo(fR.x, fR.y);
  c.lineTo(fR.x + 8, fR.y + 28); c.lineTo(fL.x + 10, fL.y + 32);
  c.closePath();
  c.fillStyle = RIDGE_FACE;
  c.fill();
  inkPath(c, 2.2); c.stroke();

  const hipPts = sample(u => hip(u), 24);
  hipPts.push(lpt(H2, ridgeL, 0.55));
  hipPts.push(ridgeL);
  ribbon(c, hipPts, 20);
  c.fillStyle = RIDGE_FACE;
  c.fill();
  inkPath(c, 2.3); c.stroke();
  ribbon(c, hipPts, 8);
  c.fillStyle = RIDGE_TOP;
  c.fill();

  const far = sample(u => quad(eaveR, { x: 2480, y: 760 }, { x: ridgeR.x + 10, y: ridgeR.y + 36 }, u), 14);
  ribbon(c, far, 14);
  c.fillStyle = RIDGE_FACE;
  c.globalAlpha = 0.95;
  c.fill();
  inkPath(c, 2); c.stroke();
  c.globalAlpha = 1;

  inkPath(c, 8, GREEN);
  const ev = sample(eave, 20);
  c.beginPath();
  ev.forEach((p, i) => i ? c.lineTo(p.x, p.y + 6) : c.moveTo(p.x, p.y + 6));
  c.stroke();
  for (let k = 0; k <= 14; k++) {
    const p = eave(k / 14);
    c.beginPath();
    c.arc(p.x, p.y + 16, 9, Math.PI * 1.05, Math.PI * 1.95);
    c.fillStyle = GREEN;
    c.fill();
    inkPath(c, 1.3); c.stroke();
  }
}

function ribbonPoly(c, pts, widths) {
  const L = [], R = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[Math.min(n - 1, i + 1)], r = pts[Math.max(0, i - 1)];
    const dx = i === 0 ? q.x - p.x : i === n - 1 ? p.x - r.x : q.x - r.x;
    const dy = i === 0 ? q.y - p.y : i === n - 1 ? p.y - r.y : q.y - r.y;
    const m = Math.hypot(dx, dy) || 1;
    const nx = -dy / m, ny = dx / m, w = widths[i];
    L.push({ x: p.x + nx * w, y: p.y + ny * w });
    R.push({ x: p.x - nx * w, y: p.y - ny * w });
  }
  c.beginPath();
  L.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  for (let i = R.length - 1; i >= 0; i--) c.lineTo(R[i].x, R[i].y);
  c.closePath();
}

function chiwen(c, x, y, dir, sc) {
  c.save();
  c.translate(x, y);
  c.scale(dir * sc, sc);
  c.lineJoin = 'round'; c.lineCap = 'round';
  // 一条龙脊：下颌咬进正脊，上颌抬起，颈连到卷尾。口是开口，不是笑脸。
  const spine = [
    { x: 160, y: 12 }, { x: 100, y: 24 }, { x: 48, y: 18 }, { x: 8, y: 4 },
    { x: -18, y: -26 }, { x: 4, y: -48 }, { x: 70, y: -36 }, { x: 155, y: -14 },
    { x: 112, y: -52 }, { x: 62, y: -92 }, { x: 22, y: -140 },
  ];
  const widths = [15, 17, 19, 20, 18, 16, 15, 13, 15, 17, 19];
  const ccx = -8, ccy = -214, rad = 54;
  for (let i = 0; i < 16; i++) {
    const a = 1.15 + i * (3.5 / 15);
    spine.push({ x: ccx + Math.cos(a) * rad, y: ccy + Math.sin(a) * rad });
    widths.push(18);
  }
  ribbonPoly(c, spine, widths);
  c.fillStyle = VERM; c.fill();
  inkPath(c, 2.4); c.stroke();
  c.strokeStyle = '#7A241C'; c.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    c.beginPath();
    c.arc(40 - i * 10, -30 - i * 26, 11, 0.3, Math.PI - 0.2);
    c.stroke();
  }
  c.fillStyle = '#F6E7C0';
  c.beginPath(); c.ellipse(78, -70, 9, 6.5, -0.3, 0, 7); c.fill();
  inkPath(c, 1.6); c.stroke();
  c.fillStyle = INK; c.beginPath(); c.arc(80, -70, 2.6, 0, 7); c.fill();
  inkPath(c, 4.5);
  c.beginPath(); c.moveTo(18, -130); c.lineTo(-8, -178); c.lineTo(22, -196); c.stroke();
  c.strokeStyle = INK; c.lineWidth = 2.2;
  for (let i = 0; i < 5; i++) {
    c.beginPath(); c.moveTo(55 + i * 16, 0); c.lineTo(53 + i * 16, -12); c.stroke();
  }
  let top = spine[0];
  for (const p of spine) if (p.y < top.y) top = p;
  inkPath(c, 4);
  c.beginPath(); c.moveTo(top.x, top.y); c.lineTo(top.x, top.y - 62); c.stroke();
  c.beginPath(); c.moveTo(top.x - 16, top.y); c.lineTo(top.x + 16, top.y); c.stroke();
  c.fillStyle = '#E2B34A';
  c.fillRect(top.x - 7, top.y - 60, 14, 16);
  inkPath(c, 1.4); c.strokeRect(top.x - 7, top.y - 60, 14, 16);
  c.restore();
}

function chuishou(c) {
  const p = chuishouPt;
  c.save();
  c.translate(p.x, p.y);
  c.scale(1.55, 1.55);
  c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = RIDGE_FACE;
  c.beginPath(); c.ellipse(0, 8, 36, 14, -0.4, 0, 7); c.fill();
  inkPath(c, 1.8); c.stroke();
  c.beginPath();
  c.moveTo(34, 4);
  c.quadraticCurveTo(48, -20, 18, -48);
  c.quadraticCurveTo(-8, -78, -36, -52);
  c.quadraticCurveTo(-58, -28, -30, 2);
  c.quadraticCurveTo(-8, 16, 34, 4);
  c.closePath();
  c.fillStyle = '#C47A3A';
  c.fill();
  inkPath(c, 2.3); c.stroke();
  c.fillStyle = PAPER;
  c.beginPath();
  c.moveTo(6, -2); c.lineTo(40, -8); c.lineTo(36, -20); c.lineTo(4, -14); c.closePath();
  c.fill(); inkPath(c, 1.6); c.stroke();
  c.strokeStyle = INK; c.lineWidth = 3;
  c.beginPath(); c.moveTo(-16, -48); c.quadraticCurveTo(-28, -78, -6, -86); c.stroke();
  c.fillStyle = '#F6E7C0';
  c.beginPath(); c.ellipse(-8, -36, 5, 4, -0.4, 0, 7); c.fill(); inkPath(c, 1.4); c.stroke();
  c.restore();
}

function drawBeast(c, b, x, y) {
  const im = window.IMG[ASSET + b.id + '-unified-transparent.png'];
  if (!im) return;
  const s = FIG / b.srcH;
  const dw = im.width * s, dh = im.height * s;
  c.drawImage(im, x - b.cx * s, y - b.foot * s, dw, dh);
}

function halo(c, x, y, alpha) {
  if (alpha < 0.02) return;
  c.save();
  c.globalAlpha = 0.95 * alpha;
  c.strokeStyle = VERM;
  c.lineWidth = 3.2;
  c.beginPath();
  c.ellipse(x, y - FIG * 0.50, FIG * 0.28, FIG * 0.52, -0.4, 0, 7);
  c.stroke();
  c.restore();
}

function activeHalo(t) {
  for (const h of HALO) {
    const a = fade(t, h.t0, h.t0 + 0.22, h.t1 - 0.18, h.t1);
    if (a > 0.02) return { i: h.i, a };
  }
  return null;
}

function trace(c, t) {
  const p = ease(t, 6.20, 8.20);
  const a = fade(t, 6.20, 6.45, 9.05, 9.70);
  if (a < 0.02 || p < 0.02) return;
  const n = 22;
  const pts = [];
  for (let i = 0; i <= n * p; i++) {
    const u = i / n;
    const q = hip(u);
    pts.push({ x: q.x + 36, y: q.y + 46 });
  }
  if (pts.length < 2) return;
  c.save();
  c.globalAlpha = 0.9 * a;
  inkPath(c, 2.4, VERM);
  c.beginPath();
  pts.forEach((q, i) => i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y));
  c.stroke();
  c.restore();
}

function ring(c, x, y, rx, ry, p) {
  if (p <= 0.01) return;
  c.save();
  c.globalAlpha = p < 1 ? 0.9 : 0.9;
  inkPath(c, 2.4, VERM);
  c.setLineDash([6, 5]);
  c.beginPath();
  c.ellipse(x, y, rx, ry, -0.35, 0, Math.PI * 2 * Math.min(1, p));
  c.stroke();
  c.restore();
}

function chip(c, t) {
  const item = CHIPS.find(s => t >= s.t0 && t < s.t1);
  if (!item) return;
  const a = Math.min(1, (t - item.t0) / 0.18, (item.t1 - t) / 0.2);
  const size = 78;
  const w = TY.width(c, item.text, size, 'PuHui-Bold') + 48;
  const x = 56, y = 46;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = 'rgba(247,241,222,0.94)';
  c.fillRect(x, y, w, 96);
  inkPath(c, 1.6); c.strokeRect(x, y, w, 96);
  c.restore();
  TY.text(c, item.text, x + w / 2, y + 66, { size, fam: 'PuHui-Bold', color: INK, align: 'center', base: 'alphabetic', alpha: a });
}

function card(c, t) {
  const a = fade(t, 25.25, 26.05, 30.55, 31.0);
  if (a < 0.02) return;
  const x = 64, y = 168, w = 560, h = 300;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = 'rgba(247,241,222,0.94)';
  c.fillRect(x, y, w, h);
  inkPath(c, 1.8); c.strokeRect(x, y, w, h);
  c.strokeStyle = INK; c.lineWidth = 2.4; c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x + 48, y + 168);
  c.lineTo(x + 250, y + 78);
  c.stroke();
  c.fillStyle = GLAZE_D;
  for (let i = 0; i < 4; i++) {
    const px = x + 78 + i * 42, py = y + 150 - i * 22;
    c.beginPath();
    c.moveTo(px - 16, py); c.quadraticCurveTo(px, py + 12, px + 16, py); c.lineTo(px + 10, py - 8); c.lineTo(px - 10, py - 8); c.closePath();
    c.fill(); inkPath(c, 1.3); c.stroke();
  }
  c.fillStyle = VERM;
  c.beginPath(); c.arc(x + 168, y + 112, 7, 0, 7); c.fill();
  c.restore();
  TY.text(c, '旧法示意 · 压住脊瓦', x + 36, y + 214, { size: 36, fam: 'PuHui-Bold', color: INK, align: 'left', base: 'alphabetic', alpha: a });
  TY.text(c, '钉是原理，不是现状', x + 36, y + 262, { size: 32, fam: 'LXGWWenKai-500', color: SUB, align: 'left', base: 'alphabetic', alpha: a });
}

function subtitle(c, t) {
  const line = SUBS.find(s => t >= s.t0 && t < s.t1);
  if (!line) return;
  const a = Math.min(1, (t - line.t0) / 0.12, (line.t1 - t) / 0.16);
  const size = line.text.length > 16 ? 72 : 80;
  const w = TY.width(c, line.text, size, 'PuHui-Bold') + 64;
  const x = 960, y = 990;
  c.save();
  c.globalAlpha = a * 0.96;
  c.fillStyle = '#F7F1DE';
  c.fillRect(x - w / 2, y - 58, w, 96);
  inkPath(c, 1.5); c.strokeRect(x - w / 2, y - 58, w, 96);
  c.restore();
  TY.text(c, line.text, x, y + 12, { size, fam: 'PuHui-Bold', color: INK, align: 'center', base: 'middle', alpha: a });
}

let ready = false;
const WUJI = window.WUJI = {
  init() {
    if (ready) return; ready = true;
    const all = SUBS.map(s => s.text).join('') + CHIPS.map(s => s.text).join('') + '旧法示意压住脊瓦钉是原理不是现状';
    U.assertGlyphs('80px "PuHui-Bold"', all, '样镜字幕');
    U.assertGlyphs('36px "LXGWWenKai-500"', '钉是原理不是现状', '样镜卡片');
  },
  draw(c, t) {
    const tile = CL.paperTile('wuji_v3_paper', PAPER, { amt: 11, fibers: 180, grain: 7, seed: 4, fiberCol: [150, 120, 70] });
    CL.fillPaper(c, tile, 0, 0, 1920, 1080);
    const cam = camAt(t);
    c.save();
    CAM.apply(c, cam);
    wall(c);
    slopes(c);
    ridges(c);
    const ah = activeHalo(t);
    const order = BEASTS.map((b, i) => ({ b, i, p: beastPos(i) })).sort((a, b) => a.p.y - b.p.y);
    for (const it of order) {
      c.save();
      c.globalAlpha = 0.10;
      c.fillStyle = INK;
      c.beginPath();
      c.ellipse(it.p.x, it.p.y + 4, 28, 8, -0.5, 0, 7);
      c.fill();
      c.restore();
      drawBeast(c, it.b, it.p.x, it.p.y);
    }
    if (ah) {
      const p = beastPos(ah.i);
      halo(c, p.x, p.y, ah.a);
    }
    chuishou(c);
    chiwen(c, ridgeL.x + 6, ridgeL.y + 8, 1, 1.12);
    chiwen(c, ridgeR.x + 4, ridgeR.y + 6, -1, 0.86);
    trace(c, t);
    c.restore();
    card(c, t);
    chip(c, t);
    subtitle(c, t);
  },
};
})();
