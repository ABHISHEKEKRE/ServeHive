const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema')
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
exports.postProject = async (req, res) => {
    try {
        console.log("company-post-project")
          try {
                const token = req.cookies.jwt;
        
                if (!token) {
                    console.log('No token found');
                    return res.redirect('/company-login');
                }
        
                const decoded = jwt.verify(token, JWT_SECRET); 
                const companyId = decoded.id; 
        
                const company = await Company.findById(companyId);
        
                if (!company) {
                    console.log('Company not found');
                    return res.redirect('/company-login');
                }
                

                 const { projectTitle, projectDescription, projectCategory, projectBudget, projectDeadline } = req.body;
                 console.log('Received Data:', req.body);
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
                 console.log(`Project Posted by ${company.companyName}: ${projectTitle}`);
                 res.redirect('/company-manage-projects');
            } catch (error) {
                console.error('Error verifying JWT or rendering dashboard:', error.message);
                return res.redirect('/company-login');
            }
    } catch (error) {
        console.error('Error posting project:', error);
        res.status(500).json({ message: 'Server error while posting project.' });
    }
};

exports.renderPostProject = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/company-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const companyId = decoded.id; 

        const company = await Company.findById(companyId);

        if (!company) {
            console.log('Company not found');
            return res.redirect('/company-login');
        }
        res.render('company-post-projects', { companyName: req.session.companyName });
    }
    catch(error){
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
};

exports.getCompanyProjects = async (req,companyId) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            console.log('No token found');
            return res.redirect('/company-login');
        }

        const decoded = jwt.verify(token, JWT_SECRET); 
        const companyId = decoded.id; 

        const company = await Company.findById(companyId).populate('projects');

        if (!company) {
            console.log('Company not found');
            return res.redirect('/company-login');
        }
        return company.projects;
    }
    catch(error){
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
   
};

exports.manageProjects = async (req, res) => {
    try {
        try {
            const token = req.cookies.jwt;
    
            if (!token) {
                console.log('No token found');
                return res.redirect('/company-login');
            }
    
            const decoded = jwt.verify(token, JWT_SECRET); 
            const companyId = decoded.id; 
    
            const company = await Company.findById(companyId);
    
            if (!company) {
                console.log('Company not found');
                return res.redirect('/company-login');
            }
            const projects = await exports.getCompanyProjects(req,companyId);
            console.log('projects:', projects);
             if (!Array.isArray(projects)) {
            console.log('projects is not an array!', projects);
            }

              res.render('company-manage-projects', { projects });
        }
        catch(error){
            console.error('Error verifying JWT or rendering dashboard:', error.message);
             return res.redirect('/company-login');
            }
       
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching projects');
    }
};

exports.companyRecommendations = async (req, res) => {

    try {
        try {
            const token = req.cookies.jwt;
    
            if (!token) {
                console.log('No token found');
                return res.redirect('/company-login');
            }
    
            const decoded = jwt.verify(token, JWT_SECRET); 
            const companyId = decoded.id; 
    
            const company = await Company.findById(companyId).populate('projects');
    
            if (!company) {
                console.log('Company not found');
                return res.redirect('/company-login');
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
        }
        catch(error){
            console.error('Error verifying JWT or rendering dashboard:', error.message);
            return res.redirect('/company-login');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
