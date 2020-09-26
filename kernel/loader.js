const pathModule = require('path');
const fsModule = require('fs');

// const util = require('util');

class Loader {
	constructor(ctx, {unitPath, controllerDirname, serviceDirname, modelDirname, middlewareDirname, routerDirname}) {
		this.ctx = ctx;
		
		this.controllerPaths = [];
		this.servicePaths = [];
		this.modelPaths = [];
		this.middlewarePaths = [];
		this.routerPaths = [];
		
		const unitPaths = Array.isArray(unitPath) ? unitPath : [unitPath];
		
		unitPaths.forEach(path => {
			this.controllerPaths.push(pathModule.join(path, controllerDirname));
			this.servicePaths.push(pathModule.join(path, serviceDirname));
			this.modelPaths.push(pathModule.join(path, modelDirname));
			this.middlewarePaths.push(pathModule.join(path, middlewareDirname));
			this.routerPaths.push(pathModule.join(path, routerDirname));
		})
		
		
	}
	
	loadService(serviceProxy) {
		return serviceProxy.getProxy(this.ctx, this.servicePaths);
	}
	
	loadRouter(router) {
		//载入路由
		this.routerPaths.forEach(path => {
			if (fsModule.existsSync(path)) {
				fsModule.readdirSync(path).forEach(file => {
					const loadRoutes = requireModule(pathModule.join(path, file));
					loadRoutes(router);
				})
			}
		})
		
		
		return router;
	}
	
	loadController(name) {
		return this.loadFile(name, this.controllerPaths, '控制器');
	}
	
	loadMiddleWare(name, path) {
		return this.loadFile(name, this.middlewarePaths, '中间件');
	}
	
	// loadModel() {
		
	// }
	
	/**
	 * @param {String} name  文件路径
	 * @param {String} path  所要搜索的目录
	 * @param {String} extname  文件扩展名
	 * @param {String} type 文件类型，用于错误输出时标记类型 如： 控制器|模型等
	 */
	loadFile(name, path, type='文件', extname='js') {
		const paths = Array.isArray(path) ? path : [path];
		const file = [name, extname].join('.');
		
		//载入路由
		
		const file_dir = paths.find(path => {
			return fsModule.existsSync(pathModule.join(path, file));
		})
		
		if (file_dir) {
			return this.loadModule(pathModule.join(file_dir, file));
		}
		
		throw Error(`载入${name}${type}失败`);
	}
	
	loadModule(path) {
		return requireModule(path);
	}
}

function requireModule(path) {
	return require(path);
}

module.exports = Loader;