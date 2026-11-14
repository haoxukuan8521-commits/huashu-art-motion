// 样镜：v3p17 十一张走兽原图不动。正吻用审定稿抠底，两端各一，口咬正脊。
// 屋面是淡彩界画：浅琉璃、墨线瓦垄，和走兽同一套暖纸。没有朱红，没有兽头。
(() => {
const { lerp, clamp } = U;
const INK = '#3A332C';
const INK_SOFT = '#6A5E52';
const PAPER = '#F4EEE4';
const SKY = '#E4EEEA';
const FRONT = '#E4C992';
const SIDE = '#D7C095';
const RIDGE = '#EBD6A4';
const RIDGE_F = '#D7BC84';
const CELADON = '#C5D0C4';
const FIG = 186;

const ASSET = 'demos/wuji/assets/';
const ZW = ASSET + 'zhengwen-transparent.png';
const ZBITE = { x: 752, y: 608 };
const ZW_H = 280;

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
window.EXTRA_ASSETS = BEASTS.map(b => ASSET + b.id + '-unified-transparent.png').concat(ZW);

const H0 = { x: 400, y: 1000 };
const H1 = { x: 740, y: 820 };
const H2 = { x: 1060, y: 660 };
const ridgeL = { x: 1280, y: 560 };
const ridgeR = { x: 1460, y: 530 };
const eaveR = { x: 1680, y: 860 };
const eaveMid = { x: 1080, y: 1120 };
const sideBack = { x: 960, y: 360 };
const sideEave = { x: 560, y: 640 };

const SUBS = [
  { t0: 0.10, t1: 2.55, text: '屋顶上，为什么排着一队神兽？' },
  { t0: 2.99, t1: 5.80, text: '正脊两端的大构件，叫正吻。' },
  { t0: 6.25, t1: 8.70, text: '檐角这一小队，才叫走兽。' },
  { t0: 9.06, t1: 10.70, text: '以故宫太和殿为例：' },
  { t0: 10.73, t1: 14.30, text: '最前面是骑凤仙人，不算在十只里面。' },
  { t0: 14.74, t1: 17.58, text: '后面从龙、凤、狮子排起，' },
  { t0: 17.70, t1: 20.42, text: '经过狻猊、狎鱼、獬豸，' },
  { t0: 20.49, t1: 21.48, text: '直到行什。' },
  { t0: 21.94, t1: 24.02, text: '斜脊上的小兽，压住脊瓦，' },
  { t0: 24.08, t1: 25.96, text: '也寄托着平安的祈愿。' },
];

const NAMES = [
  { i: 0, name: '仙人', t0: 0.85, t1: 2.70 },
  { i: 0, name: '仙人', t0: 11.55, t1: 14.20 },
  { i: 1, name: '龙', t0: 15.25, t1: 15.90 },
  { i: 2, name: '凤', t0: 15.88, t1: 16.46 },
  { i: 3, name: '狮子', t0: 16.42, t1: 17.55 },
  { i: 6, name: '狻猊', t0: 18.05, t1: 18.86 },
  { i: 7, name: '狎鱼', t0: 18.84, t1: 19.70 },
  { i: 8, name: '獬豸', t0: 19.68, t1: 20.45 },
  { i: 10, name: '行什', t0: 20.70, t1: 21.70 },
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
function beastU(i) { return 0.04 + i * 0.092; }
function beastPos(i) { return hip(beastU(i)); }

function sample(fn, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push(fn(i / n));
  return pts;
}
function ink(c, w, color) {
  c.lineJoin = 'round'; c.lineCap = 'round';
  c.strokeStyle = color || INK; c.lineWidth = w;
}
function poly(c, pts) {
  c.beginPath();
  pts.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  c.closePath();
}
function walk(pts, step, fn) {
  let acc = 0, prev = pts[0];
  for (let i = 1; i < pts.length; i++) {
    const q = pts[i];
    let dx = q.x - prev.x, dy = q.y - prev.y;
    let seg = Math.hypot(dx, dy) || 1;
    while (acc + seg >= step) {
      const t = (step - acc) / seg;
      const p = lpt(prev, q, t);
      const ang = Math.atan2(dy, dx);
      fn(p, ang);
      prev = p; dx = q.x - p.x; dy = q.y - p.y; seg = Math.hypot(dx, dy) || 1; acc = 0;
    }
    acc += seg; prev = q;
  }
}

function camAt(t) {
  const keys = [
    { t: 0.00, ax: 860, ay: 820, z: 1.38 },
    { t: 2.60, ax: 980, ay: 760, z: 1.48 },
    { t: 4.70, ax: 980, ay: 760, z: 1.18 },
    { t: 8.15, ax: 980, ay: 760, z: 1.18 },
    { t: 11.90, u: 0.10, z: 1.58, ox: -40, oy: 50 },
    { t: 14.20, u: 0.14, z: 1.52, ox: 0, oy: 16 },
    { t: 21.50, u: 0.90, z: 1.52, ox: 0, oy: 8 },
    { t: 24.10, ax: 980, ay: 780, z: 1.18 },
    { t: 27.00, ax: 980, ay: 780, z: 1.18 },
  ];
  let i = 0;
  while (i < keys.length - 2 && t >= keys[i + 1].t) i++;
  const a = keys[i], b = keys[i + 1];
  const e = MO.smooth(MO.seg(t, a.t, b.t));
  const focus = (k) => k.ax != null ? { x: k.ax, y: k.ay } : { x: hip(k.u).x + (k.ox || 0), y: hip(k.u).y + (k.oy || 0) };
  const pa = focus(a), pb = focus(b);
  return { x: lerp(pa.x, pb.x, e), y: lerp(pa.y, pb.y, e), z: CAM.zlerp(a.z, b.z, e) };
}

function sky(c) {
  const g = c.createLinearGradient(0, 0, 0, 1080);
  g.addColorStop(0, SKY);
  g.addColorStop(0.42, '#F3F1EA');
  g.addColorStop(1, '#E7D7B8');
  c.fillStyle = g;
  c.fillRect(0, 0, 1920, 1080);
  const tile = CL.paperTile('wuji_v4_paper', PAPER, { amt: 8, fibers: 140, grain: 5, seed: 6, fiberCol: [170, 150, 120] });
  c.save();
  c.globalAlpha = 0.28;
  CL.fillPaper(c, tile, 0, 0, 1920, 1080);
  c.restore();
}

function roof(c) {
  const hipPts = sample(hip, 22);
  const up = sample(u => lpt(H2, ridgeL, u), 8).slice(1);
  const spine = hipPts.concat(up);
  const ev = sample(eave, 20);

  const rh = sample(u => quad({ x: ridgeR.x + 10, y: ridgeR.y + 16 }, { x: (ridgeR.x + eaveR.x) / 2 + 28, y: (ridgeR.y + eaveR.y) / 2 }, eaveR, u), 10);
  const sidePts = [sideBack, ...spine.slice().reverse(), sideEave];
  const frontPts = [...spine, { x: ridgeL.x + 14, y: ridgeL.y + 16 }, { x: ridgeR.x + 12, y: ridgeR.y + 14 }, ...rh.slice().reverse(), ...ev.slice().reverse()];

  poly(c, sidePts);
  c.fillStyle = SIDE; c.fill();
  c.save(); c.clip();
  ink(c, 1.05, INK_SOFT);
  for (let row = 1; row <= 6; row++) {
    const v = row / 7;
    c.beginPath();
    for (let k = 0; k <= 14; k++) {
      const u = k / 14;
      const p = lpt(lpt(sideBack, ridgeL, u), lpt(sideEave, H0, u), v);
      k ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y);
    }
    c.stroke();
  }
  c.restore();
  poly(c, sidePts); ink(c, 1.7); c.stroke();

  poly(c, frontPts);
  c.fillStyle = FRONT; c.fill();
  c.save(); c.clip();
  ink(c, 1.2, INK_SOFT);
  for (let row = 1; row <= 8; row++) {
    const v = row / 9;
    c.beginPath();
    for (let k = 0; k <= 22; k++) {
      const u = k / 22;
      const top = lpt({ x: ridgeL.x + 14, y: ridgeL.y + 16 }, { x: ridgeR.x + 12, y: ridgeR.y + 14 }, u);
      const p = lpt(top, eave(u), v);
      k ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y);
    }
    c.stroke();
  }
  c.restore();
  poly(c, frontPts); ink(c, 1.8); c.stroke();

  const ang = Math.atan2(ridgeR.y - ridgeL.y, ridgeR.x - ridgeL.x);
  function solidRidge(pts, half) {
    if (pts.length < 2) return;
    const L = [], R = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[Math.min(pts.length - 1, i + 1)];
      const r = pts[Math.max(0, i - 1)];
      let dx = i === 0 ? q.x - p.x : i === pts.length - 1 ? p.x - r.x : q.x - r.x;
      let dy = i === 0 ? q.y - p.y : i === pts.length - 1 ? p.y - r.y : q.y - r.y;
      const m = Math.hypot(dx, dy) || 1;
      dx /= m; dy /= m;
      L.push({ x: p.x - dy * half, y: p.y + dx * half });
      R.push({ x: p.x + dy * half, y: p.y - dx * half });
    }
    c.beginPath();
    L.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
    for (let i = R.length - 1; i >= 0; i--) c.lineTo(R[i].x, R[i].y);
    c.closePath();
    c.fillStyle = RIDGE;
    c.fill();
    ink(c, 1.8); c.stroke();
    ink(c, 1.15, INK);
    walk(pts, 34, (p, a) => {
      const ox = -Math.sin(a) * half, oy = Math.cos(a) * half;
      c.beginPath();
      c.moveTo(p.x - ox, p.y - oy);
      c.lineTo(p.x + ox, p.y + oy);
      c.stroke();
    });
  }
  solidRidge(spine, 24);
  const nx = Math.sin(ang), ny = -Math.cos(ang);
  const beam = [ridgeL, ridgeR, { x: ridgeR.x + nx * 22, y: ridgeR.y + ny * 22 }, { x: ridgeL.x + nx * 22, y: ridgeL.y + ny * 22 }];
  c.save();
  poly(c, frontPts); c.clip();
  poly(c, beam);
  c.fillStyle = RIDGE_F; c.fill();
  ink(c, 1.7); c.stroke();
  ink(c, 1.15, INK);
  walk([ridgeL, ridgeR], 32, (p) => {
    c.beginPath();
    c.moveTo(p.x, p.y);
    c.lineTo(p.x + nx * 22, p.y + ny * 22);
    c.stroke();
  });
  c.restore();

  ink(c, 2.2, INK);
  c.beginPath();
  ev.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  c.stroke();
  if (roof.cam) {
    walk(ev, 46, (p) => {
      const [sx, sy] = CAM.toScreen(roof.cam, p.x, p.y + 5);
      if (sx < 48 || sx > 1872 || sy < 48 || sy > 1032) return;
      c.beginPath();
      c.arc(p.x, p.y + 5, 6.5, 0, Math.PI * 2);
      c.fillStyle = CELADON; c.fill();
      ink(c, 1.2); c.stroke();
    });
  }
}

