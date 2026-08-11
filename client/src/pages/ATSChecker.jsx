import React, { useState } from 'react';
import { FileCheck2, Upload, Sparkles, CheckCircle2, AlertCircle, Search, ArrowRight, Layers, FileText } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function ATSChecker() {
  const { showToast } = useNotification();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Job Match state
  const [jobDescription, setJobDescription] = useState('');
  const [matchingJob, setMatchingJob] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        showToast('Only PDF resume files are supported. Please upload a valid PDF resume.', 'error');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      showToast('Please select a valid PDF resume file first.', 'error');
      return;
    }

    setAnalyzing(true);
    setAnalysisData(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await API.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.analysis) {
        setAnalysisData(res.data.analysis);
        showToast(`ATS Resume Analysis Complete! Score: ${res.data.analysis.atsScore}/100`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error analyzing resume file. Please upload a valid text-based PDF resume.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleJobMatch = async () => {
    if (!jobDescription || jobDescription.trim().length < 10) {
      showToast('Please paste a valid target job description.', 'error');
      return;
    }

    setMatchingJob(true);
    setJobMatchResult(null);

    try {
      const res = await API.post('/resume/job-match', {
        resumeText: analysisData?.extractedTextSnippet || 'Candidate with Python, React, Node.js, Express, MongoDB, SQL, Data Structures',
        jobDescription
      });

      if (res.data.success && res.data.result) {
        setJobMatchResult(res.data.result);
        showToast(`Job Description Match Score: ${res.data.result.jobMatchScore}%`, 'success');
      }
    } catch (err) {
      showToast('Job match calculation unavailable. Please try again.', 'error');
    } finally {
      setMatchingJob(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <FileCheck2 className="w-8 h-8 text-violet-400" />
          AI ATS Resume Scanner & Job Matcher
        </h1>
        <p className="text-sm text-slate-400 mt-1">Upload candidate PDF resumes for calculated ATS compatibility scores, section validation, and job description skill gap analysis.</p>
      </div>

      {/* File Upload Dropzone */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-center">
        
        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 transition-colors bg-slate-900/40 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <label className="cursor-pointer font-bold text-sm text-indigo-400 hover:underline">
              Choose PDF Resume File
              <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
            <p className="text-xs text-slate-500 mt-1">Supported format: PDF only (Maximum file size: 5MB)</p>
          </div>

          {selectedFile && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>

        <button
          onClick={handleUploadAndAnalyze}
          disabled={analyzing || !selectedFile}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 disabled:opacity-40"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          {analyzing ? 'Extracting Text & Validating Resume...' : 'Scan Resume for ATS Compatibility'}
        </button>

      </div>

      {/* ATS ANALYSIS RESULTS */}
      {analysisData && (
        <div className="space-y-6">
          
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 space-y-6 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI-based ATS Compatibility Score</span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{analysisData.fileName}</h2>
              </div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-500/30">
                {analysisData.atsScore}
              </div>
            </div>

            {/* Score Category Breakdown */}
            {analysisData.scoreBreakdown && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Contact Info</span>
                  <span className="text-lg font-bold text-indigo-400">{analysisData.scoreBreakdown.contactInfo || 10}/10</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Education</span>
                  <span className="text-lg font-bold text-violet-400">{analysisData.scoreBreakdown.education || 15}/15</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Technical Skills</span>
                  <span className="text-lg font-bold text-emerald-400">{analysisData.scoreBreakdown.skills || 20}/20</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Projects & Exp</span>
                  <span className="text-lg font-bold text-pink-400">{analysisData.scoreBreakdown.projects || 20}/20</span>
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysisData.strengths.map((s, i) => <li key={i}>✔ {s}</li>)}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Areas to Improve
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysisData.improvements.map((imp, i) => <li key={i}>⚠ {imp}</li>)}
                </ul>
              </div>
            </div>

            {/* Missing Sections */}
            {analysisData.missingSections && analysisData.missingSections.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-xs">
                <span className="font-bold text-rose-400 block">Missing Sections:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {analysisData.missingSections.map((sec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-semibold">{sec}</span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ADVANCED FEATURE: JOB DESCRIPTION ATS MATCH */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                Compare with Job Description
              </h3>
              <p className="text-xs text-slate-400 mt-1">Paste a target job description below to evaluate candidate resume match percentage.</p>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste Job Description here (e.g. Seeking Software Engineer proficient in Python, SQL, REST APIs, Docker...)"
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleJobMatch}
              disabled={matchingJob}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4" />
              {matchingJob ? 'Matching Skills...' : 'Calculate Job Match Percentage'}
            </button>

            {jobMatchResult && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Job Match Score:</span>
                  <span className="text-xl font-black text-indigo-400">{jobMatchResult.jobMatchScore}%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                    <span className="font-bold text-emerald-400 block mb-1">Matching Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {jobMatchResult.matchingSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                    <span className="font-bold text-rose-400 block mb-1">Missing Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {jobMatchResult.missingSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {(jobMatchResult.suggestions || jobMatchResult.recommendedChanges) && (
                  <div className="text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-indigo-300 block">Recommended Actions:</span>
                    {(jobMatchResult.suggestions || jobMatchResult.recommendedChanges).map((r, i) => <p key={i}>• {r}</p>)}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
