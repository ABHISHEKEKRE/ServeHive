const mongoose= require("mongoose")

const conversationSchema= new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'participantsModel', // Dynamic ref to Company or Freelancer
        required: true,
      }],
      participantsModel: [{
        type: String,
        required: true,
        enum: ['Company', 'Freelancer'],
      }],
    messages:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default:[],
    } 
   ]
},
{timestamp:true}
);

module.exports= mongoose.model("Conversation",conversationSchema);
