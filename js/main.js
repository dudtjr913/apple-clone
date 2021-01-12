(() => {
  const acc = 0.1; // 부드럽게 스크롤 하기 위한 감속 비율
  let delayedYOffset = 0; // 부드럽게 스크롤 하기 위한 감속이 적용된 yOffset
  let rafValue = 0; // requestAnimationFrame의 값(cancel을 하기 위함)
  let rafState = 'stop'; // requestAnimationFrame의 상태(stop or going)
  let currentScene = 0; // 현재 보고 있는 scene
  let prevScrollHeight = 0; // 보고 있는 scene 전까지의 높이
  let yOffset = 0; // pageYOffset
  let canvasScaleRatio; // 마지막 스크린의 캔버스 scale비율
  let currentImage = 0; // 현재 화면에 그려지는 이미지
  let initImage = false; // 다른 scene의 이미지가 초기화 되었는지 알려주기 위함

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

        canvas_opacity_out: [1, 0, {start: 0.88, end: 1}],

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
        content: document.querySelector('#scroll-section-1 .description'),
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
        canvasCaption: document.querySelector('.canvas-caption'),
        canvasA: document.querySelector('#canvas-image1'),
        contextA: document.querySelector('#canvas-image1').getContext('2d'),
        footer: document.querySelector('.footer'),
      },
      values: {
        images: ['./images/blend-image-1.jpg', './images/blend-image-2.jpg'],
        imagesSrc: [],
        rect1X: [0, 0, {start: 0, end: 0}],
        rect2X: [0, 0, {start: 0, end: 0}],
        canvasA: {width: 0, height: 0, whiteRectWidth: 0},
        blendedCanvas: [0, 0, {start: 0, end: 0}],
        scale_canvas: [0, 0, {start: 0, end: 0}],
        caption_opacity_in: [0, 1, {start: 0, end: 0}],
        caption_translate3d_in: [20, 0, {start: 0, end: 0}],
      },
    },
  ];

  const debounce = (func, ms) => {
    let start = 0;
    return () => {
      if (start) {
        clearTimeout(start);
      }
      start = setTimeout(() => {
        start = 0;
        func();
      }, ms);
    };
  };

  // 이미지 로드하기
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

  // 로드되기 전에 미리 높이 셋팅 - 미리 셋팅하지 않으면 스크롤이 이상한 곳으로 가는 것 방지
  const setSceneHeight = () => {
    sceneInfo.forEach((v) => {
      if (v.type === 'sticky') {
        v.scrollHeight = v.heightMultiple * window.innerHeight;
      } else {
        v.scrollHeight = v.objs.content.offsetHeight * 1.5;
      }
      v.objs.container.style.height = `${v.scrollHeight}px`;
    });
  };

  const setLayout = () => {
    setSceneHeight();

    let totalHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalHeight += sceneInfo[i].scrollHeight;
      if (totalHeight > window.pageYOffset) {
        currentScene = i;
        break;
      }
    }

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    document.body.id = `scroll-scene-${currentScene}`;

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;

    setCanvasAnimationInit(sceneInfo[3].scrollHeight, sceneInfo[3].values, sceneInfo[3].objs);

    // 마지막 scene의 마지막 문단의 절대위치를 구해서 footer에 margin-top을 주기 위한 값
    const footerMarginTop =
      pageYOffset +
      sceneInfo[3].objs.canvasCaption.getBoundingClientRect().top +
      sceneInfo[3].scrollHeight * 0.45 +
      sceneInfo[3].objs.canvasCaption.offsetHeight -
      document.body.offsetHeight +
      150;
    document.querySelector('.footer').style.marginTop = `${footerMarginTop}px`;
  };

  // 스크롤을 내리면 스크롤에 따라 점점 커지거나 작아지는 캔버스를 초기 셋팅하는 함수
  const setCanvasAnimationInit = (scrollHeight, values, objs) => {
    const canvasWidthRatio = window.innerWidth / objs.canvasA.width;
    const canvasHeightRatio = window.innerHeight / objs.canvasA.height;
    objs.canvasA.classList.remove('sticky-blend-canvas');

    if (canvasWidthRatio >= canvasHeightRatio) {
      canvasScaleRatio = canvasWidthRatio;
    } else {
      canvasScaleRatio = canvasHeightRatio;
    }
    if (canvasScaleRatio >= 1) {
      canvasScaleRatio = 1;
    }

    objs.contextA.drawImage(values.imagesSrc[0], 0, 0);
    objs.canvasA.style.transform = `scale(${canvasScaleRatio})`;

    const recalculatedWidth = document.body.offsetWidth / canvasScaleRatio;
    const recalculatedHeight = window.innerHeight / canvasScaleRatio;
    const whiteRectWidth = recalculatedWidth * 0.15;

    values.canvasA.width = recalculatedWidth;
    values.canvasA.height = recalculatedHeight;
    values.canvasA.whiteRectWidth = whiteRectWidth;

    values.rect1X[0] = (objs.canvasA.width - recalculatedWidth) / 2;
    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
    values.rect2X[0] = values.rect1X[0] + recalculatedWidth - whiteRectWidth;
    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

    const canvasTop = (objs.canvasA.height - objs.canvasA.height * canvasScaleRatio) / 2;
    const canvasHeight = objs.canvasA.offsetTop + canvasTop;
    values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
    values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
    values.rect1X[2].end = canvasHeight / scrollHeight;
    values.rect2X[2].end = canvasHeight / scrollHeight;

    objs.contextA.fillStyle = 'white';
    objs.contextA.fillRect(
      parseInt(values.rect1X[0]),
      0,
      parseInt(whiteRectWidth),
      objs.canvasA.height,
    );
    objs.contextA.fillRect(
      parseInt(values.rect2X[0]),
      0,
      parseInt(whiteRectWidth),
      objs.canvasA.height,
    );

    objs.canvasA.style.top = `-${canvasTop}px`;

    values.blendedCanvas[0] = 0;
    values.blendedCanvas[1] = objs.canvasA.height;
    values.blendedCanvas[2].start = values.rect1X[2].end;
    values.blendedCanvas[2].end = values.blendedCanvas[2].start + 0.2;

    values.scale_canvas[0] = canvasScaleRatio;
    values.scale_canvas[1] =
      canvasScaleRatio < 1 ? document.body.offsetWidth / (1.5 * objs.canvasA.width) : 0.5;
    values.scale_canvas[2].start = values.blendedCanvas[2].end + 0.05;
    values.scale_canvas[2].end = values.scale_canvas[2].start + 0.2;

    values.caption_opacity_in[2].start = values.scale_canvas[2].end;
    values.caption_opacity_in[2].end = values.caption_opacity_in[2].start + 0.1;
    values.caption_translate3d_in[2].start = values.scale_canvas[2].end;
    values.caption_translate3d_in[2].end = values.caption_translate3d_in[2].start + 0.1;
  };

  const setScrollLoop = () => {
    while (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      if (currentScene === 3) break;
      prevScrollHeight += sceneInfo[currentScene].scrollHeight;
      currentScene++;
    }

    while (yOffset < prevScrollHeight) {
      if (currentScene === 0) break;
      prevScrollHeight -= sceneInfo[currentScene - 1].scrollHeight;
      currentScene--;
    }

    document.body.id = `scroll-scene-${currentScene}`;

    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    setAnimation();
  };

  const setAnimation = () => {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const scene = sceneInfo[currentScene];
    const currentYOffset = yOffset - prevScrollHeight;
    const currentScrollHeight = scene.scrollHeight;
    const scrollRatio = currentYOffset / currentScrollHeight;

    // 3번 scene이 빠르게 스크롤되어서 남아있을 때 초기화
    if (currentScene !== 3 && sceneInfo[3].objs.canvasA.className === 'sticky-blend-canvas') {
      sceneInfo[3].objs.contextA.drawImage(sceneInfo[3].values.imagesSrc[0], 0, 0);
      sceneInfo[3].objs.canvasA.style.transform = `scale(${canvasScaleRatio})`;
      sceneInfo[3].objs.canvasA.style.marginTop = 0;
      lastSceneInit(0);
    }

    // 특정 위치부터 header 고정
    const $stickyNav = document.querySelector('.local-nav');
    if (yOffset > 44 && !$stickyNav.classList.contains('sticky')) {
      $stickyNav.classList.add('sticky');
    } else if (yOffset <= 44) {
      $stickyNav.classList.remove('sticky');
    }

    switch (currentScene) {
      case 0:
        const canvas_opacity_out = getRatio(values.canvas_opacity_out, currentYOffset);
        objs.canvas.style.opacity = canvas_opacity_out;

        if (scrollRatio <= 0.2) {
          const messageA_opacity_in = getRatio(values.messageA_opacity_in, currentYOffset);
          const messageA_translate3d_in = getRatio(values.messageA_translate3d_in, currentYOffset);
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_in}%, 0)`;
        } else {
          const messageA_opacity_out = getRatio(values.messageA_opacity_out, currentYOffset);
          const messageA_translate3d_out = getRatio(
            values.messageA_translate3d_out,
            currentYOffset,
          );
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.4) {
          const messageB_opacity_in = getRatio(values.messageB_opacity_in, currentYOffset);
          const messageB_translate3d_in = getRatio(values.messageB_translate3d_in, currentYOffset);
          objs.messageB.style.opacity = messageB_opacity_in;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_in}%, 0)`;
        } else {
          const messageB_opacity_out = getRatio(values.messageB_opacity_out, currentYOffset);
          const messageB_translate3d_out = getRatio(
            values.messageB_translate3d_out,
            currentYOffset,
          );
          objs.messageB.style.opacity = messageB_opacity_out;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.6) {
          const messageC_opacity_in = getRatio(values.messageC_opacity_in, currentYOffset);
          const messageC_translate3d_in = getRatio(values.messageC_translate3d_in, currentYOffset);
          objs.messageC.style.opacity = messageC_opacity_in;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_in}%, 0)`;
        } else {
          const messageC_opacity_out = getRatio(values.messageC_opacity_out, currentYOffset);
          const messageC_translate3d_out = getRatio(
            values.messageC_translate3d_out,
            currentYOffset,
          );
          objs.messageC.style.opacity = messageC_opacity_out;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.8) {
          const messageD_opacity_in = getRatio(values.messageD_opacity_in, currentYOffset);
          const messageD_translate3d_in = getRatio(values.messageD_translate3d_in, currentYOffset);
          objs.messageD.style.opacity = messageD_opacity_in;
          objs.messageD.style.transform = `translate3d(0, ${messageD_translate3d_in}%, 0)`;
        } else {
          const messageD_opacity_out = getRatio(values.messageD_opacity_out, currentYOffset);
          const messageD_translate3d_out = getRatio(
            values.messageD_translate3d_out,
            currentYOffset,
          );
          objs.messageD.style.opacity = messageD_opacity_out;
          objs.messageD.style.transform = `translate3d(0, ${messageD_translate3d_out}%, 0)`;
        }
        break;

      case 1:
        // 0,2번 scene이 빠르게 스크롤되어서 남아있을 때 초기화
        if (!initImage) {
          initImage = true;
          const lastImage1 = sceneInfo[0].values.imageSequence[1];
          sceneInfo[0].objs.context.drawImage(sceneInfo[0].values.imagesSrc[lastImage1], 0, 0);
          sceneInfo[2].objs.context.drawImage(sceneInfo[2].values.imagesSrc[0], 0, 0);
        }
        break;

      case 2:
        if (scrollRatio <= 0.2) {
          const messageA_opacity_in = getRatio(values.messageA_opacity_in, currentYOffset);
          const messageA_translate3d_in = getRatio(values.messageA_translate3d_in, currentYOffset);
          const canvas2_opacity_in = getRatio(values.canvas_opacity_in, currentYOffset);
          objs.canvas.style.opacity = canvas2_opacity_in;
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_in}%, 0)`;
        } else {
          const messageA_opacity_out = getRatio(values.messageA_opacity_out, currentYOffset);
          const messageA_translate3d_out = getRatio(
            values.messageA_translate3d_out,
            currentYOffset,
          );
          const canvas2_opacity_out = getRatio(values.canvas_opacity_out, currentYOffset);
          objs.canvas.style.opacity = canvas2_opacity_out;
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translate3d(0, ${messageA_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.45) {
          const messageB_opacity_in = getRatio(values.messageB_opacity_in, currentYOffset);
          const messageB_translate3d_in = getRatio(values.messageB_translate3d_in, currentYOffset);
          const pinB_scale3d = getRatio(values.pinB_scale3d, currentYOffset);
          objs.messageB.style.opacity = messageB_opacity_in;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_in}%, 0)`;
          objs.pinB.style.transform = `scale3d(1, ${pinB_scale3d}, 1)`;
        } else {
          const messageB_opacity_out = getRatio(values.messageB_opacity_out, currentYOffset);
          const messageB_translate3d_out = getRatio(
            values.messageB_translate3d_out,
            currentYOffset,
          );
          objs.messageB.style.opacity = messageB_opacity_out;
          objs.messageB.style.transform = `translate3d(0, ${messageB_translate3d_out}%, 0)`;
        }

        if (scrollRatio <= 0.8) {
          const messageC_opacity_in = getRatio(values.messageC_opacity_in, currentYOffset);
          const messageC_translate3d_in = getRatio(values.messageC_translate3d_in, currentYOffset);
          const pinC_scale3d = getRatio(values.pinC_scale3d, currentYOffset);
          objs.messageC.style.opacity = messageC_opacity_in;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_in}%, 0)`;
          objs.pinC.style.transform = `scale3d(1, ${pinC_scale3d}, 1)`;
        } else {
          const messageC_opacity_out = getRatio(values.messageC_opacity_out, currentYOffset);
          const messageC_translate3d_out = getRatio(
            values.messageC_translate3d_out,
            currentYOffset,
          );
          objs.messageC.style.opacity = messageC_opacity_out;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_out}%, 0)`;
        }

        break;

      case 3:
        // 0,2번 scene이 빠르게 스크롤되어서 남아있을 때 초기화
        if (!initImage) {
          initImage = true;
          const lastImage1 = sceneInfo[0].values.imageSequence[1];
          const lastImage2 = sceneInfo[2].values.imageSequence[1];
          sceneInfo[0].objs.context.drawImage(sceneInfo[0].values.imagesSrc[lastImage1], 0, 0);
          sceneInfo[2].objs.context.drawImage(sceneInfo[2].values.imagesSrc[lastImage2], 0, 0);
        }

        objs.contextA.drawImage(values.imagesSrc[0], 0, 0);
        objs.canvasA.style.transform = `scale(${canvasScaleRatio})`;
        objs.canvasA.style.marginTop = 0;

        if (scrollRatio < values.rect1X[2].end) {
          objs.canvasCaption.style.opacity = 0;
          lastSceneInit(currentYOffset);
        } else {
          const blendedCanvasHeight = parseInt(getRatio(values.blendedCanvas, currentYOffset));
          objs.canvasA.classList.add('sticky-blend-canvas');
          objs.contextA.drawImage(
            values.imagesSrc[1],
            0,
            objs.canvasA.height - blendedCanvasHeight,
            objs.canvasA.width,
            blendedCanvasHeight,
            0,
            objs.canvasA.height - blendedCanvasHeight,
            objs.canvasA.width,
            blendedCanvasHeight,
          );

          if (scrollRatio >= values.blendedCanvas[2].end) {
            const scaleCanvas = getRatio(values.scale_canvas, currentYOffset);
            const caption_opacity_in = getRatio(values.caption_opacity_in, currentYOffset);
            const caption_translate3d_in = getRatio(values.caption_translate3d_in, currentYOffset);
            objs.canvasA.style.transform = `scale(${scaleCanvas})`;
            objs.canvasCaption.style.opacity = caption_opacity_in;
            objs.canvasCaption.style.transform = `translate3d(0, ${caption_translate3d_in}%, 0)`;
            if (scaleCanvas === values.scale_canvas[1]) {
              const calculatedMarginTop = scene.scrollHeight * 0.45;
              objs.canvasA.classList.remove('sticky-blend-canvas');
              objs.canvasA.style.marginTop = `${calculatedMarginTop}px`;
            }
          }
        }
        break;

      default:
        break;
    }
  };

  const getRatio = (values, currentYOffset) => {
    let rv;
    const currentScrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / currentScrollHeight;
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

  const lastSceneInit = (currentYOffset) => {
    const {objs, values} = sceneInfo[3];
    const canvas1_in = parseInt(getRatio(values.rect1X, currentYOffset));
    const canvas2_in = parseInt(getRatio(values.rect2X, currentYOffset));
    objs.canvasA.classList.remove('sticky-blend-canvas');
    objs.contextA.fillRect(
      canvas1_in,
      0,
      parseInt(values.canvasA.whiteRectWidth),
      objs.canvasA.height,
    );
    objs.contextA.fillRect(
      canvas2_in,
      0,
      parseInt(values.canvasA.whiteRectWidth),
      objs.canvasA.height,
    );
  };

  const loop = () => {
    rafState = 'going';
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
    if (currentScene === 0 || currentScene === 2) {
      const scene = sceneInfo[currentScene];
      const {objs, values} = scene;
      const currentDelayedYOffset = delayedYOffset - prevScrollHeight;
      currentImage = Math.round(getRatio(values.imageSequence, currentDelayedYOffset));
      if (values.imagesSrc[currentImage]) {
        if (initImage) {
          initImage = false;
        }
        objs.context.drawImage(values.imagesSrc[currentImage], 0, 0);
      }
    }

    rafValue = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafValue);
      rafState = 'stop';
    }
  };

  const windowReLoad = () => {
    window.location.reload();
  };

  window.addEventListener('load', () => {
    // 미리 scene들의 높이 설정
    setSceneHeight();
    // 로딩창 제거
    document.body.classList.remove('before-loaded');
    document.body.querySelector('.loading').addEventListener('transitionend', (e) => {
      document.body.removeChild(e.currentTarget);
    });

    // 레이아웃이 모두 설정될 때까지 기다리기
    setTimeout(() => {
      // 레이아웃 설정 및 첫 화면 그리기
      setLayout();
      sceneInfo[0].objs.context.drawImage(sceneInfo[0].values.imagesSrc[0], 0, 0);

      // 새로고침 후 스크롤 강제로 하기
      let count = 0;
      const intervalValue = setInterval(() => {
        scrollTo(0, window.pageYOffset + 5);
        count++;
        if (count >= 5) {
          clearInterval(intervalValue);
        }
      }, 20);

      // 스크롤 이벤트 시작
      window.addEventListener(
        'scroll',
        () => {
          yOffset = window.pageYOffset;
          setScrollLoop();
          if (rafState === 'stop') {
            loop();
          }
        },
        {passive: true},
      );
    }, 100);
  });

  window.addEventListener('resize', debounce(windowReLoad, 200)); // resize시 새로고침

  loadImages();
})();
