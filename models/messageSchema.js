const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'senderModel',
        required: true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'receiverModel',
        required:true
    },
    senderModel:{
        type:String,
        required:true,
        enum:['Company','Freelancer']
    },
    receiverModel:{
        type:String,
        required:true,
        enum:['Company','Freelancer']
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true});
module.exports =mongoose.model("Message",messageSchema);
