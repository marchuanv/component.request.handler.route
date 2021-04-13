const { Route } = require("./route.js");
const routes = [];

function RegisteredRoutes() {};
RegisteredRoutes.prototype.register = function(route) {
    if (route instanceof Route) {
        if (this.find())
        routes.push(route);
    } else {
        throw new Error("route parameter is not of type Route");
    }
};
RegisteredRoutes.prototype.find = function(path) {
    if (path instanceof String) {
        return routes.find(rt => rt.path === path);
    } else {
        throw new Error("path parameter is not of type string");
    }
};
module.exports = { RegisteredRoutes };