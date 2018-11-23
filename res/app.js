/*global app: true*/
app =
(function () {
"use strict";

var app = {};

app.constructors = [];

app.register = function (name, constr) {
	app.constructors[name] = constr;
};

app.init = function (buttons) {
	var i;
	app.config = app.loadConfig();
	app.configShown = false;
	app.currentName = '';
	app.currentButton = buttons[0]; //TODO config

	for (i = 0; i < buttons.length - 1; i++) {
		buttons[i].addEventListener('click', app.onButtonClick);
	}
	buttons[buttons.length - 1].addEventListener('click', app.onConfigClick);

	app.currentButton.className = 'selected';
	app.switchTo(app.currentButton.dataset.id);
};

app.onButtonClick = function () {
	app.currentButton.className = '';
	this.className = 'selected';
	app.currentButton = this;
	app.switchTo(this.dataset.id);
};

app.onConfigClick = function () {
	this.className = app.configShown ? '' : 'selected';
	app.toggleConfig(!app.configShown);
};

app.getLang = function () {
	var lang = navigator.language,
		available = ['en', 'de'];
	if (available.indexOf(lang) > -1) {
		return lang;
	}
	lang = lang.replace(/-.*/, '');
	if (available.indexOf(lang) > -1) {
		return lang;
	}
	return available[0];
};

app.switchTo = function (name, noReadConfig) {
	if (app.configShown) {
		if (app.currentName && !noReadConfig) {
			app.readConfig(app.currentName);
		}
		app.showConfig(name);
	} else {
		app.show(name);
	}
	app.currentName = name;
};

app.toggleConfig = function (on) {
	app.configShown = on;
	if (app.currentName) {
		if (!on) {
			app.readConfig(app.currentName);
		}
		app.switchTo(app.currentName, true);
	}
};

app.getParams = function (name) {
	var params = app.config[name] || app.constructors[name].getDefaultParams();
	params.lang = app.getLang();
	return params;
};

app.show = function (name) {
	var R = app.constructors[name], r;
	r = new R(app.getParams(name));
	r.init(document.getElementById('page'));
};

app.loadConfig = function () {
	try {
		return JSON.parse(localStorage.getItem('random-config') || 'x');
	} catch (e) {
	}
	return {};
};

app.saveConfig = function (config) {
	try {
		localStorage.setItem('random-config', JSON.stringify(config));
	} catch (e) {
	}
};

app.showConfig = function (name) {
	app.constructors[name].showConfig(document.getElementById('page'), app.getParams(name));
};

app.readConfig = function (name) {
	app.config[name] = app.constructors[name].readConfig(document.getElementById('page'));
	app.saveConfig(app.config);
};

return app;

})();