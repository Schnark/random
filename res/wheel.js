/*global Random, app*/
(function () {
"use strict";

function Wheel (params) {
	var data = params.key ? Wheel.getInternalData(params.key) : params.data;
	this.data = typeof data === 'string' ? Wheel.parse(data) : data;
}

Wheel.WIDTH = 250;

Wheel.l10n = {
	de: {
		key: 'Glücksrad:',
		keyNumbers: 'Zahlen (1–8)',
		keyRoulette: 'Roulette',
		keyEmoji: 'Emoji',
		keyCustom: 'Eigenes Glücksrad',
		customData: 'Daten:',
		customExplain: 'Jede Zeile definiert ein Feld des Glücksrads. ' +
			'Sollen die Felder verschieden groß sein, ' +
			'so stellt man der Zeile eine Zahl als Gewicht gefolgt von einem Doppelpunkt voran. ' +
			'Zeilen ohne ein solches explizites Gewicht haben das Gewicht 1.'
	},
	en: {
		key: 'Type of wheel:',
		keyNumbers: 'Numbers (1–8)',
		keyRoulette: 'Roulette',
		keyEmoji: 'Emoji',
		keyCustom: 'Custom wheel of fortune',
		customData: 'Data:',
		customExplain: 'Every line defines one field of the wheel. ' +
			'If you want fields of different sizes, ' +
			'you have to prepend the lines with a number as weight, ' +
			'followed by a colon. Lines without such an explicite weight have the weight 1.'
	}
};

Wheel.internalData = {
	numbers: '1\n2\n3\n4\n5\n6\n7\n8',
	emoji: '😁\n😃\n😐\n😞\n😢'
};

Wheel.parse = function (input) {
	var totalWeight = 0, colors = [
		'red', 'green', 'blue', 'yellow'
	];

	return input.split('\n').filter(function (line) {
		return line;
	}).map(function (line, i, total) {
		var weight = 1, start;

		line = line.split(':');
		if (line.length > 1 && Number(line[0]) > 0) {
			weight = Number(line.shift());
		}
		line = line.join(':');
		totalWeight += weight;

		start = line.charCodeAt(0);
		if (start >= 0xD800 && start <= 0xDBFF) {
			start = line.slice(0, 2);
		} else {
			start = line.slice(0, 1);
		}
		line = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		start = start.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

		return {
			str: line,
			strShort: start,
			color: (i === total.length - 1 && i % colors.length === 0) ? colors[1] : colors[i % colors.length],
			textColor: 'black',
			angle: weight
		};
	}).map(function (entry) {
		entry.angle *= 360 / totalWeight;
		return entry;
	});
};

Wheel.getInternalData = function (key) {
	if (key === 'roulette') {
		return [
			0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
			10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
		].map(function (n, i, total) {
			return {
				str: String(n),
				strShort: String(n),
				color: i === 0 ? 'green' : ['black', 'red'][i % 2],
				textColor: 'white',
				angle: 360 / total.length
			};
		});
	}
	return Wheel.internalData[key];
};

Wheel.getDefaultParams = function () {
	return {key: 'numbers', data: '2:Aaaa\nBbbb\n2:Cccc\n3:Dddd'};
};

Wheel.showConfig = function (container, config) {
	var html = [], select;

	function onKeyChange () {
		container.getElementsByClassName('config-data-container')[0].style.display = (select.value === '') ? '' : 'none';
	}

	html.push('<label>' + Wheel.l10n[config.lang].key + '<br><select class="config-key">' +
		'<option value="numbers">' + Wheel.l10n[config.lang].keyNumbers + '</option>' +
		'<option value="roulette">' + Wheel.l10n[config.lang].keyRoulette + '</option>' +
		'<option value="emoji">' + Wheel.l10n[config.lang].keyEmoji + '</option>' +
		'<option value="">' + Wheel.l10n[config.lang].keyCustom + '</option>' +
		'</select></label>');
	html.push('<div class="config-data-container"><label>' + Wheel.l10n[config.lang].customData + '<br>' +
		'<textarea class="config-data" rows="5"></textarea></label>' +
		'<p>' + Wheel.l10n[config.lang].customExplain + '</p></div>');
	container.innerHTML = html.join('');
	select = container.getElementsByClassName('config-key')[0];
	select.value = config.key;
	container.getElementsByClassName('config-data')[0].value = config.data;

	select.addEventListener('change', onKeyChange);
	onKeyChange();
};

Wheel.readConfig = function (container) {
	return {
		key: container.getElementsByClassName('config-key')[0].value,
		data: container.getElementsByClassName('config-data')[0].value
	};
};

Wheel.prototype = new Random();

Wheel.prototype.getRandom = function (init) {
	return init ? 0 : Random.randRange(0, 360);
};

Wheel.prototype.getHtml = function () {
	var point = [Wheel.WIDTH / 2, 0], angle = 0;
	return '<span id="arrow">↓</span>' +
		'<svg id="wheel" class="trigger" width="' + Wheel.WIDTH + '" height="' + Wheel.WIDTH + '">' +
		this.data.map(function (entry) {
			var el, next, anchor;
			angle += entry.angle;
			next = [
				Wheel.WIDTH / 2 + Wheel.WIDTH / 2 * Math.sin(angle * Math.PI / 180),
				Wheel.WIDTH / 2 - Wheel.WIDTH / 2 * Math.cos(angle * Math.PI / 180)
			];
			anchor = [(point[0] + next[0]) / 2, (point[1] + next[1]) / 2];
			el = '<path ' +
					'fill="' + entry.color + '" ' +
					'd="M ' + (Wheel.WIDTH / 2) + ',' + (Wheel.WIDTH / 2) + ' L ' + point.join(',') +
						' A ' + (Wheel.WIDTH / 2) + ',' + (Wheel.WIDTH / 2) + ' 0 ' +
						(entry.angle > 180 ? '1' : '0') + ' 1 ' + next.join(',') + ' z">' +
				'</path><text transform="rotate(' + (angle - entry.angle / 2) + ' ' + anchor.join(' ') + ')"' +
					'fill="' + entry.textColor + '" ' +
					'text-anchor="middle" ' +
					'x="' + anchor[0] + '" ' +
					'y="' + anchor[1] + '">' +
						'<tspan dy="2ex">' + entry.strShort + '</tspan>' +
				'</text>';
			point = next;
			return el;
		}).join('') +
	'</svg>';
};

Wheel.prototype.getCss = function () {
	return '#arrow, #wheel {' +
		'display: block;' +
		'width: ' + Wheel.WIDTH + 'px;' +
		'margin: auto;' +
		'text-align: center;' +
	'}';
};

Wheel.prototype.getAnimation = function (from, to, duration) {
	to += 360 * Math.floor(Random.randNormalClamped(3, 0.5, 2, 6));
	return Random.createAnimation('#wheel', {
		'0%': Random.getTransformPrefix() + 'transform: rotate(' + from + 'deg);',
		'100%': Random.getTransformPrefix() + 'transform: rotate(' + to + 'deg);'
	}, duration);
};

Wheel.prototype.getDisplay = function (val, short) {
	var i = 0;
	val = 360 - val;
	while (i < this.data.length - 1 && this.data[i].angle < val) {
		val -= this.data[i].angle;
		i++;
	}
	return this.data[i][short ? 'strShort' : 'str'];
};

app.register('wheel', Wheel);

})();