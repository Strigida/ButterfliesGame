// JavaScript Document
function initButton () {
	var newButton = {};
	newButton.x = 400;
	newButton.y = 400;

	var buttonImg = new Image();
	buttonImg.onload = function () {
		newButton.width = buttonImg.width;
		newButton.height = buttonImg.height;

		newButton = buttonImg;

		newButton.render = function () {
			newButton.render(newButton.x, newButton.y);
		};
	};

	buttonImg.src = "imgs/Button.png";

	return newButton;
}