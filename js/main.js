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
      },
      values: {
        messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
        messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
        messageA_opacity_out: [1, 0, {start: 0.2, end: 0.25}],
        messageA_translateY_out: [0, -20, {start: 0.2, end: 0.25}],
      },
    },
    {
      type: 'normal',
      heightMultiple: 5,
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
      v.scrollHeight = v.heightMultiple * window.innerHeight;
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
      if (currentScene === 0) return;
      changeScene = true;
      currentScene--;
      document.body.id = `scroll-scene-${currentScene}`;
    }

    !changeScene && setAnimation();
  };

  const setAnimation = () => {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const scene = sceneInfo[currentScene];

    switch (currentScene) {
      case 0:
        const messageA_opacity_in = getRatio(scene, values.messageA_opacity_in);
        const messageA_opacity_out = getRatio(scene, values.messageA_opacity_out);
        const messageA_translateY_in = getRatio(scene, values.messageA_translateY_in);
        const messageA_translateY_out = getRatio(scene, values.messageA_translateY_out);
        if (scrollRatio <= values.messageA_opacity_in[2].end) {
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
        } else {
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
        }
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  };

  const getRatio = (scene, values) => {
    let rv;
    const currentYOffset = yOffset - prevScrollHeight;
    const currentScrollHeight = scene.scrollHeight;
    scrollRatio = currentYOffset / currentScrollHeight;
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
