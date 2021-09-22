
module.exports = (req, res, next) => {
	if(req.query.ACallowedGroups && req.query.sciper){
		req.shouldAccessControl = true;
		groups = req.query.ACallowedGroups.split(",");
		if (groups.includes(req.query.sciper%3)) {
			req.allow=true;
		} else {
			req.disallowMessage = req.disallowMessage ? req.disallowMessage+" and modulo groups" : "modulo groups";
		}
	}
    next();
}
