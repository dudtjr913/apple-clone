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
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
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
        messageA: document.querySelector('#scroll-section-2 .main-message.a'),
        messageB: document.querySelector('#scroll-section-2 .description-message.b'),
        messageC: document.querySelector('#scroll-section-2 .description-message.c'),
        pinB: document.querySelector('#scroll-section-2 .description-message.b .pin'),
        pinC: document.querySelector('#scroll-section-2 .description-message.c .pin'),
      },
      values: {
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
          const messageC_opacity_in = getRatio(scene, values.messageC_opacity_in);
          const messageC_translate3d_in = getRatio(scene, values.messageC_translate3d_in);
          const pinC_scale3d = getRatio(scene, values.pinC_scale3d);
          objs.messageC.style.opacity = messageC_opacity_in;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_in}%, 0)`;
          objs.pinC.style.transform = `scale3d(1, ${pinC_scale3d}, 1)`;
        } else {
          const messageC_opacity_out = getRatio(scene, values.messageC_opacity_out);
          const messageC_translate3d_out = getRatio(scene, values.messageC_translate3d_out);
          objs.messageC.style.opacity = messageC_opacity_out;
          objs.messageC.style.transform = `translate3d(0, ${messageC_translate3d_out}%, 0)`;
        }
        break;

      case 3:
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

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    setScrollLoop();
  });
  window.addEventListener('resize', debounce(setLayout));
  window.addEventListener('load', setLayout);
})();
