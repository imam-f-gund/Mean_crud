var mongoose =require('mongoose');

//Schema
var countrySchema = mongoose.Schema({
name:{ type:String},
capital:{type:String}
});

module.exports = mongoose.model('country',countrySchema);
