const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
 
  content: { type: String, required:true },
  post:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Post',
      required:"post is required feild"

  },
  creator:{
    type:mongoose.Schema.Types.String,
    ref:'User',
    required:true

},

email:{
    type:mongoose.Schema.Types.String,
    ref:'User',
    required:true

}
  
 

});

const Comment = mongoose.model("Comment", commentSchema);

function validatecomment(comment) {
    const schema = {
        
        comment: Joi.string().min(5).max(255).required()
       
       
    };
    return Joi.validate(comment, schema);
}


exports.Comment =Comment ;
exports.validate = validatecomment;