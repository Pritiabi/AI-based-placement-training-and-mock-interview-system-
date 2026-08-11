const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const CodingQuestion = require('../models/CodingQuestion');
const CodingMCQ = require('../models/CodingMCQ');

// 1. PYTHON MCQs & CODING QUESTIONS
const pythonMCQs = [
  // Basic Python MCQs
  {
    question: 'What is the output of `print(type([]) is list)` in Python 3?',
    optionA: 'False', optionB: 'True', optionC: 'Error', optionD: 'None',
    correctAnswer: 'B',
    explanation: '`[]` creates a list object. `type([])` returns `<class "list">`, which is identical to `list`, returning `True`.',
    language: 'Python', topic: 'Data Types', difficulty: 'Basic'
  },
  {
    question: 'Which operator is used for integer division in Python?',
    optionA: '/', optionB: '//', optionC: '%', optionD: '**',
    correctAnswer: 'B',
    explanation: 'The `//` operator performs floor (integer) division in Python.',
    language: 'Python', topic: 'Operators', difficulty: 'Basic'
  },
  {
    question: 'What is the value of `len({"apple", "banana", "apple"})`?',
    optionA: '3', optionB: '2', optionC: '1', optionD: 'Error',
    correctAnswer: 'B',
    explanation: 'Sets in Python only store unique elements. Duplicate "apple" is ignored, leaving 2 items.',
    language: 'Python', topic: 'Sets', difficulty: 'Basic'
  },
  {
    question: 'What does `range(1, 10, 2)` generate?',
    optionA: '[1, 2, 3, 4, 5, 6, 7, 8, 9]', optionB: '[1, 3, 5, 7, 9]', optionC: '[2, 4, 6, 8, 10]', optionD: '[1, 3, 5, 7]',
    correctAnswer: 'B',
    explanation: '`range(start, stop, step)` starts at 1, increments by 2, and stops before 10.',
    language: 'Python', topic: 'Loops', difficulty: 'Basic'
  },
  
  // Medium Python MCQs
  {
    question: 'What is the output of `[x**2 for x in range(5) if x % 2 == 0]`?',
    optionA: '[0, 4, 16]', optionB: '[0, 1, 4, 9, 16]', optionC: '[4, 16]', optionD: '[0, 4, 8]',
    correctAnswer: 'A',
    explanation: 'Even values in `range(5)` are 0, 2, 4. Squaring them yields `0**2 = 0`, `2**2 = 4`, `4**2 = 16`.',
    language: 'Python', topic: 'List comprehensions', difficulty: 'Medium'
  },
  {
    question: 'In Python OOP, what is the role of `__init__`?',
    optionA: 'To destroy an object', optionB: 'Constructor method to initialize instance attributes', optionC: 'To convert object to string', optionD: 'Static method initializer',
    correctAnswer: 'B',
    explanation: '`__init__` is the initializer method automatically invoked when creating a new object instance.',
    language: 'Python', topic: 'OOP basics', difficulty: 'Medium'
  },
  {
    question: 'What happens when `try ... except KeyError` encounters a `ValueError`?',
    optionA: 'KeyError handles it silently', optionB: 'The exception is unhandled by except and propagates up', optionC: 'Python ignores the error', optionD: 'Program returns None',
    correctAnswer: 'B',
    explanation: 'An `except KeyError` block only catches `KeyError`. Other exception types propagate unhandled.',
    language: 'Python', topic: 'Exception handling', difficulty: 'Medium'
  },

  // Hard Python MCQs
  {
    question: 'What is the time complexity of looking up a key in a Python dict on average?',
    optionA: 'O(N)', optionB: 'O(log N)', optionC: 'O(1)', optionD: 'O(N^2)',
    correctAnswer: 'C',
    explanation: 'Python dictionaries are implemented using hash tables, offering average O(1) time complexity for key lookup.',
    language: 'Python', topic: 'Advanced data structures', difficulty: 'Hard'
  },
  {
    question: 'How does memoization optimize dynamic programming algorithms in Python recursion?',
    optionA: 'By multithreading recursive branches', optionB: 'By caching results of expensive subproblems to prevent redundant calculations', optionC: 'By compiling bytecode to C', optionD: 'By converting lists to sets',
    correctAnswer: 'B',
    explanation: 'Memoization caches evaluated recursive arguments in a dictionary or array, reducing exponential time to linear/polynomial.',
    language: 'Python', topic: 'Dynamic programming', difficulty: 'Hard'
  }
];

