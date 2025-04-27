const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    description: { type: String }, 
    email: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true
    },
    phone: { type: String }, 
    address: { type: String }, 
    password: { type: String, required: true }, 
    industry: {type:String},
    Founded_year: {type:Number},
    projects: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
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
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true  
});

companySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

companySchema.methods.validatePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Company', companySchema);
