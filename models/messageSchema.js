const mongoose=rtequire('mongoose');

const mongooseSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'senderModel',
        required: true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'recieverModel',
        required:true
    },
    senderModel:{
        type:String,
        required:true,
        enum:['Company','Freelanccer']
    },
    recieverModel:{
        type:String,
        required:true,
        enum:['Company','Freelanccer']
    },
    message:{
        typr:String,
        required:true
    }
},{timestamp:true});
module.exports =mongoose.model("Message",messageSchema);
