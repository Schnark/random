/*global Random: true*/
/*jshint bitwise: false*/
Random =
(function () {
"use strict";

function MersenneTwister (seed) {
	//https://de.wikipedia.org/wiki/Mersenne-Twister
	var s;
	if (seed === undefined) {
		seed = new Date().getTime();
	}
	this.N = 624;
	this.M = 397;

	this.mt = [];
	this.mt[0] = seed >>> 0;
	for (this.mti = 1; this.mti < this.N; this.mti++) {
		s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
		this.mt[this.mti] >>>= 0;
	}
}

MersenneTwister.prototype.random = function () {
	var y, i,
		UPPER_MASK = 0x80000000,
		LOWER_MASK = 0x7fffffff,
		m = [0x0, 0x9908b0df];

	if (this.mti === this.N) {
		for (i = 0; i < this.N - this.M; i++) {
			y = (this.mt[i] & UPPER_MASK) | (this.mt[i + 1] & LOWER_MASK);
			this.mt[i] = this.mt[i + this.M] ^ (y >>> 1) ^ m[y & 0x1];
		}
		for (; i < this.N - 1; i++) {
			y = (this.mt[i] & UPPER_MASK) | (this.mt[i + 1] & LOWER_MASK);
			this.mt[i] = this.mt[i + (this.M - this.N)] ^ (y >>> 1) ^ m[y & 0x1];
		}
		y = (this.mt[this.N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
		this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ m[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return (y >>> 0) / 0x100000000;
};

var mt = new MersenneTwister();

function Random (/*config*/) {
}

Random.checkStyle = function (map) {
	var el = document.createElement('span'), key;
	for (key in map) {
		if (map.hasOwnProperty(key) && key in el.style) {
			return map[key];
		}
	}
	return '';
};

Random.getAnimationPrefix = function () {
	if (Random.cachedAnimationPrefix === undefined) {
		Random.cachedAnimationPrefix = Random.checkStyle({
			animationName: '',
			MozAnimationName: '-moz-',
			WebkitAnimationName: '-webkit-'
		});
	}
	return Random.cachedAnimationPrefix;
};

Random.getTransformPrefix = function () {
	if (Random.cachedTransformPrefix === undefined) {
		Random.cachedTransformPrefix = Random.checkStyle({
			transform: '',
			MozTransform: '-moz-',
			WebkitTransform: '-webkit-'
		});
	}
	return Random.cachedTransformPrefix;
};

Random.animationCount = 0;

Random.createAnimation = function (selector, states, duration, additional) {
	var name;

	function flatten (obj) {
		var key, str = '';
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				str += key + '{' + obj[key] + '}';
			}
		}
		return str;
	}

	if (!duration) {
		if (states['100%'] || states.to) {
			return selector + '{' + (states['100%'] || states.to) + '}';
		}
		duration = 1;
	}

	name = 'animation-' + Random.animationCount;
	Random.animationCount = (Random.animationCount + 1) % 1024;
	return '@' + Random.getAnimationPrefix() + 'keyframes ' + name + '{' + flatten(states) + '}' +
		selector + '{' + Random.getAnimationPrefix() + 'animation:' +
		name + ' ' + duration + 'ms forwards ' + (additional || '') + '}';
};

Random.random = function () {
	return mt.random();
	//return Math.random();
};

Random.randInt = function (n) {
	return Math.floor(n * Random.random());
};

Random.randRange = function (a, b) {
	return a + Random.random() * (b - a);
};

Random.randNormal = function (m, s) {
	//Box-Muller
	return Math.cos(2 * Math.PI * Random.random()) * Math.sqrt(-2 * Math.log(Random.random())) * s + m;
};

Random.randNormalClamped = function (m, s, min, max) {
	return Math.max(min, Math.min(max, Random.randNormal(m, s)));
};

Random.shuffle = function (objects) {
	objects = objects.map(function (object) {
		return {
			object: object,
			order: Random.random()
		};
	});
	objects.sort(function (a, b) {
		return a.order - b.order;
	});
	return objects.map(function (entry) {
		return entry.object;
	});
};

Random.prototype.getRandom = function () {
	return 0;
};

Random.prototype.getDisplay = function (val/*, short*/) {
	return String(val);
};

Random.prototype.getDuration = function (/*from, to*/) {
	return Random.randNormalClamped(3000, 200, 700, 5000);
};

Random.prototype.getHtml = function () {
	return '';
};

Random.prototype.getBasicCss = function () {
	return '.trigger {cursor: pointer;}' +
		'#display {text-align: center; font-size: 150%; padding: 10px 0;}' +
		'#history {padding: 0; margin: 0; white-space: nowrap; text-align: right;' +
			' width: 10000%; position: relative; right: 9950%;}' +
		'#history li {display: inline-block; padding: 0.2em;}' +
		'#history li:last-child {font-weight: bold;}';
};

Random.prototype.getCss = function () {
	return '';
};

Random.prototype.getAnimation = function (/*from, to, duration*/) {
	return '';
};

Random.prototype.onInit = function (container) {
	var i, trigger;
	trigger = container.getElementsByClassName('trigger');
	for (i = 0; i < trigger.length; i++) {
		trigger[i].addEventListener('click', this.onRefresh.bind(this), false);
	}
};

Random.prototype.onBeforeAnimation = function (/*newVal*/) {
};

Random.prototype.onAfterAnimation = function (/*curVal*/) {
};

Random.prototype.onRefresh = function () {
	var newVal, duration, css;
	if (this.isRefreshing) {
		return;
	}
	this.isRefreshing = true;
	newVal = this.getRandom();
	duration = this.getDuration();
	css = this.getAnimation(this.currentVal, newVal, duration);
	this.onBeforeAnimation(newVal);
	this.currentVal = newVal;
	this.elements.animation.textContent = css;
	setTimeout(function () {
		this.onAfterAnimation(this.currentVal);
		this.elements.display.innerHTML = this.getDisplay(this.currentVal);
		this.elements.history.innerHTML += '<li>' + this.getDisplay(this.currentVal, true) + '</li>';
		this.isRefreshing = false;
	}.bind(this), duration);
};

Random.prototype.init = function (page) {
	page.innerHTML = '<div id="container"></div><div id="display"></div><ol id="history"></ol>';
	this.elements = {
		css: document.getElementById('static-style'),
		animation: document.getElementById('animation-style'),
		container: document.getElementById('container'),
		display: document.getElementById('display'),
		history: document.getElementById('history')
	};
	this.currentVal = this.getRandom(true);
	this.elements.css.textContent = this.getBasicCss() + this.getCss();
	this.elements.animation.textContent = this.getAnimation(this.currentVal, this.currentVal, 0);
	this.elements.container.innerHTML = this.getHtml();
	this.onInit(this.elements.container);
};

return Random;

})();