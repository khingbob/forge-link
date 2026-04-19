import express from "express";
import cors from "cors";
import OpenAI from "openai";
import * as dotenv from "dotenv";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRACKING_FILE = path.join(__dirname, "outreach-tracking.json");
const CALL_RESULTS_FILE = path.join(__dirname, "call-results.json");
const CALL_WEBHOOK_URL = "https://workflows.platform.eu.happyrobot.ai/hooks/paa3bqir9y8u";

// ── Outreach tracking helpers ─────────────────────────────────────────────────

interface OutreachRecord {
  id: string;
  startupName: string;
  emailContext: string;
  outreachedAt: string; // ISO date
  callTriggered: boolean;
}

function readTracking(): OutreachRecord[] {
  try {
    if (!fs.existsSync(TRACKING_FILE)) return [];
    return JSON.parse(fs.readFileSync(TRACKING_FILE, "utf-8")) as OutreachRecord[];
  } catch {
    return [];
  }
}

function writeTracking(records: OutreachRecord[]): void {
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(records, null, 2));
}

// ── Call results (HappyRobot callback storage) ────────────────────────────────

interface CallResult {
  id: string;
  startupName: string;
  classification: string;
  receivedAt: string;
  processed: boolean;
}

function readCallResults(): CallResult[] {
  try {
    if (!fs.existsSync(CALL_RESULTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(CALL_RESULTS_FILE, "utf-8")) as CallResult[];
  } catch {
    return [];
  }
}

function writeCallResults(records: CallResult[]): void {
  fs.writeFileSync(CALL_RESULTS_FILE, JSON.stringify(records, null, 2));
}

async function runFollowUpCheck() {
  const records = readTracking();
  const now = new Date();
  const updated = [...records];
  let triggered = 0;

  for (let i = 0; i < updated.length; i++) {
    const record = updated[i];
    if (record.callTriggered) continue;

    const daysSince =
      (now.getTime() - new Date(record.outreachedAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSince >= 14) {
      try {
        const res = await fetch(CALL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startup_name: record.startupName,
            email_context: record.emailContext,
          }),
        });
        if (res.ok) {
          updated[i] = { ...record, callTriggered: true };
          triggered++;
          console.log(`[Cron] Call triggered for ${record.startupName}`);
        } else {
          console.error(
            `[Cron] Webhook error for ${record.startupName}: ${res.status}`
          );
        }
      } catch (err) {
        console.error(
          `[Cron] Failed to trigger call for ${record.startupName}:`,
          err
        );
      }
    }
  }

  writeTracking(updated);
  console.log(
    `[Cron] Follow-up check done — ${triggered} call(s) triggered, ${records.filter((r) => !r.callTriggered).length} pending`
  );
}

// Run every day at 09:00
cron.schedule("0 9 * * *", () => {
  console.log("[Cron] Daily follow-up check starting…");
  runFollowUpCheck().catch((err) =>
    console.error("[Cron] Unexpected error:", err)
  );
});

console.log("[Cron] Daily follow-up scheduler registered (runs at 09:00)");

// ── Express setup ─────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  if (req.path === "/client-response") {
    return cors({ origin: "*" })(req, res, next);
  }
  return cors({ origin: "http://localhost:5173" })(req, res, next);
});

app.all("/client-response", (req, res) => {
  const snapshot = {
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body,
  };
  console.log("[client-response] received:", JSON.stringify(snapshot, null, 2));
  res.status(200).json({ ok: true });
});

// ── HappyRobot callback ───────────────────────────────────────────────────────
// HappyRobot POSTs here after each call. Open CORS — external caller.

app.post("/happyrobot-callback", cors({ origin: "*" }), (req, res) => {
  const { classification } = req.body as { classification?: string };
  console.log("[HappyRobot] Callback received:", req.body);

  // Identify the startup: use startup_name if provided, else last triggered call
  const startupName: string =
    (req.body as { startup_name?: string }).startup_name ??
    (() => {
      const records = readTracking();
      return records.filter((r) => r.callTriggered).pop()?.startupName ?? "Unknown";
    })();

  const result: CallResult = {
    id: `call-${Date.now()}`,
    startupName,
    classification: classification ?? "Unknown",
    receivedAt: new Date().toISOString(),
    processed: false,
  };

  const results = readCallResults();
  results.push(result);
  writeCallResults(results);

  console.log(`[HappyRobot] Stored result for "${startupName}": ${classification}`);
  res.json({ ok: true });
});

