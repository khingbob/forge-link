import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are the ForgeLink Strategic Scout. Translate a manufacturing manager's scouting intent into a JSON payload for the Apollo.io /v1/organizations/search endpoint.

Rules:
1. Startup Filter: Always set organization_num_employees_ranges to ["1,10", "11,20", "21,50"].
2. Keyword Tags: Derive 3-6 specific, searchable industrial/tech tags from the description and industry. Put them in q_organization_keyword_tags.
3. Location: Map the location field to the organization_locations array (e.g. "Germany" → ["Germany"], "DACH" → ["Germany", "Austria", "Switzerland"]). If worldwide, omit organization_locations.
4. Per page: Set per_page to the numberOfResults value provided (max 25).
5. Set page to 1.
6. Output ONLY a valid JSON object with exactly two keys: "apollo_payload" and "reasoning_trace".
7. reasoning_trace must be an array of 4-5 step objects, each with: { "id": "step-N", "step": N, "title": "string", "body": "string" }. The body should explain the actual reasoning used to build the Apollo query.

Example output:
{
  "apollo_payload": {
    "q_organization_keyword_tags": ["hydraulic sensors", "industrial IoT", "pressure sensing"],
    "organization_locations": ["Germany", "Austria"],
    "organization_num_employees_ranges": ["1,10", "11,20", "21,50"],
    "per_page": 10,
    "page": 1
  },
  "reasoning_trace": [
    { "id": "step-1", "step": 1, "title": "Parameter Extraction", "body": "Extracted key terms..." },
    { "id": "step-2", "step": 2, "title": "Keyword Mapping", "body": "Mapped to Apollo tags..." }
  ]
}`;

interface ApolloOrganization {
  id: string;
  name: string;
  website_url?: string;
  primary_domain?: string;
  industry?: string;
  estimated_num_employees?: number;
  short_description?: string;
  description?: string;
  keywords?: string[];
  country?: string;
  city?: string;
}

app.post('/api/scout', async (req, res) => {
  try {
    const { description, industry, location, numberOfResults, collaborationType } = req.body as {
      description: string;
      industry: string;
      location: string;
      numberOfResults: number;
      collaborationType: string;
    };

    const userQuery = `
Search description: ${description}
Industry focus: ${industry}
Location: ${location}
Number of results requested: ${Math.min(numberOfResults, 25)}
Collaboration type: ${collaborationType}
    `.trim();

    console.log('[Scout] Calling OpenAI for Apollo payload…');

    // Step 1: OpenAI translates intent → Apollo query
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Manager Query:\n${userQuery}` },
      ],
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0].message.content ?? '{}';
    const aiOutput = JSON.parse(rawContent) as {
      apollo_payload: Record<string, unknown>;
      reasoning_trace: Array<{ id: string; step: number; title: string; body: string }>;
    };

    const { apollo_payload, reasoning_trace } = aiOutput;
    console.log('[Scout] Apollo payload:', JSON.stringify(apollo_payload, null, 2));

    // Step 2: Call Apollo
    const apolloRes = await fetch('https://api.apollo.io/v1/organizations/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.APOLLO_API_KEY ?? '',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(apollo_payload),
    });

    if (!apolloRes.ok) {
      const text = await apolloRes.text();
      console.error('[Scout] Apollo error:', apolloRes.status, text);
      throw new Error(`Apollo responded with ${apolloRes.status}`);
    }

    const apolloData = (await apolloRes.json()) as { organizations?: ApolloOrganization[] };
    const orgs: ApolloOrganization[] = (apolloData.organizations ?? []).slice(0, numberOfResults);

    console.log(`[Scout] Apollo returned ${orgs.length} organizations`);

    // Step 3: Map to our SearchResult shape
    const results = orgs.map((org, i) => {
      const domain = org.primary_domain || extractDomain(org.website_url);
      const keywordStr = (org.keywords ?? []).slice(0, 4).join(', ');
      const empCount = org.estimated_num_employees
        ? `${org.estimated_num_employees} employees.`
        : '';

      return {
        id: `result-live-${i}`,
        companyName: org.name,
        description:
          org.short_description ||
          org.description ||
          `${org.name} operates in the ${org.industry ?? industry} sector.`,
        fitExplanation:
          `Industry: ${org.industry ?? industry}. ${empCount} ${keywordStr ? `Keywords: ${keywordStr}.` : ''} ` +
          `Located in ${[org.city, org.country].filter(Boolean).join(', ') || location}. ` +
          `Matched via Apollo search for "${industry}" in ${location}.`,
        industry: org.industry ?? industry,
        website: domain,
        contact: 'example@gmail.com',
        status: 'pending' as const,
        agreedCallDate: null,
      };
    });

    res.json({ results, reasoningTrace: reasoning_trace, appliedFilters: apollo_payload });
  } catch (err) {
    console.error('[Scout] Error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Scout failed' });
  }
});

function extractDomain(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`[ForgeLink server] running on http://localhost:${PORT}`));
