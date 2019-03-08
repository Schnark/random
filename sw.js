/*global caches, fetch, Promise */
(function (worker) {
"use strict";

var PREFIX = 'random',
	VERSION = '1.1',
	FILES = [
		'index.html',
		'res/app.js',
		'res/bottle.jpg',
		'res/bottle.js',
		'res/cards.js',
		'res/coin.js',
		'res/dice.js',
		'res/euro-de.gif',
		'res/euro.gif',
		'res/generator.js',
		'res/init.js',
		'res/random.js',
		'res/style.css',
		'res/wheel.js'
	];

worker.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(PREFIX + ':' + VERSION).then(function (cache) {
			return cache.addAll(FILES);
		})
	);
});

worker.addEventListener('activate', function (e) {
	e.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(keys.map(function (key) {
				if (key.indexOf(PREFIX + ':') === 0 && key !== PREFIX + ':' + VERSION) {
					return caches.delete(key);
				}
			}));
		})
	);
});

worker.addEventListener('fetch', function (e) {
	e.respondWith(caches.match(e.request, {ignoreSearch: true})
		.then(function (response) {
			return response || fetch(e.request);
		})
	);
});

})(this);
