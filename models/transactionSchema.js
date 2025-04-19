const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const transactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed'], 
        default: 'Pending'  
    },
    entityId: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'entityModel'  
    },
    entityModel: {
        type: String,
        enum: ['Company', 'Freelancer']
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
