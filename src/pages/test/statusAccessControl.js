module.exports = (req, res, next) => {
	if(req.query.ACallowedStatus && !req.allow){
		req.shouldAccessControl = true;
		if (req.query.status.toLower() == req.query.ACallowedStatuts.toLower()) {
			req.allow = true;
		} else {
			req.disallowMessage = req.disallowMessage ? req.disallowMessage+" and status" : "status";
		}
	}
    next();
}