module.exports = (req, res, next) => {
	if(req.shouldAccessControl && !req.allow) {
		return next("Access denied by "+req.disallowMessage);
	}
    next();
}
