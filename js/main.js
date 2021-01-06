(() => {
  let currentScene = 0; // 현재 보고 있는 scene
  let prevScrollHeight = 0; // 보고 있는 scene 전까지의 높이
  let yOffset = 0; // pageYOffset
  let scrollRatio = 0;
  let changeScene = false;

  const sceneInfo = [
    {
      type: 'sticky',
      heightMultiple: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        canvas: document.querySelector('#canvas-0'),
        context: document.querySelector('#canvas-0').getContext('2d'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        totalImageCount: 300,
        imagesSrc: [],
        imageSequence: [0, 299],

        canvas_opacity_out: [1, 0, {start: 0.9, end: 1}],

        messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
        messageA_translate3d_in: [20, 0, {start: 0.1, end: 0.2}],
        messageA_opacity_out: [1, 0, {start: 0.2, end: 0.28}],
        messageA_translate3d_out: [0, -20, {start: 0.2, end: 0.28}],

        messageB_opacity_in: [0, 1, {start: 0.3, end: 0.4}],
        messageB_translate3d_in: [20, 0, {start: 0.3, end: 0.4}],
        messageB_opacity_out: [1, 0, {start: 0.4, end: 0.48}],
        messageB_translate3d_out: [0, -20, {start: 0.4, end: 0.48}],

        messageC_opacity_in: [0, 1, {start: 0.5, end: 0.6}],
        messageC_translate3d_in: [20, 0, {start: 0.5, end: 0.6}],
        messageC_opacity_out: [1, 0, {start: 0.6, end: 0.68}],
        messageC_translate3d_out: [0, -20, {start: 0.6, end: 0.68}],

        messageD_opacity_in: [0, 1, {start: 0.7, end: 0.8}],
        messageD_translate3d_in: [20, 0, {start: 0.7, end: 0.8}],
        messageD_opacity_out: [1, 0, {start: 0.8, end: 0.88}],
        messageD_translate3d_out: [0, -20, {start: 0.8, end: 0.88}],
      },
    },
    {
      type: 'normal',
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    {
      type: 'sticky',
      heightMultiple: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        canvas: document.querySelector('#canvas-2'),
        context: document.querySelector('#canvas-2').getContext('2d'),
        messageA: document.querySelector('#scroll-section-2 .main-message.a'),
        messageB: document.querySelector('#scroll-section-2 .description-message.b'),
        messageC: document.querySelector('#scroll-section-2 .description-message.c'),
        pinB: document.querySelector('#scroll-section-2 .description-message.b .pin'),
        pinC: document.querySelector('#scroll-section-2 .description-message.c .pin'),
      },
      values: {
        totalImageCount: 960,
        imagesSrc: [],
        imageSequence: [0, 959],

        canvas_opacity_in: [0, 1, {start: 0, end: 0.1}],
        canvas_opacity_out: [1, 0, {start: 0.9, end: 1}],

        messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
        messageA_translate3d_in: [20, 0, {start: 0.1, end: 0.2}],
        messageA_opacity_out: [1, 0, {start: 0.2, end: 0.28}],
        messageA_translate3d_out: [0, -20, {start: 0.2, end: 0.28}],

        messageB_opacity_in: [0, 1, {start: 0.3, end: 0.45}],
        messageB_translate3d_in: [20, 0, {start: 0.3, end: 0.45}],
        messageB_opacity_out: [1, 0, {start: 0.45, end: 0.58}],
        messageB_translate3d_out: [0, -20, {start: 0.45, end: 0.58}],

        messageC_opacity_in: [0, 1, {start: 0.65, end: 0.8}],
        messageC_translate3d_in: [20, 0, {start: 0.65, end: 0.8}],
        messageC_opacity_out: [1, 0, {start: 0.8, end: 0.93}],
        messageC_translate3d_out: [0, -20, {start: 0.8, end: 0.93}],

        pinB_scale3d: [0.5, 1, {start: 0.3, end: 0.45}],
        pinC_scale3d: [0.5, 1, {start: 0.65, end: 0.8}],
      },
    },
    {
      type: 'sticky',
      heightMultiple: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvas: document.querySelector('#canvas-image'),
        context: document.querySelector('#canvas-image').getContext('2d'),
      },
      values: {
        images: ['./images/blend-image-1.jpg', './images/blend-image-2.jpg'],
        imagesSrc: [],
        rect1X: [0, 0, {start: 0, end: 0}],
        rect2X: [0, 0, {start: 0, end: 0}],
        canvas1: {width: 0, height: 0, whiteRectWidth: 0},
      },
    },
  ];

  const debounce = (func) => {
    let start = 0;
    return () => {
      if (start) {
        clearTimeout(start);
      }
      start = setTimeout(() => {
        start = 0;
        func();
      }, 200);
    };
  };

  const loadImages = () => {
    for (let i = 0; i < sceneInfo[0].values.totalImageCount; i++) {
      const $imgElem = new Image();
      $imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].values.imagesSrc.push($imgElem);
    }

    for (let i = 0; i < sceneInfo[2].values.totalImageCount; i++) {
      const $imgElem = new Image();
      $imgElem.src = `./video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].values.imagesSrc.push($imgElem);
    }

    for (let i = 0; i < sceneInfo[3].values.images.length; i++) {
      const $imgElem = new Image();
      $imgElem.src = sceneInfo[3].values.images[i];
      sceneInfo[3].values.imagesSrc.push($imgElem);
    }
  };

  const setLayout = () => {
    sceneInfo.forEach((v) => {
      if (v.type === 'sticky') {
        v.scrollHeight = v.heightMultiple * window.innerHeight;
      } else {
        v.scrollHeight = v.objs.container.offsetHeight;
      }
      v.objs.container.style.height = `${v.scrollHeight}px`;
    });

    let totalHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalHeight += sceneInfo[i].scrollHeight;
      if (totalHeight >= window.pageYOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.id = `scroll-scene-${currentScene}`;

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;

    setCanvasAnimationInit(sceneInfo[3].scrollHeight, sceneInfo[3].values, sceneInfo[3].objs);
  };

  // 스크롤을 내리면 스크롤에 따라 점점 커지거나 작아지는 캔버스를 초기 셋팅하는 함수
  const setCanvasAnimationInit = (scrollHeight, values, objs) => {
    const canvasWidthRatio = document.body.offsetWidth / objs.canvas.width;
    const canvasHeightRatio = window.innerHeight / objs.canvas.height;

    let canvasRatio;
    if (canvasWidthRatio >= canvasHeightRatio) {
      canvasRatio = canvasWidthRatio;
    } else {
      canvasRatio = canvasHeightRatio;
    }
    if (canvasRatio >= 1) {
      canvasRatio = 1;
    }

    objs.context.drawImage(values.imagesSrc[0], 0, 0);
    objs.canvas.style.transform = `scale(${canvasRatio})`;

    const recalculatedWidth = document.body.offsetWidth / canvasRatio;
    const recalculatedHeight = window.innerHeight / canvasRatio;
    const whiteRectWidth = recalculatedWidth * 0.15;

    values.canvas1.width = recalculatedWidth;
    values.canvas1.height = recalculatedHeight;
    values.canvas1.whiteRectWidth = whiteRectWidth;

    values.rect1X[0] = (objs.canvas.width - recalculatedWidth) / 2;
    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
    values.rect2X[0] = values.rect1X[0] + recalculatedWidth - whiteRectWidth;
    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

    const canvasHeight =
      objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasRatio) / 2;
    values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
    values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
    values.rect1X[2].end = canvasHeight / scrollHeight;
    values.rect2X[2].end = canvasHeight / scrollHeight;

    objs.context.fillStyle = 'white';
    objs.context.fillRect(
      parseInt(values.rect1X[0]),
      0,
      parseInt(whiteRectWidth),
      recalculatedHeight,
    );
    objs.context.fillRect(
      parseInt(values.rect2X[0]),
      0,
      parseInt(whiteRectWidth),
      recalculatedHeight,
    );
  };

  const setScrollLoop = () => {
    changeScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      changeScene = true;
      currentScene++;
      document.body.id = `scroll-scene-${currentScene}`;
    }

    if (yOffset < prevScrollHeight) {
      changeScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.id = `scroll-scene-${currentScene}`;
    }

    !changeScene && setAnimation();
  };

  const setAnimation = () => {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const scene = sceneInfo[currentScene];
    const currentYOffset = yOffset - prevScrollHeight;
    const currentScrollHeight = scene.scrollHeight;
    scrollRatio = currentYOffset / currentScrollHeight;

    switch (currentScene) {
      case 0:
        const currentImage = Math.round(getRatio(scene, values.imageSequence));
        const canvas_opacity_out = getRatio(scene, values.canvas_opacity_out);
        scene.objs.context.drawImage(scene.values.imagesSrc[currentImage], 0, 0);
        objs.canvas.style.opacity = canvas_opacity_out;

        if (scrollRatio <= 0.2) {
          const messageA_opacity_in = getRatio(scene, values.messageA_opacity_in);
          const messageA_translate3d_in = getRatio(scene, values.messageA_translate3d_in);
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_in}%, 0)`;
        } else {
          const messageA_opacity_out = getRatio(scene, values.messageA_opacity_out);
          const messageA_translate3d_out = getRatio(scene, values.messageA_translate3d_out);
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.4) {
          const messageB_opacity_in = getRatio(scene, values.messageB_opacity_in);
          const messageB_translate3d_in = getRatio(scene, values.messageB_translate3d_in);
          objs.messageB.style.opacity = messageB_opacity_in;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_in}%, 0)`;
        } else {
          const messageB_opacity_out = getRatio(scene, values.messageB_opacity_out);
          const messageB_translate3d_out = getRatio(scene, values.messageB_translate3d_out);
          objs.messageB.style.opacity = messageB_opacity_out;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.6) {
          const messageC_opacity_in = getRatio(scene, values.messageC_opacity_in);
          const messageC_translate3d_in = getRatio(scene, values.messageC_translate3d_in);
          objs.messageC.style.opacity = messageC_opacity_in;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_in}%, 0)`;
        } else {
          const messageC_opacity_out = getRatio(scene, values.messageC_opacity_out);
          const messageC_translate3d_out = getRatio(scene, values.messageC_translate3d_out);
          objs.messageC.style.opacity = messageC_opacity_out;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.8) {
          const messageD_opacity_in = getRatio(scene, values.messageD_opacity_in);
          const messageD_translate3d_in = getRatio(scene, values.messageD_translate3d_in);
          objs.messageD.style.opacity = messageD_opacity_in;
          objs.messageD.style.transform = `translate3d(0, ${messageD_translate3d_in}%, 0)`;
        } else {
          const messageD_opacity_out = getRatio(scene, values.messageD_opacity_out);
          const messageD_translate3d_out = getRatio(scene, values.messageD_translate3d_out);
          objs.messageD.style.opacity = messageD_opacity_out;
          objs.messageD.style.transform = `translate3d(0, ${messageD_translate3d_out}%, 0)`;
        }
        break;

      case 2:
        const currentImage2 = Math.round(getRatio(scene, values.imageSequence));
        scene.objs.context.drawImage(scene.values.imagesSrc[currentImage2], 0, 0);

        if (scrollRatio <= 0.2) {
          const messageA_opacity_in = getRatio(scene, values.messageA_opacity_in);
          const messageA_translate3d_in = getRatio(scene, values.messageA_translate3d_in);
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_in}%, 0)`;
        } else {
          const messageA_opacity_out = getRatio(scene, values.messageA_opacity_out);
          const messageA_translate3d_out = getRatio(scene, values.messageA_translate3d_out);
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.45) {
          const messageB_opacity_in = getRatio(scene, values.messageB_opacity_in);
          const messageB_translate3d_in = getRatio(scene, values.messageB_translate3d_in);
          const pinB_scale3d = getRatio(scene, values.pinB_scale3d);
          objs.messageB.style.opacity = messageB_opacity_in;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_in}%, 0)`;
          objs.pinB.style.transform = `scale3d(1, ${pinB_scale3d}, 1)`;
        } else {
          const messageB_opacity_out = getRatio(scene, values.messageB_opacity_out);
          const messageB_translate3d_out = getRatio(scene, values.messageB_translate3d_out);
          objs.messageB.style.opacity = messageB_opacity_out;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.8) {
          const canvas2_opacity_in = getRatio(scene, values.canvas_opacity_in);
          const messageC_opacity_in = getRatio(scene, values.messageC_opacity_in);
          const messageC_translate3d_in = getRatio(scene, values.messageC_translate3d_in);
          const pinC_scale3d = getRatio(scene, values.pinC_scale3d);
          objs.canvas.style.opacity = canvas2_opacity_in;
          objs.messageC.style.opacity = messageC_opacity_in;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_in}%, 0)`;
          objs.pinC.style.transform = `scale3d(1, ${pinC_scale3d}, 1)`;
        } else {
          const canvas2_opacity_out = getRatio(scene, values.canvas_opacity_out);
          const messageC_opacity_out = getRatio(scene, values.messageC_opacity_out);
          const messageC_translate3d_out = getRatio(scene, values.messageC_translate3d_out);
          objs.canvas.style.opacity = canvas2_opacity_out;
          objs.messageC.style.opacity = messageC_opacity_out;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_out}%, 0)`;
        }
        break;

      case 3:
        objs.context.drawImage(values.imagesSrc[0], 0, 0);
        const canvas1_in = parseInt(getRatio(scene, values.rect1X));
        const canvas2_in = parseInt(getRatio(scene, values.rect2X));

        objs.context.fillRect(
          canvas1_in,
          0,
          parseInt(values.canvas1.whiteRectWidth),
          values.canvas1.height,
        );
        objs.context.fillRect(
          canvas2_in,
          0,
          parseInt(values.canvas1.whiteRectWidth),
          values.canvas1.height,
        );
        break;

      default:
        break;
    }
  };

  const getRatio = (scene, values) => {
    let rv;
    const currentYOffset = yOffset - prevScrollHeight;
    const currentScrollHeight = scene.scrollHeight;
    if (values.length === 3) {
      rv = getPartRatio(currentYOffset, currentScrollHeight, values);
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  };

  const getPartRatio = (currentYOffset, currentScrollHeight, values) => {
    const partStart = values[2].start * currentScrollHeight;
    const partEnd = values[2].end * currentScrollHeight;
    const partHeight = partEnd - partStart;

    if (currentYOffset < partStart) {
      return values[0];
    }

    if (currentYOffset > partEnd) {
      return values[1];
    }

    return ((currentYOffset - partStart) / partHeight) * (values[1] - values[0]) + values[0];
  };

  loadImages();

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    setScrollLoop();
  });
  window.addEventListener('resize', debounce(setLayout));
  window.addEventListener('load', () => {
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].values.imagesSrc[0], 0, 0);
  });
})();
