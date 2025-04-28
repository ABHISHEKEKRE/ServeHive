const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
exports.placeBid = async (req, res) => {
    const projectId = req.query.project;
    console.log(projectId);
    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).send('Project not found');
    }
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
        
       res.render('bid', { project, freelancer });
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
};

exports.submitBid = async (req, res) => {
    try {
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
         console.log('Request body:', req.body);

        const { projectId, freelancerId, bidAmount, proposal } = req.body;

        if (!projectId || !freelancerId || !bidAmount || !proposal) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log("FREELANCER ID:" ,freelancerId);
        const project = await Project.findById(projectId);
        console.log(freelancer);
        if (!project || !freelancer) {
            return res.status(404).json({ error: 'Project or Freelancer not found' });
        } 

        const newBid = new Bid({
            project: projectId,
            freelancer: freelancerId,
            bidAmount,
            coverLetter: proposal,
            status: 'Pending'
        });

        await newBid.save();

        freelancer.bids.push(newBid._id);
        await freelancer.save();
        console.log('Bid submitted successfully', newBid);
        res.redirect('/freelancer-bidding');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/freelancer-login');
    }
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
