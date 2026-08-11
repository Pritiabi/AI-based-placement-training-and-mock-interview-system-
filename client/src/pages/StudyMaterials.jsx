import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowRight, Search, BookOpen, Layers, Sparkles } from 'lucide-react';

export default function StudyMaterials() {
  const [activeCategory, setActiveCategory] = useState('Quantitative Aptitude');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Quantitative Aptitude', color: 'from-amber-500 to-orange-600' },
    { name: 'Logical Reasoning', color: 'from-indigo-500 to-violet-600' },
    { name: 'Verbal Ability', color: 'from-emerald-500 to-teal-600' }
  ];

  const topicsMap = {
    'Quantitative Aptitude': [
      'Number System', 'HCF & LCM', 'Percentages', 'Profit and Loss', 
      'Simple Interest', 'Compound Interest', 'Ratio and Proportion', 'Average', 
      'Time and Work', 'Time Speed Distance', 'Problems on Ages', 
      'Permutation and Combination', 'Probability', 'Data Interpretation', 'Algebra'
    ],
    'Logical Reasoning': [
      'Number Series', 'Alphabet Series', 'Coding-Decoding', 'Blood Relations', 
      'Direction Sense', 'Syllogism', 'Analogy', 'Classification', 
      'Seating Arrangement', 'Puzzles', 'Statement and Conclusion', 
      'Data Sufficiency', 'Logical Sequence'
    ],
    'Verbal Ability': [
      'Grammar', 'Vocabulary', 'Synonyms', 'Antonyms', 
      'Sentence Correction', 'Error Detection', 'Reading Comprehension', 
      'Para Jumbles', 'Fill in the Blanks', 'Tenses', 'Articles', 'Prepositions'
    ]
  };

  const currentTopics = (topicsMap[activeCategory] || []).filter(t => 
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            Placement Study Materials
          </h1>
          <p className="text-sm text-slate-400 mt-1">Select a category and topic to study core formulas, shortcuts, and solved examples.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeCategory === cat.name
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                : 'glass-panel text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            {cat.name}
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white">
              {topicsMap[cat.name].length}
            </span>
          </button>
        ))}
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentTopics.map((topic, i) => {
          const topicSlug = topic.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
          return (
            <Link
              key={i}
              to={`/materials/${topicSlug}`}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {topic}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Concepts, important formulas, shortcuts, and solved placement examples.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Study Topic</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
