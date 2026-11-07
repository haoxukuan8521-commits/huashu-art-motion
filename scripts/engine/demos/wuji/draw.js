// 原创界画示意。造型对照故宫院刊 2014 年第 2 期图一（太和殿走兽）、图二（行什）目视核对，
// 不把照片描进成片。正吻 ≠ 檐角走兽；仙人与后方兽头不进十只。行什：猴面、双翼、持杵，不扇翅、不眨眼。
(() => {
const { lerp, clamp } = U;
const INK = '#1C1914';
const SUB = '#5C564C';
const PAPER = '#F3E6C4';
const VERM = '#C23A2E';
const GOLD = '#E2B33A';
const GOLD_D = '#A87420';
const GREEN = '#2E7D4F';
const ridgeL = { x: 700, y: 268 };
const ridgeR = { x: 1260, y: 236 };
const cornerL = { x: 360, y: 708 };
const cornerR = { x: 1580, y: 628 };

const QUEUE = [
  { kind: 'xian', u0: 0.00, u1: 0.00 },
  { kind: 'dragon', u0: 0.09, u1: 0.13 },
  { kind: 'phoenix', u0: 0.17, u1: 0.22 },
  { kind: 'lion', u0: 0.25, u1: 0.31 },
  { kind: 'tianma', u0: 0.33, u1: 0.40 },
  { kind: 'haima', u0: 0.41, u1: 0.48 },
  { kind: 'suanni', u0: 0.49, u1: 0.56 },
  { kind: 'yayu', u0: 0.57, u1: 0.64 },
  { kind: 'xiezhi', u0: 0.65, u1: 0.72 },
  { kind: 'douniu', u0: 0.73, u1: 0.80 },
  { kind: 'xingshi', u0: 0.82, u1: 0.84 },
  { kind: 'head', u0: 0.94, u1: 1 },
];

const SUBS = [
  { t0: 0.10, t1: 2.85, text: '屋顶上，为什么排着一队神兽？' },
  { t0: 2.99, t1: 4.55, text: '先别急着数。' },
  { t0: 4.72, t1: 7.80, text: '正脊两端的大构件，叫正吻。' },
  { t0: 7.98, t1: 10.60, text: '檐角这一小队，才叫走兽。' },
  { t0: 10.79, t1: 13.15, text: '位置不同，别混成一队。' },
  { t0: 13.34, t1: 14.98, text: '以故宫太和殿为例：' },
  { t0: 15.04, t1: 17.05, text: '最前面是骑凤仙人，' },
  { t0: 17.16, t1: 19.40, text: '后面才是十只走兽。' },
  { t0: 19.59, t1: 21.85, text: '开头是龙、凤和狮子，' },
  { t0: 21.97, t1: 23.85, text: '最后一只是行什。' },
  { t0: 24.06, t1: 25.85, text: '仙人不算进这十只；' },
  { t0: 25.97, t1: 29.40, text: '后方的兽头，也不加进计数。' },
];

const lp = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
const hipL = (v) => lp(ridgeL, cornerL, v);
const hipR = (v) => lp(ridgeR, cornerR, v);
const ease = (t, a, b) => MO.smooth(MO.seg(t, a, b));
const spread = (t) => ease(t, 15.05, 18.2);
const fade = (t, a, b, c, d) => Math.min(ease(t, a, b), 1 - ease(t, c, d));

function camAt(t) {
  const keys = [
    { t: 0, x: 980, y: 470, z: 1.12 },
    { t: 4.55, x: 980, y: 470, z: 1.12 },
    { t: 7.5, x: 990, y: 360, z: 1.2 },
    { t: 10.6, x: 620, y: 520, z: 1.28 },
    { t: 14.9, x: 640, y: 510, z: 1.28 },
    { t: 18.3, x: 960, y: 590, z: 1.58 },
    { t: 22.1, x: 960, y: 590, z: 1.58 },
    { t: 23.95, x: 1120, y: 575, z: 1.72 },
    { t: 25.9, x: 980, y: 585, z: 1.5 },
    { t: 29.4, x: 980, y: 585, z: 1.5 },
  ];
  return CAM.at(keys.map((k, i) => ({ ...k, ease: i === 0 ? MO.linear : MO.smooth })), t);
}

function queueU(item, sp) { return lerp(item.u0, item.u1, sp); }
function queuePos(item, sp) {
  const u = queueU(item, sp);
  const onHip = hipL(lerp(0.88, 0.16, u));
  const onRow = lp({ x: 520, y: 630 }, { x: 1400, y: 520 }, u);
  return lp(onHip, onRow, sp);
}

function ink(c, w) {
  c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = w || 2.2;
  c.lineJoin = 'round'; c.lineCap = 'round';
}
function goldFill(c) { c.fillStyle = GOLD; c.strokeStyle = INK; c.lineWidth = 2.2; c.lineJoin = 'round'; }
function paint(c) { c.fill(); c.stroke(); }

function tileArc(c, x, y, s) {
  c.beginPath();
  c.arc(x, y, 11 * s, Math.PI * 1.05, Math.PI * 1.95);
  c.stroke();
}

function roof(c, t) {
  const side = [ridgeL, cornerL, { x: cornerL.x + 70, y: cornerL.y + 58 }, { x: ridgeL.x + 36, y: ridgeL.y + 46 }];
  c.beginPath();
  side.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
  c.closePath();
  c.fillStyle = '#E7D3A4';
  c.fill();
  ink(c, 1.6); c.stroke();

  c.beginPath();
  c.moveTo(ridgeL.x, ridgeL.y); c.lineTo(ridgeR.x, ridgeR.y);
  c.lineTo(cornerR.x, cornerR.y); c.lineTo(cornerL.x, cornerL.y);
  c.closePath();
  c.fillStyle = '#F6E7C2';
  c.fill();
  ink(c, 2.4); c.stroke();

  ink(c, 1.15);
  c.strokeStyle = SUB;
  for (let row = 1; row <= 7; row++) {
    const v = row / 8;
    const L = lp(ridgeL, cornerL, v), R = lp(ridgeR, cornerR, v);
    for (let k = 0; k <= 14; k++) {
      const p = lp(L, R, k / 14);
      tileArc(c, p.x, p.y, 1);
    }
  }

  // 正脊
  const ridgeP = ease(t, 3.05, 4.55);
  c.save();
  c.strokeStyle = GOLD_D; c.lineWidth = 16; c.lineCap = 'butt';
  c.globalAlpha = 0.9;
  c.beginPath(); c.moveTo(ridgeL.x, ridgeL.y); c.lineTo(ridgeR.x, ridgeR.y); c.stroke();
  ink(c, 2); c.strokeStyle = INK;
  c.beginPath(); c.moveTo(ridgeL.x, ridgeL.y - 9); c.lineTo(ridgeR.x, ridgeR.y - 9); c.stroke();
  c.beginPath(); c.moveTo(ridgeL.x, ridgeL.y + 9); c.lineTo(ridgeR.x, ridgeR.y + 9); c.stroke();
  if (ridgeP > 0 && ridgeP < 1) {
    c.strokeStyle = VERM; c.lineWidth = 3; c.globalAlpha = 0.9;
    const q = lp(ridgeL, ridgeR, ridgeP);
    c.beginPath(); c.moveTo(ridgeL.x, ridgeL.y); c.lineTo(q.x, q.y); c.stroke();
  }
  c.restore();

  // 檐口
  ink(c, 8); c.strokeStyle = '#8E2E28';
  c.beginPath(); c.moveTo(cornerL.x, cornerL.y + 8); c.lineTo(cornerR.x, cornerR.y + 6); c.stroke();
  for (let k = 0; k < 6; k++) {
    const p = lp(cornerL, cornerR, 0.14 + k * 0.14);
    c.fillStyle = GREEN;
    c.fillRect(p.x - 7, p.y + 14, 14, 7);
    c.fillRect(p.x - 12, p.y + 21, 24, 5);
    ink(c, 1.1);
    c.strokeRect(p.x - 7, p.y + 14, 14, 7);
    c.strokeRect(p.x - 12, p.y + 21, 24, 5);
  }

  ink(c, 3); c.strokeStyle = GOLD_D;
  c.beginPath(); c.moveTo(ridgeL.x, ridgeL.y); c.lineTo(cornerL.x, cornerL.y); c.stroke();
  c.globalAlpha = 0.55;
  c.beginPath(); c.moveTo(ridgeR.x, ridgeR.y); c.lineTo(cornerR.x, cornerR.y); c.stroke();
  c.globalAlpha = 1;
}

function chiwen(c, x, y, dir) {
  // 口在原点，咬住正脊；尾向外侧卷起。dir=1 头朝右，dir=-1 头朝左。
  c.save();
  c.translate(x, y); c.scale(dir, 1);
  c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = '#C23A2E'; c.strokeStyle = INK; c.lineWidth = 2.6;
  // 卷尾
  c.beginPath();
  c.arc(-36, -96, 26, 0.15, Math.PI * 1.75);
  c.lineWidth = 14; c.strokeStyle = '#C23A2E'; c.stroke();
  c.beginPath();
  c.arc(-36, -96, 26, 0.2, Math.PI * 1.7);
  c.strokeStyle = INK; c.lineWidth = 2.4; c.stroke();
  // 身与颈
  c.beginPath();
  c.moveTo(-18, -78);
  c.quadraticCurveTo(-28, -36, -6, -8);
  c.lineTo(8, 4);
  c.lineTo(46, 6);
  c.lineTo(42, -12);
  c.quadraticCurveTo(18, -18, 8, -36);
  c.quadraticCurveTo(-2, -62, -14, -88);
  c.closePath();
  c.fill(); c.stroke();
  // 头
  c.beginPath(); c.ellipse(2, -30, 24, 18, -0.4, 0, Math.PI * 2); c.fill(); c.stroke();
  // 张开的口，脊伸进去
  c.fillStyle = PAPER;
  c.beginPath();
  c.moveTo(6, -4); c.lineTo(52, 0); c.lineTo(48, -14); c.lineTo(8, -16); c.closePath();
  c.fill(); c.stroke();
  // 角，向后弯，不是天线
  c.strokeStyle = INK; c.lineWidth = 4;
  c.beginPath(); c.moveTo(-8, -44); c.quadraticCurveTo(-24, -62, -6, -84); c.stroke();
  // 鳞
  c.lineWidth = 1.5; c.strokeStyle = '#7A241C';
  for (let i = 0; i < 4; i++) {
    c.beginPath(); c.arc(-8, -18 - i * 14, 6, 0.15, Math.PI - 0.1); c.stroke();
  }
  c.fillStyle = GOLD;
  c.beginPath(); c.arc(-2, -32, 3.2, 0, Math.PI * 2); c.fill();
  c.strokeStyle = INK; c.stroke();
  c.restore();
}

function ring(c, x, y, rx, ry, p) {
  if (p <= 0.01) return;
  c.save();
  c.strokeStyle = VERM; c.lineWidth = 3.2; c.globalAlpha = Math.min(1, p * 1.4);
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, p));
  c.stroke();
  c.restore();
}

