const path = require('path');

const Controller = require('../kernel/controller');
const Service = require('../kernel/service');

const ServiceProxy = require('../kernel/service_proxy');
const Request = require('../kernel/request');
const Response = require('../kernel/response');

const Router = require('../kernel/router');
const Route = require('../kernel/route');
const RouteGroup = require('../kernel/route_group');

const Loader = require('../kernel/loader');

const Context = require('../kernel/context');
const App = require('../kernel/application');


function app(base_path='') {
	const base_paths = Array.isArray(base_path) ? base_path : [base_path];
	
	const appConfig = {
		basePath: base_paths,
		Context,
		Loader,
		ServiceProxy,
		Request,
		Response,
	}
	
	const routerConfig = {
		Route,
		RouteGroup,
		Router,
	}
	
	
	
	const app = new App({appConfig, routerConfig});
	return app;
}


module.exports = {
	app,
	Controller,
	Service
}