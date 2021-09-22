module.exports = (req, res, next) => {
	if(req.query.ACallowedScipers && req.query.sciper){
		req.shouldAccessControl = true;
		scipers = req.query.ACallowedScipers.split(",");
		if (scipers.includes(req.query.sciper)) {
			req.allow=true;
		} else {
		    req.disallowMessage = "sciper";
		}
	}
    next();
}
