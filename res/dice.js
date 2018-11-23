/*global Random, app*/
(function () {
"use strict";

function Dice (params) {
	this.color = params.color;
}

Dice.WIDTH = 100;

Dice.l10n = {
	de: {
		color: 'Farbe:',
		colors: ['Rot', 'Grün', 'Gelb', 'Blau']
	},
	en: {
		color: 'Color:',
		colors: ['Red', 'Green', 'Yellow', 'Blue']
	}
};

Dice.getDefaultParams = function () {
	return {color: 'red'};
};

Dice.showConfig = function (container, config) {
	container.innerHTML = '<label>' + Dice.l10n[config.lang].color + '<br><select class="config-color">' +
		'<option value="red">' + Dice.l10n[config.lang].colors[0] + '</option>' +
		'<option value="green">' + Dice.l10n[config.lang].colors[1] + '</option>' +
		'<option value="yellow">' + Dice.l10n[config.lang].colors[2] + '</option>' +
		'<option value="blue">' + Dice.l10n[config.lang].colors[3] + '</option>' +
		'</select></label>';
	container.getElementsByClassName('config-color')[0].value = config.color;
};

Dice.readConfig = function (container) {
	return {color: container.getElementsByClassName('config-color')[0].value};
};

Dice.prototype = new Random();

Dice.prototype.getRandom = function () {
	return 1 + Random.randInt(6);
};

Dice.prototype.getHtml = function () {
	return ' ' +
		'<div id="table">' +
			'<div id="platform">' +
				'<div id="dice" class="trigger">' +
					'<div class="side front">' +
						'<div class="dot center"></div>' +
					'</div>' +
					'<div class="side front inner"></div>' +
					'<div class="side top">' +
						'<div class="dot dtop dleft"></div>' +
						'<div class="dot dbottom dright"></div>' +
					'</div>' +
					'<div class="side top inner"></div>' +
					'<div class="side right">' +
						'<div class="dot dtop dleft"></div>' +
						'<div class="dot center"></div>' +
						'<div class="dot dbottom dright"></div>' +
					'</div>' +
					'<div class="side right inner"></div>' +
					'<div class="side left">' +
						'<div class="dot dtop dleft"></div>' +
						'<div class="dot dtop dright"></div>' +
						'<div class="dot dbottom dleft"></div>' +
						'<div class="dot dbottom dright"></div>' +
					'</div>' +
					'<div class="side left inner"></div>' +
					'<div class="side bottom">' +
						'<div class="dot center"></div>' +
						'<div class="dot dtop dleft"></div>' +
						'<div class="dot dtop dright"></div>' +
						'<div class="dot dbottom dleft"></div>' +
						'<div class="dot dbottom dright"></div>' +
					'</div>' +
					'<div class="side bottom inner"></div>' +
					'<div class="side back">' +
						'<div class="dot dtop dleft"></div>' +
						'<div class="dot dtop dright"></div>' +
						'<div class="dot dbottom dleft"></div>' +
						'<div class="dot dbottom dright"></div>' +
						'<div class="dot center dleft"></div>' +
						'<div class="dot center dright"></div>' +
					'</div>' +
					'<div class="side back inner"></div>' +
					'<div class="side cover x"></div>' +
					'<div class="side cover y"></div>' +
					'<div class="side cover z"></div>' +
				'</div>' +
			'</div>' +
		'</div>';
};

Dice.prototype.getCss = function () {
	return ' ' +
		'#table {' +
			'position: relative;' +
			'width: ' + Dice.WIDTH + 'px;' +
			'padding-top: ' + (Dice.WIDTH * 0.5) + 'px;' +
			'margin: 0 auto;' +
			Random.getTransformPrefix() + 'perspective: 1200px;' +
		'}' +
		'#platform {' +
			'margin-top: ' + (Dice.WIDTH * 0.5) + 'px;' +
			'width: ' + Dice.WIDTH + 'px;' +
			'height: ' + Dice.WIDTH + 'px;' +
			Random.getTransformPrefix() + 'transform-style: preserve-3d;' +
		'}' +
		'#dice {' +
			'position: absolute;' +
			'width: ' + Dice.WIDTH + 'px;' +
			'height: ' + Dice.WIDTH + 'px;' +
			Random.getTransformPrefix() + 'transform-style: preserve-3d;' +
		'}' +
		'.side {' +
			'position: absolute;' +
			'width: ' + Dice.WIDTH + 'px;' +
			'height: ' + Dice.WIDTH + 'px;' +
			'background: #fff;' +
			'box-shadow: inset 0 0 ' + (Dice.WIDTH * 0.2) + 'px #ccc;' +
			'border-radius: 20%;' +
			'background: ' + this.color + ';' +
		'}' +
		'#dice .cover, #dice .inner {' +
			'background: #e0e0e0;' +
			'box-shadow: none;' +
		'}' +
		'#dice .cover {' +
			'border-radius: 0;' +
			Random.getTransformPrefix() + 'transform: translateZ(0px);' +
		'}' +
		'#dice .cover.x {' +
			Random.getTransformPrefix() + 'transform: rotateY(90deg);' +
		'}' +
		'#dice .cover.z {' +
			Random.getTransformPrefix() + 'transform: rotateX(90deg);' +
		'}' +
		'#dice .front  {' +
			Random.getTransformPrefix() + 'transform: translateZ(' + (Dice.WIDTH * 0.5) + 'px);' +
		'}' +
		'#dice .front.inner  {' +
			Random.getTransformPrefix() + 'transform: translateZ(' + (Dice.WIDTH * 0.5 - 2) + 'px);' +
		'}' +
		'#dice .back {' +
			Random.getTransformPrefix() + 'transform: rotateX(-180deg) translateZ(' + (Dice.WIDTH * 0.5) + 'px);' +
		'}' +
		'#dice .back.inner {' +
			Random.getTransformPrefix() + 'transform: rotateX(-180deg) translateZ(' + (Dice.WIDTH * 0.5 - 2) + 'px);' +
		'}' +
		'#dice .right {' +
			Random.getTransformPrefix() + 'transform: rotateY(90deg) translateZ(' + (Dice.WIDTH * 0.5) + 'px);' +
		'}' +
		'#dice .right.inner {' +
			Random.getTransformPrefix() + 'transform: rotateY(90deg) translateZ(' + (Dice.WIDTH * 0.5 - 2) + 'px);' +
		'}' +
		'#dice .left {' +
			Random.getTransformPrefix() + 'transform: rotateY(-90deg) translateZ(' + (Dice.WIDTH * 0.5) + 'px);' +
		'}' +
		'#dice .left.inner {' +
			Random.getTransformPrefix() + 'transform: rotateY(-90deg) translateZ(' + (Dice.WIDTH * 0.5 - 2) + 'px);' +
		'}' +
		'#dice .top {' +
			Random.getTransformPrefix() + 'transform: rotateX(90deg) translateZ(' + (Dice.WIDTH * 0.5) + 'px);' +
		'}' +
		'#dice .top.inner {' +
			Random.getTransformPrefix() + 'transform: rotateX(90deg) translateZ(' + (Dice.WIDTH * 0.5 - 2) + 'px);' +
		'}' +
		'#dice .bottom {' +
			Random.getTransformPrefix() + 'transform: rotateX(-90deg) translateZ(' + (Dice.WIDTH * 0.5) + 'px);' +
		'}' +
		'#dice .bottom.inner {' +
			Random.getTransformPrefix() + 'transform: rotateX(-90deg) translateZ(' + (Dice.WIDTH * 0.5 - 2) + 'px);' +
		'}' +
		'.dot {' +
			'position: absolute;' +
			'width: ' + (Dice.WIDTH * 0.23) + 'px;' +
			'height: ' + (Dice.WIDTH * 0.23) + 'px;' +
			'border-radius: 50%;' +
			'background: #444;' +
			'box-shadow: inset 5px 0 10px #000;' +
		'}' +
		'.dot.center {' +
			'margin: ' + (Dice.WIDTH * 0.385) + 'px 0 0 ' + (Dice.WIDTH * 0.385) + 'px;' +
		'}' +
		'.dot.dtop {' +
			'margin-top: ' + (Dice.WIDTH * 0.1) + 'px;' +
		'}' +
		'.dot.dleft {' +
			'margin-left: ' + (Dice.WIDTH * 0.67) + 'px;' +
		'}' +
		'.dot.dright {' +
			'margin-left: ' + (Dice.WIDTH * 0.1) + 'px;' +
		'}' +
		'.dot.dbottom {' +
			'margin-top: ' + (Dice.WIDTH * 0.67) + 'px;' +
		'}' +
		'.dot.center.dleft {' +
			'margin: ' + (Dice.WIDTH * 0.385) + 'px 0 0 ' + (Dice.WIDTH * 0.1) + 'px;' +
		'}' +
		'.dot.center.dright {' +
			'margin: ' + (Dice.WIDTH * 0.385) + 'px 0 0 ' + (Dice.WIDTH * 0.67) + 'px;' +
		'}';
};

Dice.prototype.getAnimation = function (from, to, duration) {
	var angles = [
		[0, 0, 0],
		[270, 0, 0],
		[0, 270, 0],
		[0, 90, 0],
		[90, 0, 0],
		[180, 0, 0]
	];
	return Random.createAnimation('#dice', {
		'0%': Random.getTransformPrefix() + 'transform: translateZ(-100px) ' +
			'rotateX(' + angles[from - 1][0] + 'deg) ' +
			'rotateY(' + angles[from - 1][1] + 'deg) ' +
			'rotateZ(' + angles[from - 1][2] + 'deg);',
		'100%': Random.getTransformPrefix() + 'transform: translateZ(-100px) ' +
			'rotateX(' + (angles[to - 1][0] + 720) + 'deg) ' +
			'rotateY(' + (angles[to - 1][1] + 720) + 'deg) ' +
			'rotateZ(' + (angles[to - 1][2] + 720) + 'deg);'
	}, duration, 'linear') +
	Random.createAnimation('#platform', {
		'0%': Random.getTransformPrefix() + 'transform: translate3d(0px,0,0px)',
		'12%': Random.getTransformPrefix() + 'transform: translate3d(200px,-50px,-300px)',
		'25%': Random.getTransformPrefix() + 'transform: translate3d(0px,-100px,-700px)',
		'37%': Random.getTransformPrefix() + 'transform: translate3d(-200px,-50px,-300px)',
		'50%': Random.getTransformPrefix() + 'transform: translate3d(0px,0,0px)',
		'62%': Random.getTransformPrefix() + 'transform: translate3d(100px,-25px,-150px)',
		'75%': Random.getTransformPrefix() + 'transform: translate3d(0px,-50px,-350px)',
		'87%': Random.getTransformPrefix() + 'transform: translate3d(-100px,-25px,-150px)',
		'100%': Random.getTransformPrefix() + 'transform: translate3d(0px,0px,0px)'
	}, duration, 'linear');
};

app.register('dice', Dice);

})();