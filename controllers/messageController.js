const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema')
const jwt = require('jsonwebtoken');
const Conversation=require('../models/conversationSchema');
const Message=require('../models/messageSchema');
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require('mongoose');

exports.sendMessage = async(req,res,ioInstance)=>{
    try{
      
        const {message}=req.body;
        const  {id:receiverId}=req.params;
        const senderId=req.user._id;
        let senderObjectId = new mongoose.Types.ObjectId(senderId);
       let receiverObjectId = new mongoose.Types.ObjectId(receiverId);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderObjectId, receiverObjectId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderObjectId, receiverObjectId],
                messages: []
            });
        }
        
        
        let senderModel = 'Freelancer';
        const senderCompany = await Company.findById(senderId);
        if (senderCompany) {
            senderModel = 'Company';
        }
        console.log(senderCompany);
        let receiverModel = 'Freelancer'; 
        const receiverCompany = await Company.findById(receiverId);
        if (receiverCompany) {
            receiverModel = 'Company';
        }
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            senderModel: senderModel,
            receiverModel: receiverModel,
            message: message,
        })
        // socket message adding
        if(newMessage){
            conversation.messages.push(newMessage);
    
        }
        await Promise.all([newMessage.save(),conversation.save()]);
        // Emit message to receiver and sender
        if (ioInstance && typeof ioInstance.to === 'function') {
            ioInstance.to(receiverId.toString()).emit('newMessage', newMessage);
            ioInstance.to(senderId.toString()).emit('newMessage', newMessage);
            console.log('Socket.IO events emitted to:', { receiverId, senderId });
          } else {
            console.log('No valid ioInstance provided; skipping Socket.IO emission');
          }
        res.status(200).json({
        error:"successful msg creation"
        });
    }
    catch(error){
        console.log("Error in sendMessage Controller: ",error.message);
        res.status(500).json({error:"Internal server error"});
    }
   console.log("we are inside sendmsg route",req.params.id);
}

exports.getMessages = async (req, res) => {
    try {
      const { id: freelancerId } = req.params;
      const senderId = req.user._id;
  
      // Validate ObjectIds
      if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(freelancerId)) {
        return res.status(400).json({ error: 'Invalid sender or freelancer ID' });
      }
  
      console.log('Fetching conversation for:', { senderId, freelancerId });
  
      // Convert strings to ObjectIds
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
      const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);
  
      const conversation = await Conversation.findOne({
        participants: { $all: [senderObjectId, freelancerObjectId] },
      }).populate('messages');
  
      if (!conversation) {
        console.log('No conversation found for:', { senderId, freelancerId });
        return res.status(200).json({ messages: [] });
      }
  
      console.log('Conversation found:', conversation);
  
      res.status(200).json({ messages: conversation.messages || [] });
    } catch (error) {
      console.error('Error in getMessages Controller:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
