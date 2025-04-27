const { body, validationResult } = require('express-validator');
const Company = require('../models/companySchema');
const Freelancer=require('../models/FreelancerSchema');
const  generateTokenSetCookie = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

const companysignupValidation = [
    body('companyName')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Company name must be 2-50 characters long')
        .matches(/^[a-zA-Z0-9 &-]+$/).withMessage('Company name can only contain letters, numbers, spaces, &, and -'),
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must include uppercase, lowercase, number, and special character'),
    body('phone')
        .optional({ checkFalsy: true })
        .isMobilePhone().withMessage('Invalid phone number')
];

const loginValidation = [
    body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').not().isEmpty().withMessage('Password is required')
];
exports.companySignup = [
    ...companysignupValidation,
    async (req, res) => {

        try {
            console.log('signup page post');
            const { companyName, email, password,confirmPassword } = req.body;
            
            const existingCompany = await Company.findOne({ email });
            if (existingCompany) {
                console.log('Company already exists');
                return res.render('company-login', { errors: [{ msg: 'Company with this email already exists!' }] });
            }
             
            if(password!==confirmPassword){
                console.log('Passwords dont match ');
                return res.render('company-login', { errors: [{ msg: 'Password and Confirm Password are not the same' }] });
            }
            
            
            const newCompany = new Company({
                companyName,
                email,
                password
            });
            generateTokenSetCookie(newCompany._id,res, 'company');
            await newCompany.save();
            console.log('company saved', companyName);
            res.render('company-login', { errors: [{ msg: 'Signup Successful' }] });
     
        } catch (error) {
            console.error(' Signup Error:', error);
            res.render('company-login', { errors: [{ msg: 'Server error during signup' }] });
        }
    }
];
exports.companyLogin =[
    ...loginValidation,
async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('company-login', {
                errors: errors.array(),
                email: req.body.email
            });
        }
        const { email, password } = req.body;
            console.log('Login attempt for:', email);

            const company = await Company.findOne({ email }).select('+password');
            if (!company) {
                console.log('Company not found!');
                return res.render('company-login', {
                  errors: [{ msg: 'Invalid email or password!' }],
                  email,
                  csrfToken: res.locals.csrfToken
                });
              }

            const isMatch = await company.validatePassword(password);
            console.log('Password Match:', isMatch);

            if (!isMatch) {
                return res.render('company-login', {
                    errors: [{ msg: 'Invalid email or password!' }],
                    email
                });
            }
            generateTokenSetCookie(company._id,res, 'company');
            
            res.redirect('/company-dashboard');
    }
    catch(error){
        console.error(' Login Error:', error.message, error.stack);
        res.render('company-login', {
            errors: [{ msg: 'Server error during login' }],
            email
        });
    }
}];

exports.companyLogout = async(req, res) => {
    try{
          res.cookie("jwt","",{maxAge:0});
          console.log("Logout successfull");
          res.redirect('/');
    }
    catch{
          console.log("Error in company logout Controller",error.message);
          res.status(500).json({error:"Internal Server Error"});
    }
};


exports.freelancerLogout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        console.log("Logout successfull");
        res.redirect('/');
  }
  catch{
        console.log("Error in freelancer logout Controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
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
                email,
                csrfToken: res.locals.csrfToken
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
        generateTokenSetCookie(freelancer._id,res,'freelancer');
        
        res.redirect('/freelancer-dashboard');
       
    } catch (error) {
        console.error('freelancer login post error', error);
        res.render('freelancer-login', {
            errors: [{ msg: 'Server error during login' }],
            email: req.body.freelancerEmail
        });
    }
};


exports.freelancerSignup = async (req, res) => {
    try {
        console.log('signup page post');
        const { freelancerName, freelancerEmail, freelancerPassword,confirmPassword } = req.body;
        const email = freelancerEmail;
        if (!freelancerName || !freelancerEmail || !freelancerPassword || !confirmPassword) {
            console.log('Missing required fields');
            console.log(freelancerName);
            console.log(freelancerEmail);
            console.log(freelancerPassword);
            consolele.log(confirmPassword);
            return res.render('freelancer-login', { errors: [{ msg: 'All fields are required' }] });
        }

        const existingFreelancer = await Freelancer.findOne({ email });
        if (existingFreelancer) {
            console.log('Freelancer already exists');
            return res.render('freelancer-login', { errors: [{ msg: 'Freelancer/Startup with this email already exists!' }] });
        }
        if(freelancerPassword!==confirmPassword){
            console.log('Passwords dont match ');
            return res.render('company-login', { errors: [{ msg: 'Password and Confirm Password are not the same' }] });
        }
        
        const newFreelancer = new Freelancer({
            name: freelancerName,
            email: freelancerEmail,
            password: freelancerPassword
        });
        generateTokenSetCookie(newFreelancer._id,res,'freelancer');
        await newFreelancer.save();
        console.log('Freelancer saved', freelancerName);
        res.render('freelancer-login', { errors: [{ msg: 'Signup Successful' }] });
    } catch (error) {
        console.error('Signup Error:', error);
        res.render('freelancer-login', { errors: [{ msg: 'Server error during signup' }] });
    }
};