function pedestal(c, rx) {
  c.beginPath(); c.ellipse(0, 2, rx || 24, 7, 0, 0, Math.PI * 2);
  c.fillStyle = GOLD_D; c.strokeStyle = INK; c.lineWidth = 2; c.fill(); c.stroke();
}
function haunch(c) {
  goldFill(c);
  c.beginPath(); c.ellipse(8, -26, 20, 22, 0, 0, Math.PI * 2); paint(c);
  c.beginPath(); c.ellipse(-6, -34, 12, 14, 0, 0, Math.PI * 2); paint(c);
  c.beginPath();
  c.moveTo(-14, -22); c.lineTo(-18, -2); c.lineTo(-8, 0); c.lineTo(-4, -20); c.closePath(); paint(c);
  c.beginPath();
  c.moveTo(16, -16); c.lineTo(22, 0); c.lineTo(10, 2); c.lineTo(8, -16); c.closePath(); paint(c);
}

function horn(c, x, y, x2, y2) {
  c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo((x + x2) / 2 - 6, (y + y2) / 2, x2, y2);
  c.lineWidth = 3; c.stroke();
}

function beastDragon(c, detail) {
  pedestal(c, 26); haunch(c);
  goldFill(c);
  c.beginPath();
  c.moveTo(-4, -46);
  c.quadraticCurveTo(-16, -70, -36, -74);
  c.lineTo(-62, -68);
  c.lineTo(-54, -58);
  c.quadraticCurveTo(-30, -60, -12, -48);
  c.closePath();
  paint(c);
  c.beginPath(); c.moveTo(-38, -66); c.quadraticCurveTo(-58, -58, -66, -48); c.lineTo(-52, -46); c.stroke();
  horn(c, -30, -78, -14, -108);
  horn(c, -18, -74, 2, -104);
  c.beginPath(); c.moveTo(-48, -60); c.quadraticCurveTo(-70, -78, -58, -50); c.lineWidth = 1.6; c.stroke();
  c.beginPath(); c.moveTo(-8, -60); c.quadraticCurveTo(6, -88, 18, -62); c.lineWidth = 2.2; c.stroke();
  if (detail > 0.4) {
    c.lineWidth = 1.3; c.beginPath(); c.arc(-46, -66, 2, 0, 7); c.stroke();
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(2 + i * 8, -30, 4, 0.4, Math.PI); c.stroke(); }
  }
}

