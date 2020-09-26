const pathModule = require('path');
const fsModule = require('fs');

class ServiceProxy {
	/**
	 * @param {Object} ctx
	 * @param {Object} servicePath 服务所在目录
	 */
	getProxy(ctx, servicePath) {
		const servicePaths = Array.isArray(servicePath) ? servicePath : [servicePath];
		
		return new Proxy(this, {
			servicePath: '',
			get(target, propertyKey, receiver) {
				this.servicePath = pathModule.join(this.servicePath, propertyKey);
				
				let service_file = ''
				const service_dir = servicePaths.find(path => {
					service_file = pathModule.join(path, this.servicePath)
					
					return fsModule.existsSync(service_file + '.js');
				});
				
				if (service_dir) {
					const Service = requireModule(service_file);
					
					return new Service(ctx);
				}
				
				return receiver;
			}
		});
	}
}

function requireModule(path) {
	return require(path);
}


module.exports = ServiceProxy;