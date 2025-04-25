const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema')
exports.freelancerSignup = async (req, res) => {
    try {
        console.log('signup page post');
        const { freelancerName, freelancerEmail, freelancerPassword } = req.body;
        const email = freelancerEmail;

        const existingFreelancer = await Freelancer.findOne({ email });
        if (existingFreelancer) {
            console.log('Freelancer already exists');
            return res.render('freelancer-login', { errors: [{ msg: 'Freelancer/Startup with this email already exists!' }] });
        }

        const newFreelancer = new Freelancer({
            name: freelancerName,
            email: freelancerEmail,
            password: freelancerPassword
        });

        await newFreelancer.save();
        console.log('Freelancer saved', freelancerName);
        res.render('freelancer-login', { errors: [{ msg: 'Signup Successful' }] });
    } catch (error) {
        console.error('Signup Error:', error);
        res.render('freelancer-login', { errors: [{ msg: 'Server error during signup' }] });
    }
};

exports.freelancerLogin = async (req, res) => {
    try {
        const { freelancerEmail, freelancerPassword } = req.body;
        const email = freelancerEmail;
        const password = freelancerPassword;

        const freelancer = await Freelancer.findOne({ email }).select('+password');
        if (!freelancer) {
            console.log('Freelancer not found!');
            return res.render('freelancer-login', {
                errors: [{ msg: 'Invalid email or password!' }],
                email
            });
        }

        const isMatch = await freelancer.validatePassword(password);
        console.log('🔹 Password Match:', isMatch);

        if (!isMatch) {
            return res.render('freelancer-login', {
                errors: [{ msg: 'Invalid email or password!' }],
                email
            });
        }

        req.session.freelancerId = freelancer._id;
        req.session.freelancerName = freelancer.name;

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.render('freelancer-login', {
                    errors: [{ msg: 'Session error. Please try again.' }],
                    email
                });
            }
            console.log('Login successful for:', freelancer.email);
            res.redirect('/freelancer-dashboard');
        });
    } catch (error) {
        console.error('freelancer login post error', error);
        res.render('freelancer-login', {
            errors: [{ msg: 'Server error during login' }],
            email: req.body.freelancerEmail
        });
    }
};

exports.freelancerLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};
exports.renderFreelancerDashboard = (req, res) => {
    if (!req.session.freelancerId) {
        return res.redirect('/freelancer-login');
    }
    console.log(req.session.freelancerName);
    res.render('freelancer-dashboard', { freelancerName: req.session.freelancerName });
};

exports.renderFreelancerBidding = async (req, res) => {
    try {
        if (!req.session.freelancerId) {
            return res.redirect('/freelancer-login');
        }

        const openProjects = await Project.find({ status: 'Open' }).populate('company');

        res.render('freelancer-bidding', {
            freelancerName: req.session.freelancerName,
            projects: openProjects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.render('freelancer-bidding', {
            freelancerName: req.session.freelancerName,
            projects: [],
            error: 'Failed to load projects.'
        });
    }
};

exports.renderFreelancerCommunications = (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    res.render('freelancer-communications');
};

exports.renderFreelancerReviews = async (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    const freelancers = await Freelancer.find({});
    res.render('freelancer-reviews', { freelancers });
};

exports.renderFreelancerTaskManagement = (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    res.render('freelancer-task-management');
};

exports.renderFreelancerPayments = (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    res.render('freelancer-payments');
};

exports.renderFreelancerNotifications = (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    res.render('freelancer-notifications');
};

exports.renderFreelancerHelp = (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    res.render('freelancer-help');
};

exports.renderFreelancerSettings = (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    res.render('freelancer-settings');
};
exports.renderFreelancerProfile = async (req, res) => {
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    const freelancer= await Freelancer.findOne({_id:req.session.freelancerId });
    res.render('freelancer-profile',{freelancer});
};
exports.renderFreelancerProfileUpdates= async(req,res)=>{
    if (!req.session.freelancerId) {
        res.redirect('freelancer-login');
    }
    const { freelancerName,freelancerEmail,freelancerIndustry,freelancerExperience,freelancerResumeLink,freelancerPhone,freelancerAddress }=req.body;
  
    if (!freelancerName || !freelancerEmail) {
        return res.status(400).send("Company name and email are required.");
        }
    
        const freelancer= await Freelancer.findOne({_id:req.session.freelancerId });
        if(freelancer){
          freelancer.name = freelancerName.trim();
          freelancer.email = freelancerEmail.trim().toLowerCase();
          freelancer.industry = freelancerIndustry;
          freelancer.experience = freelancerExperience;
          freelancer.resumelink = freelancerResumeLink;
          freelancer.phone = freelancerPhone ? String(freelancerPhone) : undefined;
          freelancer.address = freelancerAddress;
    
          await freelancer.save();
        }
    res.redirect('/freelancer-profile');
}
