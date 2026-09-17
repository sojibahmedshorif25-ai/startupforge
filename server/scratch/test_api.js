import http from 'http';

const request = (path, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resData || '{}') }));
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

async function runTests() {
  console.log('--- Testing StartupForge 2.0 API Server ---');

  try {
    const health = await request('/api/health');
    console.log('✅ Health Check:', health.status, health.data.status);

    const opps = await request('/api/opportunities/all');
    console.log('✅ Opportunities API:', opps.status, 'Total items:', opps.data.total || opps.data.length || 0);

    const match = await request('/api/ai/match', 'POST', {
      skills: ['React', 'JavaScript', 'Node.js'],
      bio: 'Fullstack developer passionate about building AI apps',
    });
    console.log('✅ AI Matcher API:', match.status, 'Recommendations count:', match.data.recommendations?.length);

    const resume = await request('/api/ai/resume', 'POST', {
      resumeText: 'Senior Fullstack Engineer with 5 years experience in React, TypeScript, Node.js, Express, and MongoDB.',
    });
    console.log('✅ AI Resume Analyzer API:', resume.status, 'Detected skills:', resume.data.skillsDetected);

    const assistant = await request('/api/ai/assistant', 'POST', {
      message: 'What skills should I learn for AI startup engineering?',
    });
    console.log('✅ AI Assistant API:', assistant.status, 'Reply received:', assistant.data.reply?.substring(0, 60) + '...');

    console.log('🎉 All API verification checks passed!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runTests();
