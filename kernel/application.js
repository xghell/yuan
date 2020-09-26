// const pathModule = require('path');
// const fsModule = require('fs');
// const util = require('util');

class Application {
	constructor({appConfig, routerConfig}) {
		const {basePath, Context, Loader, ServiceProxy, Request, Response} = appConfig;
		//应用根目录
		this.basePath = basePath;
		
		//设置ctx
		this.ctx = new Context();
		this.ctx.request = new Request();
		this.ctx.response = new Response();
		
		//实例化服务代理
		this.serviceProxy = new ServiceProxy();
		
		
		//实例化router
		const {Route, RouteGroup, Router} = routerConfig;
		this.router = new Router(this.ctx, {Route, RouteGroup});
		
				
		//实例化loader
		this.loader = new Loader(this.ctx, {unitPath: this.basePath, controllerDirname: 'controller', serviceDirname: 'service', modelDirname: 'model', middlewareDirname: 'middleware', routerDirname: 'router'});
	}
	
	boot() {
		
	}
	
	async run(request) {
		const {method, path, params} = request;
		this.ctx.request.setMethod(method)
						.setPath(path)
						.setParams(params);
		
		
		
		//加载路由
		this.loader.loadRouter(this.router);
		
		//加载服务
		this.ctx.service = this.loader.loadService(this.serviceProxy);
		
		//调度任务，处理请求
		await this.dispatch(this.ctx, this.router, this.loader);
		return this.ctx.body;
	}
	
	async dispatch(ctx, router, loader) {
		//路由解析
		const {path, method, params: requestParams} = ctx.request;
		const {controllerName, actionName, params: routeParams, middlewareNames} = router.parse(path, method);
		
		//根据解析的路由，加载控制器、中间件
		const Controller = loader.loadController(controllerName);
		
		const middlewares = middlewareNames.map(middlewareName => {
			return loader.loadMiddleWare(middlewareName);
		})
		
		const params = {...routeParams, ...requestParams};
		
		//执行中间件、控制器
		const next = async () => {
			const Middleware = middlewares.shift();
			
			if (Middleware) {
				(new Middleware()).handle(ctx, next);
			} else {
				(new Controller(ctx))[actionName](params);
			}
		}
		
		await next();
	}
}

module.exports = Application;