function ornamentAlpha(cam, bite, dir, ang) {
  const im = window.IMG[ZW];
  if (!im) return 0;
  const s = ZW_H / im.height;
  const corners = [[88, 70], [772, 70], [88, 1048], [772, 1048]];
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
  for (const [ix, iy] of corners) {
    const lx = (ix - ZBITE.x) * s * dir;
    const ly = (iy - ZBITE.y) * s;
    const wx = bite.x + lx * Math.cos(ang) - ly * Math.sin(ang);
    const wy = bite.y + lx * Math.sin(ang) + ly * Math.cos(ang);
    const [sx, sy] = CAM.toScreen(cam, wx, wy);
    minx = Math.min(minx, sx); maxx = Math.max(maxx, sx);
    miny = Math.min(miny, sy); maxy = Math.max(maxy, sy);
  }
  const edge = Math.min(minx, 1920 - maxx, miny, 1080 - maxy);
  if (edge >= 90) return 1;
  if (edge <= 48) return 0;
  return (edge - 48) / 42;
}

function zhengwen(c, x, y, dir, ang, alpha) {
  const im = window.IMG[ZW];
  if (!im || alpha < 0.02) return;
  const s = ZW_H / im.height;
  c.save();
  c.globalAlpha *= alpha;
  c.translate(x, y);
  c.rotate(ang);
  c.scale(dir, 1);
  c.drawImage(im, -ZBITE.x * s, -ZBITE.y * s, im.width * s, im.height * s);
  c.restore();
}

