(() => {
  let currentScene = 0; // 현재 보고 있는 scene
  let prevScrollHeight = 0; // 보고 있는 scene 전까지의 높이
  let yOffset = 0; // pageYOffset

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
        opacity: [0, 1],
        messageA_scope: [0.1, 0.2],
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
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      document.body.id = `scroll-scene-${currentScene}`;
    }

    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return;
      currentScene--;
      document.body.id = `scroll-scene-${currentScene}`;
    }

    setAnimation();
  };

  const setAnimation = () => {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentHeight = sceneInfo[currentScene].scrollHeight;

    switch (currentScene) {
      case 0:
        const ratio = getRatio(currentHeight, values.opacity);
        objs.messageA.style.opacity = ratio;
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  };

  const getRatio = (currentHeight, values) => {
    const currentYOffset = yOffset - prevScrollHeight;
    const difference = values[1] - values[0];
    const ratio = (currentYOffset / currentHeight) * difference + values[0];

    return ratio;
  };

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    setScrollLoop();
  });
  window.addEventListener('resize', debounce(setLayout));
  window.addEventListener('load', setLayout);
})();
