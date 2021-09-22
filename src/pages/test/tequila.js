const fetch = require('node-fetch');
const jwt = require("jsonwebtoken");

const JWT_PRIV_KEY = process.env.JWT_KEY

const params = ['displayname', 'email', 'uniqueid', 'allunits', 'statut', 'faculty', 'institute', 'camiprocardid'];


const dict2txt = (dict, opt_operator="=")=>{
    return Object.keys(dict).map((k)=> (k + opt_operator + dict[k] + "\n")).join("").slice(0, -1);
};

const txt2dict = (txt, opt_operator="=")=>{
    let dict = {};
    txt.replace(/\r/, "").split("\n").forEach((line)=>{
    	let sepIndex = line.indexOf(opt_operator)
        if (sepIndex === -1) return;
        dict[line.slice(0, sepIndex)] = line.slice(sepIndex + opt_operator.length);
    });
    return dict;
};


const generate_key = (trgt_url)=>{
	const options = {
        client: "express-middleware-tequila",
        urlaccess: trgt_url,
        request: params.join(","),
        service: "Tracing",
    };

    return fetch("https://tequila.epfl.ch/cgi-bin/tequila/createrequest",{method:"POST", body:dict2txt(options)})
    	.then(res=>res.text())
    	.then(res=>txt2dict(res))
    	.then(res=>res.key)
}

const get_attribute = (key)=>{
	const options = {
		key: key
	}
	return fetch("https://tequila.epfl.ch/cgi-bin/tequila/fetchattributes",{method:"POST", body:dict2txt(options)})
    	.then(res=>res.text())
    	.then(res=>txt2dict(res))
}


module.exports = async (req, res, next)=>{

	//Parse User
	try{
		if(req.cookies && req.cookies.tequila){
			var token = jwt.verify(req.cookies.tequila, JWT_PRIV_KEY);
			req.tequila = token;
			return next();
		}
	}catch(e){
		res.clearCookie('tequila');
	}

	//Login & Parse User Info
	if(req.query && req.query.key){
		return get_attribute(req.query.key)
		.then((attr)=>{
			req.tequila = {
				name: attr.displayname, 
				email: attr.email,
				sciper: attr.uniqueid, 
				group: String(attr.uniqueid %3),
				units: attr.allunits, 
				status: attr.statut,
				faculty: attr.faculty, 
				institute: attr.institute,
				cardid: attr.camiprocardid,
			};
			res.cookie('tequila',jwt.sign(req.tequila, JWT_PRIV_KEY));
			return next();
		})
		.catch(err=>console.log(err) && next({status_code: 500, status: "Error - Internal Error !", message: "Internal Error Getting Attributes"}));
	}
	
	//Do not Auth XHR
	if(req.xhr){
		return next({status_code: 401, status: "Error - Unauthenticated XHR Request !", message: "Unauthenticated XHR Request"});
	}

	//Authenticate User
	return generate_key(req.getUrl).then(key=>{
		if(key)
			return res.redirect(`https://tequila.epfl.ch/cgi-bin/tequila/auth?requestkey=${key}`);
		else
			return next({status_code: 400, status: "Error - Unable to link with Tequila !", message: "Unable to link with Tequila"})
	});
}
