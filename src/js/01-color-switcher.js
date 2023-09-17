const startBtn = document.querySelector('button[data-start="start"]');
const stopBtn = document.querySelector('button[data-stop="stop"]');
const backgroundElem = document.querySelector('body');
let timerId = null;

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function disableBtn() {
  startBtn.disabled = true;
}

function enableBtn() {
  startBtn.disabled = false;
}

startBtn.addEventListener('click', () => {
  timerId = setInterval(() => {
    const randomColor = getRandomHexColor();
    backgroundElem.style.backgroundColor = randomColor;
  }, 1000);
  disableBtn();
});

stopBtn.addEventListener('click', () => {
  clearInterval(timerId);
  enableBtn();
});
