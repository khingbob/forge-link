import { Search } from '../types';

export const MOCK_SEARCHES: Search[] = [
  {
    id: 'search-mock-1',
    name: 'Smart Sensor Integration Partners — Q1 2026',
    description:
      'Seeking companies with expertise in IoT sensors, edge computing, and vibration/pressure sensing for integration into hydraulic systems. Target partners should have proven deployments in harsh industrial environments.',
    industry: 'Electronics / Sensors',
    location: 'Germany, Austria, Switzerland',
    numberOfResults: 7,
    collaborationType: 'both',
    status: 'active',
    createdAt: '2026-03-01T09:00:00.000Z',
    reasoningTrace: [
      {
        id: 'rt-1-1',
        step: 1,
        title: 'Parameter Extraction',
        body: 'Parsing search parameters: target industry "Electronics / Sensors", geography restricted to DACH region. Key technical requirements extracted: pressure sensing ≥ 400 bar, IP67 minimum enclosure rating, CAN-bus or IO-Link compatible interfaces, temperature range −40°C to +85°C. Establishing scoring rubric weighted toward hardware capability (40%) over analytics (20%).',
      },
      {
        id: 'rt-1-2',
        step: 2,
        title: 'Market Landscape Scan',
        body: 'Scanning startup databases (Crunchbase, Dealroom), LinkedIn company search, and German Mittelstand registries. Applied filters: founded 2015–2024, headcount 5–200, B2B revenue model, verifiable product (not concept stage). Initial pool: 312 companies. Removed 241 with insufficient technical documentation or consumer focus.',
      },
      {
        id: 'rt-1-3',
        step: 3,
        title: 'Technical Fit Scoring',
        body: 'Running domain-specific scoring model against 71 shortlisted candidates. Scoring dimensions: technical capability (40%), geographic accessibility (20%), team maturity (20%), existing OEM references (20%). Threshold set at 68%. 7 companies cleared threshold with scores between 71% and 89%.',
      },
      {
        id: 'rt-1-4',
        step: 4,
        title: 'Outreach Prioritization',
        body: 'Ranking final 7 by email deliverability signal and LinkedIn activity recency. Personalised outreach drafted per company using publicly available product announcements and recent press releases. Templates adapted to avoid boilerplate triggers in corporate spam filters.',
      },
      {
        id: 'rt-1-5',
        step: 5,
        title: 'Final Shortlist Compiled',
        body: 'Shortlist of 7 candidates finalized and outreach initiated. Two companies (SensaTech GmbH and VibrosenseEU) responded within 48 hours and calls have been scheduled. Remaining 5 candidates in active follow-up pipeline with 72-hour response window before escalation attempt.',
      },
    ],
    results: [
      {
        id: 'r-1-1',
        companyName: 'SensaTech GmbH',
        description:
          'Berlin-based startup specialising in piezoelectric pressure sensors and custom transducer arrays for harsh industrial environments. Currently supplying Tier-2 automotive OEMs.',
        fitExplanation:
          'Direct product-market fit: pressure sensors rated to 500 bar with CAN-bus interface, IP67 certified, existing automotive supply chain experience highly transferable to hydraulic applications. CEO confirmed interest in expanding to construction equipment sector.',
        industry: 'Industrial Sensors',
        website: 'sensatech.de',
        contact: 'partnerships@sensatech.de',
        status: 'accepted',
        agreedCallDate: '2026-03-15',
      },
      {
        id: 'r-1-2',
        companyName: 'Microedge Systems AG',
        description:
          'Swiss company building edge inference firmware and microcontroller platforms for real-time industrial signal processing. Seed-stage, 12-person team.',
        fitExplanation:
          'Strong edge computing capability with proven onboard inference for vibration anomaly detection. Could run diagnostic models directly within hydraulic actuator housing, eliminating cloud latency. Firmware is sensor-agnostic and could integrate with our existing hardware.',
        industry: 'Edge Computing',
        website: 'microedge.ch',
        contact: 'hello@microedge.ch',
        status: 'pending',
        agreedCallDate: null,
      },
      {
        id: 'r-1-3',
        companyName: 'VibrosenseEU',
        description:
          'Munich startup manufacturing MEMS vibration sensor arrays specifically for rotating and reciprocating machinery. Series A, 28 employees.',
        fitExplanation:
          'Already supplying Tier-1 mining OEMs with vibration arrays for bearing and seal wear detection. Direct analogues to hydraulic cylinder condition monitoring. ISO 9001 certified. Strong reference list available upon request.',
        industry: 'Vibration Sensing',
        website: 'vibrosense.eu',
        contact: 'b2b@vibrosense.eu',
        status: 'accepted',
        agreedCallDate: '2026-03-22',
      },
      {
        id: 'r-1-4',
        companyName: 'DataFluent Austria',
        description:
          'Vienna-based analytics platform specialising in time-series industrial data visualisation and anomaly reporting for factory floors.',
        fitExplanation:
          'Strong analytics stack but no hardware or sensor manufacturing capability. The integration depth required for hydraulic system embedding cannot be met with a software-only partner at this stage. Potential revisit as analytics layer once hardware integration is complete.',
        industry: 'Data Analytics',
        website: 'datafluent.at',
        contact: 'enterprise@datafluent.at',
        status: 'rejected',
        agreedCallDate: null,
      },
      {
        id: 'r-1-5',
        companyName: 'NordSens GmbH',
        description:
          'Hamburg-based industrial sensor company with a focus on temperature and pressure sensing for offshore and energy applications.',
        fitExplanation:
          'Very high technical fit score (84%) with rated components for extreme environments. No response after three contact attempts via email and LinkedIn. Company appears to be in a quiet period potentially due to acquisition talks based on recent LinkedIn changes.',
        industry: 'Industrial Sensors',
        website: 'nordsens.de',
        contact: 'info@nordsens.de',
        status: 'cant_reach',
        agreedCallDate: null,
      },
      {
        id: 'r-1-6',
        companyName: 'Elerion Components',
        description:
          'Dresden-based electronics manufacturer producing custom PCBs with integrated sensor fusion capability for industrial control systems.',
        fitExplanation:
          'Custom PCB capability with sensor fusion MCU could serve as the integration hub within the hydraulic actuator housing. Currently evaluating the minimum order quantities and IP ownership terms before proceeding to technical discussion.',
        industry: 'Electronics Manufacturing',
        website: 'elerion.de',
        contact: 'partnerships@elerion.de',
        status: 'pending',
        agreedCallDate: null,
      },
      {
        id: 'r-1-7',
        companyName: 'SwissEdge Labs',
        description:
          'ETH Zurich spin-off developing embedded AI for predictive maintenance in industrial machinery. Pre-Series A, strong academic publications record.',
        fitExplanation:
          'Research-stage edge AI with promising results in compressor and pump wear prediction — very analogous to hydraulic cylinder fatigue. The team is early but technically exceptional. Worth tracking for a follow-on engagement in 6–12 months when product matures.',
        industry: 'Embedded Systems',
        website: 'swissedge.ch',
        contact: 'contact@swissedge.ch',
        status: 'pending',
        agreedCallDate: null,
      },
    ],
  },
  {
    id: 'search-mock-2',
    name: 'Composite Materials Suppliers — Lightweight Actuator Program',
    description:
      'Looking for suppliers of carbon fibre reinforced polymers and aluminium matrix composites suitable for actuator housings under high cyclic load. Must be able to handle custom geometries and demonstrate certifications for mechanical components.',
    industry: 'Advanced Materials',
    location: 'Europe, North America',
    numberOfResults: 5,
    collaborationType: 'offline',
    status: 'active',
    createdAt: '2026-03-18T14:00:00.000Z',
    reasoningTrace: [
      {
        id: 'rt-2-1',
        step: 1,
        title: 'Spec Decomposition',
        body: 'Translating actuator housing specification into material fatigue requirements: 10⁷ cyclic load cycles at 50 kN axial force, operating temperature −20°C to +80°C, density target ≤ 2.1 g/cm³ (35% weight reduction vs steel). Identified CFRP and AMC as primary candidate material families. Secondary requirement: custom moulding or machining capability for non-standard geometries.',
      },
      {
        id: 'rt-2-2',
        step: 2,
        title: 'Supplier Database Scan',
        body: 'Cross-referencing aerospace and automotive composite suppliers with capacity to adapt to hydraulic/industrial applications. Sourced from EU supply chain directories, SAMPE Europe members list, and Composites World vendor database. Initial pool of 48 companies filtered by ISO 9001 or IATF 16949 certification status.',
      },
      {
        id: 'rt-2-3',
        step: 3,
        title: 'Certification and Capacity Check',
        body: 'Filtering for: ISO 9001 (mandatory), IATF 16949 or EN 9100 preferred, minimum annual composite output > 10 tonnes, documented fatigue test protocols. 18 of 48 companies cleared certification filter. Further refined to 5 based on geographic logistics feasibility and willingness to engage with prototype runs (< 500 units).',
      },
      {
        id: 'rt-2-4',
        step: 4,
        title: 'Geographic Feasibility',
        body: 'Modelling logistics cost and lead time for transatlantic supply chain versus EU-local sourcing. EU-local suppliers preferred for prototyping phase (< 5 days delivery, lower MOQ flexibility). US suppliers retained as secondary options for volume production once design is frozen.',
      },
    ],
    results: [
      {
        id: 'r-2-1',
        companyName: 'CarbonFlex Industries',
        description:
          'French manufacturer of CFRP structural components for aerospace and industrial applications. ISO 9001 and EN 9100 certified. 80-person team, Series B.',
        fitExplanation:
          'CFRP panels rated for 10⁷ fatigue cycles with custom layup capability. Aerospace-grade quality control directly applicable to high-reliability industrial use. CTO confirmed interest in diversifying into heavy machinery sector. Logistics: Lyon facility, 3 days to Munich.',
        industry: 'Composite Manufacturing',
        website: 'carbonflex.fr',
        contact: 'industrial@carbonflex.fr',
        status: 'accepted',
        agreedCallDate: '2026-04-02',
      },
      {
        id: 'r-2-2',
        companyName: 'AlloMatrix Corp',
        description:
          'Canadian startup producing aluminium matrix composite billets for automotive and industrial tooling. Pre-Series A, 20-person team in Montreal.',
        fitExplanation:
          'AMC billet production with documented fatigue performance matching spec requirements. Currently evaluating minimum order quantities (MOQ) — preliminary discussion suggests 50-unit prototype batches are feasible. Transatlantic logistics adds 8–10 days lead time.',
        industry: 'Aluminum Matrix Composites',
        website: 'allomatrix.ca',
        contact: 'partners@allomatrix.ca',
        status: 'pending',
        agreedCallDate: null,
      },
      {
        id: 'r-2-3',
        companyName: 'PolyForge Europe',
        description:
          'Dutch polymer engineering company specialising in high-performance thermoplastic components for automotive and consumer goods.',
        fitExplanation:
          'Polymer-only product line without fibre reinforcement capability. Structural rating insufficient for 50 kN cyclic load application. Excluded from shortlist as material properties do not meet the minimum tensile and fatigue specifications for actuator housing use.',
        industry: 'Polymer Engineering',
        website: 'polyforge.nl',
        contact: 'b2b@polyforge.nl',
        status: 'rejected',
        agreedCallDate: null,
      },
      {
        id: 'r-2-4',
        companyName: 'StructureTec GmbH',
        description:
          'Stuttgart startup manufacturing hybrid CFRP-aluminium sandwich panels for lightweight automotive body structures. Seed stage, 15 employees.',
        fitExplanation:
          'Hybrid sandwich panel approach could be adapted to actuator housing geometry. Currently automotive-focused but expressed interest in industrial diversification. Technical fit is high; commercial terms and tooling investment still under discussion.',
        industry: 'Advanced Materials',
        website: 'structuretec.de',
        contact: 'info@structuretec.de',
        status: 'pending',
        agreedCallDate: null,
      },
      {
        id: 'r-2-5',
        companyName: 'Apex Composites NA',
        description:
          'US aerospace composite manufacturer with strong fatigue testing infrastructure and AS9100D certification. 200-person facility in Wichita, Kansas.',
        fitExplanation:
          'Extremely strong technical and quality profile — highest fit score in this search (91%). US-only manufacturing creates transatlantic logistics complexity and higher unit cost for prototype phase. Worth engaging as a volume production partner once design is finalised in 2027.',
        industry: 'Aerospace Composites',
        website: 'apexcomposites.com',
        contact: 'industrial-sales@apexcomposites.com',
        status: 'cant_reach',
        agreedCallDate: null,
      },
    ],
  },
  {
    id: 'search-mock-3',
    name: 'Hydraulic Seal Technology Review — 2025',
    description:
      'Completed scout for next-generation dynamic seal suppliers for high-pressure hydraulic cylinders operating at 400 bar continuous. Partnership decision made; two suppliers selected for prototype programme.',
    industry: 'Sealing Technology',
    location: 'Europe',
    numberOfResults: 4,
    collaborationType: 'both',
    status: 'finished',
    createdAt: '2025-10-15T10:00:00.000Z',
    reasoningTrace: [
      {
        id: 'rt-3-1',
        step: 1,
        title: 'Requirements Analysis',
        body: 'Specification: dynamic seal for hydraulic cylinder rod, operating pressure 400 bar continuous / 480 bar peak, rod diameter 60–120 mm, temperature range −40°C to +120°C, expected seal life > 5,000 operating hours. Material requirements: PTFE-lined or polyurethane, compatible with mineral oil HLP 46.',
      },
      {
        id: 'rt-3-2',
        step: 2,
        title: 'Supplier Identification',
        body: 'Searched European Fluid Power Association (CETOP) member directory, sealing technology trade publications, and Hamburg Messe FLUID exhibitor lists. Filtered for companies with documented hydraulic OEM references and seal geometry customisation capability. Pool of 22 companies reduced to 8 after pressure rating filter (must exceed 400 bar).',
      },
      {
        id: 'rt-3-3',
        step: 3,
        title: 'Technical Validation',
        body: 'Requested technical datasheets from 8 shortlisted suppliers. Validated pressure ratings, material compatibility with HLP 46, and lifecycle test documentation. 4 companies provided complete documentation within 5 business days. 4 disqualified due to insufficient rating or static-seal-only product lines.',
      },
      {
        id: 'rt-3-4',
        step: 4,
        title: 'Partnership Recommendation',
        body: 'Top two candidates (HydroSeal GmbH and SealPro Europe) selected for prototype seal programme. Contracts signed. Two suppliers declined due to spec mismatch. Prototype delivery expected Q1 2026. Search formally closed and marked as finished.',
      },
    ],
    results: [
      {
        id: 'r-3-1',
        companyName: 'HydroSeal GmbH',
        description:
          'Nuremberg-based sealing specialist with 30 years experience in dynamic hydraulic seals for heavy machinery. ISO 9001, certified hydraulic seal manufacturer per DIN ISO 6195.',
        fitExplanation:
          'PTFE-lined dynamic seals rated to 450 bar, with documented 6,000-hour lifecycle in mining hydraulic cylinders. Existing OEM relationships with two major construction equipment manufacturers. Fastest response time (< 24h) and most complete technical documentation in the search.',
        industry: 'Sealing Technology',
        website: 'hydroseal.de',
        contact: 'oem@hydroseal.de',
        status: 'accepted',
        agreedCallDate: '2025-11-10',
      },
      {
        id: 'r-3-2',
        companyName: 'SealPro Europe',
        description:
          'Italian manufacturer of custom hydraulic seals with rapid prototyping capability. Specialises in non-standard geometries for demanding applications.',
        fitExplanation:
          'Custom seal geometry capability is critical for non-standard rod diameters in the next-generation cylinder design. CE certified, rapid prototyping turnaround of 15 business days. Slightly lower pressure rating (420 bar) but confirmed acceptable given our operating profile.',
        industry: 'Industrial Sealing',
        website: 'sealpro.eu',
        contact: 'custom@sealpro.eu',
        status: 'accepted',
        agreedCallDate: '2025-11-18',
      },
      {
        id: 'r-3-3',
        companyName: 'FlexRing Technologies',
        description:
          'Czech Republic startup manufacturing elastomeric sealing rings for static applications in pneumatic and low-pressure hydraulic systems.',
        fitExplanation:
          'Product line limited to static seals only. Dynamic seal capability (rod sealing under reciprocating motion) is absent from the catalogue. The operating pressure range of 0–150 bar is far below the 400 bar specification. Disqualified at technical validation stage.',
        industry: 'Sealing',
        website: 'flexring.cz',
        contact: 'sales@flexring.cz',
        status: 'rejected',
        agreedCallDate: null,
      },
      {
        id: 'r-3-4',
        companyName: 'NovaSeal Iberia',
        description:
          'Spanish gasket and seal manufacturer serving the automotive and food processing industries. Price-competitive with fast delivery from Valencia warehouse.',
        fitExplanation:
          'Competitive pricing and good logistics, but maximum pressure rating of 250 bar is significantly below the 400 bar specification. No documentation for dynamic rod seal applications provided. Disqualified due to fundamental specification mismatch.',
        industry: 'Gasket Manufacturing',
        website: 'novaseal.es',
        contact: 'industrial@novaseal.es',
        status: 'rejected',
        agreedCallDate: null,
      },
    ],
  },
];
