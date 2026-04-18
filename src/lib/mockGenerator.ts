import { SearchResult, ReasoningStep } from '../types';

const COMPANY_POOL = [
  {
    companyName: 'VisionCore AI',
    description: 'AI-powered visual inspection systems for industrial production lines, detecting surface defects with sub-millimetre precision.',
    industry: 'Manufacturing AI',
    website: 'visioncore.ai',
    contact: 'partners@visioncore.ai',
    fitNote: 'Computer vision platform directly applicable to quality inspection requirements. Real-time detection latency under 50ms.',
  },
  {
    companyName: 'InspectBot GmbH',
    description: 'Robotic inspection systems for automated quality control in automotive and heavy machinery manufacturing.',
    industry: 'Robotics & Automation',
    website: 'inspectbot.de',
    contact: 'b2b@inspectbot.de',
    fitNote: 'Robotic arm integration with existing production lines demonstrated in 3 automotive plants. Modular system adaptable to new environments.',
  },
  {
    companyName: 'QualityAI Labs',
    description: 'Machine learning platform that learns defect patterns from production data, improving detection accuracy over time without manual reprogramming.',
    industry: 'Manufacturing AI',
    website: 'qualityailabs.com',
    contact: 'enterprise@qualityailabs.com',
    fitNote: 'Self-improving ML model reduces false positive rate by 40% after 30 days of production training. Strong track record in discrete manufacturing.',
  },
  {
    companyName: 'ClearSight Systems',
    description: 'Hyperspectral imaging solutions for detecting hidden material defects and composition variations invisible to standard cameras.',
    industry: 'Quality Inspection',
    website: 'clearsight.io',
    contact: 'sales@clearsight.io',
    fitNote: 'Hyperspectral capability detects subsurface defects — unique capability not available from standard vision systems. Complements existing inspection infrastructure.',
  },
  {
    companyName: 'Pixelio Manufacturing',
    description: 'Industrial 3D scanning and dimensional measurement systems for tight-tolerance component verification.',
    industry: 'Quality Inspection',
    website: 'pixelio.eu',
    contact: 'industrial@pixelio.eu',
    fitNote: 'Dimensional accuracy to ±0.005mm, suitable for hydraulic component tolerance verification. ISO 17025 accredited metrology.',
  },
  {
    companyName: 'Teknoform AG',
    description: 'Swiss precision tooling company integrating sensor feedback into CNC machining for real-time process control.',
    industry: 'Automation & Control',
    website: 'teknoform.ch',
    contact: 'partnerships@teknoform.ch',
    fitNote: 'In-process quality control reduces scrap rate by 25% in documented trials. Direct integration with Fanuc and Siemens CNC controllers.',
  },
  {
    companyName: 'DeepForge Analytics',
    description: 'Industrial analytics platform connecting shop floor OPC-UA data sources to real-time dashboards and predictive models.',
    industry: 'Predictive Maintenance',
    website: 'deepforge.io',
    contact: 'hello@deepforge.io',
    fitNote: 'OPC-UA native integration eliminates custom data pipeline development. Predictive maintenance models pre-trained on 200+ machine types.',
  },
  {
    companyName: 'Lattice Structures Inc.',
    description: 'Metal additive manufacturing company specialising in topology-optimised lightweight structural components for industrial applications.',
    industry: 'Additive Manufacturing',
    website: 'latticestructures.com',
    contact: 'oem@latticestructures.com',
    fitNote: 'Lattice-core components achieve 30% weight reduction while maintaining structural ratings. Design-for-additive-manufacturing service included.',
  },
  {
    companyName: 'FlowDynamics BV',
    description: 'Dutch startup developing smart flow control valves with embedded IoT sensing for hydraulic and pneumatic systems.',
    industry: 'Industrial IoT',
    website: 'flowdynamics.nl',
    contact: 'sales@flowdynamics.nl',
    fitNote: 'Embedded flow sensing directly addresses hydraulic system monitoring requirements. IP67 rated, CAN-bus interface, operating pressure to 450 bar.',
  },
  {
    companyName: 'GreenAlloy Materials',
    description: 'Finnish materials science startup developing bio-derived polymer alloys to replace petroleum-based industrial plastics.',
    industry: 'Green Manufacturing',
    website: 'greenalloy.fi',
    contact: 'partners@greenalloy.fi',
    fitNote: 'Bio-derived alloys meet REACH compliance and reduce Scope 3 emissions in supply chain. Mechanical properties competitive with ABS and PA66.',
  },
  {
    companyName: 'MotionSync Robotics',
    description: 'Collaborative robot platform with force-sensing end effectors designed for assembly tasks in unstructured industrial environments.',
    industry: 'Robotics & Automation',
    website: 'motionsync.de',
    contact: 'enterprise@motionsync.de',
    fitNote: 'Force-controlled assembly reduces fixture cost for complex sub-assemblies. CE marked, ISO 10218 compliant for human-robot collaboration zones.',
  },
  {
    companyName: 'NanoSeal Technologies',
    description: 'Danish startup applying nanotechnology surface coatings to extend the life of dynamic seals in high-pressure hydraulic applications.',
    industry: 'Sealing Technology',
    website: 'nanoseal.dk',
    contact: 'technical@nanoseal.dk',
    fitNote: 'Nano-coating treatment extends seal lifecycle by 2.3× in accelerated fatigue tests at 400 bar. Retrofit-compatible with standard seal geometries.',
  },
  {
    companyName: 'Aerofit Composites',
    description: 'UK startup using out-of-autoclave CFRP manufacturing to reduce composite component lead times from 16 weeks to 4 weeks.',
    industry: 'Composite Materials',
    website: 'aerofitcomposites.co.uk',
    contact: 'industrial@aerofitcomposites.co.uk',
    fitNote: 'OOA process significantly reduces tooling cost and lead time versus traditional autoclave CFRP. Structural performance verified per ASTM D3039.',
  },
  {
    companyName: 'SolidState Energy GmbH',
    description: 'Munich startup developing solid-state energy storage modules for industrial machinery, enabling peak-load buffering and regenerative energy capture.',
    industry: 'Energy Systems',
    website: 'solidstate-energy.de',
    contact: 'b2b@solidstate-energy.de',
    fitNote: 'Regenerative energy capture from hydraulic actuator deceleration cycles offers 15–20% energy efficiency improvement in continuous-duty applications.',
  },
  {
    companyName: 'ChainIQ Supply',
    description: 'Supply chain visibility platform for industrial manufacturers, providing real-time supplier risk scoring and disruption alerts.',
    industry: 'Supply Chain Tech',
    website: 'chainiq.com',
    contact: 'enterprise@chainiq.com',
    fitNote: 'Reduces supply chain disruption impact through 72-hour advance warning on Tier-2 and Tier-3 supplier issues. Integrates with SAP and Oracle ERPs.',
  },
  {
    companyName: 'PrecisionCast GmbH',
    description: 'Austrian investment casting startup using AI-driven process control to achieve consistently tighter tolerances in complex aluminium castings.',
    industry: 'Manufacturing AI',
    website: 'precisioncast.at',
    contact: 'partnerships@precisioncast.at',
    fitNote: 'AI process control reduces dimensional variance by 60% versus manual casting. Capability directly applicable to hydraulic manifold block production.',
  },
  {
    companyName: 'ThermoShield Materials',
    description: 'Belgian startup developing ceramic matrix composite coatings for components operating in extreme thermal environments.',
    industry: 'Advanced Materials',
    website: 'thermoshield.be',
    contact: 'oem@thermoshield.be',
    fitNote: 'CMC coatings extend component life in thermal cycling environments. Operating range −60°C to +1200°C — well beyond hydraulic system requirements, providing significant margin.',
  },
  {
    companyName: 'DataMesh Industrial',
    description: 'IoT connectivity platform enabling legacy industrial machines to communicate with modern MES and ERP systems via plug-in edge gateways.',
    industry: 'Industrial IoT',
    website: 'datamesh.io',
    contact: 'sales@datamesh.io',
    fitNote: 'Retrofit connectivity for older hydraulic control systems without requiring PLC replacement. 15-minute installation, supports OPC-UA, MQTT, and Modbus.',
  },
  {
    companyName: 'Ergon Automation',
    description: 'Swedish startup building AI-driven assembly line balancing software that dynamically adjusts workstation allocations to maximise throughput.',
    industry: 'Automation & Control',
    website: 'ergonautomation.se',
    contact: 'enterprise@ergonautomation.se',
    fitNote: 'Dynamic line balancing demonstrated 12% throughput improvement in discrete manufacturing pilot. SaaS model with low implementation overhead.',
  },
  {
    companyName: 'BioTorque Systems',
    description: 'Portuguese startup developing biologically-inspired actuator designs for soft robotics and compliant mechanical systems.',
    industry: 'Robotics & Automation',
    website: 'biotorque.pt',
    contact: 'info@biotorque.pt',
    fitNote: 'Compliant actuator technology interesting for human-machine collaboration zones but core technology is not yet suitable for high-force hydraulic applications at required pressure ratings.',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMockResults(industry: string, count: number, searchId: string): SearchResult[] {
  const shuffled = shuffle(COMPANY_POOL);
  const selected = shuffled.slice(0, Math.min(count, COMPANY_POOL.length));

  return selected.map((c, i) => ({
    id: `result-${searchId}-${i}`,
    companyName: c.companyName,
    description: c.description,
    fitExplanation: `${c.fitNote} Fit score: ${70 + Math.floor(Math.random() * 25)}%. Identified as a strong candidate for ${industry} partnership based on technical capability and geographic accessibility.`,
    industry: c.industry,
    website: c.website,
    contact: c.contact,
    status: 'pending' as const,
    agreedCallDate: null,
  }));
}

export function generateReasoningTrace(description: string, industry: string): ReasoningStep[] {
  const snippet = description.length > 80 ? description.slice(0, 80) + '…' : description;
  return [
    {
      id: 'step-1',
      step: 1,
      title: 'Parameter Extraction',
      body: `Parsing search parameters: industry scope "${industry}", technical requirements derived from the description: "${snippet}". Establishing scoring rubric — technical capability weighted at 40%, geographic accessibility 20%, team maturity 20%, existing references 20%.`,
    },
    {
      id: 'step-2',
      step: 2,
      title: 'Market Landscape Scan',
      body: `Scanning startup databases (Crunchbase, Dealroom), LinkedIn company search, and industry trade registries. Applied filters: B2B revenue model, verifiable product (not concept stage), headcount 5–250. Initial pool narrowed by removing companies without documented technical implementations.`,
    },
    {
      id: 'step-3',
      step: 3,
      title: 'Technical Fit Scoring',
      body: `Running domain-specific scoring model against shortlisted candidates. Threshold set at 68% — companies below this score are excluded regardless of other signals. Final candidates scored between 71% and 93% on the composite rubric.`,
    },
    {
      id: 'step-4',
      step: 4,
      title: 'Outreach Prioritisation',
      body: `Ranking final candidates by email deliverability signal, LinkedIn activity recency, and company blog/press release engagement. Personalised outreach drafted per company referencing their specific technology and relevant product announcements.`,
    },
    {
      id: 'step-5',
      step: 5,
      title: 'Shortlist Finalised',
      body: `Shortlist compiled and outreach initiated across all candidates. Tracking response status in real time — candidates typically respond within 24–72 hours. Follow-up scheduled automatically at 72-hour intervals. Results will be updated as replies arrive.`,
    },
  ];
}
