class Request {
	constructor() {
		this.method = '';
		this.path = '';
		this.params = {};
	}
	
	getMethod() {
		return this.method;
	}
	
	getPath() {
		return this.path;
	}
	
	getParams() {
		return params;
	}
	
	setMethod(method) {
		this.method = method;
		return this;
	}
	
	setPath(path) {
		this.path = path;
		return this;
	}
	
	setParams(params) {
		this.params = params;
		return this;
	}
}

module.exports = Request;