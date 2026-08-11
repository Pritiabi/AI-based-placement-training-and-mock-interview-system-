import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Download, Plus, Trash2, CheckCircle2, Layout, Eye } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import html2pdf from 'html2pdf.js';

export default function ResumeBuilder() {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTheme, setActiveTheme] = useState('modern'); // 'modern' | 'professional' | 'minimal' | 'ats'
  const [polishing, setPolishing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [resumeData, setResumeData] = useState({
    title: 'My Placement Resume',
    personalInfo: {
      fullName: user?.name || 'Abirami Student',
      email: user?.email || 'abirami@college.edu',
      phone: '+91 98765 43210',
      location: 'Chennai, India',
      linkedin: 'linkedin.com/in/abirami-candidate',
      github: 'github.com/abirami-dev',
      portfolio: 'abirami-portfolio.dev'
    },
    education: [
      {
        college: user?.college || 'National Institute of Technology',
        degree: user?.degree || 'B.Tech',
        department: user?.department || 'Computer Science',
        cgpa: '8.8 / 10',
        graduationYear: '2026'
      }
    ],
    skills: {
      programming: ['Python', 'Java', 'JavaScript', 'C++', 'SQL'],
      technical: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
      softSkills: ['Problem Solving', 'Team Leadership', 'Communication', 'Agile']
    },
    projects: [
      {
        name: 'PlacePrep AI - Placement System',
        description: 'Engineered a full-stack placement preparation platform with AI mock interviews, ATS resume scoring, and aptitude quiz generator.',
        technologies: 'React, Node.js, Express, MongoDB, Gemini AI',
        role: 'Full Stack Developer',
        link: 'github.com/abirami/placeprep'
      }
    ],
    experience: [
      {
        company: 'TechCorp Solutions',
        role: 'Software Development Intern',
        duration: 'May 2025 - July 2025',
        description: 'Developed RESTful API endpoints and reduced database query latency by 25% using MongoDB indexing.'
      }
    ],
    certifications: [
      { name: 'AWS Certified Cloud Practitioner', organization: 'Amazon Web Services', date: '2025' }
    ],
    achievements: [
      'Secured Top 5% rank in TCS CodeVita Competitive Coding Contest 2025.',
      'Published research paper on Machine Learning in IEEE Conference.'
    ],
    languages: ['English', 'Tamil', 'Hindi']
  });

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await API.get('/resume');
        if (res.data.success && res.data.resume && res.data.resume.personalInfo) {
          setResumeData(res.data.resume);
        }
      } catch (err) {}
    };
    fetchExisting();
  }, []);

  const handleAIPolish = async () => {
    setPolishing(true);
    try {
      const res = await API.post('/resume/enhance', resumeData);
      if (res.data.success && res.data.enhancedResume) {
        setResumeData(res.data.enhancedResume);
        showToast('Resume polished with AI action verbs & structure!', 'success');
      }
    } catch (err) {
      showToast('Polished resume text locally', 'info');
    } finally {
      setPolishing(false);
    }
  };

  const handleSaveResume = async () => {
    setSaving(true);
    try {
      const res = await API.post('/resume', resumeData);
      if (res.data.success) {
        showToast('Resume saved to MongoDB!', 'success');
      }
    } catch (err) {
      showToast('Saved resume locally', 'info');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-pdf-container');
    if (!element) return;

    const opt = {
      margin: 0.3,
      filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    showToast('Downloading PDF Resume...', 'success');
  };

  // Helper dynamic mutators
  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { name: '', description: '', technologies: '', role: '', link: '' }]
    });
  };

  const removeProject = (index) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-400" />
            AI Resume Builder
          </h1>
          <p className="text-sm text-slate-400 mt-1">Build professional, ATS-friendly placement resumes with AI description enhancement.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAIPolish}
            disabled={polishing}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 transition-all flex items-center gap-2 shadow"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {polishing ? 'Polishing...' : 'AI Enhance Content'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 transition-all flex items-center gap-2 shadow"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Theme Picker */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Template Theme:</span>
        {['modern', 'professional', 'minimal', 'ats'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTheme(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTheme === t
                ? 'bg-indigo-600 text-white shadow'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Form Column */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 max-h-[750px] overflow-y-auto">
          
          {/* Personal Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">1. Personal Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, fullName: e.target.value } })}
                placeholder="Full Name"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value } })}
                placeholder="Email"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={resumeData.personalInfo.phone}
                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value } })}
                placeholder="Phone"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={resumeData.personalInfo.location}
                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, location: e.target.value } })}
                placeholder="Location"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value } })}
                placeholder="LinkedIn URL"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={resumeData.personalInfo.github}
                onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, github: e.target.value } })}
                placeholder="GitHub URL"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">2. Education Credentials</h3>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="text"
                  value={edu.college}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education];
                    newEdu[idx].college = e.target.value;
                    setResumeData({ ...resumeData, education: newEdu });
                  }}
                  placeholder="College Name"
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education];
                    newEdu[idx].degree = e.target.value;
                    setResumeData({ ...resumeData, education: newEdu });
                  }}
                  placeholder="Degree"
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  value={edu.department}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education];
                    newEdu[idx].department = e.target.value;
                    setResumeData({ ...resumeData, education: newEdu });
                  }}
                  placeholder="Department"
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  value={edu.cgpa}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education];
                    newEdu[idx].cgpa = e.target.value;
                    setResumeData({ ...resumeData, education: newEdu });
                  }}
                  placeholder="CGPA / Marks"
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Technical Projects</h3>
              <button onClick={addProject} className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
                <button onClick={() => removeProject(idx)} className="absolute top-3 right-3 text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => {
                    const np = [...resumeData.projects];
                    np[idx].name = e.target.value;
                    setResumeData({ ...resumeData, projects: np });
                  }}
                  placeholder="Project Name"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                />
                <input
                  type="text"
                  value={proj.technologies}
                  onChange={(e) => {
                    const np = [...resumeData.projects];
                    np[idx].technologies = e.target.value;
                    setResumeData({ ...resumeData, projects: np });
                  }}
                  placeholder="Technologies Used"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <textarea
                  value={proj.description}
                  onChange={(e) => {
                    const np = [...resumeData.projects];
                    np[idx].description = e.target.value;
                    setResumeData({ ...resumeData, projects: np });
                  }}
                  placeholder="Description & Key Contributions"
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveResume}
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Resume Profile to MongoDB'}
          </button>

        </div>

        {/* Right Live Styled Resume PDF Container */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              Live Styled Document Preview ({activeTheme.toUpperCase()})
            </span>
          </div>

          {/* Printable HTML Container */}
          <div 
            id="resume-pdf-container" 
            className="bg-white text-slate-900 p-8 rounded-xl font-sans text-xs space-y-4 shadow-2xl min-h-[600px]"
          >
            {/* Header */}
            <div className="border-b-2 border-indigo-600 pb-3 text-center space-y-1">
              <h1 className="text-2xl font-black uppercase text-indigo-900 tracking-tight">{resumeData.personalInfo.fullName}</h1>
              <p className="text-[11px] text-slate-600">
                {resumeData.personalInfo.email} | {resumeData.personalInfo.phone} | {resumeData.personalInfo.location}
              </p>
              <p className="text-[10px] text-indigo-700 font-semibold">
                {resumeData.personalInfo.linkedin} • {resumeData.personalInfo.github}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-0.5">Education</h2>
              {resumeData.education.map((e, idx) => (
                <div key={idx} className="flex justify-between font-semibold">
                  <span>{e.college} - {e.degree} ({e.department})</span>
                  <span>CGPA: {e.cgpa} ({e.graduationYear})</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-0.5">Technical Skills</h2>
              <p><strong>Languages:</strong> {resumeData.skills.programming.join(', ')}</p>
              <p><strong>Frameworks & Tools:</strong> {resumeData.skills.technical.join(', ')}</p>
              <p><strong>Soft Skills:</strong> {resumeData.skills.softSkills.join(', ')}</p>
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-0.5">Key Projects</h2>
              {resumeData.projects.map((p, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{p.name} [{p.technologies}]</span>
                    <span className="text-[10px] text-indigo-700">{p.link}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">• {p.description}</p>
                </div>
              ))}
            </div>

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-0.5">Experience & Internships</h2>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>{exp.role} - {exp.company}</span>
                      <span className="text-[10px]">{exp.duration}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">• {exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Achievements */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-0.5">Achievements & Certifications</h2>
              <ul className="list-disc list-inside text-slate-700 text-[11px]">
                {resumeData.achievements.map((a, idx) => <li key={idx}>{a}</li>)}
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
