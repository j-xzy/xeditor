export function initializeStyle() {
  const style = document.createElement('style');
  style.innerHTML = `
   * {
        box-sizing: border-box;
        -webkit-user-select:none;
     }
   `;
  if (document.head) {
    document.head.appendChild(style);
  }
}
