class Router {
	constructor(ctx, {Route, RouteGroup}) {
		this.ctx = ctx;
		
		this.Route = Route;
		this.RouteGroup = RouteGroup;
		
		this.routes = {
			get: [],
			post: [],
		}
	}
	
	parse(path, method) {
		const {route, params} = this.matchRoute(path, method);
		
		
		const {controllerName, actionName} = this.parseRouteAction(route);
		
		const middlewareNames = route.getMiddlewares();
		
		return {controllerName, actionName, params, middlewareNames};
	}
	
	matchRoute(path, method) {
		const params = {};
		
		const request_sub_paths = path.split('/');
		const request_sub_paths_length = request_sub_paths.length;
		
		const route = this.routes[method].find(route => {
			const route_sub_paths = this.parseRoutePath(route);
			
			if (route_sub_paths.length > request_sub_paths_length) {
				return false;
			}
			
			return route_sub_paths.every((sub_path, index) => {
				if (':' === sub_path.type) {
					params[sub_path.value] = request_sub_paths[index];
					
					return true;
				}
				
				if ('none' === sub_path.type && request_sub_paths[index] === sub_path.value) {
					return true;
				}
				
				return false;
			})
		})
		
		if (!route) {
			throw Error('未匹配路由,请检查路由是否正确设置！');
		}
		
		return {route, params};
	}
	
	parseRouteAction(route) {
		const actionPath = route.getAction().trim('.');
		
		const actionSubPaths = actionPath.split('.');
		
		const actionName = actionSubPaths.pop();
		const controllerName = actionSubPaths.join('/');
		return {controllerName, actionName};
	}
	
	parseRoutePath(route) {
		const path = route.getPath();
		const sub_paths = path.split('/').map(item => {
			const flag = item.slice(0, 1);
			
			if (':' === flag) {
				return {
					type: ':',
					value: item.slice(1)
				};
			}
			
			return {
				type: 'none',
				value: item,
			};
		});
		
		return sub_paths;
	}
	
	
	_addRoute(route) {
		const method = route.getMethod();
		this.routes[method] = this.routes[method] ? this.routes[method] : [];
		
		this.routes[method].push(route);
		
		return route;
	}
	
	_addRouteRaw(path, action, method) {
		const route = new this.Route({path, action, method});
		
		this._addRoute(route);
		
		return route;
	}
	
	group(fn) {
		const routeGroup = new this.RouteGroup(this.Route);

		fn(routeGroup);
		
		const routes = routeGroup.getRoutes();
		
		routes.forEach(route => {
			this._addRoute(route);
		});
		
		return routeGroup;
	}
	
	resources(path, controller) {
		return this.group((routeGroup) => {
			routeGroup.get(path, [controller, 'index'].join('.'));
			routeGroup.get([path, 'new'].join('/'), [controller, 'new'].join('.'));
			routeGroup.get([path, ':id'].join('/'), [controller, 'show'].join('.'));
			routeGroup.get([path, ':id', 'edit'].join('/'), [controller, 'edit'].join('.'));
			routeGroup.post(path, [controller, 'create'].join('/'));
			routeGroup.put([path, ':id'].join('/'), [controller, 'update'].join('.'));
			routeGroup.delete([path, ':id'].join('/'), [controller, 'destroy'].join('.'));
			
		})
	}
	
	get(path, action) {
		return this._addRouteRaw(path, action, 'get');
	}
	
	post(path, action) {
		return this._addRouteRaw(path, action, 'post');
	}
	
	put(path, action) {
		return this._addRouteRaw(path, action, 'put');
	}
	
	delete(path, action) {
		return this._addRouteRaw(path, action, 'delete');
	}
}

module.exports = Router;