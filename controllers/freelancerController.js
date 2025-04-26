const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;



exports.renderFreelancerDashboard = async(req, res) => {
      try{
            const token = req.cookies.jwt;
    
            if (!token) {
                console.log('No token found');
                return res.redirect('/freelancer-login');
            }
    
            const decoded = jwt.verify(token, JWT_SECRET); 
            const freelancerId = decoded.id; 
    
            const freelancer = await Freelancer.findById(freelancerId);
    
            if (!freelancer) {
                console.log('Freelancer not found');
                return res.redirect('/freelancer-login');
            }
            
             res.render('freelancer-dashboard', { freelancerName: freelancer.name });
        }
        catch (error) {
            console.error('Error verifying JWT or rendering dashboard:', error.message);
            return res.redirect('/freelancer-login');
        }
};

exports.renderFreelancerBidding = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
        try{
        const openProjects = await Project.find({ status: 'Open' }).populate('company');

        res.render('freelancer-bidding', {
            freelancerName: freelancer.name,
            projects: openProjects
        });
          }
          catch (error) {
            console.error('Error fetching projects:', error);
            res.render('freelancer-bidding', {
                freelancerName: freelancer.name,
                projects: [],
                error: 'Failed to load projects.'
            });
        }

          
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
 
};

exports.renderFreelancerCommunications = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
        
        res.render('freelancer-communications');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
    
};

exports.renderFreelancerReviews = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
        
            const freelancers = await Freelancer.find({});
            res.render('freelancer-reviews', { freelancers });
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
    
};

exports.renderFreelancerTaskManagement = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
        
          res.render('freelancer-task-management');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
};


exports.renderFreelancerPayments = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
           res.render('freelancer-payments');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
};

exports.renderFreelancerNotifications = async(req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
           res.render('freelancer-notifications');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
};


exports.renderFreelancerHelp = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
        res.render('freelancer-help');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
    
};
exports.renderFreelancerSettings = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
              res.render('freelancer-settings');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
};
exports.renderFreelancerProfile = async (req, res) => {
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
        res.render('freelancer-profile',{freelancer});
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
};
exports.renderFreelancerProfileUpdates= async(req,res)=>{
    try{
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/freelancer-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const freelancerId = decoded.id; 

        const freelancer = await Freelancer.findById(freelancerId);

        if (!freelancer) {
            console.log('Freelancer not found');
            return res.redirect('/freelancer-login');
        }
        const { freelancerName,freelancerEmail,freelancerIndustry,freelancerExperience,freelancerResumeLink,freelancerPhone,freelancerAddress }=req.body;
  
        if (!freelancerName || !freelancerEmail) {
            return res.status(400).send("Company name and email are required.");
            }
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
        res.render('freelancer-profile',{freelancer});
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
   
}