function beastPhoenix(c, detail) {
  pedestal(c, 28);
  goldFill(c);
  c.beginPath(); c.ellipse(6, -24, 18, 16, 0, 0, 7); paint(c);
  c.beginPath();
  c.moveTo(-2, -34); c.quadraticCurveTo(-24, -48, -46, -36); c.lineTo(-58, -28); c.lineTo(-36, -26); c.quadraticCurveTo(-16, -30, 0, -24);
  c.closePath(); paint(c);
  // 冠
  c.beginPath();
  c.moveTo(-18, -42); c.lineTo(-22, -68); c.lineTo(-10, -44);
  c.moveTo(-10, -40); c.lineTo(-6, -64); c.lineTo(2, -40);
  c.lineWidth = 2.6; c.stroke();
  // 翅与尾
  c.beginPath();
  c.moveTo(8, -30); c.quadraticCurveTo(28, -58, 24, -22); c.closePath(); goldFill(c); paint(c);
  c.beginPath();
  c.moveTo(16, -16); c.quadraticCurveTo(46, -28, 52, -6); c.quadraticCurveTo(34, -8, 18, -8);
  c.closePath(); paint(c);
  if (detail > 0.4) { c.beginPath(); c.moveTo(14, -40); c.lineTo(26, -48); c.moveTo(16, -32); c.lineTo(28, -34); c.stroke(); }
}