function drawBeast(c, b, x, y) {
  const im = window.IMG[ASSET + b.id + '-unified-transparent.png'];
  if (!im) return;
  const s = FIG / b.srcH;
  c.drawImage(im, x - b.cx * s, y - b.foot * s, im.width * s, im.height * s);
}

function activeName(t) {
  for (const n of NAMES) {
    const a = fade(t, n.t0, n.t0 + 0.35, n.t1 - 0.35, n.t1);
    if (a > 0.04) return { ...n, a };
  }
  return null;
}

function presence(i, t) {
  const hook = ease(t, 0.20 + i * 0.16, 0.62 + i * 0.16);
  const along = ease(t, 14.3 + i * 0.5, 14.85 + i * 0.5);
  const p = t < 13.8 ? hook : Math.max(hook, along);
  return 0.72 + 0.28 * p;
}

function beasts(c, t) {
  const act = activeName(t);
  const order = BEASTS.map((b, i) => ({ b, i, p: beastPos(i) })).sort((a, b) => a.p.y - b.p.y);
  for (const it of order) {
    const on = act && act.i === it.i;
    if (on) {
      c.save();
      const g = c.createRadialGradient(it.p.x, it.p.y - FIG * 0.5, 8, it.p.x, it.p.y - FIG * 0.5, FIG * 0.85);
      g.addColorStop(0, `rgba(255,246,220,${0.9 * act.a})`);
      g.addColorStop(1, 'rgba(255,246,220,0)');
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(it.p.x, it.p.y - FIG * 0.46, FIG * 0.62, FIG * 0.7, 0, 0, 7);
      c.fill();
      c.restore();
    }
    c.save();
    c.globalAlpha = on ? 1 : presence(it.i, t);
    drawBeast(c, it.b, it.p.x, it.p.y);
    c.restore();
  }
  return act;
}

