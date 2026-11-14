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
const ZBITE = { x: 660, y: 823 };
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
    { t: 4.70, ax: 980, ay: 728, z: 1.16 },
    { t: 8.15, ax: 980, ay: 728, z: 1.16 },
    { t: 11.90, u: 0.10, z: 1.58, ox: -40, oy: 50 },
    { t: 14.20, u: 0.14, z: 1.52, ox: 0, oy: 16 },
    { t: 21.50, u: 0.90, z: 1.52, ox: 0, oy: 8 },
    { t: 24.10, ax: 980, ay: 728, z: 1.16 },
    { t: 27.00, ax: 980, ay: 728, z: 1.16 },
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

const COLS = 12;

function solidRidge(c, pts, half, halfUp) {
  if (pts.length < 2) return;
  const downAt = (i) => typeof half === 'number' ? half : half[0] + (half[1] - half[0]) * (i / (pts.length - 1));
  const upAt = (i) => halfUp == null ? downAt(i) : halfUp;
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[Math.min(pts.length - 1, i + 1)];
    const r = pts[Math.max(0, i - 1)];
    let dx = i === 0 ? q.x - p.x : i === pts.length - 1 ? p.x - r.x : q.x - r.x;
    let dy = i === 0 ? q.y - p.y : i === pts.length - 1 ? p.y - r.y : q.y - r.y;
    const m = Math.hypot(dx, dy) || 1;
    dx /= m; dy /= m;
    const hd = downAt(i), hu = upAt(i);
    L.push({ x: p.x - dy * hd, y: p.y + dx * hd });
    R.push({ x: p.x + dy * hu, y: p.y - dx * hu });
  }
  c.beginPath();
  L.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  for (let i = R.length - 1; i >= 0; i--) c.lineTo(R[i].x, R[i].y);
  c.closePath();
  c.fillStyle = RIDGE;
  c.fill();
  ink(c, 1.8); c.stroke();
  ink(c, 1.1, INK);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], q = pts[i];
    const seg = Math.hypot(q.x - p.x, q.y - p.y);
    const n = Math.max(1, Math.round(seg / 36));
    for (let k = 1; k < n; k++) {
      const t = k / n;
      const x = p.x + (q.x - p.x) * t, y = p.y + (q.y - p.y) * t;
      const a = Math.atan2(q.y - p.y, q.x - p.x);
      const hd = downAt(i - 1) + (downAt(i) - downAt(i - 1)) * t;
      const hu = upAt(i - 1) + (upAt(i) - upAt(i - 1)) * t;
      const ox = -Math.sin(a), oy = Math.cos(a);
      c.beginPath();
      c.moveTo(x + ox * hd * 0.92, y + oy * hd * 0.92);
      c.lineTo(x - ox * hu * 0.92, y - oy * hu * 0.92);
      c.stroke();
    }
  }
}

function roundCap(c, p, ang, half) {
  c.save();
  c.translate(p.x, p.y);
  c.rotate(ang);
  c.beginPath();
  c.arc(0, 0, half, Math.PI / 2, Math.PI * 1.5, false);
  c.closePath();
  c.fillStyle = RIDGE;
  c.fill();
  ink(c, 1.8); c.stroke();
  c.beginPath();
  c.arc(-half * 0.08, 0, half * 0.62, Math.PI / 2, Math.PI * 1.5, false);
  ink(c, 1.15); c.stroke();
  c.restore();
}

function ridgeSleeve(c, a, b, hd, hu) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const ox = -Math.sin(ang), oy = Math.cos(ang);
  const p = [
    { x: a.x + ox * hd, y: a.y + oy * hd },
    { x: b.x + ox * hd, y: b.y + oy * hd },
    { x: b.x - ox * hu, y: b.y - oy * hu },
    { x: a.x - ox * hu, y: a.y - oy * hu },
  ];
  c.beginPath();
  p.forEach((q, i) => i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y));
  c.closePath();
  c.fillStyle = RIDGE;
  c.fill();
  ink(c, 1.8);
  c.beginPath();
  c.moveTo(p[0].x, p[0].y); c.lineTo(p[1].x, p[1].y);
  c.moveTo(p[3].x, p[3].y); c.lineTo(p[2].x, p[2].y);
  c.stroke();
}