function beastLion(c, detail) {
  pedestal(c, 26); haunch(c);
  goldFill(c);
  c.beginPath(); c.arc(-16, -62, 22, 0, Math.PI * 2); paint(c);
  c.beginPath(); c.arc(-34, -58, 8, 0, 7); paint(c);
  c.beginPath(); c.moveTo(-24, -82); c.lineTo(-28, -96); c.lineTo(-16, -82); c.stroke();
  c.beginPath(); c.moveTo(-6, -82); c.lineTo(-2, -94); c.lineTo(6, -80); c.stroke();
  if (detail > 0.4) {
    c.lineWidth = 1.4;
    c.beginPath(); c.arc(-24, -64, 2, 0, 7); c.stroke();
    c.beginPath(); c.arc(-14, -54, 7, 0.3, Math.PI - 0.2); c.stroke();
  }
}

function beastHorse(c, detail, sea) {
  pedestal(c, 26); haunch(c);
  goldFill(c);
  c.beginPath();
  c.moveTo(-2, -46);
  c.lineTo(-8, -62);
  c.lineTo(-48, -66);
  c.lineTo(-66, -58);
  c.lineTo(-46, -52);
  c.lineTo(-8, -42);
  c.closePath();
  paint(c);
  c.beginPath(); c.moveTo(-20, -64); c.lineTo(-26, -84); c.lineTo(-12, -66); c.stroke();
  c.beginPath(); c.moveTo(-8, -62); c.lineTo(-4, -82); c.lineTo(4, -60); c.stroke();
  c.beginPath(); c.moveTo(-14, -64); c.quadraticCurveTo(4, -86, 16, -58); c.stroke();
  if (sea) {
    c.beginPath(); c.moveTo(2, -48); c.lineTo(10, -74); c.lineTo(20, -44); c.closePath();
    goldFill(c); paint(c);
    if (detail > 0.4) {
      c.lineWidth = 1.2;
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-2 + i * 8, -28, 4, 0.3, Math.PI); c.stroke(); }
    }
  }
}

