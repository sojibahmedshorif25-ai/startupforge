import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const data = parseJSON(response.text);

    return res.status(200).json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('generateOpportunityPitch Error:', error);
    return res.status(500).json({ success: false, message: 'AI generation failed.' });
  }
};

/**
 * Feature 2: AI Skill Match Percentage & Application Enhancement
 */
export const calculateSkillMatch = async (req, res) => {
  try {
    const { userSkills = [], requiredSkills = [], applicantBio = '' } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(200).json({ success: true, matchPercentage: 85, matchingSkills: [], generatedMotivation: 'I am excited to apply!' });
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const data = parseJSON(response.text);

    return res.status(200).json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('calculateSkillMatch Error:', error);
    return res.status(500).json({ success: false, message: 'AI evaluation failed.' });
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const data = parseJSON(response.text);

    return res.status(200).json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('generateUserBio Error:', error);
    return res.status(500).json({ success: false, message: 'AI bio generation failed.' });
  }
};