function roof(c, t) {
  const hipPts = sample(hip, 22);
  const up = sample(u => lpt(H2, ridgeL, u), 8).slice(1);
  const spine = hipPts.concat(up);
  const ev = sample(eave, 24);
  const rh = sample(u => quad(ridgeR, { x: (ridgeR.x + eaveR.x) / 2 + 16, y: (ridgeR.y + eaveR.y) / 2 + 6 }, eaveR, u), 12);
  const sidePts = [sideBack, ...spine.slice().reverse(), sideEave];
  const frontPts = [...spine, ridgeR, ...rh.slice(1).reverse(), ...ev.slice().reverse()];

  poly(c, sidePts);
  c.fillStyle = SIDE; c.fill();
  c.save(); c.clip();
  const sideWash = c.createLinearGradient(sideBack.x, sideBack.y, sideEave.x, sideEave.y);
  sideWash.addColorStop(0, '#E7D7B0');
  sideWash.addColorStop(1, '#D2BC90');
  c.fillStyle = sideWash;
  c.fillRect(-400, -400, 4000, 4000);
  ink(c, 1.05, INK_SOFT);
  for (let row = 1; row <= 5; row++) {
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
  const wash = c.createLinearGradient(ridgeL.x, ridgeL.y, eaveMid.x, eaveMid.y);
  wash.addColorStop(0, '#F6E6C2');
  wash.addColorStop(1, '#E3C48C');
  c.fillStyle = wash;
  c.fillRect(-400, -400, 4000, 4000);
  const uL = 0.16 + 0.68 * (0.5 - 0.5 * Math.cos(t * 0.17));
  const light = lpt(lpt(ridgeL, ridgeR, uL), eave(Math.min(0.92, uL + 0.08)), 0.46);
  const glow = c.createRadialGradient(light.x, light.y, 12, light.x, light.y, 250);
  glow.addColorStop(0, 'rgba(255,251,236,0.18)');
  glow.addColorStop(1, 'rgba(255,251,236,0)');
  c.fillStyle = glow;
  c.beginPath(); c.arc(light.x, light.y, 250, 0, Math.PI * 2); c.fill();
  ink(c, 1.05, INK_SOFT);
  for (let i = 0; i < COLS; i++) {
    const u = (i + 0.5) / COLS;
    const top = lpt(ridgeL, ridgeR, u);
    const end = eave(u);
    const dx = end.x - top.x, dy = end.y - top.y;
    const len = Math.hypot(dx, dy) || 1;
    const a = lpt(top, end, 0.16);
    const b = { x: end.x - dx / len * 8, y: end.y - dy / len * 8 };
    if (Math.hypot(b.x - a.x, b.y - a.y) < 36) continue;
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
  }
  for (let row = 1; row <= 4; row++) {
    const v = 0.18 + row * 0.14;
    c.beginPath();
    for (let k = 0; k <= 28; k++) {
      const u = k / 28;
      const top = lpt(ridgeL, ridgeR, u);
      const p = lpt(top, eave(u), v);
      k ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y);
    }
    c.stroke();
  }
  c.restore();
  poly(c, frontPts); ink(c, 1.8); c.stroke();

  // 垂脊收到正脊同宽，角上不再出现一宽一窄的错台。
  const hipBack = spine[spine.length - 2];
  const hipSpan = Math.hypot(ridgeL.x - hipBack.x, ridgeL.y - hipBack.y) || 1;
  const hipEnd = {
    x: ridgeL.x + (hipBack.x - ridgeL.x) / hipSpan * 18,
    y: ridgeL.y + (hipBack.y - ridgeL.y) / hipSpan * 18,
  };
  solidRidge(c, spine.slice(0, -1).concat([hipEnd]), [22, 14]);
  const tipAng = Math.atan2(spine[1].y - spine[0].y, spine[1].x - spine[0].x);
  roundCap(c, spine[0], tipAng, 22);
  const rang = Math.atan2(ridgeR.y - ridgeL.y, ridgeR.x - ridgeL.x);
  const ux = Math.cos(rang), uy = Math.sin(rang);
  const show = t < 8.35 ? 1 : t < 9.15 ? 1 - ease(t, 8.35, 9.15) : t < 22.4 ? 0 : ease(t, 22.4, 23.1);
  const intoMouth = 22;
  const mouthL = { x: ridgeL.x - ux * intoMouth, y: ridgeL.y - uy * intoMouth };
  const mouthR = { x: ridgeR.x + ux * intoMouth, y: ridgeR.y + uy * intoMouth };
  solidRidge(c, [ridgeL, ridgeR], 14);
  roundCap(c, ridgeL, rang, 18);
  roundCap(c, ridgeR, rang + Math.PI, 18);
  if (show > 0.02) {
    c.save();
    c.globalAlpha *= show;
    solidRidge(c, [mouthL, ridgeL], 14);
    solidRidge(c, [ridgeR, mouthR], 14);
    c.restore();
  }

  ink(c, 2.2, INK);
  c.beginPath();
  ev.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  c.stroke();
  if (roof.cam) {
    for (let i = 1; i < COLS - 1; i++) {
      const u = (i + 0.5) / COLS;
      const p = eave(u);
      const rad = 7;
      const [sx, sy] = CAM.toScreen(roof.cam, p.x, p.y);
      const px = rad * roof.cam.z;
      if (sx - px < 28 || sx + px > 1892 || sy - px < 28 || sy + px > 1052) continue;
      c.beginPath();
      c.arc(p.x, p.y, rad, 0, Math.PI * 2);
      c.fillStyle = CELADON; c.fill();
      ink(c, 1.2); c.stroke();
    }
  }
}

