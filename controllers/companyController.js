const { body, validationResult } = require('express-validator');
const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.renderCompanyDashboard = async (req, res) => {
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

        res.render('company-dashboard', { companyName: company.companyName });
    } catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
};

exports.renderCompanyProfile = async (req, res) => {
    try{
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
        res.render('company-profile',{company});

    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
    
};
// new changes for profile update
exports.renderCompanyProfileUpdates= async (req,res)=>{
    try{
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
        const { companyName,companyEmail,companyIndustry,companyFoundedYear,companyPhone,companyAddress }=req.body;
    
        if (!companyName || !companyEmail) {
           return res.status(400).send("Company name and email are required.");
        }

        if(company){
             company.companyName = companyName.trim();
             company.email = companyEmail.trim().toLowerCase();
             company.industry = companyIndustry;
             company.Founded_year = companyFoundedYear ? Number(companyFoundedYear) : undefined;
             company.phone = companyPhone ? String(companyPhone) : undefined;
             company.address = companyAddress;

              await company.save();
            }
            res.redirect('/company-profile')
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }

}
exports.renderCompanySettings = async (req, res) => {
    try{
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
        res.render('company-settings');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }

   
};
exports.renderCompanyCommunications = async (req, res) => {
    try{
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
         res.render('company-communications');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
};

exports.renderCompanyReviews = async (req, res) => {
    try{
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
        const companies = await Company.find({});
        res.render('company-reviews', { companies });
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
}   
exports.renderCompanyPayments = async(req, res) => {
    try{
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
        res.render('company-payments');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
   
};
exports.renderCompanyTaskManagement = async (req, res) => {
    try{
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
        res.render('company-task-management');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
  
};

exports.renderCompanyNotifications =async (req, res) => {
    try{
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
        res.render('company-notifications');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
    
};
exports.renderCompanySupport = async(req, res) => {
    try{
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
         res.render('company-support');
    }
    catch (error) {
        console.error('Error verifying JWT or rendering dashboard:', error.message);
        return res.redirect('/company-login');
    }
};
