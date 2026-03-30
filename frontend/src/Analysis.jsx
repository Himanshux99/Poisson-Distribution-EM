import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine, ReferenceArea } from 'recharts';
import { ArrowLeft, Loader2, Settings, BarChart as ChartIcon, Table as TableIcon, Brain, Info, Plus, Minus, ChevronDown, Sun, Moon } from 'lucide-react';

const SCENARIOS = {
  "Industrial Manufacturing": { n: 200, p: 0.15, k_start: 20, k_end: 40 },
  "Custom": { n: 20, p: 0.2, k_start: 0, k_end: 5 },
  "Call Center": { n: 50, p: 0.1, k_start: 5, k_end: 10 },
  "Website Traffic": { n: 1000, p: 0.01, k_start: 0, k_end: 15 },
  "Accidents": { n: 100, p: 0.03, k_start: 1, k_end: 3 }
};

const InputControl = ({ label, value, onChange, step = 1, min = 0, max = Infinity }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-widest px-1">{label}</label>
    <div className="flex items-center gap-2 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl p-1 pr-4 focus-within:border-[#00f2ff]/30 transition-all shadow-sm">
      <button 
        onClick={() => onChange(Math.max(min, Number((value - step).toFixed(4))))}
        className="p-3 text-[var(--text-muted)] hover:text-[#ff2e97] hover:bg-black/5 rounded-lg transition-all"
      >
        <Minus size={14} />
      </button>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-transparent p-2 text-sm font-bold focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button 
        onClick={() => onChange(Math.min(max, Number((value + step).toFixed(4))))}
        className="p-3 text-[#94a3b8] hover:text-[#00f2ff] hover:bg-white/5 rounded-lg transition-all"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);

