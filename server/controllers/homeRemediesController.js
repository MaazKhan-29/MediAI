// Home Remedies Controller
// Uses Ollama (Mistral) to generate safe, natural home remedies
// ⚠️ NO medicine prescriptions, NO dosage — only safe lifestyle guidance

// @desc    Get AI-powered home remedies for symptoms
// @route   POST /api/ai/home-remedies
// @access  Public
const getHomeRemedies = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a symptoms array.',
      });
    }

    const symptomList = symptoms.map(s => s.replace(/_/g, ' ')).join(', ');

    console.log(`🌿 Generating home remedies for: [${symptomList}]`);

    const systemPrompt = `You are a safe medical wellness assistant for a healthcare app called MediAI.

Based on the patient's symptoms, provide helpful pre-consultation guidance.

STRICT RULES:
- Do NOT prescribe any medicines or drugs
- Do NOT provide any dosage information
- ONLY suggest natural remedies, lifestyle changes, and home care
- Keep advice simple, safe, and easy to follow
- Always recommend seeing a doctor for serious concerns

Respond in EXACTLY this JSON format (no markdown, no code blocks, just pure JSON):
{
  "cause": "A brief, simple explanation of possible causes (1-2 sentences)",
  "remedies": ["remedy 1", "remedy 2", "remedy 3", "remedy 4"],
  "warning": ["warning sign 1", "warning sign 2", "warning sign 3"]
}`;

    const userPrompt = `Patient symptoms: ${symptomList}

Provide safe home remedies and guidance for these symptoms. Remember: NO medicines, NO dosage. Only natural/lifestyle remedies.`;

    const ollamaResponse = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text();
      console.error('Ollama error:', ollamaResponse.status, errText);
      return res.status(500).json({
        success: false,
        message: 'AI service unavailable. Ensure Ollama is running with the Mistral model.',
      });
    }

    const ollamaData = await ollamaResponse.json();
    const content = ollamaData.choices?.[0]?.message?.content || '';

    console.log('  🧠 AI response received, parsing...');

    // Parse the JSON response from AI
    let remediesData;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonStr = content;

      // Remove markdown code blocks if present
      const jsonBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonBlockMatch) {
        jsonStr = jsonBlockMatch[1].trim();
      }

      // Try to find JSON object in the response
      const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        jsonStr = jsonObjectMatch[0];
      }

      remediesData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.warn('  ⚠️ Could not parse AI response as JSON, using fallback structure');
      console.warn('  Raw content:', content);

      // Fallback: construct a reasonable response from raw text
      remediesData = {
        cause: `These symptoms (${symptomList}) may have various causes. Please consult a doctor for accurate diagnosis.`,
        remedies: [
          'Stay well hydrated — drink plenty of water',
          'Get adequate rest and sleep',
          'Eat light, nutritious meals',
          'Avoid stress and practice relaxation',
        ],
        warning: [
          'Symptoms worsen or persist beyond 48 hours',
          'High fever above 103°F (39.4°C)',
          'Difficulty breathing or chest pain',
        ],
      };
    }

    // Validate and sanitize the response structure
    const result = {
      cause: typeof remediesData.cause === 'string'
        ? remediesData.cause
        : `These symptoms may have various causes. Consult a doctor for proper diagnosis.`,
      remedies: Array.isArray(remediesData.remedies)
        ? remediesData.remedies.filter(r => typeof r === 'string').slice(0, 8)
        : ['Stay hydrated', 'Get proper rest', 'Eat light meals'],
      warning: Array.isArray(remediesData.warning)
        ? remediesData.warning.filter(w => typeof w === 'string').slice(0, 6)
        : ['Symptoms persist or worsen', 'High fever', 'Difficulty breathing'],
    };

    console.log(`  ✅ Home remedies generated: ${result.remedies.length} remedies, ${result.warning.length} warnings`);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Home remedies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate home remedies. Please try again.',
    });
  }
};

module.exports = { getHomeRemedies };
