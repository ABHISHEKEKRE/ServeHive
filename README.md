# ServeHive - Freelancing Platform

## Introduction
Welcome to ServeHive, a modern freelancing platform connecting companies with talented freelancers and startups. Our platform simplifies the process of finding the right talent for your projects or the perfect projects for your skills.

## Features

- **Dual User System**: Separate functionalities for companies and freelancers
- **User Authentication**: Secure login and signup system using MongoDB sessions
- **Project Posting**: Companies can post detailed project requirements
- **Bidding System**: Freelancers can bid on available projects
- **Recommendation Engine**: Companies receive tailored freelancer recommendations
- **Ratings & Reviews**: Transparent feedback system for both companies and freelancers

## Coming Soon
- **Communication Channel**: Direct messaging between companies and freelancers
- **Payment Processing**: Secure payment system for project transactions

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: MongoDB session-based authentication

## Getting Started

### Prerequisites
- Node.js (v14.0 or higher)
- MongoDB (v4.4 or higher)
- npm (v6.0 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/ABHISHEKEKRE/ServeHive.git
cd ServeHive
```

2. Install dependencies
```bash
npm install
```

3. Create necessary environment variables or configuration files

4. Start the development server
```bash
npm start
```

## Project Structure

```
ServeHive/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── models/         # MongoDB models
├── routes/         # API routes
├── views/          # EJS templates
├── .gitignore      # Git ignore file
├── index.js        # Main application file
├── package.json    # Project dependencies
└── README.md       # This file
```

## User Flows

### For Companies
1. Sign up/Login to company account
2. Post a new project with requirements and budget
3. Review bids from freelancers
4. Select a freelancer based on recommendations and ratings
5. Rate freelancers upon project completion

### For Freelancers
1. Sign up/Login to freelancer account
2. Browse available projects
3. Submit bids on interesting projects
4. Track bid status and project progress
5. Receive ratings from companies

## Current Progress
- Successfully implemented user authentication for both freelancers and companies
- Created login and signup functionality
- Established project posting system
- Implemented bidding mechanism
- Developed ratings and reviews functionality

## Contributing

If you're interested in contributing to ServeHive, please reach out to the repository owner.

## Contact

GitHub: [ABHISHEKEKRE](https://github.com/ABHISHEKEKRE) [AyushGupta915](https://github.com/AyushGupta915)
Project Link: [https://github.com/ABHISHEKEKRE/ServeHive](https://github.com/ABHISHEKEKRE/ServeHive)