function tag(c, cam, world, text, alpha, lift) {
  if (!text || alpha < 0.03) return;
  let [sx, sy] = CAM.toScreen(cam, world.x, world.y - (lift || FIG + 8));
  sx = clamp(sx, 110, 1810);
  sy = clamp(sy, 48, 860);
  const size = 50;
  const w = TY.width(c, text, size, 'PuHui-Bold') + 32;
  c.save();
  c.globalAlpha = alpha;
  c.fillStyle = 'rgba(251,247,240,0.92)';
  c.fillRect(sx - w / 2, sy - 40, w, 58);
  ink(c, 1.2); c.strokeRect(sx - w / 2, sy - 40, w, 58);
  c.restore();
  TY.text(c, text, sx, sy + 2, { size, fam: 'PuHui-Bold', color: '#241E18', align: 'center', base: 'middle', alpha });
}

function labels(c, cam, t, act) {
  const zwA = fade(t, 4.55, 4.85, 6.15, 6.45);
  if (zwA > 0.03) tag(c, cam, { x: ridgeL.x - 160, y: ridgeL.y - 80 }, '正吻', zwA, 80);
  const zsA = fade(t, 6.90, 7.15, 8.70, 9.05);
  const mid = beastPos(3);
  if (zsA > 0.03) tag(c, cam, { x: mid.x - 70, y: mid.y - FIG - 70 }, '走兽', zsA, 10);
  if (act) tag(c, cam, beastPos(act.i), act.name, act.a, FIG + 10);
}

function card(c, t) {
  const a = fade(t, 21.70, 22.10, 26.20, 26.60);
  if (a < 0.02) return;
  const x = 56, y = 48, w = 760, h = 340;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = 'rgba(247,244,238,0.94)';
  c.fillRect(x, y, w, h);
  ink(c, 1.6); c.strokeRect(x, y, w, h);
  const x0 = x + 48, y0 = y + 196;
  ink(c, 2.2);
  c.beginPath();
  c.moveTo(x0, y0); c.lineTo(x0 + 280, y0 - 92); c.stroke();
  c.fillStyle = RIDGE;
  for (let i = 0; i < 5; i++) {
    const px = x0 + 36 + i * 48, py = y0 - 12 - i * 16;
    c.beginPath();
    c.moveTo(px - 22, py); c.lineTo(px + 22, py - 8); c.lineTo(px + 16, py - 22); c.lineTo(px - 28, py - 14); c.closePath();
    c.fill(); ink(c, 1.3); c.stroke();
  }
  c.strokeStyle = '#241E18'; c.lineWidth = 5; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x0 + 168, y0 - 8); c.lineTo(x0 + 152, y0 - 86); c.stroke();
  c.lineWidth = 7;
  c.beginPath(); c.moveTo(x0 + 136, y0 - 86); c.lineTo(x0 + 172, y0 - 96); c.stroke();
  c.restore();
  TY.text(c, '压住脊瓦', x + 360, y + 118, { size: 52, fam: 'PuHui-Bold', color: '#241E18', align: 'left', base: 'alphabetic', alpha: a });
  TY.text(c, '钉在瓦下', x + 360, y + 186, { size: 48, fam: 'PuHui-Bold', color: '#241E18', align: 'left', base: 'alphabetic', alpha: a });
  TY.text(c, '旧法示意，不是现状', x + 360, y + 250, { size: 40, fam: 'LXGWWenKai-500', color: '#5C5348', align: 'left', base: 'alphabetic', alpha: a });
}