function beastSuanni(c, detail) {
  beastLion(c, detail);
  c.beginPath();
  c.moveTo(-16, -84);
  c.quadraticCurveTo(-26, -108, -8, -90);
  c.quadraticCurveTo(-2, -112, 8, -86);
  c.lineWidth = 2.4; c.stroke();
}

function beastYayu(c, detail) {
  pedestal(c, 26); haunch(c);
  goldFill(c);
  c.beginPath(); c.ellipse(-22, -58, 18, 14, -0.2, 0, 7); paint(c);
  c.beginPath(); c.arc(-38, -56, 5.5, 0, 7); c.stroke();
  c.beginPath(); c.moveTo(-6, -64); c.lineTo(2, -86); c.lineTo(12, -52); c.closePath(); paint(c);
  if (detail > 0.4) {
    c.fillStyle = INK; c.beginPath(); c.arc(-26, -60, 2.2, 0, 7); c.fill();
    c.strokeStyle = INK; c.lineWidth = 1.2;
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(2 + i * 8, -24, 4, 0.2, Math.PI); c.stroke(); }
  }
}

function beastXiezhi(c, detail) {
  pedestal(c, 26); haunch(c);
  goldFill(c);
  c.beginPath(); c.ellipse(-14, -58, 16, 14, 0, 0, 7); paint(c);
  horn(c, -14, -72, -12, -108);
  if (detail > 0.4) { c.beginPath(); c.arc(-20, -60, 2, 0, 7); c.stroke(); }
}

function beastDouniu(c, detail) {
  pedestal(c, 28); haunch(c);
  goldFill(c);
  c.beginPath(); c.ellipse(-12, -56, 18, 15, 0, 0, 7); paint(c);
  horn(c, -22, -66, -36, -96);
  horn(c, -2, -66, 12, -96);
  if (detail > 0.4) { c.beginPath(); c.arc(-16, -58, 2, 0, 7); c.stroke(); }
}

