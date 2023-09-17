import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const uiInput = {
  timePicker: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  theme: 'material_green',
  onClose(selectedDates) {
    const selectedTime = selectedDates[0];
    const startTime = Date.now();

    // logic for past date notification from notiflix
    if (selectedTime < startTime) {
      Notify.failure('Please choose a date in the future.');
      uiInput.startBtn.disabled = true;
    }

    uiInput.startBtn.disabled = false;

    let intervalId = null;

    uiInput.startBtn.addEventListener('click', startCountdown);

    function startCountdown() {
      uiInput.startBtn.disabled = true;
      uiInput.timePicker.disabled = true;

      intervalId = setInterval(() => {
        const currentTime = Date.now();

        if (selectedTime < currentTime) {
          clearInterval(intervalId);
          uiInput.timePicker.disabled = false;
        }

        const timeDifference = selectedTime - currentTime;
        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        uiInput.days.textContent = addLeadingZero(days);
        uiInput.hours.textContent = addLeadingZero(hours);
        uiInput.minutes.textContent = addLeadingZero(minutes);
        uiInput.seconds.textContent = addLeadingZero(seconds);
      }, 1000);
    }
  },
};

function addLeadingZero(num) {
  return num.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(uiInput.timePicker, options);
