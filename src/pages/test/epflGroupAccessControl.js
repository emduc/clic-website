const fetch = require('node-fetch');

var groupsCache = [];
const url = "https://websrv.epfl.ch/rwsgroups/listMembers?app=Accred&caller=288467&id=";

module.exports = async (req, res, next) => {
	if(req.query.ACepflAllowedGroups && req.query.email){
		req.shouldAccessControl = true;
		groups = req.query.ACepflAllowedGroups.split(",");
		let gr_promise = [];

		for(gr of groups) {
			if(groupsCache[gr] == undefined){
			  	var reply;
			  	try {
					const rep = await fetch(url+gr,{method:"GET"});
					reply = await rep.json();
			 	} catch (err) {
				 	return next("Error fetching EPFL groups"+err.toString());
			   	}

			   	if (reply.result == undefined) 
			   		return next("Error fetching EPFL groups"+JSON.stringify(reply));

				groupsCache[gr] = reply.result;
			}
			if(groupsCache[gr].find(a => {return a.email == req.query.email}) != undefined) {
				req.allow=true;
				return next();
			} else {
				req.disallowMessage = req.disallowMessage ? req.disallowMessage+" and epfl groups" : "epfl groups";
			}
		}
	}
	next();
}
