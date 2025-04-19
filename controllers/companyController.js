const { body, validationResult } = require('express-validator');
const Company = require('../models/companySchema');
const Project = require('../models/projectSchema');
const Bid = require('../models/bidSchema');
const Freelancer=require('../models/FreelancerSchema')
const signupValidation = [
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
    ...signupValidation,
    async (req, res) => {
        try {
            console.log('signup page post');
            const { companyName, description, email, phone, address, password } = req.body;

            const existingCompany = await Company.findOne({ email });
            if (existingCompany) {
                console.log('Company already exists');
                return res.render('company-login', { errors: [{ msg: 'Company with this email already exists!' }] });
            }

            const newCompany = new Company({
                companyName,
                description: description || '',
                email,
                phone: phone || '',
                address: address || '',
                password
            });

            await newCompany.save();
            console.log('company saved', companyName);
            res.render('company-login', { errors: [{ msg: 'Signup Successful' }] });
        } catch (error) {
            console.error(' Signup Error:', error);
            res.render('company-login', { errors: [{ msg: 'Server error during signup' }] });
        }
    }
];

exports.companyLogin = [
    ...loginValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('company-login', {
                errors: errors.array(),
                email: req.body.email
            });
        }

        try {
            const { email, password } = req.body;
            console.log('🔹 Login attempt for:', email);

            const company = await Company.findOne({ email }).select('+password');
            if (!company) {
                console.log(' Company not found!');
                return res.render('company-login', {
                    errors: [{ msg: 'Invalid email or password!' }],
                    email
                });
            }

            const isMatch = await company.validatePassword(password);
            console.log('🔹 Password Match:', isMatch);

            if (!isMatch) {
                return res.render('company-login', {
                    errors: [{ msg: 'Invalid email or password!' }],
                    email
                });
            }

            req.session.companyId = company._id;
            req.session.companyName = company.companyName;

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('company-login', {
                        errors: [{ msg: 'Session error. Please try again.' }],
                        email
                    });
                }
                console.log(' Login successful for:', company.companyName);
                res.redirect('/company-dashboard');
            });
        } catch (error) {
            console.error(' Login Error:', error.message, error.stack);
            res.render('company-login', {
                errors: [{ msg: 'Server error during login' }],
                email
            });
        }
    }
];

exports.companyLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

// exports.renderCompanyDashboard = (req, res) => {
//     if (!req.session.companyId) {
//         console.log("WE ARE IN DASHBOARD BITCHES");
//         return res.redirect('/company-login');
//     }
//     res.render('company-dashboard', { companyName: req.session.companyName });
// };
exports.renderCompanyDashboard = (req, res) => {
    console.log('Session in dashboard:', req.session);
    if (!req.session.companyId) {
        console.log("WE ARE IN DASHBOARD BITCHES - No session found");
        return res.redirect('/company-login');
    }
    res.render('company-dashboard', { companyName: req.session.companyName });
};

exports.renderCompanyProfile = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-profile');
};

exports.renderCompanySettings = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-settings');
};

exports.renderCompanyCommunications = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-communications');
};

exports.renderCompanyReviews = async (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    const companies = await Company.find({});
    res.render('company-reviews', { companies });
};

exports.renderCompanyPayments = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-payments');
};

exports.renderCompanyTaskManagement = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-task-management');
};

exports.renderCompanyNotifications = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-notifications');
};

exports.renderCompanySupport = (req, res) => {
    if (!req.session.companyId) {
        return res.redirect('/company-login');
    }
    res.render('company-support');
};