function beastXingshi(c, detail) {
  pedestal(c, 22);
  goldFill(c);
  // 直立陶身，爪足
  c.beginPath();
  c.moveTo(-12, -2); c.lineTo(-16, -34); c.quadraticCurveTo(-18, -58, -4, -64);
  c.lineTo(12, -64); c.quadraticCurveTo(20, -40, 14, -4); c.closePath();
  paint(c);
  c.beginPath(); c.ellipse(0, -36, 11, 14, 0, 0, 7); c.fillStyle = '#F3D78A'; paint(c);
  // 双翼静止
  c.beginPath();
  c.moveTo(8, -56); c.quadraticCurveTo(42, -92, 58, -48); c.quadraticCurveTo(36, -44, 14, -36);
  c.closePath(); goldFill(c); paint(c);
  c.beginPath();
  c.moveTo(-4, -54); c.quadraticCurveTo(-30, -78, -22, -46); c.lineTo(-6, -40); c.closePath();
  paint(c);
  if (detail > 0.35) {
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(18, -66); c.lineTo(46, -70);
    c.moveTo(16, -56); c.lineTo(48, -54);
    c.moveTo(14, -46); c.lineTo(40, -42);
    c.stroke();
  }
  // 猴面：短吻、额骨，无金箍
  goldFill(c);
  c.beginPath(); c.ellipse(0, -80, 14, 13, 0, 0, 7); paint(c);
  c.beginPath();
  c.moveTo(-12, -76); c.lineTo(-26, -72); c.lineTo(-22, -64); c.lineTo(-8, -70); c.closePath();
  paint(c);
  if (detail > 0.4) {
    c.fillStyle = INK;
    c.beginPath(); c.arc(-6, -84, 1.6, 0, 7); c.fill();
    c.beginPath(); c.arc(4, -84, 1.6, 0, 7); c.fill();
  }
  ink(c, 2);
  c.beginPath(); c.moveTo(-10, -2); c.lineTo(-16, 6); c.moveTo(-2, -2); c.lineTo(-2, 6); c.moveTo(8, -2); c.lineTo(14, 6); c.stroke();
  // 金刚杵：杵头圆鼓有棱，不是金箍棒
  goldFill(c);
  c.beginPath(); c.moveTo(-16, -48); c.lineTo(-22, -8); c.lineTo(-10, -6); c.lineTo(-6, -46); c.closePath(); paint(c);
  c.beginPath(); c.ellipse(-14, -54, 10, 8, 0, 0, 7); paint(c);
  if (detail > 0.3) {
    c.lineWidth = 1.3; c.beginPath(); c.moveTo(-22, -54); c.lineTo(-6, -54); c.moveTo(-20, -48); c.lineTo(-8, -48); c.stroke();
  }
  c.beginPath(); c.arc(-12, -42, 4.5, 0, 7); goldFill(c); paint(c);
}

function beastXian(c, detail) {
  pedestal(c, 30);
  goldFill(c);
  c.beginPath(); c.ellipse(4, -22, 22, 16, 0, 0, 7); paint(c);
  c.beginPath();
  c.moveTo(-6, -30); c.quadraticCurveTo(-28, -42, -50, -28); c.lineTo(-62, -20); c.lineTo(-40, -20); c.closePath();
  paint(c);
  c.beginPath(); c.moveTo(-20, -34); c.lineTo(-16, -54); c.lineTo(-8, -34); c.stroke();
  c.beginPath();
  c.moveTo(12, -18); c.quadraticCurveTo(42, -34, 48, -8); c.quadraticCurveTo(28, -10, 14, -8); c.closePath();
  paint(c);
  // 骑在鸟上的陶人，脸不刻画表情
  c.fillStyle = '#F4E2B0';
  c.beginPath(); c.moveTo(-6, -36); c.lineTo(-12, -18); c.lineTo(10, -16); c.lineTo(6, -36); c.closePath(); paint(c);
  c.beginPath(); c.ellipse(0, -46, 7, 8, 0, 0, 7); paint(c);
  c.beginPath(); c.moveTo(-7, -50); c.quadraticCurveTo(0, -64, 8, -50); c.stroke();
  if (detail > 0.45) { c.beginPath(); c.moveTo(0, -32); c.lineTo(0, -18); c.stroke(); }
}

function beastHead(c, detail) {
  pedestal(c, 34);
  goldFill(c);
  c.beginPath();
  c.moveTo(18, -4);
  c.bezierCurveTo(36, -20, 28, -70, -6, -78);
  c.bezierCurveTo(-36, -82, -58, -52, -52, -24);
  c.quadraticCurveTo(-16, -6, 18, -4);
  c.closePath();
  paint(c);
  c.fillStyle = PAPER;
  c.beginPath(); c.moveTo(-16, -22); c.lineTo(-64, -12); c.lineTo(-46, -2); c.lineTo(-8, -12); c.closePath();
  paint(c);
  horn(c, -2, -70, 12, -114);
  c.lineWidth = 2.2;
  c.beginPath();
  c.moveTo(-20, -74); c.lineTo(-28, -92); c.lineTo(-8, -76);
  c.moveTo(-4, -76); c.lineTo(2, -98); c.lineTo(10, -72);
  c.stroke();
  c.beginPath(); c.moveTo(8, -50); c.quadraticCurveTo(48, -68, 34, -22); c.lineWidth = 2.6; c.stroke();
  if (detail > 0.3) {
    c.lineWidth = 1.4; c.beginPath(); c.arc(-12, -50, 3, 0, 7); c.stroke();
  }
}

