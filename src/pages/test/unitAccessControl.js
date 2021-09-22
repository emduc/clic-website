module.exports = (req, res, next) => {
	if(req.query.ACallowedUnits && req.query.section && !req.allow){
		req.shouldAccessControl = true;
		units = req.query.ACallowedUnits.split(",");
		if (req.query.section.filter(element => units.includes(element)).length > 0) {
			req.allow = true;
		} else {
			req.disallowMessage = req.disallowMessage ? req.disallowMessage+" and unit" : "unit";
		}
	}
    next();
}
