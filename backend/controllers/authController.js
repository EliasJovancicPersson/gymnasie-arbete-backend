const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();
const { OAuth2Client } = require('google-auth-library');
const user = require("../models/user");

async function verify(client_id, jwtToken) {

    const client = new OAuth2Client(client_id);

    // Call the verifyIdToken to
    // varify and decode it
    const ticket = await client.verifyIdToken({
        idToken: jwtToken,
        audience: client_id,
    });

    // Get the JSON with all the user info
    const payload = ticket.getPayload();

    // This is a JSON object that contains
    // all the user info
    return payload;
}

function sendJWT(target,res){
	//signing token with user id
	var token = jwt.sign(
		{
			id: target.id,
		},
		process.env.API_SECRET,
		{
			expiresIn: "10 days",
		}
	);

	//responding to client request with user profile success message and access token as cookie
	res.cookie("jwt", token, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		maxAge: 24 * 60 * 60 * 1000,
	}); //send token as a cookie when logging in
	res.status(200).send({
		message: "Login successfull",
		authenticated: true,
		user : target
	});
}

function createUser(fullName,email,username,password,res,googleAccount){
	const user = new User({
		fullName: fullName,
		email: email,
		username: username,		// TODO : Add check for same username
		password: !googleAccount ? bcrypt.hashSync(password, 8) : null,
		role: "normal",
		googleAccount: googleAccount,
	})

	user.save((err, user) => {
		if (err) {
			res.status(500).send(
			{
				error:err.name,
				field:err.errors?.path,
				field:err.errors,
				code:err?.code,
			});
			console.log(err)
			return;
		} else {
			sendJWT(user,res)
		}
	});
}

exports.signup = (req, res) => {
	
	createUser(req.body.fullName,req.body.email,req.body.username,req.body.password,res,false)

};

exports.signin = (req, res) => {
	// TODO : take jwt and check if its from google
	if(req.body.jwt){
		verify("1018800979482-4l8e73ndjgvksei3vu3el632vre3glpd.apps.googleusercontent.com",req.body.jwt).then((response) => {
			/*
			  	iss: 'https://accounts.google.com',
				nbf: 1682635788,
				aud: '1018800979482-4l8e73ndjgvksei3vu3el632vre3glpd.apps.googleusercontent.com',
				sub: '113010279416113724456',
				email: 'eliasjovancicpersson@gmail.com',
				email_verified: true,
				azp: '1018800979482-4l8e73ndjgvksei3vu3el632vre3glpd.apps.googleusercontent.com',
				name: 'Elias Jovancic Persson',
				picture: 'https://lh3.googleusercontent.com/a/AGNmyxa25X175vc0h8qjIu7G8HLMyTYIo8Z5tjuASgo=s96-c',
				given_name: 'Elias',
				family_name: 'Jovancic Persson',
				iat: 1682636088,
				exp: 1682639688,
				jti: '23d74e72d9926022305713f94119c07d73461e97'
			*/
			User.exists({email: response.email},(error, result)=>{
				if (error){
				  console.log(error)
				} else {
				  console.log("result:", result)  //result is true the email from google jwt is already linked to a account
				  if(result){
					User.findById(result._id).exec((err,user) =>{
						console.log(user)
						if(user.googleAccount){
							//account linked with google
							console.log("account linked")
							sendJWT(user,res)
						}
						else{
							//promt and ask if user wants to link account
							console.log("link account?")
							//if yes
							user.googleAccount = true
							user.save((err,user)=>{
								if (err) {
									res.status(500).send(
									{
										error:err.name,
										field:err.errors?.path,
										field:err.errors,
										code:err?.code,
									});
									console.log(err)
									return;
								} else {
									sendJWT(user,res)
								}
							})
						}
					})
				  }
				  else{
					//Create account
					createUser(response.name,response.email,response.name.replace(/\s+/g, '-'),null,res,true)
				  }
				}
			  });
			
				// TODO : Create account (without password)?
				// TODO : Link with already created account?
		})
	}
	else{
		User.findOne({
			email: req.body.email,
		}).exec((err, user) => {
			if (err) {
				res.status(500).send({
					message: err,
				});
				return;
			}
			if (!user) {
				return res.status(404).send({
					message: "User Not found.",
				});
			}
	
			//comparing passwords
			var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Invalid Password!",
				});
			}
			sendJWT(user,res)
		});
	}
	
	
};

exports.signout = (req, res) => {
	//setting cookie to blank on signout
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		maxAge: 24 * 60 * 60 * 1000,
	});
	res.status(200).send({ message: "logged out" });
};
