const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    postedAt: { type: Date, default: Date.now },
    
    company: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Freelancer', 
        default: null 
    },
    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Open'
    },
    
    bidsCount: { type: Number, default: 0 },
    totalBidAmount: { type: Number, default: 0 }
}, {
    timestamps: true  
});



module.exports = mongoose.model('Project', projectSchema);