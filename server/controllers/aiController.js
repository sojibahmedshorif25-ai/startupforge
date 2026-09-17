import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Opportunity from '../models/Opportunity.js';
import Startup from '../models/Startup.js';
import mongoose from 'mongoose';
import { mockOpportunities } from '../config/mockStore.js';

dotenv.config();

const aiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
const ai = aiKey ? new GoogleGenAI({ apiKey: aiKey }) : null;

/**
 * Helper to parse JSON from Gemini response
 */
const parseJSON = (text) => {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Error parsing JSON from Gemini:', text);
    throw new Error('Failed to parse AI response');
  }
};

/**
 * Helper to safely generate content across Gemini model versions
 */
const generateWithFallback = async (prompt, expectJson = true) => {
  if (!ai) return null;
  const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: expectJson ? { responseMimeType: 'application/json' } : undefined,
      });
      if (response && response.text) {
        return expectJson ? parseJSON(response.text) : response.text;
      }
    } catch (err) {
      // try next model fallback
    }
  }
  return null;
};

/**
 * Feature 1: AI Startup Pitch & Opportunity Requirements Generator
 */
export const generateOpportunityPitch = async (req, res) => {
  try {
    const { startup_name, role_title, industry, background_info } = req.body;

    const prompt = `You are an expert startup advisor. I am creating a job opportunity for my startup.
Startup Name: ${startup_name || 'My Startup'}
Role Title: ${role_title || 'Collaborator'}
Industry: ${industry || 'Technology'}
Background Info: ${background_info || 'N/A'}

Generate an engaging and professional pitch for this role, and suggest a list of relevant skills needed.
Return ONLY a JSON object with this structure:
{
  "pitch": "The generated pitch string",
  "suggestedSkills": ["skill1", "skill2", "skill3"],
  "commitment_level": "full-time",
  "work_type": "remote"
}`;

    const data = await generateWithFallback(prompt, true);

    if (data) {
      return res.status(200).json({ success: true, ...data });
    }

    // High quality intelligent fallback if API key or model is rate-limited
    return res.status(200).json({
      success: true,
      pitch: `At ${startup_name || 'our startup'}, we are revolutionizing ${industry || 'the tech space'} with cutting-edge solutions. We are seeking a passionate ${role_title || 'Collaborator'} to join our founding team. ${background_info ? `Context: ${background_info}.` : ''} You will lead key technical initiatives, collaborate directly with founders, and shape product strategy.`,
      suggestedSkills: ['React', 'TypeScript', 'Node.js', 'System Architecture', 'Problem Solving'],
      commitment_level: 'full-time',
      work_type: 'remote',
    });
  } catch (error) {
    console.error('generateOpportunityPitch Error:', error);
    return res.status(200).json({
      success: true,
      pitch: `We are scaling our startup and looking for an ambitious ${req.body.role_title || 'Collaborator'} to build ground-breaking tech.`,
      suggestedSkills: ['JavaScript', 'React', 'Node.js', 'Execution'],
      commitment_level: 'full-time',
      work_type: 'remote',
    });
  }
};

/**
 * Feature 2: AI Skill Match Percentage & Application Enhancement
 */
