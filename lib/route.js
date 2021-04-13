const requestIds = [];
function Route(path) {
    if (path === "/routes/register") {
        this.isRegisterRoute = true;
    } else {
        this.isRegisterRoute = false;
    }
    this.issecure = false;
    this.path = path;
    this.hashedPassphrase = null;
    this.hashedPassphraseSalt = null;
};

Route.prototype.secure = function(hashedPassphrase, hashedPassphraseSalt) {
    this.hashedPassphrase = hashedPassphrase;
    this.hashedPassphraseSalt = hashedPassphraseSalt;
};

Route.prototype.hasRequestId = function(requestId) {
    return requestIds.find( reqId => reqId === requestId );
};

Route.prototype.addRequestId = function(requestId) {
    requestIds.push(requestId);
};

module.exports = { Route };