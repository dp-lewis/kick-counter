(function () {

  var timer = function() {
    // Private vars
    var startAt = 0;  // Time of last start / resume. (0 if not running)
    var lapTime = 0;  // Time on the clock when last stopped in milliseconds

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

  var x = new timer();
  var ui = {};
  var clocktimer;
  var state = {};
  var counter = [];


  ui.time = document.getElementById('timer');
  ui.start = document.getElementById('start');
  ui.reset = document.getElementById('reset');
  ui.counter = document.getElementById('counter');

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
    ui.time.innerHTML = formatTime(x.time());
    ui.counter.innerHTML = counter.length;
  }

  function start() {
    clocktimer = setInterval(update, 1);
    x.start();
    state.running = true;
    ui.reset.innerHTML = 'Stop';
  }

  function stop() {
    x.stop();
    clearInterval(clocktimer);
    state.running = false;
    ui.reset.innerHTML = 'Reset';
  }

  function reset() {
    stop();
    x.reset();
    counter = [];
    update();
  }

  ui.reset.onclick = function () {
    if (state.running) {
      stop();
    } else {
      reset();      
    }

  };

  ui.counter.onclick = function () {
    if (state.running) {
      counter.push(1);      
    } else {
      counter.push(1);      
      start();
    }
  }

}());