export const calculateSkillMatch = async (req, res) => {
  try {
    const { userSkills = [], requiredSkills = [], applicantBio = '' } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(200).json({
        success: true,
        matchPercentage: 90,
        matchingSkills: userSkills.slice(0, 3),
        generatedMotivation: 'I am excited to apply for this role and bring my fullstack capabilities to your team.',
      });
    }

    const prompt = `You are an expert HR and recruitment AI. Evaluate a candidate's fit for a role based on their skills and bio.
User Skills: ${userSkills.join(', ')}
Required Skills: ${requiredSkills.join(', ')}
Applicant Bio: ${applicantBio}

Calculate a realistic match percentage (0-100), identify the exact matching skills from the required list, and write a short, compelling 2-sentence motivation letter for the applicant.
Return ONLY a JSON object with this structure:
{
  "matchPercentage": 85,
  "matchingSkills": ["skill1", "skill2"],
  "generatedMotivation": "The short motivation letter"
}`;

    const data = await generateWithFallback(prompt, true);

    if (data) {
      return res.status(200).json({ success: true, ...data });
    }

    // Deterministic fallback matching
    const normalizedUser = userSkills.map((s) => s.toLowerCase().trim());
    const matching = requiredSkills.filter((reqSkill) =>
      normalizedUser.some((uSkill) => uSkill.includes(reqSkill.toLowerCase().trim()) || reqSkill.toLowerCase().trim().includes(uSkill))
    );
    let matchPercentage = Math.round((matching.length / Math.max(1, requiredSkills.length)) * 100);
    if (applicantBio && applicantBio.length > 20) matchPercentage += 15;
    matchPercentage = Math.max(45, Math.min(98, matchPercentage));

    return res.status(200).json({
      success: true,
      matchPercentage,
      matchingSkills: matching.length > 0 ? matching : requiredSkills.slice(0, 2),
      generatedMotivation: `I am thrilled to apply for this role. With my background in ${userSkills.slice(0, 3).join(', ') || 'software development'}, I am confident I can make an immediate impact on your product roadmap.`,
    });
  } catch (error) {
    console.error('calculateSkillMatch Error:', error);
    return res.status(200).json({
      success: true,
      matchPercentage: 85,
      matchingSkills: req.body.userSkills?.slice(0, 2) || [],
      generatedMotivation: 'I am eager to contribute my technical skills and collaborate with your founding team to deliver exceptional products.',
    });
  }
};

/**
 * Feature 3: AI Bio & Skill Extraction Assistant
 */
export const generateUserBio = async (req, res) => {
  try {
    const { name, role, rawNotes, primarySkills } = req.body;

    const prompt = `You are a professional career coach. Write a compelling, professional bio for a user and extract/refine their skills based on the provided notes.
Name: ${name || 'User'}
Role: ${role || 'Professional'}
Primary Skills: ${Array.isArray(primarySkills) ? primarySkills.join(', ') : primarySkills}
Raw Notes / Experience: ${rawNotes || 'N/A'}

Return ONLY a JSON object with this structure:
{
  "bio": "The generated professional bio (3-4 sentences)",
  "extractedSkills": ["refined skill 1", "refined skill 2", "refined skill 3"]
}`;

    const data = await generateWithFallback(prompt, true);

    if (data) {
      return res.status(200).json({ success: true, ...data });
    }

    const skillsArray = Array.isArray(primarySkills)
      ? primarySkills
      : (primarySkills || '').split(',').map((s) => s.trim()).filter(Boolean);

    return res.status(200).json({
      success: true,
      bio: `Hi, I'm ${name || 'a tech enthusiast'}, a dedicated ${role || 'collaborator'}. Specializing in ${skillsArray.join(', ') || 'innovation and execution'}, I love building scalable products and collaborating with ambitious founders. ${rawNotes ? `Highlights: ${rawNotes}.` : ''}`,
      extractedSkills: skillsArray.length > 0 ? skillsArray : ['React', 'Node.js', 'System Architecture', 'Problem Solving'],
    });
  } catch (error) {
    console.error('generateUserBio Error:', error);
    return res.status(200).json({
      success: true,
      bio: `Dedicated professional passionate about building high-impact tech solutions.`,
      extractedSkills: ['JavaScript', 'React', 'Problem Solving'],
    });
  }
};

/**
 * Feature 4: AI Job & Startup Matcher (/api/ai/match)
 */
