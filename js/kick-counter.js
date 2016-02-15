// script borrows heavily from https://gist.github.com/electricg/4372563

(function () {

  var timer = function(elapsedTime) {
    // Private vars

    var startAt = 0;  // Time of last start / resume. (0 if not running)
    var lapTime = elapsedTime || 0;  // Time on the clock when last stopped in milliseconds

    var now = function() {
        return (new Date()).getTime(); 
      }; 
 
    // Public methods
    // Start or resume
    this.start = function() {
        startAt = startAt ? startAt : now();
      };

    // Stop or pause
    this.stop = function() {
        // If running, update elapsed time otherwise keep it
        lapTime = startAt ? lapTime + now() - startAt : lapTime;
        startAt = 0; // Paused
      };

    // Reset
    this.reset = function() {
        lapTime = startAt = 0;
      };

    // Duration
    this.time = function() {
        return lapTime + (startAt ? now() - startAt : 0); 
      };
  };


  var ui = {};
  var clocktimer;
  var state = (localStorage.getItem('kick-counter')) ? JSON.parse(localStorage.getItem('kick-counter')) : { counter: [], time: 0, timestamp: Math.floor(Date.now()) };

  ui.time = document.getElementById('timer');
  ui.start = document.getElementById('start');
  ui.reset = document.getElementById('reset');
  ui.counter = document.getElementById('counter');
  ui.root = document.getElementById('kick-counter');

  var x = new timer(state.time + (Math.floor(Date.now()) - state.timestamp));

  function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
  }

  function formatTime(time) {
    var h = m = s = ms = 0;
    var newTime = '';

    h = Math.floor( time / (60 * 60 * 1000) );
    time = time % (60 * 60 * 1000);
    m = Math.floor( time / (60 * 1000) );
    time = time % (60 * 1000);
    s = Math.floor( time / 1000 );
    ms = time % 1000;

    newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2);
    return newTime;
  }

  function update() {
    state.timestamp = Math.floor(Date.now());
    state.time = x.time();
    ui.time.innerHTML = formatTime(x.time());
    ui.counter.innerHTML = state.counter.length;
    localStorage.setItem('kick-counter', JSON.stringify(state));
  }

  function start() {
    clocktimer = setInterval(update, 1);
    x.start();
    state.running = true;
    ui.reset.innerHTML = 'Stop';
    ui.root.classList.remove('is-reset');
    ui.root.classList.remove('is-stopped');
    ui.root.classList.add('is-running');
  }

  function stop() {
    x.stop();
    clearInterval(clocktimer);
    state.running = false;
    ui.reset.innerHTML = 'Reset';
    ui.root.classList.add('is-stopped');
    ui.root.classList.remove('is-running');
  }

  function reset() {
    stop();
    x.reset();
    state.counter = [];
    ui.root.classList.add('is-reset');
    ui.root.classList.remove('is-stopped');
    ui.root.classList.remove('is-running');
    update();
  }

  function resetFromUI(e) {
    e.preventDefault();
    if (state.running) {
      stop();
    } else {
      reset();      
    }
  }

  function startFromUI(e) {
    e.preventDefault();
    state.counter = state.counter || [];
    if (state.running) {
      state.counter.push(1);      
    } else {
      state.counter.push(1);      
      start();
    }

    if(state.counter.length === 10) {
      ui.root.classList.add('is-ten');
    } else {
      ui.root.classList.remove('is-ten');      
    }
  }

  ui.reset.addEventListener('touchstart', resetFromUI, false);
  ui.reset.addEventListener('click', resetFromUI, false);
  ui.counter.addEventListener('touchstart', startFromUI, false);
  ui.counter.addEventListener('click', startFromUI, false);

  document.body.addEventListener('touchmove', function (e) { 
    e.preventDefault(); 
  });

  if (state.running === true) {
    start();
  }

}());

