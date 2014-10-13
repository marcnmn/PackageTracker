
"use strict";

var size = 100;
var duration = 3.0 * 1000;

function testStep(numSteps, position) {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  var span = document.createElement('span');
  span.appendChild(canvas);
  span.appendChild(document.createElement('br'));
  span.appendChild(document.createTextNode('steps: ' + numSteps));
  span.appendChild(document.createElement('br'));
  span.appendChild(document.createTextNode('position: ' + position));
  document.body.appendChild(span);
  return new Animation(ctx,
    function(timeFraction, animation) {
      var target = animation.target;
      var inputTimeFraction = player.currentTime / duration;
      if (target.lastTimeFraction !== timeFraction) {
        target.beginPath();
        target.moveTo(inputTimeFraction * size,
            size - target.lastTimeFraction * size);
        target.lineTo(inputTimeFraction * size, size - timeFraction * size);
        target.strokeStyle = 'silver';
        target.stroke();
        target.beginPath();
        target.strokeStyle = 'blue';
      } else {
        target.lineTo(inputTimeFraction * size, size - timeFraction * size);
      }
      target.lastTimeFraction = timeFraction;
      target.stroke();
    }, {
    duration: duration,
    easing: 'steps(' + numSteps + ', ' + position + ')',
  });
}

// TODO: Making player global like this is is rather ugly. It would be nice if
// the animation or player were passed to the custom animation effect's sample
// function.
var player = document.timeline.play(new AnimationGroup([
  testStep(1, 'start'),
  testStep(1, 'middle'),
  testStep(1, 'end'),
  testStep(3, 'start'),
  testStep(3, 'middle'),
  testStep(3, 'end'),
  testStep(10, 'start'),
  testStep(10, 'middle'),
  testStep(10, 'end'),
]));