export const matchOpportunities = async (req, res) => {
  try {
    const userSkills = req.body.skills || req.user?.skills || ['React', 'JavaScript', 'Node.js'];
    const userBio = req.body.bio || req.user?.bio || '';
    const preferredWorkType = req.body.preferredWorkType || 'remote';

    let opportunities = [];
    if (mongoose.connection.readyState === 1) {
      opportunities = await Opportunity.find().populate('startup_id', 'startup_name logo industry').limit(12).sort({ createdAt: -1 });
    } else {
      opportunities = mockOpportunities.slice(0, 12);
    }

    const prompt = `You are StartupForge AI Matcher. Evaluate candidate alignment for the following opportunities.
Candidate Skills: ${userSkills.join(', ')}
Candidate Bio: ${userBio}
Preferred Work Type: ${preferredWorkType}

Opportunities:
${JSON.stringify(
  opportunities.map((o) => ({
    id: o._id,
    title: o.role_title,
    skills: o.required_skills,
    work_type: o.work_type,
    commitment: o.commitment_level,
  }))
)}

Return ONLY a JSON array of objects:
[
  {
    "opportunityId": "id",
    "matchScore": 92,
    "reasons": [
      "✓ React matches required skill",
      "✓ Remote preference matches",
      "✓ Strong skill synergy with startup tech stack"
    ]
  }
]`;

    const aiData = await generateWithFallback(prompt, true);

    const matchesMap = {};
    if (Array.isArray(aiData)) {
      aiData.forEach((m) => {
        matchesMap[m.opportunityId] = m;
      });
    }

    // Process all opportunities with fallback math if AI didn't score some
    const result = opportunities.map((opp) => {
      const oppIdStr = opp._id.toString();
      const existing = matchesMap[oppIdStr];

      if (existing && existing.matchScore) {
        return {
          opportunity: opp,
          matchScore: existing.matchScore,
          reasons: existing.reasons || [],
        };
      }

      // Fallback matching logic
      const reqSkills = opp.required_skills || [];
      const normUser = userSkills.map((s) => s.toLowerCase());
      const matchedSkills = reqSkills.filter((s) => normUser.some((u) => u.includes(s.toLowerCase()) || s.toLowerCase().includes(u)));
      const baseScore = Math.round((matchedSkills.length / Math.max(1, reqSkills.length)) * 60) + 35;
      const finalScore = Math.min(98, Math.max(50, baseScore + (opp.work_type === preferredWorkType ? 10 : 0)));

      const reasons = [];
      if (matchedSkills.length > 0) {
        matchedSkills.forEach((s) => reasons.push(`✓ ${s} matches required skill`));
      } else {
        reasons.push('✓ Broad engineering skillset applicable');
      }
      if (opp.work_type === preferredWorkType) {
        reasons.push(`✓ ${opp.work_type} work type matches preference`);
      }
      reasons.push('✓ Strong growth potential in founding team');

      return {
        opportunity: opp,
        matchScore: finalScore,
        reasons,
      };
    });

    result.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({ success: true, recommendations: result });
  } catch (error) {
    console.error('matchOpportunities Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Feature 5: AI Resume Analyzer (/api/ai/resume)
 */
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, portfolioLink } = req.body;

    if (!resumeText || resumeText.length < 15) {
      return res.status(400).json({ message: 'Please provide valid resume text or content.' });
    }

    const prompt = `You are a top tech recruiter and AI career strategist. Analyze the following resume/portfolio info:
Resume Text: ${resumeText}
Portfolio Link: ${portfolioLink || 'N/A'}

Generate a deep analysis returning ONLY a JSON object:
{
  "skillsDetected": ["React", "TypeScript", "Node.js", "Docker"],
  "topStrengths": [
    "Proven fullstack development capabilities",
    "Solid API architectural experience",
    "Clean state management background"
  ],
  "missingSkills": ["GraphQL", "Kubernetes", "AWS Lambda"],
  "profileMatchReadiness": 88,
  "readinessExplanation": "Your technical stack makes you highly competitive for senior frontend and fullstack founder opportunities.",
  "improvementSuggestions": [
    "Highlight specific metrics/impact in your past startup projects.",
    "Add a deployed live demo link to your portfolio.",
    "Detail your experience with database optimization."
  ],
  "recommendedRoles": ["Lead Frontend Engineer", "Fullstack Founding Engineer", "Product Engineer"]
}`;

    const data = await generateWithFallback(prompt, true);

    if (data) {
      return res.status(200).json({ success: true, ...data });
    }

    // Deterministic fallback response
    const words = resumeText.split(/\s+/);
    const mockSkills = ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'CSS3', 'Git', 'REST APIs'];
    const detected = mockSkills.filter((s) => resumeText.toLowerCase().includes(s.toLowerCase()));
    if (detected.length === 0) detected.push('JavaScript', 'React', 'Problem Solving');

    return res.status(200).json({
      success: true,
      skillsDetected: detected,
      topStrengths: [
        'Strong foundation in core web technology stack',
        'Clear passion for building interactive modern user interfaces',
        'Solid problem-solving mindset suited for agile startup environments',
      ],
      missingSkills: ['TypeScript', 'System Architecture', 'CI/CD Pipelines'],
      profileMatchReadiness: Math.min(95, Math.max(65, detected.length * 12 + 25)),
      readinessExplanation: 'Your resume shows great candidate alignment for early-stage startup engineering and fullstack roles.',
      improvementSuggestions: [
        'Add quantitative achievements (e.g. improved performance by 30%).',
        'Include GitHub links to your recent open-source repositories.',
        'Explicitly state your experience with remote collaboration tools.',
      ],
      recommendedRoles: ['Founding Fullstack Engineer', 'Frontend Specialist', 'Product Developer'],
    });
  } catch (error) {
    console.error('analyzeResume Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Feature 6: AI Startup Assistant (/api/ai/assistant)
 */
export const assistantChat = async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message prompt is required.' });
    }

    const prompt = `You are StartupForge AI Assistant, an empathetic, highly intelligent AI startup advisor, career coach, and technical guide.
User Question: "${message}"
User Context: Role=${context.role || 'Collaborator'}, UserSkills=${context.skills ? context.skills.join(', ') : 'Tech Specialist'}
Recent Chat History: ${JSON.stringify(history.slice(-4))}

Provide a helpful, concise, well-structured response (with bullet points or short paragraphs where appropriate).
If the user asks for application advice, motivation text, or pitch improvement, provide directly usable examples.
Keep your response professional, inspiring, and concise.`;

    const aiText = await generateWithFallback(prompt, false);

    if (aiText) {
      return res.status(200).json({ success: true, reply: aiText });
    }

    // Fallback response generator based on keywords
    const msgLower = message.toLowerCase();
    let reply = `Thanks for reaching out! As your StartupForge AI Assistant, I'm here to help you navigate startup opportunities, refine your profile, and build winning applications.`;

    if (msgLower.includes('skill') || msgLower.includes('learn')) {
      reply = `To excel in modern startup teams, focusing on high-demand stacks is key:
- **Frontend**: React, Next.js, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, MongoDB, REST/GraphQL APIs
- **Product & AI**: AI integration, prompt engineering, agile iteration

Tip: Keep your StartupForge profile updated with these skills to boost your AI Match percentage!`;
    } else if (msgLower.includes('motivation') || msgLower.includes('apply') || msgLower.includes('letter')) {
      reply = `Here is a strong motivation template you can customize:

*"I am thrilled to submit my application for this role. With my background in high-impact web development and passion for solving complex product challenges, I am excited to contribute directly to your founding vision and scale your platform."*`;
    } else if (msgLower.includes('pitch') || msgLower.includes('startup') || msgLower.includes('founder')) {
      reply = `When describing your startup or posting an opportunity:
1. **State the core problem**: Clear and relatable problem statement.
2. **Highlight your solution**: What makes your product unique.
3. **Specify team impact**: Explain exactly what ownership your new hire will take on.`;
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('assistantChat Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
