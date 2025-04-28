const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const freelancerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    industry:{type:String},

    phone: { 
        type: Number, 
     
    },
    address: { 
        type: String, 
       
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    type: { 
        type: String, 
        enum: ['Freelancer', 'Startup']
    },
    skills: { 
        type: [String], 
       
    },
    resumelink: { type: String},
    experience: { 
        type: String, 
        maxlength: [500, 'Experience description too long']
    },
    
    bids: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bid' 
    }],
    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' 
    }],
    
    ratings: { 
        type: [Number], 
        default: [] 
    },
    
    registeredAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    
    profileCompletionScore: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 100 
    }
}, {
    timestamps: true
});

freelancerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

freelancerSchema.methods.validatePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion score
freelancerSchema.methods.calculateProfileCompletion = function() {
    let score = 0;
    if (this.name) score += 20;
    if (this.email) score += 20;
    if (this.phone) score += 15;
    if (this.address) score += 15;
    if (this.skills && this.skills.length > 0) score += 10;
    if (this.experience) score += 20;
    
    this.profileCompletionScore = score;
    return score;
};



module.exports = mongoose.model('Freelancer', freelancerSchema);
