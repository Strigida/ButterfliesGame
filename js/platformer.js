var requestAnimationFrame, canvas, context, timeout, width, height, keys, player, friction, gravity, button;
var score, scoreCard;
var levelCleared = false;
var levelCount = 1;

(initialize());

function initialize () {
	document.getElementById('playButton').onclick = function () {
		document.getElementById('music').play();
		document.getElementById('playButton').style.display = 'none';
		document.getElementById('pauseButton').style.display = 'block';
	};
	document.getElementById('pauseButton').onclick = function () {
		document.getElementById('music').pause();
		document.getElementById('pauseButton').style.display = 'none';
		document.getElementById('playButton').style.display = 'block';
	};


	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimation || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	// these can be arbitrary, but should be less than the background image dimensions
	// height can be the same if there will be no vertical change in background
	width = 800;
	height = 600;
	canvas.width = width;
	canvas.height = height;

	level = initLevel(42);

	score = 0;
	scoreCard = document.getElementById('score');
	scoreCard.innerHTML = score;

	keys = [];
	friction = 0.8;
	gravity = 0.75;

	player = initPlayer(width / 4);

}

// on page load
window.addEventListener('load', function () {
	update();
});

// on keydown event
document.body.addEventListener('keydown', function (e) {
	keys[e.keyCode] = true;
});

// on keyup event
document.body.addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
});

// on click event
document.addEventListener('click', function () {
	update();
});

// update the game canvas
function updateGame () {
	// check for keys pressed
	if (keys[38] || keys[32]) {
		// up arrow || space bar
		if (!player.jumping) {
			player.jumping = true;
			player.yVelocity = -player.maxSpeed * 2;
		}
	}
	if (keys[39]) {
		// right arrow
		player.direction = 'right';
		if (player.xVelocity < player.maxSpeed) {
			player.xVelocity++;
		}
	}
	if (keys[37]) {
		// left arrow
		player.direction = 'left';
		if (player.xVelocity > -player.maxSpeed) {
			player.xVelocity--;
		}
	}

	// clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	if (!levelCleared) {
		// update player and level info
		player.update();
		level.update();

		// draw player and level
		// we want the level to be on the bottom, so we need to draw it first
		level.render();
		player.render();
	}
	if (level.currentScore < 94 && levelCleared) {
		// setup a message to display
		context.fillStyle = '#8060B6';
		context.font = '6em "Papyrus"';
		var message1 = 'Level ' + levelCount + ' cleared!';
		context.fillText(message1, (canvas.width - context.measureText(message1).width)/2, canvas.height/2);
		// display the message for 2 seconds before clearing it and starting a new level
		if (timeout === undefined) {
			timeout = window.setTimeout(function () {
				levelCleared = false;
				levelCount++;
				level.reset(level.maxScore + Math.ceil(level.maxScore/2));
				player.reset();
				window.clearTimeout(timeout);
				timeout = undefined;
			}, 2000);
		}
	}
	if (level.currentScore >= 94 && levelCleared) {
		// setup a message to display
		context.fillStyle = '#8060B6';
		context.font = '3em "Papyrus"';
		var message3 = 'Level ' + levelCount + ' cleared!';
		var message4 = 'You Win!';
		context.fillText(message3, (canvas.width - context.measureText(message3).width)/2, canvas.height/2);
		context.fillText(message4, (canvas.width - context.measureText(message4).width)/2, canvas.height/1.25);
		// display the message for 2 seconds before clearing it and starting a new level
		if (timeout === undefined) {
			timeout = window.setTimeout(function () {
				levelCleared = false;
				levelCount = 1;
				score = 0;
				level.currentScore = 0;
				scoreCard.innerHTML = 0;
				level.reset(42);
				player.reset();
				window.clearTimeout(timeout);
				timeout = undefined;
			}, 4000);
		}
	}
}

// collision detection
function checkColl (obj1, obj2) {
	return (obj1.x + obj1.width >= obj2.x)
		&& (obj1.x <= obj2.x + obj2.width)
		&& (obj1.y <= obj2.y + obj2.height)
		&& (obj1.y + obj1.height >= obj2.y);
}

function incrementScore(butterfly) {
	if (!butterfly.captured) {
		butterfly.capture();
		level.currentScore++;
		scoreCard.innerHTML = score + level.currentScore;

		if (level.currentScore == level.maxScore) {
			levelCleared = true;
			score = score + level.currentScore;
			scoreCard.innerHTML = score;
		}
	}

}

// on frame draw
function update () {
	updateGame();
	// update frame
	requestAnimationFrame(update);
}


