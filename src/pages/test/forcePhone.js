const Person = require('../models/person');

module.exports = async (req, res, next) => {
	if(req.query.ACforcePhone == "true" && !req.query.phone){
		const denyMessage = "Il faut renseigner le téléphone sur : "+req.protocol+'://'+req.host+"/phone.html (ou dans le formulaire pour les externes)";
	    if(req.query.sciper && req.query.sciper.match(/^[0-9]{6}$/)){
  			return Person.count({sciper: req.query.sciper}).then(count => {
				if(count > 0) {
					return next();
				} else {
					return next(denyMessage)
				}
			})
			.catch(err => next(err));	
		} else {
			return next(denyMessage);
		}
	}
	next();
}
