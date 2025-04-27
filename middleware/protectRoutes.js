const jwt = require('jsonwebtoken');
const Company = require('../models/companySchema');
const Freelancer = require('../models/FreelancerSchema');

const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      console.log('No token found');
      return res.redirect('/company-login'); // Redirect instead of JSON
    }

    console.log('Token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log('Invalid token');
      return res.redirect('/company-login');
    }

    console.log('Decoded ID:', decoded.id);
    let user = await Company.findById(decoded.id).select('-password');

    if (user) {
      req.user = user;
    } else {
      // Try finding as a Freelancer
      user = await Freelancer.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      } else {
        console.log('User not found');
        return res.redirect('/company-login');
      }
    }

    next();
  } catch (error) {
    console.error('Error in protectRoutes middleware:', error.message);
    return res.redirect('/company-login');
  }
};

module.exports = protectRoutes;