const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    freelancer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Freelancer', 
        required: true 
    },
    bidAmount: { 
        type: Number, 
        required: true,
        min: [0, 'Bid amount cannot be negative'] 
    },
    coverLetter: { 
        type: String, 
        required: true,
        maxlength: [1000, 'Cover letter too long'] 
    },
    bidDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected'], 
        default: 'Pending' 
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

bidSchema.virtual('bidAge').get(function() {
    return Math.round((Date.now() - this.bidDate) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Bid', bidSchema);