// ── Call results polling (client) ─────────────────────────────────────────────

app.get("/api/call-results", (req, res) => {
  const unprocessed = readCallResults().filter((r) => !r.processed);
  res.json({ results: unprocessed });
});

app.post("/api/call-results/:id/mark-processed", (req, res) => {
  const records = readCallResults();
  const updated = records.map((r) =>
    r.id === req.params.id ? { ...r, processed: true } : r
  );
  writeCallResults(updated);
  res.json({ ok: true });
});

// ── Track outreach ────────────────────────────────────────────────────────────

app.post("/api/track-outreach", (req, res) => {
  const { startupName, emailContext } = req.body as {
    startupName: string;
    emailContext: string;
  };

  if (!startupName) {
    res.status(400).json({ error: "startupName is required" });
    return;
  }

  const records = readTracking();
  const newRecord: OutreachRecord = {
    id: `outreach-${Date.now()}`,
    startupName,
    emailContext,
    outreachedAt: new Date().toISOString(),
    callTriggered: false,
  };
  records.push(newRecord);
  writeTracking(records);

  console.log(
    `[Track] Outreach recorded for "${startupName}" — call will trigger in 14 days if no reply`
  );
  res.json({ ok: true });
});

// ── Scout ─────────────────────────────────────────────────────────────────────

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

app.post("/api/scout", async (req, res) => {
  try {
    const {
      description,
      industry,
      location,
      numberOfResults,
      collaborationType,
    } = req.body as {
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

    console.log("[Scout] Calling OpenAI for Apollo payload…");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Manager Query:\n${userQuery}` },
      ],
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0].message.content ?? "{}";
    const aiOutput = JSON.parse(rawContent) as {
      apollo_payload: Record<string, unknown>;
      reasoning_trace: Array<{
        id: string;
        step: number;
        title: string;
        body: string;
      }>;
    };

    const { apollo_payload, reasoning_trace } = aiOutput;
    console.log("[Scout] Apollo payload:", JSON.stringify(apollo_payload, null, 2));

    const apolloRes = await fetch(
      "https://api.apollo.io/v1/organizations/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.APOLLO_API_KEY ?? "",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(apollo_payload),
      }
    );

    if (!apolloRes.ok) {
      const text = await apolloRes.text();
      console.error("[Scout] Apollo error:", apolloRes.status, text);
      throw new Error(`Apollo responded with ${apolloRes.status}`);
    }

    const apolloData = (await apolloRes.json()) as {
      organizations?: ApolloOrganization[];
    };
    const orgs: ApolloOrganization[] = (apolloData.organizations ?? []).slice(
      0,
      numberOfResults
    );

    console.log(`[Scout] Apollo returned ${orgs.length} organizations`);

    const results = orgs.map((org, i) => {
      const domain = org.primary_domain || extractDomain(org.website_url);
      const keywordStr = (org.keywords ?? []).slice(0, 4).join(", ");
      const empCount = org.estimated_num_employees
        ? `${org.estimated_num_employees} employees.`
        : "";

      return {
        id: `result-live-${i}`,
        companyName: org.name,
        description:
          org.short_description ||
          org.description ||
          `${org.name} operates in the ${org.industry ?? industry} sector.`,
        fitExplanation:
          `Industry: ${org.industry ?? industry}. ${empCount} ${keywordStr ? `Keywords: ${keywordStr}.` : ""}` +
          ` Located in ${[org.city, org.country].filter(Boolean).join(", ") || location}.` +
          ` Matched via Apollo search for "${industry}" in ${location}.`,
        industry: org.industry ?? industry,
        website: domain,
        contact: "example@gmail.com",
        status: "pending" as const,
        agreedCallDate: null,
      };
    });

    res.json({
      results,
      reasoningTrace: reasoning_trace,
      appliedFilters: apollo_payload,
    });
  } catch (err) {
    console.error("[Scout] Error:", err);
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "Scout failed" });
  }
});

function extractDomain(url?: string): string {
  if (!url) return "";
  try {
    return new URL(
      url.startsWith("http") ? url : `https://${url}`
    ).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () =>
  console.log(`[ForgeLink server] running on http://localhost:${PORT}`)
);
