const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');
const Question = require('../models/Question');
const CodingQuestion = require('../models/CodingQuestion');

const sampleMaterials = [
  // Quantitative Aptitude: Percentages
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    title: 'Mastering Percentages & Ratio Conversions',
    introduction: 'Percentage means "per hundred" or parts per 100. It is a fundamental quantitative topic widely tested in campus placement aptitude rounds.',
    concepts: [
      'Concept 1: Converting fraction to percentage by multiplying by 100.',
      'Concept 2: Percentage Increase = [(New Value - Old Value) / Old Value] * 100.',
      'Concept 3: Percentage Decrease = [(Old Value - New Value) / Old Value] * 100.',
      'Concept 4: Successive Percentage Change = A + B + (AB / 100).'
    ],
    formulas: [
      { name: 'Percentage Value', formula: '% = (Part / Whole) * 100', description: 'Calculates the percentage fraction of a total quantity.' },
      { name: 'Successive Change', formula: 'Net % = A + B + (A*B)/100', description: 'Used when a quantity undergoes two consecutive percentage changes.' },
      { name: 'Price & Consumption', formula: 'Consumption Decrease % = [P / (100 + P)] * 100', description: 'If price increases by P%, consumption must decrease by this % to keep expenditure constant.' }
    ],
    shortcuts: [
      'Fraction Equivalents: 1/2 = 50%, 1/3 = 33.33%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16.66%, 1/8 = 12.5%, 1/12 = 8.33%.',
      'If A is x% more than B, then B is [x / (100 + x)] * 100% less than A.',
      'Multiplying factor approach: A 20% increase equals multiplying original value by 1.20.'
    ],
    solvedExamples: [
      {
        question: 'If the price of sugar increases by 25%, by what percentage should a household reduce sugar consumption so that expenditure remains unchanged?',
        solution: 'Using formula: [P / (100 + P)] * 100 => [25 / (100 + 25)] * 100 = (25 / 125) * 100 = 20%.',
        explanation: 'Hence, reducing consumption by 20% offsets the 25% price increase.'
      },
      {
        question: 'A salary is first increased by 20% and then decreased by 20%. What is the net percentage change in salary?',
        solution: 'Net Change = A + B + (A*B)/100 = +20 - 20 + (20 * -20)/100 = 0 - 400/100 = -4%.',
        explanation: 'The salary decreases by 4% net.'
      }
    ],
    commonMistakes: [
      'Mistake 1: Confusing base values when calculating percentage increase vs percentage decrease.',
      'Mistake 2: Assuming +20% followed by -20% returns to the original value (it actually results in a 4% net loss!).'
    ],
    interviewTips: [
      'In TCS NQT & Infosys tests, use fraction shortcuts (like 1/6 = 16.66%) to solve percentage problems in under 30 seconds without long division.'
    ]
  },
  // Logical Reasoning: Syllogism
  {
    category: 'Logical Reasoning',
    topic: 'Syllogism',
    title: 'Syllogism & Venn Diagram Deduction Rules',
    introduction: 'Syllogism evaluates logical deduction based on given statements. You must treat statements as absolute truth even if they defy real-world facts.',
    concepts: [
      'All A are B: A is completely inside B.',
      'Some A are B: A and B share an overlapping intersection.',
      'No A is B: A and B are completely disjoint sets.'
    ],
    formulas: [
      { name: 'Universal Positive', formula: 'All A are B', description: 'Implies Some A are B and Some B are A.' },
      { name: 'Universal Negative', formula: 'No A is B', description: 'Implies No B is A.' }
    ],
    shortcuts: [
      'Check standard Venn diagrams for definite conclusions.',
      'Either-Or Condition requirement: Same subject & predicate, one positive & one negative statement, neither conclusion is individually definite.'
    ],
    solvedExamples: [
      {
        question: 'Statements: 1. All Books are Pens. 2. All Pens are Pencils. Conclusions: I. All Books are Pencils. II. Some Pencils are Books.',
        solution: 'Both Conclusion I and Conclusion II follow.',
        explanation: 'Since Books are inside Pens and Pens are inside Pencils, Books are inside Pencils (I follows). Also, Pencils overlap with Books (II follows).'
      }
    ],
    commonMistakes: [
      'Applying real world logic instead of strictly adhering to the statement premises.'
    ],
    interviewTips: [
      'Draw minimal Venn diagrams first. Check if conclusions hold true in all possible diagram cases.'
    ]
  },
  // Verbal Ability: Reading Comprehension
  {
    category: 'Verbal Ability',
    topic: 'Reading Comprehension',
    title: 'Reading Comprehension & Critical Inference Techniques',
    introduction: 'Reading comprehension tests your speed, critical vocabulary, central theme identification, and tone analysis.',
    concepts: [
      'Identify Main Idea & Central Thesis in the first and last paragraphs.',
      'Tone of Passage: Analytical, Critical, Optimistic, Objective, or Disparaging.'
    ],
    formulas: [
      { name: 'Elimination Rule', formula: 'Eliminate Out-of-Bounds & Extreme Options', description: 'Options using absolute terms like "always", "never", "only" are rarely correct unless explicitly stated.' }
    ],
    shortcuts: [
      'Read questions first, then skim the passage for targeted keywords.',
      'Identify transitional words like "however", "nevertheless", "consequently" to track structural shifts.'
    ],
    solvedExamples: [
      {
        question: 'What is the primary purpose of identifying transitional words in a reading comprehension passage?',
        solution: 'To track logical shifts in author sentiment and argument flow.',
        explanation: 'Words like "however" signal an opposing viewpoint or caveat.'
      }
    ],
    commonMistakes: ['Selecting choices based on outside knowledge rather than passage text.'],
    interviewTips: ['Practice speed reading passages with a 2-minute timer for placement verbal rounds.']
  }
];

