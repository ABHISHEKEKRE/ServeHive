const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema')
exports.postProject = async (req, res) => { 
    try {
        if (!req.session.companyId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const { projectTitle, projectDescription, projectCategory, projectBudget, projectDeadline } = req.body;
        console.log('Received Data:', req.body);

        const company = await Company.findById(req.session.companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        const newProject = new Project({
            company: company._id,
            title: projectTitle,
            description: projectDescription,
            category: projectCategory,
            budget: projectBudget,
            deadline: projectDeadline
        });

        await newProject.save();
        company.projects.push(newProject._id);
        await company.save();

        req.session.projects = company.projects;

        console.log(`Project Posted by ${company.companyName}: ${projectTitle}`);
        res.redirect('/company-manage-projects');
    } catch (error) {
        console.error('Error posting project:', error);
        res.status(500).json({ message: 'Server error while posting project.' });
    }
};

exports.renderPostProject = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-post-projects', { companyName: req.session.companyName });
};

exports.getCompanyProjects = async (companyId) => {
    try {
        const company = await Company.findById(companyId).populate('projects');
        if (!company) {
            console.log('Company not found');
            return null;
        }
        return company.projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return null;
    }
};

exports.manageProjects = async (req, res) => {
    try {
        const companyId = req.session.companyId;
        console.log(req.session.companyName);
        const projects = await exports.getCompanyProjects(companyId);
        console.log('projects:', projects);
        if (!Array.isArray(projects)) {
            console.log('projects is not an array!', projects);
        }

        res.render('company-manage-projects', { projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching projects');
    }
};

exports.companyRecommendations = async (req, res) => {
    try {
        const companyId = req.session.companyId;
        console.log('Company id', companyId);
        if (!companyId) {
            return res.status(401).send('Unauthorized: Company not logged in');
        }

        const projects = await Project.find({ company: companyId }).select('_id title');
        console.log(projects);

        if (!projects.length) {
            return res.render('company-recommendations', { freelancers: [], projects: [] });
        }

        const projectIds = projects.map(p => p._id);
        console.log('Project Id:', projectIds);

        const bids = await Bid.find({ project: { $in: projectIds } }).populate('freelancer');
        console.log('Bids found:', bids);

        const freelancers = [...new Map(bids.map(bid => [bid.freelancer._id.toString(), bid.freelancer])).values()];
        console.log('freelancers', freelancers);

        res.render('company-recommendations', { freelancers, projects });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
