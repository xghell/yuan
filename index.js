const path = require('path');
const yuan = require('./bootstrap/bootstrap');

const yuan_app = yuan.app;



function app(base_path='') {
	const base_paths = Array.isArray(base_path) ? base_path : [base_path];
	
	return yuan_app([...base_paths, path.join(path.dirname(module.parent.filename), 'app')]);
}

module.exports = {
	...yuan,
	app,
}