export default function Analysis() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState("Industrial Manufacturing");
  const [inputs, setInputs] = useState(SCENARIOS["Industrial Manufacturing"]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("graph");
  const [isLightMode, setIsLightMode] = useState(false);

  // Theme Toggle Effect
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [isLightMode]);

  const handleScenarioChange = (e) => {
    const val = e.target.value;
    setScenario(val);
    if (SCENARIOS[val]) {
      setInputs(SCENARIOS[val]); 
    }
  };

  const handleInputChange = (field, val) => {
    let numericVal = Number(val);
    if ((field === 'k_start' || field === 'k_end' || field === 'n') && numericVal < 0) numericVal = 0;
    
    setInputs(prev => {
      let next = { ...prev, [field]: numericVal };
      // Logic guards
      if (next.k_start > next.n) next.k_start = next.n;
      if (next.k_end > next.n) next.k_end = next.n;
      if (next.k_start > next.k_end) next.k_start = next.k_end;
      return next;
    });
    
    if (scenario !== "Custom") setScenario("Custom");
  };

  const [visibility, setVisibility] = useState({ binomial: true, poisson: false, normal: false });

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const payload = {
        n: Number(inputs.n),
        p: Number(inputs.p),
        k_start: Number(inputs.k_start),
        k_end: Number(inputs.k_end)
      };
      const resp = await axios.post("http://localhost:8000/api/calculate", payload);
      const { distributions, metrics, insights } = resp.data;
      
      const chartData = distributions.k_values.map((k, i) => ({
        k,
        binomial: distributions.binomial[i],
        poisson: distributions.poisson[i],
        normal: distributions.normal ? distributions.normal[i] : null
      }));
      
      // LOGIC: Poisson is now the primary default. 
      const canBinomial = (inputs.n > 50 && inputs.p < 0.1);
      const canNormal = (inputs.n * inputs.p > 15) && (inputs.n * (1 - inputs.p) > 15);
      
      setVisibility({
        poisson: true,
        binomial: canBinomial,
        normal: canNormal
      });

      setResults({ distributions, metrics, insights, chartData, canBinomial, canNormal });
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-enable Live Sync for all inputs
  useEffect(() => {
    runAnalysis();
  }, [inputs.n, inputs.p, inputs.k_start, inputs.k_end]);

  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] p-6 md:p-12 transition-colors duration-500">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#ff2e9711] blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#00f2ff0a] blur-[150px] rounded-full opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[#00f2ff] transition-all font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft size={16} /> BACK TO LAB
            </button>

            {/* THEME TOGGLE SWITCH - RE-STYLED PILL */}
            <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className="flex items-center gap-2 px-3 py-1.5 glass-card border-[var(--card-border)] hover:border-[#00f2ff]/30 transition-all group relative"
            >
              <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center p-1 ${isLightMode ? 'bg-[#ff2e9722]' : 'bg-[#00f2ff22]'}`}>
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] transform ${isLightMode ? 'translate-x-5 bg-[#ff2e97] shadow-[0_0_8px_#ff2e97]' : 'translate-x-0 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]'}`}
                />
              </div>
              <div className="flex items-center text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                {isLightMode ? <Sun size={12} className="text-[#ff2e97]" /> : <Moon size={12} className="text-[#00f2ff]" />}
              </div>
            </button>
          </div>

          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-[var(--text-main)]">
              ANALYTICS <span className="text-[#00f2ff]">ENGINE</span>
            </h1>
            <p className="text-[var(--text-muted)] text-[10px] font-bold tracking-[0.3em] uppercase">Status: System Operational</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Panel: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <Settings size={20} className="text-[#00f2ff]" />
                <h2 className="text-lg font-black uppercase tracking-tight text-[var(--text-main)]">Configuration</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 px-1">Scenario Template</label>
                  <div className="relative group">
                    <select 
                      value={scenario} onChange={handleScenarioChange}
                      className="w-full bg-black/5 border border-white/5 rounded-xl p-4 pr-12 text-sm font-bold focus:outline-none focus:border-[#00f2ff]/30 transition-all appearance-none cursor-pointer group-hover:bg-black/10 text-[var(--text-main)]"
                    >
                      {Object.keys(SCENARIOS).map(s => (
                        <option key={s} value={s} className="bg-[var(--bg-color)] text-[var(--text-main)] py-2">
                           {s}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)] group-hover:text-[#00f2ff] transition-colors">
                       <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputControl 
                    label="TRIALS (n)" 
                    value={inputs.n} 
                    onChange={(v) => handleInputChange('n', v)} 
                    min={1} 
                  />
                  <InputControl 
                    label="PROB (p)" 
                    value={inputs.p} 
                    step={0.01}
                    onChange={(v) => handleInputChange('p', v)} 
                    min={0} 
                    max={1} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                  <InputControl 
                    label="K START" 
                    value={inputs.k_start} 
                    onChange={(v) => handleInputChange('k_start', v)} 
                    max={inputs.k_end} 
                  />
                  <InputControl 
                    label="K END" 
                    value={inputs.k_end} 
                    onChange={(v) => handleInputChange('k_end', v)} 
                    min={inputs.k_start}
                    max={inputs.n}
                  />
                </div>
              </div>

              <div className="p-4 bg-[#00f2ff0a] border border-[#00f2ff22] rounded-2xl">
                 <p className="text-[10px] font-black uppercase text-[#00f2ff] tracking-widest mb-1">Target Interval</p>
                 <p className="text-xs text-[#94a3b8] font-bold tracking-tight leading-relaxed italic">
                    Analyzing probability for events happening {inputs.k_start} to {inputs.k_end} times.
                 </p>
              </div>

              <button 
                onClick={runAnalysis}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-[#00f2ff] to-[#9d50bb] hover:brightness-110 disabled:opacity-50 text-[#1a1a2e] font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.2)] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Compute Models"}
              </button>
            </div>
          </div>

          {/* Right Panel: Results Hub */}
          <div className="lg:col-span-8 space-y-6">
            {!results ? (
              <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-50">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
                  <ChartIcon size={32} stroke="#94a3b8" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest">Awaiting Command</h3>
                <p className="max-w-xs text-sm text-[#94a3b8] font-medium leading-relaxed">Adjust input parameters and trigger the analytics engine to generate probability models.</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700 slide-in-from-bottom-5 space-y-6">
                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { symbol: "λ", label: "Lambda (Poisson)", val: results.metrics.lam, color: "#00f2ff" },
                    { symbol: "μ", label: "Mean (Expected)", val: results.metrics.mu, color: "#ff2e97" },
                    { symbol: "σ", label: "Sigma (Deviation)", val: results.metrics.sigma, color: "#9d50bb" }
                  ].map((m, i) => (
                    <div key={i} className="glass-card p-4 border-t-2" style={{ borderColor: m.color + "33" }}>
                      <div className="flex items-center gap-2 mb-0.5">
                         <span className="text-xs font-black italic" style={{ color: m.color }}>{m.symbol}</span>
                         <p className="text-[8px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">{m.label}</p>
                      </div>
                      <p className="text-base font-black tracking-tighter" style={{ color: m.color }}>{m.val.toFixed(3)}</p>
                    </div>
                  ))}
                </div>

                {/* Tabs & Content */}
                <div className="glass-card overflow-hidden">
                  <div className="flex flex-col md:flex-row bg-[var(--panel-bg)] border-b border-[var(--card-border)] items-center justify-between px-6 pt-4">
                    <div className="flex gap-4">
                      {[
                        { id: 'graph', icon: ChartIcon, label: 'Visualization' },
                        { id: 'table', icon: TableIcon, label: 'Data Registry' },
                        { id: 'insights', icon: Brain, label: 'Logic Analysis' }
                      ].map(t => (
                        <button 
                          key={t.id} onClick={() => setActiveTab(t.id)}
                          className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-t-xl ${activeTab === t.id ? 'bg-[var(--bg-color)] text-[#00f2ff]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                        >
                          <t.icon size={14} /> {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Visibility Toggles specifically for Graph view */}
                    {activeTab === 'graph' && (
                      <div className="flex gap-4 pb-4 md:pb-0 px-2">
                        {[
                          { key: 'binomial', label: 'Binom', color: '#00f2ff' },
                          { key: 'poisson', label: 'Poisson', color: '#ff2e97' },
                          { key: 'normal', label: 'Normal', color: '#9d50bb' }
                        ].map(toggle => (
                          <button
                            key={toggle.key}
                            onClick={() => toggleVisibility(toggle.key)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${visibility[toggle.key] ? 'text-white' : 'text-[#94a3b8] opacity-30 grayscale'}`}
                            style={{ borderColor: toggle.color, backgroundColor: visibility[toggle.key] ? toggle.color + '33' : 'transparent' }}
                          >
                            {toggle.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-12 h-[680px] pb-[100px] overflow-y-auto relative">
                    {activeTab === 'graph' && (
                      <div className="w-full h-full pb-28 relative">
                        {/* LOGIC DISCLOSURE BADGES - DYNAMIC POSITIONING */}
                        <div className={`absolute ${!(results.canBinomial || results.canNormal) ? '-bottom-2' : '-bottom-14'} left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 min-w-[450px] transition-all duration-500`}>
                           {/* Binomial Logic Badge */}
                           {results.canBinomial && (
                              <div className="px-6 py-2 bg-[#10b98115] border border-[#10b98144] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.1)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                 <p className="text-[11px] font-black text-[#10b981] uppercase tracking-wider text-center">
                                    ✦ Since condition [n &gt; 50 and p &lt; 0.1] is true, we can also use Binomial graph instead.
                                 </p>
                              </div>
                           )}

                           {/* Normal Logic Badge */}
                           {results.canNormal && (
                              <div className="px-6 py-2 bg-[#9d50bb15] border border-[#9d50bb44] rounded-full shadow-[0_0_20px_rgba(157,80,187,0.1)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                 <p className="text-[11px] font-black text-[#9d50bb] uppercase tracking-wider text-center">
                                    ✦ Since condition [np &gt; 15 and n(1-p) &gt; 15] is true, we can also use Normal graph instead.
                                 </p>
                              </div>
                           )}

                           {/* MAIN RANGE PROBABILITY CARD */}
                           <div className="glass-card px-8 py-3 bg-[#111122]/90 border-[#00f2ff]/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-6 w-full justify-center mt-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse shadow-[0_0_10px_#00f2ff]" />
                              <div className="text-center">
                                 <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] mb-1 whitespace-nowrap">Range Exact Probability</p>
                                 <p className="text-xl font-black text-[#00f2ff] tracking-tighter transition-transform cursor-default">
                                    {(results.insights.exact_prob * 100).toFixed(4)}%
                                 </p>
                              </div>
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse shadow-[0_0_10px_#00f2ff]" />
                           </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={results.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="colorBinomial" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorPoisson" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff2e97" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ff2e97" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9d50bb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#9d50bb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis 
                              dataKey="k" 
                              stroke="#94a3b8" 
                              fontSize={10} 
                              axisLine={false} 
                              tickLine={false} 
                              label={{ value: "Number of Events (k)", fill: "#94a3b8", fontSize: 10, position: 'insideBottom', offset: -10, fontWeight: 'bold' }}
                            />
                            <YAxis 
                              stroke="#94a3b8" 
                              fontSize={10} 
                              axisLine={false} 
                              tickLine={false} 
                              label={{ value: "Probability P(X=k)", fill: "#94a3b8", fontSize: 10, angle: -90, position: 'insideLeft', offset: 0, fontWeight: 'bold' }}
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#111122', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                              itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                            />
                            
                            {/* HIGHLIGHTED TARGET AREA */}
                            <ReferenceArea 
                               x1={inputs.k_start} 
                               x2={inputs.k_end} 
                               fill="#00f2ff" 
                               fillOpacity={0.05} 
                            />
                            <ReferenceLine 
                              x={inputs.k_start} 
                              stroke="#00f2ff" 
                              strokeDasharray="3 3" 
                              strokeWidth={1}
                              label={{ position: 'insideBottomLeft', value: `START: ${inputs.k_start}`, fill: '#00f2ff', fontSize: 9, fontWeight: 'bold', offset: 10 }}
                            />
                            <ReferenceLine 
                              x={inputs.k_end} 
                              stroke="#00f2ff" 
                              strokeDasharray="3 3" 
                              strokeWidth={1}
                              label={{ position: 'insideBottomRight', value: `END: ${inputs.k_end}`, fill: '#00f2ff', fontSize: 9, fontWeight: 'bold', offset: 10 }}
                            />

                            {visibility.binomial && (
                              <Area type="monotone" dataKey="binomial" stroke="#00f2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorBinomial)" name="Binom" />
                            )}
                            {visibility.poisson && (
                              <Area type="monotone" dataKey="poisson" stroke="#ff2e97" strokeWidth={3} fillOpacity={1} fill="url(#colorPoisson)" name="Poisson" />
                            )}
                            {visibility.normal && results.distributions.normal && (
                               <Area type="monotone" dataKey="normal" stroke="#9d50bb" strokeWidth={3} fillOpacity={1} fill="url(#colorNormal)" name="Normal" />
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {activeTab === 'table' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-white/5">
                              <th className="pb-4">Input K</th>
                              <th className="pb-4">Binomial Curve</th>
                              <th className="pb-4">Poisson Map</th>
                              <th className="pb-4">Normal Matrix</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm font-bold">
                            {results.chartData.map(row => (
                              <tr key={row.k} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 text-[#00f2ff]">{row.k}</td>
                                <td className="py-4">{row.binomial.toFixed(5)}</td>
                                <td className="py-4 text-[#ff2e97]/80">{row.poisson.toFixed(5)}</td>
                                <td className="py-4 text-[#9d50bb]/80">{row.normal ? row.normal.toFixed(5) : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

              {/* INSIGHTS TAB */}
              {activeTab === 'insights' && (
                 <div className="space-y-6">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-black uppercase tracking-widest text-[#00f2ff]">Cumulative Variance Analyst</h3>
                     {/* <span className="text-[10px] font-bold text-[#94a3b8] bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">Logic: P(X ≤ {inputs.k})</span> */}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                       <div className="glass-card p-6 border-l-4 border-[#00f2ff]">
                         <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-tighter mb-1">Binomial Cumulative Exact</p>
                         <p className="text-3xl font-black">{results.insights.exact_prob.toFixed(5)}</p>
                       </div>
                       
                       <div className="glass-card p-6 border-l-4 border-[#ff2e97]">
                         <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-tighter mb-1">Poisson Cumulative Approx</p>
                         <div className="flex items-end justify-between">
                            <p className="text-3xl font-black text-[#ff2e97]">{results.insights.poisson_approx.toFixed(5)}</p>
                            <div className="text-right">
                              <p className="text-[8px] font-black text-[#94a3b8] uppercase">Delta Error</p>
                              <p className="text-sm font-black text-white">{results.insights.poisson_error.toFixed(6)}</p>
                            </div>
                         </div>
                       </div>

                       {results.insights.normal_approx !== null && (
                         <div className="glass-card p-6 border-l-4 border-[#9d50bb]">
                           <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-tighter mb-1">Normal Cumulative Approx</p>
                           <div className="flex items-end justify-between">
                              <p className="text-3xl font-black text-[#9d50bb]">{results.insights.normal_approx.toFixed(5)}</p>
                              <div className="text-right">
                                <p className="text-[8px] font-black text-[#94a3b8] uppercase">Delta Error</p>
                                <p className="text-sm font-black text-white">{results.insights.normal_error.toFixed(6)}</p>
                              </div>
                           </div>
                         </div>
                       )}
                     </div>

                     <div className="bg-black/20 rounded-3xl p-8 border border-white/5 space-y-6">
                       <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                          <Info size={14} className="text-[#00f2ff]" /> Some Additional Information
                       </h4>
                       <p className="text-[13px] text-[#94a3b8] font-medium leading-relaxed">
                         The engine is now calculating <b>Cumulative Probability</b>. This represents the total probability of observing <b>between 0 and {inputs.k}</b> independent events.
                       </p>
                       <div className="space-y-4">
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase text-[#00f2ff] mb-2">Poisson Rule</p>
                            <p className="text-[13px] text-[#94a3b8] font-bold">Good approx if n &gt; 50 and p &lt; 0.1.</p>
                         </div>
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase text-[#ff2e97] mb-2">Normal Rule</p>
                            <p className="text-[13px] text-[#94a3b8] font-bold">Good approx if np &gt; 15 and n(1-p) &gt; 15.</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div> 
              )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