const pythonCoding = [
  // Basic Python Coding
  {
    title: 'Find the Largest Element in a List',
    language: 'Python',
    difficulty: 'Basic',
    topic: 'Lists',
    category: 'Basics',
    problemStatement: 'Given a list of numbers, write a Python function `find_largest(arr)` to find and return the maximum element.',
    inputFormat: 'A list of integers `arr`.',
    outputFormat: 'Single integer representing the largest element.',
    constraints: ['1 <= len(arr) <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    sampleInput: '[10, 25, 7, 40, 18]',
    sampleOutput: '40',
    explanation: 'Iterate through the array or use the built-in max function. The largest number is 40.',
    solution: `def find_largest(arr):\n    if not arr:\n        return None\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    starterCode: `def find_largest(arr):\n    # Write Python code here\n    pass`,
    testCases: [{ input: '[10, 25, 7, 40, 18]', expectedOutput: '40', isHidden: false }]
  },
  {
    title: 'Check Palindrome String',
    language: 'Python',
    difficulty: 'Basic',
    topic: 'Strings',
    category: 'Basics',
    problemStatement: 'Write a Python function `is_palindrome(s)` to check if a given string reads the same backwards.',
    inputFormat: 'String `s`.',
    outputFormat: 'Return True if palindrome, else False.',
    constraints: ['1 <= len(s) <= 10^4'],
    sampleInput: '"radar"',
    sampleOutput: 'True',
    explanation: 'Reversing "radar" yields "radar", matching original.',
    solution: `def is_palindrome(s):\n    cleaned = s.lower().replace(" ", "")\n    return cleaned == cleaned[::-1]`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    starterCode: `def is_palindrome(s):\n    pass`,
    testCases: [{ input: '"radar"', expectedOutput: 'True', isHidden: false }]
  },

  // Medium Python Coding
  {
    title: 'Two Sum Problem',
    language: 'Python',
    difficulty: 'Medium',
    topic: 'Arrays/Lists',
    category: 'Searching',
    problemStatement: 'Given an array of integers `nums` and an integer `target`, return indices of two numbers that add up to `target`.',
    inputFormat: 'List `nums` and integer `target`.',
    outputFormat: 'List containing 2 indices.',
    constraints: ['2 <= nums.length <= 10^4'],
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    explanation: 'nums[0] + nums[1] = 2 + 7 = 9.',
    solution: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    starterCode: `def two_sum(nums, target):\n    pass`,
    testCases: [{ input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isHidden: false }]
  },

  // Hard Python Coding
  {
    title: 'Longest Palindromic Substring',
    language: 'Python',
    difficulty: 'Hard',
    topic: 'Complex string problems',
    category: 'Dynamic programming',
    problemStatement: 'Given a string `s`, return the longest palindromic substring in `s`.',
    inputFormat: 'String `s`.',
    outputFormat: 'Longest palindromic substring.',
    constraints: ['1 <= s.length <= 1000'],
    sampleInput: '"babad"',
    sampleOutput: '"bab"',
    explanation: '"bab" is a valid palindrome substring of length 3.',
    solution: `def longest_palindrome(s):\n    res = ""\n    for i in range(len(s)):\n        # odd length\n        l, r = i, i\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if (r - l + 1) > len(res):\n                res = s[l:r+1]\n            l -= 1\n            r += 1\n        # even length\n        l, r = i, i + 1\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if (r - l + 1) > len(res):\n                res = s[l:r+1]\n            l -= 1\n            r += 1\n    return res`,
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    starterCode: `def longest_palindrome(s):\n    pass`,
    testCases: [{ input: '"babad"', expectedOutput: '"bab"', isHidden: false }]
  }
];

// 2. JAVA MCQs & CODING QUESTIONS
const javaMCQs = [
  {
    question: 'Which Java keyword is used to prevent method overriding?',
    optionA: 'static', optionB: 'final', optionC: 'abstract', optionD: 'synchronized',
    correctAnswer: 'B',
    explanation: 'Declaring a method `final` in Java prevents subclasses from overriding it.',
    language: 'Java', topic: 'Classes and Objects', difficulty: 'Basic'
  },
  {
    question: 'What is the default initial capacity of an ArrayList in Java?',
    optionA: '5', optionB: '10', optionC: '16', optionD: '0',
    correctAnswer: 'B',
    explanation: 'An `ArrayList` in Java is initialized with a default capacity of 10 elements.',
    language: 'Java', topic: 'ArrayList', difficulty: 'Medium'
  },
  {
    question: 'Which method must be implemented by a class implementing the `Runnable` interface in Java?',
    optionA: 'start()', optionB: 'run()', optionC: 'execute()', optionD: 'main()',
    correctAnswer: 'B',
    explanation: 'The `Runnable` functional interface defines the `public void run()` method.',
    language: 'Java', topic: 'Multithreading concepts', difficulty: 'Hard'
  }
];

const javaCoding = [
  {
    title: 'Reverse Words in a String',
    language: 'Java',
    difficulty: 'Medium',
    topic: 'String handling',
    category: 'Strings',
    problemStatement: 'Write a Java method to reverse the order of words in a given sentence.',
    inputFormat: 'String sentence.',
    outputFormat: 'Reversed word sentence.',
    constraints: ['1 <= sentence.length <= 10^4'],
    sampleInput: '"the sky is blue"',
    sampleOutput: '"blue is sky the"',
    explanation: 'Words are split by spaces and reconstructed in reverse order.',
    solution: `public class Solution {\n    public static String reverseWords(String s) {\n        String[] words = s.trim().split("\\\\s+");\n        StringBuilder sb = new StringBuilder();\n        for (int i = words.length - 1; i >= 0; i--) {\n            sb.append(words[i]);\n            if (i > 0) sb.append(" ");\n        }\n        return sb.toString();\n    }\n}`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    starterCode: `public class Solution {\n    public static String reverseWords(String s) {\n        // Write Java code here\n        return "";\n    }\n}`,
    testCases: [{ input: '"the sky is blue"', expectedOutput: '"blue is sky the"', isHidden: false }]
  }
];

// 3. C++ MCQs & CODING QUESTIONS
const cppMCQs = [
  {
    question: 'What does the `&` operator signify when passed in function parameter `void swap(int &a, int &b)` in C++?',
    optionA: 'Address-of operator', optionB: 'Pass by reference', optionC: 'Bitwise AND', optionD: 'Pointer dereference',
    correctAnswer: 'B',
    explanation: '`int &a` specifies pass-by-reference in C++, allowing direct modification of original variables.',
    language: 'C++', topic: 'References', difficulty: 'Medium'
  },
  {
    question: 'Which STL container in C++ implements a LIFO (Last-In First-Out) structure?',
    optionA: 'std::vector', optionB: 'std::queue', optionC: 'std::stack', optionD: 'std::deque',
    correctAnswer: 'C',
    explanation: '`std::stack` provides LIFO data structure operations (push, pop, top).',
    language: 'C++', topic: 'Stack', difficulty: 'Medium'
  }
];

const cppCoding = [
  {
    title: 'Valid Parentheses Matching',
    language: 'C++',
    difficulty: 'Medium',
    topic: 'Stack',
    category: 'Data Structures',
    problemStatement: 'Given a string `s` containing brackets `()[]{}`, determine if input string is valid using C++ `std::stack`.',
    inputFormat: 'String `s`.',
    outputFormat: 'Return true/false.',
    constraints: ['1 <= s.length <= 10^4'],
    sampleInput: '"()[]{}"',
    sampleOutput: 'true',
    explanation: 'Open brackets are pushed to stack and matched with corresponding closing brackets.',
    solution: `#include <stack>\n#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\' || c == \'[\' || c == \'{\') {\n            st.push(c);\n        } else {\n            if (st.empty()) return false;\n            char top = st.top();\n            if ((c == \')\' && top == \'(\') || (c == \']\' && top == \'[\') || (c == \'}\' && top == \'{\')) {\n                st.pop();\n            } else return false;\n        }\n    }\n    return st.empty();\n}`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    starterCode: `bool isValid(string s) {\n    // Write C++ solution\n    return true;\n}`,
    testCases: [{ input: '"()[]{}"', expectedOutput: 'true', isHidden: false }]
  }
];

// 4. SQL MCQs & CODING QUESTIONS
const sqlMCQs = [
  {
    question: 'Which SQL clause is used to filter records AFTER group aggregations are performed?',
    optionA: 'WHERE', optionB: 'HAVING', optionC: 'ORDER BY', optionD: 'LIMIT',
    correctAnswer: 'B',
    explanation: '`HAVING` filters group rows after `GROUP BY` aggregations, whereas `WHERE` filters rows before grouping.',
    language: 'SQL', topic: 'HAVING', difficulty: 'Medium'
  },
  {
    question: 'Which window function assigns a unique sequential integer to rows without gaps or ties?',
    optionA: 'RANK()', optionB: 'DENSE_RANK()', optionC: 'ROW_NUMBER()', optionD: 'COUNT()',
    correctAnswer: 'C',
    explanation: '`ROW_NUMBER()` assigns sequential row numbers starting from 1 regardless of identical values.',
    language: 'SQL', topic: 'ROW_NUMBER', difficulty: 'Hard'
  }
];

const sqlCoding = [
  {
    title: 'Find Second Highest Salary',
    language: 'SQL',
    difficulty: 'Medium',
    topic: 'Subqueries',
    category: 'SQL Queries',
    problemStatement: 'Write a SQL query to select the second highest salary from Employee table.',
    inputFormat: 'Employee table with id, salary columns.',
    outputFormat: 'Second highest salary value.',
    constraints: ['1 <= Employee.rows <= 10^5'],
    sampleInput: 'Employee: [{id: 1, salary: 100}, {id: 2, salary: 200}, {id: 3, salary: 300}]',
    sampleOutput: '200',
    explanation: 'Subquery finds max salary less than overall max salary.',
    solution: `SELECT MAX(salary) AS SecondHighestSalary \nFROM Employee \nWHERE salary < (SELECT MAX(salary) FROM Employee);`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    starterCode: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE...`,
    testCases: [{ input: 'Employee table', expectedOutput: '200', isHidden: false }]
  }
];

const seedCoding = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeprep_ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB database');

    // Clean existing seed collections
    await CodingMCQ.deleteMany({});
    await CodingQuestion.deleteMany({});

    // Seed MCQs
    await CodingMCQ.insertMany([...pythonMCQs, ...javaMCQs, ...cppMCQs, ...sqlMCQs]);
    console.log(`[Seed Script] Successfully inserted ${pythonMCQs.length + javaMCQs.length + cppMCQs.length + sqlMCQs.length} Coding MCQs.`);

    // Seed Coding Problems
    await CodingQuestion.insertMany([...pythonCoding, ...javaCoding, ...cppCoding, ...sqlCoding]);
    console.log(`[Seed Script] Successfully inserted ${pythonCoding.length + javaCoding.length + cppCoding.length + sqlCoding.length} Coding Questions.`);

    console.log('[Seed Script] Complete Coding Practice Question Bank seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedCoding();
