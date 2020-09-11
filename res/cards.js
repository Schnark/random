/*global Random, app*/
(function () {
"use strict";

function Cards (params) {
	this.deck = params.deck;
	this.design = params.design;
	this.lang = params.lang;
}

/*
Werte:
	0: Joker
	1: Ass
	2-10: Zahlkarten
	11: Bube
	12: Unter (Bild wie Bube, aber andere Abkürzung)
	13: Cavall
	14: Ober (Bild wie Cavall, aber andere Abkürzung)
	15: Dame
	16: König
Werte (Tarock):
	0: Joker
	1-21: Tarocks (derzeit nur als römische Zahlen)
	22: Sküs (Bild wie Joker, aber andere Abkürzung)
*/

Cards.l10n = {
	de: {
		reset: 'Karten neu mischen',
		values: ['J', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'U', 'C', 'O', 'D', 'K'],
		values0: ['J', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
			'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'S'],
		labelDeck: 'Kartenblatt:',
		labelDeckSkat: 'Skat',
		labelDeckSkat2: 'Skat (Ober/Unter)',
		labelDeckBridge: 'Bridge',
		labelDeckFull: 'Bridge + 3 Joker',
		labelDeckTarock: 'Tarock (voll)',
		labelDeckTarock2: 'Tarock (54 Karten)',
		labelDesign: 'Farben:',
		labelDesignA: 'Zweifarbig',
		labelDesignB: 'Vierfarbig',
		labelDesignC: 'Vierfarbig (Poker)'
	},
	en: {
		reset: 'Shuffle cards',
		values: ['*', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'U', 'C', 'O', 'Q', 'K'], //TODO
		values0: ['*', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
			'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'S'],
		labelDeck: 'Deck:',
		labelDeckSkat: 'Skat',
		labelDeckSkat2: 'Skat (Ober/Unter)',
		labelDeckBridge: 'Bridge',
		labelDeckFull: 'Bridge + 3 Jokers',
		labelDeckTarock: 'Tarock (full)',
		labelDeckTarock2: 'Tarock (54 cards)',
		labelDesign: 'Colors:',
		labelDesignA: 'Two-color',
		labelDesignB: 'Four-color',
		labelDesignC: 'Four-color (Poker)'
	}
};

Cards.colors = {
	char: ['', '♣', '♠', '♥', '♦'],
	a: ['#000', '#000', '#000', '#f00', '#f00'],
	b: ['#000', '#000', '#070', '#f00', '#c70'],
	c: ['#000', '#000', '#070', '#f00', '#00f']
};

Cards.WIDTH = 100;
Cards.HEIGHT = 156;

Cards.getDeck = function (deck) {
	var cards = [], s, v, start = 2;
	if (deck === 'skat' || deck === 'skat2') {
		start = 7;
	}
	for (s = 1; s <= 4; s++) {
		if (deck === 'tarock2') {
			if (s <= 2) {
				start = 7;
			} else {
				cards.push([s, 1]);
				cards.push([s, 2]);
				cards.push([s, 3]);
				cards.push([s, 4]);
				start = 11;
			}
		} else {
			cards.push([s, 1]);
		}
		for (v = start; v <= 10; v++) {
			cards.push([s, v]);
		}
		cards.push([s, deck === 'skat2' ? 12 : 11]);
		if (deck === 'tarock' || deck === 'tarock2') {
			cards.push([s, 13]);
		}
		cards.push([s, deck === 'skat2' ? 14 : 15]);
		cards.push([s, 16]);
	}
	if (deck === 'full') {
		cards.push([0, 0]);
		cards.push([0, 0]);
		cards.push([0, 0]);
	}
	if (deck === 'tarock' || deck === 'tarock2') {
		for (v = 1; v <= 22; v++) {
			cards.push([0, v]);
		}
	}
	return cards;
};

Cards.getDefaultParams = function () {
	return {deck: 'bridge', design: 'b'};
};

Cards.showConfig = function (container, config) {
	var html = [];
	html.push('<label>' + Cards.l10n[config.lang].labelDeck + '<br><select class="config-deck">' +
		'<option value="skat">' + Cards.l10n[config.lang].labelDeckSkat + '</option>' +
		'<option value="skat2">' + Cards.l10n[config.lang].labelDeckSkat2 + '</option>' +
		'<option value="bridge">' + Cards.l10n[config.lang].labelDeckBridge + '</option>' +
		'<option value="full">' + Cards.l10n[config.lang].labelDeckFull + '</option>' +
		'<option value="tarock">' + Cards.l10n[config.lang].labelDeckTarock + '</option>' +
		'<option value="tarock2">' + Cards.l10n[config.lang].labelDeckTarock2 + '</option>' +
		'</select></label>');
	html.push('<label>' + Cards.l10n[config.lang].labelDesign + '<br><select class="config-design">' +
		'<option value="a">' + Cards.l10n[config.lang].labelDesignA + '</option>' +
		'<option value="b">' + Cards.l10n[config.lang].labelDesignB + '</option>' +
		'<option value="c">' + Cards.l10n[config.lang].labelDesignC + '</option>' +
		'</select></label>');
	container.innerHTML = html.join('<br>');
	container.getElementsByClassName('config-deck')[0].value = config.deck;
	container.getElementsByClassName('config-design')[0].value = config.design;
};

Cards.readConfig = function (container) {
	return {
		deck: container.getElementsByClassName('config-deck')[0].value,
		design: container.getElementsByClassName('config-design')[0].value
	};
};

Cards.prototype = new Random();

Cards.prototype.drawCard = function (val, el) {
	//jscs:disable maximumLineLength
	var svg = '<svg width="' + Cards.WIDTH + '" height="' + Cards.HEIGHT + '">';
	if (val) {
		svg += '<defs>';
		svg += '<g id="value' + this.cards.length + '">';
		//svg += '<rect fill="none" stroke="black" stroke-width="1" x="0" y="0" width="30" height="30" />';
		svg += '<text x="15" y="25" text-anchor="middle" font-size="25">' + Cards.l10n[this.lang][val[0] === 0 ? 'values0' : 'values'][val[1]] + '</text>';
		svg += '</g>';
		svg += '<g id="suit' + this.cards.length + '">';
		//svg += '<rect fill="none" stroke="black" stroke-width="1" x="0" y="0" width="30" height="30" />';
		svg += '<text x="15" y="25" text-anchor="middle" font-size="25">' + Cards.colors.char[val[0]] + '</text>';
		svg += '</g>';
		if (val[1] === 0 || val[1] === 22 || (val[0] > 0 && val[1] > 10)) {
			svg += '<g id="person' + this.cards.length + '">';
			//svg += '<rect fill="none" stroke="black" stroke-width="1" x="0" y="0" width="60" height="60" />';
			svg += '<path fill="#aaf" d="M 10,60 C 10,20 50,20 50,60 z" />';
			svg += '<path fill="#fc0" d="M 45,10 C 45,45 15,45 15,10 z" />';
			svg += '<circle fill="#000" cx="25" cy="17" r="1.5" />';
			svg += '<circle fill="#000" cx="35" cy="17" r="1.5" />';
			svg += '<path fill="none" stroke="#000" d="M 25,28 C 30,30 30,30 35,28" />';
			switch (val[1]) {
			case 0:
			case 22:
				svg += '<path fill="#a0a" d="M 45,10 C 40,5 50,5 50,15 C 50,-10 35,0 35,5 C 35,0 30,-5 30,-5 C 30,-5 25,0 25,5 C 25,0 10,-10 10,15 C 10,5 20,5 15,10 z" />';
				break;
			case 11:
			case 12:
				svg += '<path fill="#0a0" d="M 50,0 L 45,10 L 15,10 L 10,0 z" />';
				break;
			case 13:
			case 14:
				svg += '<path fill="#ccc" d="M 45,10 C 45,-10 15,-10 15,10 z" />';
				break;
			case 15:
				svg += '<path fill="#f90" d="M 18,10 C 16,10 17,30 15,30 C 13,30 8,10 13,5 C 18,-2 42,-2 47,5 C 52,10 47,30 45,30 C 43,30 44,30 42,10 z" />';
				break;
			case 16:
				svg += '<path fill="#a90" d="M 15,10 L 15,0 L 22.5,5 L 30,0 L 37.5,5 L 45,0 L 45,10 z" />';
				break;
			}
			svg += '<use x="15" y="30" xlink:href="#suit' + this.cards.length + '"/>';
			svg += '<line stroke-width="2" x1="0" y1="60" x2="60" y2="60" stroke="black" />';
			svg += '</g>';
		}
		svg += '</defs>';
		svg += '<g fill="' + Cards.colors[this.design][val[0]] + '">';

		if (val[0] === 0) {
			if (val[1] === 0 || val[1] === 22) {
				svg += '<use x="0" y="0" xlink:href="#value' + this.cards.length + '" transform="scale(0.6)" />';
				svg += '<use x="' + (Cards.WIDTH / 0.6 - 30) + '" y="0" xlink:href="#value' + this.cards.length + '" transform="scale(0.6)" />';
				svg += '<use x="-30" y="' + (-Cards.HEIGHT / 0.6) + '" xlink:href="#value' + this.cards.length + '" transform="scale(-0.6)" />';
				svg += '<use x="' + (-Cards.WIDTH / 0.6) + '" y="' + (-Cards.HEIGHT / 0.6) + '" xlink:href="#value' + this.cards.length + '" transform="scale(-0.6)" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 30) + '" y="' + (Cards.HEIGHT / 2 - 60) + '" xlink:href="#person' + this.cards.length + '" />';
				svg += '<use x="' + (-Cards.WIDTH / 2 - 30) + '" y="' + (-Cards.HEIGHT / 2 - 60) + '" xlink:href="#person' + this.cards.length + '" transform="scale(-1)" />';
			} else {
				svg += '<use x="' + (Cards.WIDTH / 3 - 15) + '" y="' + (Cards.HEIGHT / 3 - 15) + '" xlink:href="#value' + this.cards.length + '" transform="scale(1.5)" />';
			}
		} else {
			svg += '<use x="0" y="0" xlink:href="#value' + this.cards.length + '" transform="scale(0.6)" />';
			svg += '<use x="' + (Cards.WIDTH / 0.6 - 30) + '" y="0" xlink:href="#value' + this.cards.length + '" transform="scale(0.6)" />';
			svg += '<use x="-30" y="' + (-Cards.HEIGHT / 0.6) + '" xlink:href="#value' + this.cards.length + '" transform="scale(-0.6)" />';
			svg += '<use x="' + (-Cards.WIDTH / 0.6) + '" y="' + (-Cards.HEIGHT / 0.6) + '" xlink:href="#value' + this.cards.length + '" transform="scale(-0.6)" />';

			svg += '<use x="0" y="30" xlink:href="#suit' + this.cards.length + '" transform="scale(0.6)" />';
			svg += '<use x="' + (Cards.WIDTH / 0.6 - 30) + '" y="30" xlink:href="#suit' + this.cards.length + '" transform="scale(0.6)" />';
			svg += '<use x="-30" y="' + (30 - Cards.HEIGHT / 0.6) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-0.6)" />';
			svg += '<use x="' + (-Cards.WIDTH / 0.6) + '" y="' + (30 - Cards.HEIGHT / 0.6) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-0.6)" />';

			switch (val[1]) {
			case 1:
				svg += '<use x="' + (Cards.WIDTH / 3 - 15) + '" y="' + (Cards.HEIGHT / 3 - 15) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(1.5)" />';
				break;
			case 2:
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (-Cards.WIDTH / 2 - 15) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 3:
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (-Cards.WIDTH / 2 - 15) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 4:
				svg += '<use x="20" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="-50" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 5:
				svg += '<use x="20" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="-50" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 6:
				svg += '<use x="20" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="20" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="-50" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 7:
				svg += '<use x="20" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 4 + 2.5) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="20" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="-50" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 8:
				svg += '<use x="20" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 4 + 2.5) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="20" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (-Cards.WIDTH / 2 - 15) + '" y="' + (-3 * Cards.HEIGHT / 4 + 2.5) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="-50" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 9:
				svg += '<use x="20" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="20" y="' + (Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="' + (Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 2 - 15) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="-50" y="' + (-2 * Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (-2 * Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="-50" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 10:
				svg += '<use x="20" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="20" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 6 + 25 / 3) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="20" y="' + (Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH - 50) + '" y="' + (Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" />';
				svg += '<use x="-50" y="' + (-2 * Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (-2 * Cards.HEIGHT / 3 - 10 / 3) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH / 2 - 15) + '" y="' + (-5 * Cards.HEIGHT / 6 + 25 / 3) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="-50" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				svg += '<use x="' + (-Cards.WIDTH + 20) + '" y="' + (20 - Cards.HEIGHT) + '" xlink:href="#suit' + this.cards.length + '" transform="scale(-1)" />';
				break;
			case 0:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
				svg += '<use x="' + (Cards.WIDTH / 2 - 30) + '" y="' + (Cards.HEIGHT / 2 - 60) + '" xlink:href="#person' + this.cards.length + '" />';
				svg += '<use x="' + (-Cards.WIDTH / 2 - 30) + '" y="' + (-Cards.HEIGHT / 2 - 60) + '" xlink:href="#person' + this.cards.length + '" transform="scale(-1)" />';
				break;
			default:
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 2 - 30) + '" xlink:href="#value' + this.cards.length + '" />';
				svg += '<use x="' + (Cards.WIDTH / 2 - 15) + '" y="' + (Cards.HEIGHT / 2) + '" xlink:href="#suit' + this.cards.length + '"/>';
			}
		}
		svg += '</g>';
	} else {
		svg += '<rect fill="blue" x="3" y="3" width="' + (Cards.WIDTH - 6) + '" height="' + (Cards.HEIGHT - 6) + '" />';
	}
	svg += '</svg>';
	el.innerHTML = svg;
	//jscs:enable maximumLineLength
};

Cards.prototype.onInit = function () {
	this.resetButton = document.getElementById('reset-button');
	this.nextCard = document.getElementById('next-card');
	this.currentCard = document.getElementById('current-card');
	this.prevCard = document.getElementById('prev-card');
	this.reset();
	this.drawCard('', this.nextCard);
	this.drawCard('', this.currentCard.getElementsByClassName('back')[0]);
	this.nextCard.addEventListener('click', this.onRefresh.bind(this), false);
	this.resetButton.addEventListener('click', this.reset.bind(this), false);
};

Cards.prototype.reset = function () {
	this.resetButton.disabled = true;
	this.nextCard.style.display = '';
	this.currentCard.style.display = 'none';
	this.prevCard.style.display = 'none';
	this.cards = Random.shuffle(Cards.getDeck(this.deck));
};

Cards.prototype.getRandom = function (init) {
	return init ? '' : this.cards.pop();
};

Cards.prototype.getDuration = function () {
	return 1500;
};

Cards.prototype.getHtml = function () {
	return '<button id="reset-button">' + Cards.l10n[this.lang].reset + '</button>' +
		'<div id="table">' +
		'<div id="next-card" class="card back"></div>' +
		'<div id="current-card" class="card"><div class="front"></div><div class="back"></div></div>' +
		'<div id="prev-card" class="card front"></div>' +
		'</div>';
};

Cards.prototype.getCss = function () {
	return '#reset-button {' +
		'font: inherit;' +
	'}' +
	'#next-card {' +
		'cursor: pointer;' +
	'}' +
	'#table {' +
		Random.getTransformPrefix() + 'transform: perspective(500px);' +
		Random.getTransformPrefix() + 'transform-style: preserve-3d;' +
		'position: relative;' +
		'width: ' + (Cards.WIDTH * 2.2) + 'px;' +
		'height: ' + Cards.HEIGHT + 'px;' +
		'margin: 50px auto;' +
	'}' +
	'.card {' +
		'width: ' + Cards.WIDTH + 'px;' +
		'height: ' + Cards.HEIGHT + 'px;' +
		'border-radius: 5px;' +
		'border: 1px solid black;' +
		'background: white;' +
		'position: absolute;' +
	'}' +
	'#next-card {' +
		'top: 0; left: 0;' +
	'}' +
	'#current-card {' +
		'top: 0; left: ' + (Cards.WIDTH * 1.2) + 'px;' +
		Random.getTransformPrefix() + 'transform-style: preserve-3d;' +
		Random.getTransformPrefix() + 'transform-origin: ' + (Cards.WIDTH * -0.1) + 'px;' +
		'z-index: 1;' +
	'}' +
	'#current-card .front,  #current-card .back {' +
		'position: absolute;' +
		'top: 0; left: 0;' +
		'width: ' + Cards.WIDTH + 'px;' +
		'height: ' + Cards.HEIGHT + 'px;' +
		'backface-visibility: hidden;' +
	'}' +
	'#current-card .back {' +
		Random.getTransformPrefix() + 'transform: rotateY(180deg);' +
	'}' +
	'#prev-card {' +
		'top: 0; left: ' + (Cards.WIDTH * 1.2) + 'px;' +
	'}';
};

Cards.prototype.getAnimation = function (from, to, duration) {
	if (!to) {
		return '';
	}
	return Random.createAnimation('#current-card', {
		'0%': Random.getTransformPrefix() + 'transform: rotateY(-180deg);',
		'100%': Random.getTransformPrefix() + 'transform: rotateY(0deg);'
	}, duration);
};

Cards.prototype.getDisplay = function (val) {
	return '<span style="color:' + Cards.colors[this.design][val[0]] + '">' +
		Cards.colors.char[val[0]] + Cards.l10n[this.lang][val[0] === 0 ? 'values0' : 'values'][val[1]] + '</span>';
};

Cards.prototype.onBeforeAnimation = function (val) {
	this.resetButton.disabled = true;
	if (this.cards.length === 0) {
		this.nextCard.style.display = 'none';
	}
	this.currentCard.style.display = '';
	this.drawCard(val, this.currentCard.getElementsByClassName('front')[0]);
};

Cards.prototype.onAfterAnimation = function (val) {
	this.resetButton.disabled = false;
	this.drawCard(val, this.prevCard);
	this.prevCard.style.display = '';
};

app.register('cards', Cards);

})();