/*global Random, app*/
(function () {
"use strict";

function Coin (params) {
	this.design = params.design;
	this.lang = params.lang;
}

Coin.WIDTH = 100;
Coin.THICK = 2;

Coin.l10n = {
	de: {
		0: ['Kopf', 'K'],
		1: ['Zahl', 'Z'],
		design: 'Art der Münze:',
		designs: ['Einfach', 'Euro (Deutschland)', 'Schweizer Franken']
	},
	en: {
		0: ['Head', 'H'],
		1: ['Tails', 'T'],
		design: 'Type of coin:',
		designs: ['Simple', 'Euro (Germany)', 'Swiss franc']
	}
};

Coin.designs = [
	['', '', '#b49b5e'],
	['res/euro-de.gif', 'res/euro.gif', '#b49b5e'],
	['res/fr-k.jpg', 'res/fr-z.jpg', '#d6d6d6']
];

Coin.getDefaultParams = function () {
	return {design: 1};
};

Coin.showConfig = function (container, config) {
	container.innerHTML = '<label>' + Coin.l10n[config.lang].design + '<br><select class="config-design">' +
		Coin.l10n[config.lang].designs.map(function (label, i) {
			return '<option value="' + i + '">' + label + '</option>';
		}) +
		'</select></label>';
	container.getElementsByClassName('config-design')[0].value = config.design;
};

Coin.readConfig = function (container) {
	return {
		design: container.getElementsByClassName('config-design')[0].value
	};
};

Coin.prototype = new Random();

Coin.prototype.getRandom = function () {
	return Random.randInt(2);
};

Coin.prototype.getDuration = function () {
	return Random.randNormalClamped(1500, 200, 500, 3000);
};

Coin.prototype.getHtml = function () {
	return '<div id="coin" class="trigger"></div>';
};

Coin.prototype.getCss = function () {
	var design = Coin.designs[this.design],
		svg0, svg1;
	svg0 = 'data:image/svg+xml,' +
		'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
		'<text x="50" y="65" font-size="50" text-anchor="middle" font-family="sans-serif" font-weight="bold">';
	svg1 = '</text></svg>';
	if (!design[0]) {
		design[0] = encodeURI(svg0 + this.getDisplay(0, true) + svg1);
	}
	if (!design[1]) {
		design[1] = encodeURI(svg0 + this.getDisplay(1, true) + svg1);
	}
	return '#container {' +
		Random.getTransformPrefix() + 'transform: perspective(500px);' +
		Random.getTransformPrefix() + 'transform-style: preserve-3d;' +
	'}' +
	'#coin {' +
		'background: ' + design[2] + ';' +
		'background-image: url(' + design[0] + ');' +
		'background-size: 100% 100%;' +
		'border-radius: 50%;' +
		'height: ' + Coin.WIDTH + 'px;' +
		'margin: ' + Coin.WIDTH + 'px auto 50px;' +
		'position: relative;' +
		'width: ' + Coin.WIDTH + 'px;' +
		Random.getTransformPrefix() + 'transform-style: preserve-3d;' +
	'}' +
	'#coin::after {' +
		'background-color: ' + design[2] + ';' +
		'background-image: linear-gradient(hsla(0,0%,100%,.25), hsla(0,0%,0%,.25));' +
		'bottom: 0;' +
		'content: "";' +
		'left: ' + (Coin.WIDTH / 2 - Coin.THICK) + 'px;' +
		'position: absolute;' +
		'top: 0;' +
		'width: ' + Coin.THICK + 'px;' +
		'z-index: -10;' +
		Random.getTransformPrefix() + 'transform: rotateY(-90deg);' +
		Random.getTransformPrefix() + 'transform-origin: 100% 50%;' +
	'}' +
	'#coin::before {' +
		'background-color: ' + design[2] + ';' +
		'background-image: url(' + design[1] + ');' +
		'background-size: 100% 100%;' +
		'border-radius: 50%;' +
		'content: "";' +
		'height: ' + Coin.WIDTH + 'px;' +
		'left: 0;' +
		'position: absolute;' +
		'top: 0;' +
		'width: ' + Coin.WIDTH + 'px;' +
		Random.getTransformPrefix() + 'transform: translateZ(-5px) rotateY(180deg);' +
	'}';
};

Coin.prototype.getAnimation = function (from, to, duration) {
	var xRot = Math.round(Random.randNormalClamped(1.75, 0.5, -2, 5)),
		zRot = Math.round(Random.randNormalClamped(1.25, 0.5, -2, 5));
	if (xRot === 2 + (from - to) / 2) {
		xRot += Random.randInt(2) * 2 - 1;
	}
	return Random.createAnimation('#coin', {
		'0%': Random.getTransformPrefix() + 'transform: translate(0,0) ' +
			'rotateY(' + (from * 180) + 'deg) ' +
			'rotateX(0deg) ' +
			'rotateZ(0deg);',
		'50%': Random.getTransformPrefix() + 'transform: translate(0,-' + Coin.WIDTH + 'px) ' +
			'rotateY(' + (360 + (to + from) * 90) + 'deg) ' +
			'rotateX(' + (xRot * 180) + 'deg) ' +
			'rotateZ(' + (zRot * 180) + 'deg);',
		'100%': Random.getTransformPrefix() + 'transform: translate(0,0) ' +
			'rotateY(' + (720 + to * 180) + 'deg) ' +
			'rotateX(' + (xRot * 360) + 'deg) ' +
			'rotateZ(' + (zRot * 360) + 'deg);'
	}, duration, 'linear');
};

Coin.prototype.getDisplay = function (val, short) {
	return Coin.l10n[this.lang][val][short ? 1 : 0];
};

app.register('coin', Coin);

})();