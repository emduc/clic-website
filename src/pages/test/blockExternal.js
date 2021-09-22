module.exports = (req, res, next) => {
	if(req.query.ACblockExternal == "true" && (!req.query.sciper || !req.query.sciper.match(/^[0-9]{6}$/))){
		return next("Externes EPFL interdits");
	}
    next();
}
