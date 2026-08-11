const companiesData = [
  {
    id: 'tcs',
    name: 'TCS',
    fullName: 'Tata Consultancy Services',
    logo: '🏢',
    overview: 'TCS is India\'s largest IT services company, hiring thousands of engineering graduates through NQT (National Qualifier Test).',
    eligibility: '60% or 6.0 CGPA throughout 10th, 12th, and B.Tech. Max 1 active backlog allowed at test time.',
    selectionProcess: [
      'Phase 1: TCS NQT Online Test (Numerical, Verbal, Reasoning, Coding)',
      'Phase 2: Technical Interview',
      'Phase 3: Managerial & HR Interview'
    ],
    aptitudePattern: 'Numerical Ability (20 Qs / 40 mins), Verbal Ability (25 Qs / 30 mins), Reasoning Ability (20 Qs / 50 mins).',
    technicalTopics: ['C / C++ Basics', 'SQL & DBMS Queries', 'Data Structures (Arrays, Strings, Linked Lists)', 'OOP Concepts'],
    codingPattern: '2 Questions in 45 mins. (1 Easy logic problem, 1 Array/String matrix problem).',
    hrTopics: ['Tell me about yourself', 'Why TCS?', 'Willingness to relocate & work in shifts', 'Project deep dive'],
    tips: [
      'Practice TCS NQT past year questions for Quantitative Aptitude.',
      'Maintain clear speed & accuracy as negative marking may apply.',
      'Ensure strong understanding of your final year project.'
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys',
    fullName: 'Infosys Limited',
    logo: '🌐',
    overview: 'Global leader in next-generation digital services and consulting, offering Specialist Programmer (SP) and Systems Engineer (SE) roles.',
    eligibility: '60% throughout academics (10th, 12th, UG). No active backlogs allowed.',
    selectionProcess: [
      'Infosys Online Assessment (Aptitude + Pseudocode + Puzzle Solving)',
      'Technical + HR Combined Interview'
    ],
    aptitudePattern: 'Mathematical Ability (15 Qs), Reasoning Ability (15 Qs), Verbal Ability (40 Qs), Pseudocode (5 Qs), Puzzle Solving (4 Qs).',
    technicalTopics: ['Pseudocode Tracing', 'Pointers & Memory Allocation', 'DBMS Normalization & SQL Queries', 'Python / Java Syntax'],
    codingPattern: 'For HackWithInfy / SP roles: 3 Competitive Programming questions in 3 hours.',
    hrTopics: ['Strengths and Weaknesses', 'Relocation willingness', 'Handling project challenges'],
    tips: [
      'Pseudocode section is key for cutoff clearing.',
      'Puzzles section requires strong analytical reasoning.',
      'Be clear on basic programming logic.'
    ]
  },
  {
    id: 'wipro',
    name: 'Wipro',
    fullName: 'Wipro Limited',
    logo: '⚡',
    overview: 'Leading global information technology, consulting, and business process services company hiring through Elite NLTH.',
    eligibility: '60% or 6.0 CGPA in 10th, 12th, and Graduation.',
    selectionProcess: ['Online Test (Aptitude + Written English + Coding)', 'Technical Interview', 'HR Interview'],
    aptitudePattern: 'Logical (14 Qs), Quantitative (16 Qs), English (22 Qs).',
    technicalTopics: ['C Programming', 'Data Structures', 'Operating System Basics', 'Networking Fundamentals'],
    codingPattern: '2 Coding questions (Hands-on programming in C, C++, Java, or Python).',
    hrTopics: ['Tell me about a time you failed', 'Why Wipro?', 'Night shift flexibility'],
    tips: ['Essay writing section tests basic grammar and vocabulary clarity. Keep paragraphs well-structured.']
  },
  {
    id: 'accenture',
    name: 'Accenture',
    fullName: 'Accenture Innovation',
    logo: '🚀',
    overview: 'Multinational professional services company hiring Advanced Application Engineering Associate and Associate Software Engineer.',
    eligibility: '65% or 6.5 CGPA in B.Tech / BE. No backlogs at onboarding.',
    selectionProcess: [
      'Stage 1: Cognitive & Technical Assessment',
      'Stage 2: Coding Assessment (2 Qs / 45 mins)',
      'Stage 3: Communication Assessment (Automated Voice Test)',
      'Stage 4: Virtual Interview'
    ],
    aptitudePattern: 'Critical Reasoning, Problem Solving, Abstract Reasoning, English Ability, Common Tech Modules.',
    technicalTopics: ['Cloud Fundamentals', 'Network Security', 'MS Office & Tech Trivia', 'Pseudocode Tracing'],
    codingPattern: '2 Coding problems focusing on strings, loops, and basic logic.',
    hrTopics: ['Situational questions', 'Teamwork scenarios', 'Adaptability to changing tech stacks'],
    tips: ['Communication assessment tests pronunciation, listening comprehension, and fluency. Speak clearly into mic.']
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    fullName: 'Cognizant Technology Solutions',
    logo: '💡',
    overview: 'American multinational hiring GenC, GenC Elevate, and GenC Next software engineers.',
    eligibility: '60% throughout academics with max 2 years education gap.',
    selectionProcess: ['Aptitude & Communication Test', 'Technical Skill Assessment / Coding', 'Technical & HR Interview'],
    aptitudePattern: 'Quantitative, Logical, Verbal, and Automata Fix / Debugging rounds.',
    technicalTopics: ['C/Java Debugging', 'Data Structures', 'SQL Joins & Indexing', 'Web Basics'],
    codingPattern: 'GenC Elevate requires 2 hands-on coding problems + SQL queries.',
    hrTopics: ['Personal goals', 'Role preference', 'Relocation and service agreement terms'],
    tips: ['Automata Fix tests your ability to spot syntax & logical bugs quickly.']
  },
  {
    id: 'zoho',
    name: 'Zoho',
    fullName: 'Zoho Corporation',
    logo: '⚙️',
    overview: 'Famous product-based company known for rigorous hands-on programming and system design rounds without CGPA bar.',
    eligibility: 'Open to all degrees & branches. Skill-based selection.',
    selectionProcess: [
      'Round 1: Written Aptitude & C/C++ Output Tracing (15 Qs Aptitude + 10 Qs C Output)',
      'Round 2: Basic Programming (5 Coding Questions)',
      'Round 3: Advanced Programming / Module Design (e.g. Railway Reservation, Taxi Booking App)',
      'Round 4: Technical HR',
      'Round 5: General HR'
    ],
    aptitudePattern: 'High difficulty Aptitude (Ages, Work, Probability, Mixtures) + Tracing pointers, nested loops, recursions in C.',
    technicalTopics: ['Recursion', 'Pointers & Dynamic Memory', 'OOP System Design', 'Data Structure Implementation from Scratch'],
    codingPattern: 'Round 3 requires designing an object-oriented system with full console I/O in 3 hours.',
    hrTopics: ['Why product company over service company?', 'Deep discussion on your core problem-solving mindset'],
    tips: ['Do not use built-in STL / libraries in Round 2 & 3 unless permitted. Implement custom data structures.']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    fullName: 'Amazon Development Centre',
    logo: '📦',
    overview: 'Global tech giant hiring Software Development Engineers (SDE-1) through Campus Off-Campus drives.',
    eligibility: '7.0+ CGPA preferred. Strong command over Data Structures & Algorithms.',
    selectionProcess: [
      'Online Assessment: Debugging (7 Qs) + Coding (2 Qs) + Work Style Survey',
      'Technical Round 1: Data Structures & Algorithms',
      'Technical Round 2: Advanced Data Structures & System Design',
      'Bar Raiser Round: Leadership Principles & High Level Design'
    ],
    aptitudePattern: 'Focus is heavily on Data Structures, Problem Solving, and Amazon Leadership Principles.',
    technicalTopics: ['Trees & Graphs', 'Dynamic Programming', 'Tries & Heaps', 'System Scalability & OOD'],
    codingPattern: '2 Hard / Medium LeetCode problems (e.g. Binary Tree Traversals, Graph Shortest Path, Sliding Window).',
    hrTopics: ['Amazon 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, Earn Trust)'],
    tips: ['For every answer, map your experience directly to an Amazon Leadership Principle using the STAR method.']
  }
];

const getCompanies = (req, res) => {
  res.status(200).json({ success: true, companies: companiesData });
};

const getCompanyById = (req, res) => {
  const company = companiesData.find(c => c.id.toLowerCase() === req.params.id.toLowerCase());
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company profile not found' });
  }
  res.status(200).json({ success: true, company });
};

module.exports = { getCompanies, getCompanyById };
