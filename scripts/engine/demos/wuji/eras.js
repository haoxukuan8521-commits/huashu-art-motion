// 样镜：屋顶定位 → 檐角队列。两段同一张世界画布，靠时间连续形变接上，不切画面。
// 预览 index.html?film=demos/wuji    渲染 render.py --film demos/wuji --fps 30
// 画风锁在项目镜头表：米黄宣纸、墨色界画、朱红/琉璃黄/石绿点色。不是黑底 3b1b。
// 语法借 t1 的 Transform：正吻与走兽先分开，再把檐角一小簇展开成可数的队列。
window.PUNCH = 0;
window.FILM_SIZE = [1920, 1080];
window.SCENE_DIR = 'demos/wuji';
window.SCENE_LIBS = ['demos/wuji/draw.js'];
window.ERAS = [
  { id: 'wuji_a', dur: 14.9 },
  { id: 'wuji_b', dur: 14.5 },
];
