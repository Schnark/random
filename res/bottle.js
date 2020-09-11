/*global Random, app*/
(function () {
"use strict";

function Bottle (/*params*/) {
}

Bottle.WIDTH = 256;

Bottle.l10n = {
	de: '<p>Keine Konfiguration</p>' +
		'<p>Foto: Salsero35 (<a href="https://commons.wikimedia.org/wiki/File:Anatomie_de_bouteille.svg" ' +
		'target="_blank" rel="noopener">CC-BY-SA-3.0</a>)',
	en: '<p>No configuration</p>' +
		'<p>Photo: Salsero35 (<a href="https://commons.wikimedia.org/wiki/File:Anatomie_de_bouteille.svg" ' +
		'target="_blank" rel="noopener">CC-BY-SA-3.0</a>)'
};

Bottle.getDefaultParams = function () {
	return {};
};

Bottle.showConfig = function (container, config) {
	container.innerHTML = Bottle.l10n[config.lang];
};

Bottle.readConfig = function (/*container*/) {
	return Bottle.getDefaultParams();
};

Bottle.prototype = new Random();

Bottle.prototype.onInit = function () {
	Random.prototype.onInit.apply(this, arguments);
	if (screen.orientation && screen.orientation.lock) {
		screen.orientation.lock('portrait-primary');
	} else if (screen.lockOrientation) {
		screen.lockOrientation('portrait-primary');
	} else if (screen.mozLockOrientation) {
		screen.mozLockOrientation('portrait-primary');
	} else if (screen.msLockOrientation) {
		screen.msLockOrientation('portrait-primary');
	}
};

Bottle.prototype.onExit = function () {
	Random.prototype.onExit.apply(this, arguments);
	if (screen.orientation && screen.orientation.unlock) {
		screen.orientation.unlock();
	} else if (screen.unlockOrientation) {
		screen.unlockOrientation();
	} else if (screen.mozUnlockOrientation) {
		screen.mozUnlockOrientation();
	} else if (screen.msUnlockOrientation) {
		screen.msUnlockOrientation();
	}
};

Bottle.prototype.getRandom = function () {
	return Random.randRange(0, 360);
};

Bottle.prototype.getHtml = function () {
	return '<img id="bottle" class="trigger" src="res/bottle.jpg">';
};

Bottle.prototype.getCss = function () {
	return '#bottle {' +
		'display: block;' +
		'width: ' + Bottle.WIDTH + 'px;' +
		'height: ' + Bottle.WIDTH + 'px;' +
		'line-height: ' + Bottle.WIDTH + 'px;' +
		'margin: ' + (Bottle.WIDTH / 4) + 'px' + ' auto;' +
	'}';
};

Bottle.prototype.getAnimation = function (from, to, duration) {
	to += 360 * Math.round(Random.randNormalClamped(2.5, 0.5, 2, 4));
	return Random.createAnimation('#bottle', {
		'0%': Random.getTransformPrefix() + 'transform: rotate(' + from + 'deg);',
		'100%': Random.getTransformPrefix() + 'transform: rotate(' + to + 'deg);'
	}, duration);
};

Bottle.prototype.getDisplay = function () {
	return '';
};

app.register('bottle', Bottle);

})();