function downOf(ang) {
  return { x: -Math.sin(ang), y: Math.cos(ang) };
}

function mountBase(c, bite, ang, inward, alpha) {
  if (alpha < 0.02) return;
  const ux = Math.cos(ang) * inward;
  const uy = Math.sin(ang) * inward;
  const d = downOf(ang);
  const ridgeHalf = 14;
  c.save();
  c.globalAlpha *= alpha;
  for (let i = 0; i < 3; i++) {
    const along = 4 + i * 24;
    const x = bite.x + ux * along + d.x * (ridgeHalf + 5);
    const y = bite.y + uy * along + d.y * (ridgeHalf + 5);
    c.save();
    c.translate(x, y);
    c.rotate(ang);
    c.beginPath();
    c.moveTo(-13, -6);
    c.lineTo(13, -6);
    c.quadraticCurveTo(16, 0, 13, 6);
    c.lineTo(-13, 6);
    c.quadraticCurveTo(-16, 0, -13, -6);
    c.closePath();
    c.fillStyle = RIDGE;
    c.fill();
    ink(c, 1.25); c.stroke();
    c.restore();
  }
  c.restore();
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
  const mx = Math.min(minx, 1920 - maxx);
  const my = Math.min(miny, 1080 - maxy);
  const ax = mx >= 78 ? 1 : mx <= 36 ? 0 : (mx - 36) / 42;
  const ay = my >= 46 ? 1 : my <= 22 ? 0 : (my - 22) / 24;
  return Math.min(ax, ay);
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
    c.globalAlpha = (on ? 1 : presence(it.i, t)) * 0.16;
    c.fillStyle = '#7A6854';
    c.beginPath();
    c.ellipse(it.p.x + 6, it.p.y + 2, 34, 9, -0.4, 0, Math.PI * 2);
    c.fill();
    c.restore();
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
  const a = fade(t, 21.70, 22.05, 26.20, 26.60);
  if (a < 0.02) return;
  const x = 56, y = 48, w = 760, h = 340;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = 'rgba(247,244,238,0.94)';
  c.fillRect(x, y, w, h);
  ink(c, 1.6); c.strokeRect(x, y, w, h);
  const x0 = x + 48, y0 = y + 210;
  const slope = ease(t, 21.88, 22.22);
  ink(c, 2.2);
  c.beginPath();
  c.moveTo(x0, y0);
  c.lineTo(x0 + 280 * slope, y0 - 92 * slope);
  c.stroke();
  c.fillStyle = RIDGE;
  for (let i = 0; i < 5; i++) {
    const ta = ease(t, 22.05 + i * 0.11, 22.38 + i * 0.11);
    if (ta < 0.02) continue;
    const px = x0 + 36 + i * 48, py = y0 - 12 - i * 16;
    const lift = i === 3 ? 10 * ease(t, 22.55, 22.95) : 0;
    c.save();
    c.globalAlpha *= ta;
    c.beginPath();
    c.moveTo(px - 22, py - lift);
    c.lineTo(px + 22, py - 8 - lift);
    c.lineTo(px + 16, py - 22 - lift);
    c.lineTo(px - 28, py - 14 - lift);
    c.closePath();
    c.fill(); ink(c, 1.3); c.stroke();
    c.restore();
  }
  const nail = ease(t, 22.62, 23.12);
  if (nail > 0.02) {
    const x1 = x0 + 168, y1 = y0 - 18;
    const x2 = x0 + 152, y2 = y0 - 96;
    c.strokeStyle = '#241E18'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x1 + (x2 - x1) * nail, y1 + (y2 - y1) * nail);
    c.stroke();
    if (nail > 0.72) {
      const head = ease(t, 22.98, 23.28);
      c.globalAlpha *= head;
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(x2 - 16, y2);
      c.lineTo(x2 + 20, y2 - 10);
      c.stroke();
    }
  }
  c.restore();
  const ta = fade(t, 22.72, 23.08, 26.20, 26.60);
  TY.text(c, '压住脊瓦', x + 360, y + 118, { size: 52, fam: 'PuHui-Bold', color: '#241E18', align: 'left', base: 'alphabetic', alpha: ta });
  TY.text(c, '钉在瓦下', x + 360, y + 186, { size: 48, fam: 'PuHui-Bold', color: '#241E18', align: 'left', base: 'alphabetic', alpha: ta });
  TY.text(c, '旧法示意，不是现状', x + 360, y + 250, { size: 40, fam: 'LXGWWenKai-500', color: '#5C5348', align: 'left', base: 'alphabetic', alpha: ta });
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
    const breathe = Math.sin(t * 0.13) * 5;
    const far = { x: ax + (cam.x - ax) * 0.32 + breathe * 0.25, y: ay + (cam.y - ay) * 0.32, z: cam.z };
    const near = { x: cam.x + (cam.x - ax) * 0.042 + breathe, y: cam.y + (cam.y - ay) * 0.042, z: cam.z * 1.012 };
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
    roof(c, t);
    const showOrnament = t < 8.35 ? 1 : t < 9.15 ? 1 - ease(t, 8.35, 9.15) : t < 22.4 ? 0 : ease(t, 22.4, 23.1);
    const aL = ornamentAlpha(cam, ridgeL, 1, ang) * showOrnament;
    const aR = ornamentAlpha(cam, ridgeR, -1, ang) * showOrnament;
    mountBase(c, ridgeL, ang, 1, aL);
    mountBase(c, ridgeR, ang, -1, aR);
    const drop = downOf(ang);
    const seatL = { x: ridgeL.x + drop.x * -4, y: ridgeL.y + drop.y * -4 };
    const seatR = { x: ridgeR.x + drop.x * 4, y: ridgeR.y + drop.y * 4 };
    zhengwen(c, seatL.x, seatL.y, 1, ang, aL);
    zhengwen(c, seatR.x, seatR.y, -1, ang, aR);
    const ux = Math.cos(ang), uy = Math.sin(ang);
    const sleeve = (bite, inward, alpha) => {
      if (alpha < 0.02) return;
      const a = { x: bite.x - ux * inward * 2, y: bite.y - uy * inward * 2 };
      const b = { x: bite.x + ux * inward * 32, y: bite.y + uy * inward * 32 };
      c.save();
      c.globalAlpha *= alpha;
      ridgeSleeve(c, a, b, 12, 12);
      c.restore();
    };
    sleeve(ridgeL, 1, aL);
    sleeve(ridgeR, -1, aR);
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