const sampleQuestions = [
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    question: 'A student has to secure 40% marks to pass an exam. He gets 178 marks and fails by 22 marks. What is the maximum marks of the examination?',
    options: ['400', '500', '600', '450'],
    correctAnswer: '500',
    explanation: 'Passing marks = 178 + 22 = 200 marks. 40% of Maximum Marks = 200. Maximum Marks = (200 * 100) / 40 = 500.',
    difficulty: 'Medium',
    createdBy: 'System',
    isPublished: true
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    question: 'If A\'s income is 25% more than B\'s income, by how much percentage is B\'s income less than A\'s income?',
    options: ['20%', '25%', '15%', '30%'],
    correctAnswer: '20%',
    explanation: 'Formula: [x / (100 + x)] * 100 = [25 / 125] * 100 = 20%.',
    difficulty: 'Easy',
    createdBy: 'System',
    isPublished: true
  },
  {
    category: 'Logical Reasoning',
    topic: 'Syllogism',
    question: 'Statements: All cats are dogs. All dogs are birds. Conclusion: I. All cats are birds.',
    options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Neither follows', 'Both follow'],
    correctAnswer: 'Only Conclusion I follows',
    explanation: 'Since cats are contained in dogs, and dogs in birds, all cats are definitely birds.',
    difficulty: 'Easy',
    createdBy: 'System',
    isPublished: true
  }
];

const sampleCodingQuestions = [
  {
    title: 'Two Sum Problem',
    language: 'Python',
    topic: 'Arrays',
    difficulty: 'Easy',
    category: 'Data Structures',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0, 1]',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isHidden: false },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isHidden: false }
    ],
    starterCode: `def twoSum(nums, target):\n    # Write python code here\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`,
    solutionCode: `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`
  },
  {
    title: 'Reverse String in Java',
    language: 'Java',
    topic: 'Strings',
    difficulty: 'Easy',
    category: 'Basics',
    problemStatement: 'Write a Java function that reverses a given string in-place or returns a reversed string.',
    sampleInput: '"placement"',
    sampleOutput: '"tnemecalp"',
    constraints: ['1 <= str.length <= 10^5'],
    explanation: 'Iterate from the last index to 0 or use StringBuilder reverse().',
    testCases: [
      { input: '"placement"', expectedOutput: '"tnemecalp"', isHidden: false }
    ],
    starterCode: `public class Solution {\n    public static String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}`,
    solutionCode: `public class Solution {\n    public static String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}`
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeprep_ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB database');

    // Clean existing seed data
    await StudyMaterial.deleteMany({});
    await Question.deleteMany({});
    await CodingQuestion.deleteMany({});

    await StudyMaterial.insertMany(sampleMaterials);
    await Question.insertMany(sampleQuestions);
    await CodingQuestion.insertMany(sampleCodingQuestions);

    // Create default Admin User if not exists
    const adminUser = await User.findOne({ email: 'admin@placeprep.ai' });
    if (!adminUser) {
      await User.create({
        firebaseUid: 'admin-seed-uid',
        email: 'admin@placeprep.ai',
        name: 'Placement Admin',
        college: 'Placement Cell Engineering College',
        degree: 'M.Tech / Admin',
        department: 'Placement Training Cell',
        role: 'admin',
        streak: 15
      });
      console.log('[Seed Script] Admin User created (email: admin@placeprep.ai)');
    }

    console.log('[Seed Script] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]', error);
    process.exit(1);
  }
};

seedDB();
