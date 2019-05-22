const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true
		},
		firstName: {
			type: String,
			required: true,
			lowercase: true
		},
		lastName: {
			type: String,
			required: true,
			lowercase: true
		},
		type: {
			type: String,
			enum: ['owner', 'admin', 'customer', 'limited'],
			// default: 'shopper',
			required: true,
			// lowercase: true
		},
		contactInfo: {
			tel: [Number],
			email: [String],
			address: {
				city: String,
				street: String,
				houseNumber: String
			}
		},
		terms: {
			type: Boolean,
			required: true
		},
		picture: {
			type: String
		},
		active:{
			type:Boolean,
			default: true
		},
		company: {
			bnNumber: {
				type: Number,
			},
			accounts: [
				{
					email: {
						type: String,
						unique: true
					},
					tel: [Number],
					password: String,
					role: {
						type: String,
						enum: ['admin', 'contact', 'limited'],
						// required: true,
					},
					address: {
						city: String,
						street: String,
						houseNumber: String
					},
				},
			],
		},
	
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('user', userSchema);