function subtitle(c, t) {
  const line = SUBS.find(s => t >= s.t0 && t < s.t1);
  if (!line) return;
  const a = Math.min(1, (t - line.t0) / 0.28, (line.t1 - t) / 0.28);
  const size = line.text.length > 16 ? 68 : 76;
  const w = TY.width(c, line.text, size, 'PuHui-Bold') + 56;
  const x = 960, y = 1000;
  c.save();
  c.globalAlpha = a * 0.96;
  c.fillStyle = '#FBF7F0';
  c.fillRect(x - w / 2, y - 52, w, 86);
  ink(c, 1.3); c.strokeRect(x - w / 2, y - 52, w, 86);
  c.restore();
  TY.text(c, line.text, x, y + 8, { size, fam: 'PuHui-Bold', color: '#241E18', align: 'center', base: 'middle', alpha: a });
}

let ready = false;
const WUJI = window.WUJI = {
  init() {
    if (ready) return; ready = true;
    const all = SUBS.map(s => s.text).join('') + NAMES.map(n => n.name).join('') + '正吻走兽压住脊瓦钉在瓦下旧法示意不是现状';
    U.assertGlyphs('76px "PuHui-Bold"', all, '样镜');
    U.assertGlyphs('40px "LXGWWenKai-500"', '旧法示意，不是现状', '样镜卡片');
  },
  draw(c, t) {
    sky(c);
    const cam = camAt(t);
    const ang = Math.atan2(ridgeR.y - ridgeL.y, ridgeR.x - ridgeL.x);
    const ax = 980, ay = 760;
    const far = { x: ax + (cam.x - ax) * 0.4, y: ay + (cam.y - ay) * 0.4, z: cam.z };
    const near = { x: cam.x + (cam.x - ax) * 0.018, y: cam.y + (cam.y - ay) * 0.018, z: cam.z };
    c.save();
    CAM.apply(c, far);
    c.globalAlpha = 0.28;
    c.fillStyle = '#F7FBFA';
    for (let i = 0; i < 5; i++) {
      const x = 260 + i * 280 + Math.sin(t * 0.08 + i) * 28;
      const y = 430 + (i % 2) * 50 + Math.cos(t * 0.06 + i) * 12;
      c.beginPath(); c.ellipse(x, y, 78, 13, 0.05, 0, 7); c.fill();
    }
    c.globalAlpha = 0.4;
    c.strokeStyle = '#7E9894'; c.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const x = 180 + ((t * 16 + i * 460) % 1500);
      const y = 390 + i * 36;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 11, y - 3); c.lineTo(x, y + 1); c.lineTo(x + 11, y + 4); c.stroke();
    }
    c.restore();
    c.save();
    CAM.apply(c, cam);
    roof.cam = cam;
    roof(c);
    const showOrnament = t < 8.35 ? 1 : t < 9.15 ? 1 - ease(t, 8.35, 9.15) : t < 22.4 ? 0 : ease(t, 22.4, 23.1);
    zhengwen(c, ridgeL.x, ridgeL.y, 1, ang, ornamentAlpha(cam, ridgeL, 1, ang) * showOrnament);
    zhengwen(c, ridgeR.x, ridgeR.y, -1, ang, ornamentAlpha(cam, ridgeR, -1, ang) * showOrnament);
    c.restore();
    c.save();
    CAM.apply(c, near);
    const act = beasts(c, t);
    c.restore();
    labels(c, near, t, act);
    card(c, t);
    subtitle(c, t);
  },
};
})();