const DRAW = {
  dragon: beastDragon, phoenix: beastPhoenix, lion: beastLion,
  tianma: (c, d) => beastHorse(c, d, false),
  haima: (c, d) => beastHorse(c, d, true),
  suanni: beastSuanni, yayu: beastYayu, xiezhi: beastXiezhi, douniu: beastDouniu,
  xingshi: beastXingshi, xian: beastXian, head: beastHead,
};

function scaleOf(kind, sp) {
  const mul = { head: 1.34, xian: 1.08, xingshi: 1.06, dragon: 1.04 }[kind] || 0.92;
  return lerp(0.16, 0.9, sp) * mul;
}

function drawQueue(c, t, sp) {
  const detail = Math.max(sp, ease(t, 22.75, 23.7));
  const gleam = ease(t, 0.28, 2.15);
  const order = [...QUEUE].sort((a, b) => queueU(b, sp) - queueU(a, sp));
  for (const item of order) {
    const p = queuePos(item, sp);
    const u = queueU(item, sp);
    c.save();
    c.translate(p.x, p.y);
    c.scale(scaleOf(item.kind, sp), scaleOf(item.kind, sp));
    DRAW[item.kind](c, detail);
    if (gleam > 0 && gleam < 1) {
      const near = clamp(1 - Math.abs(u - gleam) / 0.12);
      if (near > 0) {
        c.globalAlpha = 0.22 * near;
        c.fillStyle = '#F6E3A2';
        c.beginPath(); c.ellipse(0, -36, 22, 28, 0, 0, 7); c.fill();
      }
    }
    c.restore();
  }
  // 另一檐角只留一串不分种类的釉点，避免画成第二份十兽
  const marks = 1 - ease(t, 15.2, 17.2);
  if (marks > 0.02) {
    c.save(); c.globalAlpha = marks;
    for (let i = 0; i < 8; i++) {
      const p = hipR(0.28 + i * 0.07);
      c.beginPath(); c.ellipse(p.x, p.y - 16, 7, 12, -0.5, 0, 7);
      c.fillStyle = GOLD; c.fill(); ink(c, 1.2); c.stroke();
    }
    c.restore();
  }
}

function leader(c, t) {
  const p = ease(t, 7.95, 9.55);
  if (p <= 0) return;
  const a = { x: ridgeL.x - 20, y: ridgeL.y + 30 };
  const b = hipL(0.9);
  const q = lp(a, b, Math.min(1, p));
  c.save();
  c.strokeStyle = GOLD_D; c.lineWidth = 3; c.setLineDash([2, 7]);
  c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(q.x, q.y); c.stroke();
  c.restore();
}

function label(c, cam, world, text, alpha, dx, dy) {
  if (alpha < 0.03 || !text) return;
  let [sx, sy] = CAM.toScreen(cam, world.x, world.y);
  sx = clamp(sx + (dx || 0), 90, 1830);
  sy = clamp(sy + (dy || -86), 70, 860);
  c.save();
  c.globalAlpha = alpha;
  c.strokeStyle = INK; c.lineWidth = 1.4;
  const [ox, oy] = CAM.toScreen(cam, world.x, world.y);
  c.beginPath(); c.moveTo(ox, oy - 10); c.lineTo(sx, sy + 22); c.stroke();
  const size = text.length > 4 ? 54 : 64;
  const w = TY.width(c, text, size, 'LXGWWenKai-500') + 28;
  c.fillStyle = 'rgba(247,241,222,0.92)';
  c.fillRect(sx - w / 2, sy - size * 0.78, w, size * 1.15);
  TY.text(c, text, sx, sy, { size, fam: 'LXGWWenKai-500', color: INK, align: 'center', base: 'alphabetic', alpha: 1 });
  c.restore();
}

