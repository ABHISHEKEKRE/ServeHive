const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema')
exports.placeBid = async (req, res) => {
    const projectId = req.query.project;
    console.log(projectId);
    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).send('Project not found');
    }
    const freelancer = req.session.freelancerId;
    if (!freelancer) {
        return res.redirect('/freelancer-login');
    }

    res.render('bid', { project, freelancer });
};

exports.submitBid = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { projectId, freelancerId, bidAmount, proposal } = req.body;

        if (!projectId || !freelancerId || !bidAmount || !proposal) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const project = await Project.findById(projectId);
        const freelancer = await Freelancer.findById(freelancerId);

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};