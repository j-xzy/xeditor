function setGlobal() {
  window.global = {};

  window.addEventListener('mousemove', (e) => {
    window.global.ps = {
      x: e.clientX,
      y: e.clientY
    };
  });
}

export default setGlobal;