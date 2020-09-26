class routeGroup {
	constructor(RouteClass) {
		this.RouteClass = RouteClass;
		
		this.name = '';
		
	    this.routes = [];
	}
	
	name(name) {
		this.name = name;
	}
	
	middleware(middlewares) {
		middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
		
		this.routes.forEach(route => {
			route.middleware(middlewares);
		})	
		
		return this;
	}
	
	getMiddlewares() {
		return this.middlewares;
	}
	
	getRoutes() {
		return this.routes;
	}
	
	_addRoute(path, action, method) {
		const route = new this.RouteClass({path, action, method});
		
		this.routes.push(route);
		
		return route;
	}
	
	get(path, action) {
		return this._addRoute(path, action, 'get');
	}
	
	post(path, action) {
		return this._addRoute(path, action, 'post');
	}
	
	put(path, action) {
		return this._addRoute(path, action, 'put');
	}
	
	delete(path, action) {
		return this._addRoute(path, action, 'delete');
	}
}

module.exports = routeGroup;