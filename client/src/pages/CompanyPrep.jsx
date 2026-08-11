import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import API from '../services/api';

export default function CompanyPrep() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get('/companies');
        if (res.data.success) {
          setCompanies(res.data.companies || []);
        }
      } catch (err) {}
    };
    fetchCompanies();
  }, []);

  const defaultCompanies = [
    { id: 'tcs', name: 'TCS', fullName: 'Tata Consultancy Services', logo: '🏢', overview: 'India\'s largest IT services company hiring via TCS NQT.' },
    { id: 'infosys', name: 'Infosys', fullName: 'Infosys Limited', logo: '🌐', overview: 'Global digital services leader hiring Systems Engineers & SP roles.' },
    { id: 'wipro', name: 'Wipro', fullName: 'Wipro Limited', logo: '⚡', overview: 'IT services & consulting leader hiring through Elite NLTH.' },
    { id: 'accenture', name: 'Accenture', fullName: 'Accenture Innovation', logo: '🚀', overview: 'Professional services leader hiring Advanced App Engineering roles.' },
    { id: 'cognizant', name: 'Cognizant', fullName: 'Cognizant Technology', logo: '💡', overview: 'Multinational hiring GenC, GenC Elevate & GenC Next engineers.' },
    { id: 'zoho', name: 'Zoho', fullName: 'Zoho Corporation', logo: '⚙️', overview: 'Famous product company hiring via hands-on system design rounds.' },
    { id: 'amazon', name: 'Amazon', fullName: 'Amazon Development Centre', logo: '📦', overview: 'Global tech giant hiring SDE-1 software development engineers.' }
  ];

  const list = companies.length > 0 ? companies : defaultCompanies;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-sky-400" />
          Company-Specific Placement Preparation
        </h1>
        <p className="text-sm text-slate-400 mt-1">Targeted hiring patterns, selection rounds, and preparation strategies for top recruiters.</p>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((c) => (
          <Link
            key={c.id}
            to={`/company/${c.id}`}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-sky-500/40 transition-all hover:-translate-y-1 group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow">
                {c.logo || '🏢'}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs font-semibold text-sky-400">{c.fullName}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{c.overview}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-400">
              <span>View Hiring Pattern</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
