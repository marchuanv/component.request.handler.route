function Route(path) {
    this.issecure = false;
    this.path = path;
    this.hashedPassphrase = null;
    this.hashedPassphraseSalt = null;
    this.requestIds = [];
};

Route.prototype.secure = function(hashedPassphrase, hashedPassphraseSalt) {
    this.hashedPassphrase = hashedPassphrase;
    this.hashedPassphraseSalt = hashedPassphraseSalt;
};

Route.prototype.hasRequestId = function(requestId) {
    return this.requestIds.find( reqId => reqId === requestId );
};

Route.prototype.addRequestId = function(requestId) {
    this.requestIds.push(requestId);
};

module.exports = { Route };