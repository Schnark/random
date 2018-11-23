/*global Random, app*/
(function () {
"use strict";

function Generator (params) {
	this.type = params.type;
	this.param = params.param;
}

Generator.WIDTH = 300;

Generator.l10n = {
	de: {
		type: 'Art:',
		typeInt: 'Gleichverteilung (Ganze Zahlen)',
		typeFloat: 'Gleichverteilung (Kommazahlen)',
		typeNormal: 'Normalverteilung',
		min: 'Minimum:',
		max: 'Maximum:',
		m: 'Mittelwert:',
		s: 'Standardabweichung:'
	},
	en: {
		type: 'Type:',
		typeInt: 'Uniform distribution (whole numbers)',
		typeFloat: 'Uniform distribution (floating point numbers)',
		typeNormal: 'Normal distribution',
		min: 'Minimum:',
		max: 'Maximum:',
		m: 'Mean:',
		s: 'Standard deviation:'
	}
};

Generator.getDefaultParams = function () {
	return {type: 'normal', param: {min: 0, max: 10, m: 0, s: 1}};
};

Generator.showConfig = function (container, config) {
	var html = [], select;

	function onTypeChange () {
		container.getElementsByClassName('minmax-container')[0].style.display = (select.value === 'normal') ? 'none' : '';
		container.getElementsByClassName('ms-container')[0].style.display = (select.value === 'normal') ? '' : 'none';
	}

	html.push('<label>' + Generator.l10n[config.lang].type + '<br><select class="config-type">' +
		'<option value="int">' + Generator.l10n[config.lang].typeInt + '</option>' +
		'<option value="float">' + Generator.l10n[config.lang].typeFloat + '</option>' +
		'<option value="normal">' + Generator.l10n[config.lang].typeNormal + '</option>' +
		'</select></label>');
	html.push('<div class="minmax-container"><label>' + Generator.l10n[config.lang].min + '<br>' +
		'<input type="number" class="config-min"></label><br>');
	html.push('<label>' + Generator.l10n[config.lang].max + '<br><input type="number" class="config-max"></label></div>');
	html.push('<div class="ms-container"><label>' + Generator.l10n[config.lang].m + '<br>' +
		'<input type="number" class="config-m"></label><br>');
	html.push('<label>' + Generator.l10n[config.lang].s + '<br><input type="number" class="config-s"></label></div>');
	container.innerHTML = html.join('');
	select = container.getElementsByClassName('config-type')[0];
	select.value = config.type;
	container.getElementsByClassName('config-min')[0].value = config.param.min;
	container.getElementsByClassName('config-max')[0].value = config.param.max;
	container.getElementsByClassName('config-m')[0].value = config.param.m;
	container.getElementsByClassName('config-s')[0].value = config.param.s;
	select.addEventListener('change', onTypeChange);
	onTypeChange();
};

Generator.readConfig = function (container) {
	return {
		type: container.getElementsByClassName('config-type')[0].value,
		param: {
			min: Number(container.getElementsByClassName('config-min')[0].value),
			max: Number(container.getElementsByClassName('config-max')[0].value),
			m: Number(container.getElementsByClassName('config-m')[0].value),
			s: Number(container.getElementsByClassName('config-s')[0].value)
		}
	};
};

Generator.prototype = new Random();

Generator.prototype.getDuration = function () {
	return 1000;
};

Generator.prototype.getRandom = function () {
	switch (this.type) {
	case 'int': return this.param.min + Random.randInt(this.param.max - this.param.min + 1);
	case 'float': return Random.randRange(this.param.min, this.param.max);
	case 'normal': return Random.randNormal(this.param.m, this.param.s);
	default: return 0;
	}
};

Generator.prototype.getHtml = function () {
	return '<div id="box" class="trigger">' +
		'<div id="bar"></div>' +
		'<div id="l1"></div>' +
		'<div id="l2"></div>' +
		'<div id="l3"></div>' +
		'<div id="l4"></div>' +
		'<div id="l5"></div>' +
		'<div id="l6"></div>' +
		'<div id="l7"></div>' +
		'<div id="l8"></div>' +
		'<div id="l9"></div></div>';
};

Generator.prototype.getCss = function () {
	return '#box {' +
		'width: ' + Generator.WIDTH + 'px;' +
		'height: ' + Generator.WIDTH + 'px;' +
		'border-radius: ' + Generator.WIDTH / 16 + 'px;' +
		'background-color: #aaa;' +
		'margin: auto;' +
		'position: relative;' +
	'}' +
	'#bar {' +
		'background-color: blue;' +
		'position: absolute;' +
		'top: ' + (Generator.WIDTH / 16 - 2) + 'px;' +
		'height: 4px;' +
	'}' +
	'#l1, #l2, #l3, #l4, #l5, #l6, #l7, #l8, #l9 {' +
		'width: ' + (3 * Generator.WIDTH / 16) + 'px;' +
		'height: ' + (3 * Generator.WIDTH / 16) + 'px;' +
		'margin: ' + Generator.WIDTH / 32 + 'px;' +
		'border-radius: 50%;' +
		'position: absolute;' +
	'}' +
	'#l1, #l2, #l3 {' +
		'top: ' + Generator.WIDTH / 8 + 'px;' +
	'}' +
	'#l4, #l5, #l6 {' +
		'top: ' + (3 * Generator.WIDTH / 8) + 'px;' +
	'}' +
	'#l7, #l8, #l9 {' +
		'top: ' + (5 * Generator.WIDTH / 8) + 'px;' +
	'}' +
	'#l1, #l4, #l7 {' +
		'left: ' + Generator.WIDTH / 8 + 'px;' +
	'}' +
	'#l2, #l5, #l8 {' +
		'left: ' + (3 * Generator.WIDTH / 8) + 'px;' +
	'}' +
	'#l3, #l6, #l9 {' +
		'left: ' + (5 * Generator.WIDTH / 8) + 'px;' +
	'}';
};

Generator.prototype.getAnimation = function (from, to, duration) {
	return Random.createAnimation('#bar', {
		'0%': 'left: 0; right: ' + Generator.WIDTH + 'px;',
		'50%': 'left: 0; right: 0;',
		'100%': 'left: ' + Generator.WIDTH + 'px; right: 0;'
	}, duration) +
	Random.createAnimation('#l5', {
		'0%': 'background: #b00;',
		'99%': 'background: #b00;',
		'100%': 'background: #0b0;'
	}, duration) +
	[1, 2, 3, 4, 6, 7, 8, 9].map(function (i) {
		var animation = {
			'0%': 'background: #444;',
			'100%': 'background: #444;'
		}, start, end, color1, color2;
		start = Random.randNormalClamped(20, 5, 1, 49);
		end = Random.randNormalClamped(80, 5, 51, 99);
		color1 = '#' + Random.randInt(0xfff).toString(16);
		color2 = '#' + Random.randInt(0xfff).toString(16);
		animation[start + '%'] = 'background: #444;';
		animation[(0.75 * start + 0.25 * end) + '%'] = 'background: ' + color1;
		animation[(0.25 * start + 0.75 * end) + '%'] = 'background: ' + color2;
		animation[end + '%'] = 'background: #444;';
		return Random.createAnimation('#l' + i, animation, duration);
	}).join('');
};

Generator.prototype.getDisplay = function (val, short) {
	if (short && this.type !== 'int') {
		val = Math.round(10 * val) / 10;
	}
	return String(val);
};

app.register('generator', Generator);

})();