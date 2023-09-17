//-------------imports--------------------------------------

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

//-------------object of html elements--------------------

const refs = {
  timePicker: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

//-----------adding options to the calendar-------------------

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
      refs.startBtn.disabled = true;
      return;
    }

    refs.startBtn.disabled = false;

    let intervalId = null;

    refs.startBtn.addEventListener('click', startCountdown);

    //logic for timer and conversion from ms
    function startCountdown() {
      refs.startBtn.disabled = true;
      refs.timePicker.disabled = true;

      intervalId = setInterval(() => {
        const currentTime = Date.now();

        if (selectedTime < currentTime) {
          clearInterval(intervalId);
          refs.timePicker.disabled = false;
          return;
        }

        const timeDifference = selectedTime - currentTime;
        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        refs.days.textContent = addLeadingZero(days);
        refs.hours.textContent = addLeadingZero(hours);
        refs.minutes.textContent = addLeadingZero(minutes);
        refs.seconds.textContent = addLeadingZero(seconds);
      }, 1000);
    }
  },
};

//----------------helper functions-------------------------

//in case of one digit number
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

//----------------initialize library------------------
flatpickr(refs.timePicker, options);