function labels(c, cam, t, sp) {
  const chi = { x: (ridgeL.x + ridgeR.x) / 2, y: (ridgeL.y + ridgeR.y) / 2 - 20 };
  label(c, cam, { x: ridgeL.x - 30, y: ridgeL.y - 40 }, '正吻', fade(t, 6.65, 7.15, 13.6, 14.6), -80, -150);
  label(c, cam, queuePos(QUEUE[1], sp), '走兽', fade(t, 9.55, 10.05, 14.2, 15.1), 70, -110);
  label(c, cam, chi, '太和殿', fade(t, 13.4, 13.9, 15.5, 16.2), 0, -40);
  const xian = queuePos(QUEUE[0], sp);
  const xianText = t < 24.0 ? '仙人' : '仙人不计';
  label(c, cam, xian, xianText, fade(t, 16.25, 16.7, 29.4, 29.5), t < 24 ? -10 : -20, -100);
  label(c, cam, queuePos(QUEUE[5], sp), '十只', fade(t, 18.0, 18.45, 19.7, 20.15), 0, -110);
  label(c, cam, queuePos(QUEUE[1], sp), '龙', fade(t, 20.25, 20.55, 22.15, 22.45), -16, -108);
  label(c, cam, queuePos(QUEUE[2], sp), '凤', fade(t, 20.7, 21.0, 22.15, 22.45), 0, -78);
  label(c, cam, queuePos(QUEUE[3], sp), '狮子', fade(t, 21.2, 21.5, 22.15, 22.45), 10, -108);
  label(c, cam, queuePos(QUEUE[10], sp), '行什', fade(t, 22.85, 23.25, 29.4, 29.5), -36, -150);
  label(c, cam, queuePos(QUEUE[11], sp), '兽头另计', fade(t, 26.4, 26.9, 29.4, 29.5), 90, -30);
}

function subtitle(c, t) {
  const line = SUBS.find(s => t >= s.t0 && t < s.t1);
  if (!line) return;
  const a = Math.min(1, (t - line.t0) / 0.12, (line.t1 - t) / 0.18);
  const size = 70;
  const w = TY.width(c, line.text, size, 'PuHui-Bold') + 56;
  const x = 960, y = 1002;
  c.save();
  c.globalAlpha = a * 0.94;
  c.fillStyle = '#F7F1DE';
  c.fillRect(x - w / 2, y - 52, w, 78);
  c.strokeStyle = 'rgba(28,25,20,0.35)'; c.lineWidth = 1.5;
  c.strokeRect(x - w / 2, y - 52, w, 78);
  c.restore();
  TY.text(c, line.text, x, y + 8, { size, fam: 'PuHui-Bold', color: INK, align: 'center', base: 'middle', alpha: a });
}

let ready = false;
const WUJI = window.WUJI = {
  init() {
    if (ready) return; ready = true;
    const all = SUBS.map(s => s.text).join('') + '正吻走兽仙人不计十只龙凤狮子行什兽头另计太和殿';
    U.assertGlyphs('72px "PuHui-Bold"', all, '样镜字幕');
    U.assertGlyphs('64px "LXGWWenKai-500"', '正吻走兽仙人不计十只龙凤狮子行什兽头另计太和殿', '样镜标签');
  },
  draw(c, t) {
    const sp = spread(t);
    const cam = camAt(t);
    const tile = CL.paperTile('wuji_paper', PAPER, { amt: 12, fibers: 220, grain: 8, seed: 4, fiberCol: [150, 120, 70] });
    CL.fillPaper(c, tile, 0, 0, 1920, 1080);
    c.save();
    CAM.apply(c, cam);
    roof(c, t);
    chiwen(c, ridgeL.x + 18, ridgeL.y, 1);
    chiwen(c, ridgeR.x - 18, ridgeR.y, -1);
    ring(c, ridgeL.x - 16, ridgeL.y - 58, 70, 84, ease(t, 4.72, 6.45));
    ring(c, ridgeR.x + 16, ridgeR.y - 54, 70, 84, ease(t, 4.95, 6.6));
    leader(c, t);
    drawQueue(c, t, sp);
    c.restore();
    labels(c, cam, t, sp);
    subtitle(c, t);
  },
};
})();
