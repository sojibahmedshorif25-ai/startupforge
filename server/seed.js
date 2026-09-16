import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Startup from './models/Startup.js';
import Opportunity from './models/Opportunity.js';
import Application from './models/Application.js';
import Payment from './models/Payment.js';

import dns from 'dns';
dotenv.config();

dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_PASSWORD_HERE')) {
      console.log('⚠️ MONGODB_URI not properly configured with real password in .env file.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for Seeding');

    // Clean existing data for clean demo setup
    await User.deleteMany({});
    await Startup.deleteMany({});
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    await Payment.deleteMany({});

    const defaultPassword = await bcrypt.hash('Admin123!', 12);
    const founderPassword = await bcrypt.hash('Founder123!', 12);
    const userPassword = await bcrypt.hash('User123!', 12);

    // 1. Create 6 Users
    const admin = await User.create({
      name: 'StartupForge Admin',
      email: 'admin@startupforge.com',
      password: defaultPassword,
      role: 'admin',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      isPremium: true,
      bio: 'Platform Lead & Managing Partner at StartupForge Ventures.',
    });

    const founder1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex.founder@techvision.io',
      password: founderPassword,
      role: 'founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      isPremium: true,
      bio: 'Serial entrepreneur & AI practitioner building next-gen developer tools.',
      skills: ['AI/ML', 'Product Strategy', 'React', 'Node.js', 'System Architecture'],
    });

    const founder2 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah.founder@healthai.com',
      password: founderPassword,
      role: 'founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      isPremium: true,
      bio: 'HealthTech pioneer bridging clinical diagnostics and machine learning.',
      skills: ['HealthTech', 'Python', 'Biotech', 'Growth Strategy', 'MedTech'],
    });

    const founder3 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.vance@climategrid.io',
      password: founderPassword,
      role: 'founder',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      isPremium: true,
      bio: 'CleanTech innovator focused on smart microgrids and decentralized energy management.',
      skills: ['CleanTech', 'IoT', 'Energy Analytics', 'Embedded C++', 'Go'],
    });

    const collaborator1 = await User.create({
      name: 'John Developer',
      email: 'dev.john@gmail.com',
      password: userPassword,
      role: 'collaborator',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      bio: 'Fullstack developer with 5+ years of React, Node, and Tailwind CSS experience.',
      skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'GraphQL'],
    });

    const collaborator2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena.design@uiux.io',
      password: userPassword,
      role: 'collaborator',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      bio: 'Product Designer specializing in sleek SaaS dashboards and mobile UI design systems.',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
    });

    console.log('✅ Seeded 6 Users (Admin, 3 Founders, 2 Collaborators)');

    // 2. Create 15 Startups
    const startupsData = [
      {
        startup_name: 'NexusAI Synthetics',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        industry: 'AI & Data Science',
        description: 'Building autonomous AI agents to automate software documentation, test suite generation, and architectural code analysis.',
        funding_stage: 'Seed ($1.5M)',
        founder_email: founder1.email,
        founder_name: founder1.name,
        team_size_needed: 5,
        status: 'approved',
      },
      {
        startup_name: 'BioPulse Health',
        logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
        industry: 'HealthTech',
        description: 'Real-time wearable telemetry analytics for athletic stress monitoring, cardiac arrhythmia detection, and preventative care.',
        funding_stage: 'Pre-Seed ($600K)',
        founder_email: founder2.email,
        founder_name: founder2.name,
        team_size_needed: 4,
        status: 'approved',
      },
      {
        startup_name: 'GreenGrid Energy',
        logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&auto=format&fit=crop&q=80',
        industry: 'ClimateTech',
        description: 'Decentralized peer-to-peer solar energy trading platform powered by IoT smart meters and automated grid balancing algorithms.',
        funding_stage: 'Series A ($4.2M)',
        founder_email: founder3.email,
        founder_name: founder3.name,
        team_size_needed: 6,
        status: 'approved',
      },
      {
        startup_name: 'PayFlow Global',
        logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
        industry: 'FinTech',
        description: 'Cross-border B2B settlement infrastructure enabling sub-second international wire transfers with automated compliance auditing.',
        funding_stage: 'Seed ($2.1M)',
        founder_email: founder1.email,
        founder_name: founder1.name,
        team_size_needed: 4,
        status: 'approved',
      },
      {
        startup_name: 'LearnQuantum',
        logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
        industry: 'EdTech',
        description: 'Interactive gamified learning platform teaching high schoolers and undergrads complex quantum mechanics and python algorithms.',
        funding_stage: 'Pre-Seed ($350K)',
        founder_email: founder2.email,
        founder_name: founder2.name,
        team_size_needed: 3,
        status: 'approved',
      },
      {
        startup_name: 'CyberShield Vault',
        logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
        industry: 'Cybersecurity',
        description: 'Zero-trust cloud security monitoring suite detecting anomalous API payloads and internal data exfiltration in real-time.',
        funding_stage: 'Seed ($1.8M)',
        founder_email: founder3.email,
        founder_name: founder3.name,
        team_size_needed: 5,
        status: 'approved',
      },
      {
        startup_name: 'RoboLogistics AI',
        logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop&q=80',
        industry: 'Robotics & Automation',
        description: 'Autonomous warehouse mobile robots operating with vision-guided navigation and AI route optimization.',
        funding_stage: 'Series A ($6.5M)',
        founder_email: founder1.email,
        founder_name: founder1.name,
        team_size_needed: 8,
        status: 'approved',
      },
      {
        startup_name: 'OmniCloud Dev',
        logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
        industry: 'SaaS & DevOps',
        description: 'Instant multi-cloud deployment engine turning raw GitHub repos into scalable serverless microservices within 30 seconds.',
        funding_stage: 'Seed ($2.8M)',
        founder_email: founder2.email,
        founder_name: founder2.name,
        team_size_needed: 4,
        status: 'approved',
      },
      {
        startup_name: 'AgriSense Analytics',
        logo: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop&q=80',
        industry: 'AgriTech',
        description: 'Hyperspectral satellite imaging paired with ground moisture sensors to maximize crop yields and minimize water waste.',
        funding_stage: 'Pre-Seed ($500K)',
        founder_email: founder3.email,
        founder_name: founder3.name,
        team_size_needed: 3,
        status: 'approved',
      },
      {
        startup_name: 'SoundMind AI',
        logo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
        industry: 'Mental Health Tech',
        description: 'AI-driven personalized cognitive behavioral therapy audio companion tailored for software engineers and high-stress professionals.',
        funding_stage: 'Seed ($1.1M)',
        founder_email: founder1.email,
        founder_name: founder1.name,
        team_size_needed: 4,
        status: 'approved',
      },
      {
        startup_name: 'MetaRealm Studios',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
        industry: 'Gaming & 3D',
        description: 'Photorealistic WebGL virtual event spaces allowing thousands of remote attendees to interact seamlessly in 3D audio environments.',
        funding_stage: 'Pre-Seed ($750K)',
        founder_email: founder2.email,
        founder_name: founder2.name,
        team_size_needed: 5,
        status: 'approved',
      },
      {
        startup_name: 'SupplyChainX',
        logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
        industry: 'Logistics',
        description: 'Immutable supply chain tracking software verifying food origin, temperature control, and carbon footprint across sea transit.',
        funding_stage: 'Seed ($1.4M)',
        founder_email: founder3.email,
        founder_name: founder3.name,
        team_size_needed: 4,
        status: 'approved',
      },
      {
        startup_name: 'PropTech Horizon',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
        industry: 'Real Estate Tech',
        description: 'Fractional commercial real estate tokenization platform allowing retail investors to participate in high-yield urban developments.',
        funding_stage: 'Series A ($3.9M)',
        founder_email: founder1.email,
        founder_name: founder1.name,
        team_size_needed: 6,
        status: 'approved',
      },
      {
        startup_name: 'AutoCode Studio',
        logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
        industry: 'Developer Tools',
        description: 'Browser-based collaborative IDE with real-time AI pair programming, automated PR review, and instant cloud staging containers.',
        funding_stage: 'Seed ($2.0M)',
        founder_email: founder2.email,
        founder_name: founder2.name,
        team_size_needed: 5,
        status: 'approved',
      },
      {
        startup_name: 'FoodPrint Carbon',
        logo: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop&q=80',
        industry: 'Sustainability',
        description: 'Restaurant management POS plugin calculating carbon footprints per dish and giving eco-conscious customers offsets at checkout.',
        funding_stage: 'Pre-Seed ($300K)',
        founder_email: founder3.email,
        founder_name: founder3.name,
        team_size_needed: 3,
        status: 'approved',
      },
    ];

    const createdStartups = await Startup.insertMany(startupsData);
    console.log(`✅ Seeded ${createdStartups.length} Startups`);

    // 3. Create 15 Opportunities
    const opportunitiesData = [
      {
        startup_id: createdStartups[0]._id,
        role_title: 'Senior Frontend Engineer',
        required_skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Lead the frontend architecture for our interactive AI agent canvas UI using React, WebSockets, and Tailwind CSS.',
      },
      {
        startup_id: createdStartups[0]._id,
        role_title: 'Backend Systems Architect',
        required_skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
        work_type: 'hybrid',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        description: 'Design robust microservices and high-throughput vector database pipelines for real-time AI code analysis.',
      },
      {
        startup_id: createdStartups[1]._id,
        role_title: 'Mobile App Lead (React Native)',
        required_skills: ['React Native', 'React', 'BLE Telemetry', 'Redux', 'TypeScript'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        description: 'Create ultra-smooth mobile Bluetooth communication layer for real-time heart health telemetry and sensor streaming.',
      },
      {
        startup_id: createdStartups[2]._id,
        role_title: 'IoT Embedded Firmware Engineer',
        required_skills: ['C++', 'IoT', 'Embedded Systems', 'MQTT', 'Go'],
        work_type: 'onsite',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        description: 'Program ESP32 microcontrollers for smart energy meters measuring bidirectional solar power generation.',
      },
      {
        startup_id: createdStartups[3]._id,
        role_title: 'Smart Contract & Audit Engineer',
        required_skills: ['Solidity', 'Web3.js', 'Security Auditing', 'Node.js'],
        work_type: 'remote',
        commitment_level: 'part-time',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        description: 'Audit cross-border escrow smart contracts and implement real-time fraud monitoring algorithms.',
      },
      {
        startup_id: createdStartups[4]._id,
        role_title: 'Interactive Curriculum Designer',
        required_skills: ['Python', 'Quantum Computing', 'Technical Writing', 'UI/UX'],
        work_type: 'remote',
        commitment_level: 'part-time',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        description: 'Build interactive Python notebooks and visual quizzes explaining Qiskit and quantum circuits.',
      },
      {
        startup_id: createdStartups[5]._id,
        role_title: 'Cloud Security Operations Lead',
        required_skills: ['Cybersecurity', 'AWS', 'Kubernetes', 'Python', 'Go'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        description: 'Lead threat hunting and intrusion detection engine development across multi-cloud environments.',
      },
      {
        startup_id: createdStartups[6]._id,
        role_title: 'Autonomous Navigation AI Specialist',
        required_skills: ['Python', 'PyTorch', 'ROS2', 'Computer Vision', 'C++'],
        work_type: 'hybrid',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        description: 'Train SLAM and LiDAR neural networks for AGV warehouse robots operating in dynamic industrial environments.',
      },
      {
        startup_id: createdStartups[7]._id,
        role_title: 'DevOps & Kubernetes Infrastructure Engineer',
        required_skills: ['Docker', 'Kubernetes', 'Terraform', 'Node.js', 'AWS'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
        description: 'Scale automated cluster provisioning engine capable of spawning thousands of isolated container sandboxes.',
      },
      {
        startup_id: createdStartups[8]._id,
        role_title: 'Geospatial Data Scientist',
        required_skills: ['Python', 'GIS', 'TensorFlow', 'Scikit-Learn', 'Satellite Imagery'],
        work_type: 'remote',
        commitment_level: 'part-time',
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        description: 'Analyze multispectral satellite rasters to predict soil nitrogen depletion and drought risk in agricultural regions.',
      },
      {
        startup_id: createdStartups[9]._id,
        role_title: 'Fullstack Developer (React & Node)',
        required_skills: ['React', 'Node.js', 'Web Audio API', 'MongoDB'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        description: 'Build adaptive binaural audio player with real-time sentiment tracker and biofeedback dashboard.',
      },
      {
        startup_id: createdStartups[10]._id,
        role_title: '3D WebGL / Three.js Engineer',
        required_skills: ['Three.js', 'WebGL', 'JavaScript', 'React', 'GLSL'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
        description: 'Construct high-performance 3D spatial web scenes with spatialized WebRTC audio networking.',
      },
      {
        startup_id: createdStartups[11]._id,
        role_title: 'Blockchain Protocol Engineer',
        required_skills: ['Rust', 'Blockchain', 'GraphQL', 'PostgreSQL'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
        description: 'Implement distributed ledger state machines for tracking perishable food shipments across ports.',
      },
      {
        startup_id: createdStartups[12]._id,
        role_title: 'UI/UX Product Designer',
        required_skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Testing'],
        work_type: 'remote',
        commitment_level: 'part-time',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        description: 'Craft intuitive investor dashboards and property token trading interfaces for web & mobile views.',
      },
      {
        startup_id: createdStartups[13]._id,
        role_title: 'Developer Advocate & Community Manager',
        required_skills: ['Developer Relations', 'Technical Writing', 'React', 'Public Speaking'],
        work_type: 'remote',
        commitment_level: 'full-time',
        deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
        description: 'Grow open-source developer community, organize hackathons, and author high-impact cloud IDE tutorials.',
      },
    ];

    const createdOpportunities = await Opportunity.insertMany(opportunitiesData);
    console.log(`✅ Seeded ${createdOpportunities.length} Opportunities`);

    // 4. Create Applications
    await Application.create([
      {
        opportunity_id: createdOpportunities[0]._id,
        applicant_email: collaborator1.email,
        applicant_name: collaborator1.name,
        portfolio_link: 'https://github.com/johndev-demo',
        motivation: 'I have built over 10 production React apps and love AI toolings. Excited to lead frontend at NexusAI!',
        status: 'pending',
      },
      {
        opportunity_id: createdOpportunities[2]._id,
        applicant_email: collaborator1.email,
        applicant_name: collaborator1.name,
        portfolio_link: 'https://github.com/johndev-demo',
        motivation: 'Strong background in React Native BLE telemetry integrations for healthcare startups.',
        status: 'accepted',
      },
      {
        opportunity_id: createdOpportunities[11]._id,
        applicant_email: collaborator2.email,
        applicant_name: collaborator2.name,
        portfolio_link: 'https://dribbble.com/elenadesign',
        motivation: 'Specialized in 3D UI component libraries and glassmorphic dashboards.',
        status: 'pending',
      },
    ]);

    // 5. Create Payments
    await Payment.create([
      {
        user_email: founder1.email,
        amount: 10,
        transaction_id: 'tx_demo_stripe_998124',
        payment_status: 'completed',
      },
      {
        user_email: founder2.email,
        amount: 10,
        transaction_id: 'tx_demo_stripe_998125',
        payment_status: 'completed',
      },
    ]);

    console.log('✅ Seeded Applications & Payments');
    console.log('🎉 DB Seeding Complete with 15 Startups & 15 Opportunities!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDB();
