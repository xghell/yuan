class Route {
	constructor({path, action, method}) {
		this.name = '';
		
		this.method = method;
	    this.path = path;
		this.action = action;
		
		this.middlewares = [];
	}
	
	name(name) {
		this.name = name;
	}
	
	getName() {
		return this.name;
	}
	
	getMethod() {
		return this.method;
	}
	
	getPath() {
		return this.path;
	}
	
	getAction() {
		return this.action;
	}
	
	getMiddlewares() {
		return this.middlewares;
	}
	
	middleware(middlewares) {
		
		this.middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
		
		return this;
	}
}

module.exports = Route;