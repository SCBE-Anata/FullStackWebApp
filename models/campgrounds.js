// SCEMA SETUP

var mongoose=require('mongoose');

var bootcampSchema= new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username: String
	}, 
	comments:[
		{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

module.exports=mongoose.model("Bootcamp", bootcampSchema);