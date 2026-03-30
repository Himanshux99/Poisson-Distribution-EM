import { useNavigate } from 'react-router-dom';
import { BarChart3, Scale, Globe, ArrowRight, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center px-6 py-12 md:py-24 overflow-x-hidden">
      {/* Background Glow Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9d50bb33] blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00f2ff22] blur-[100px] rounded-full -z-10"></div>

      {/* Hero Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl"
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-[#00f2ff] uppercase bg-[#00f2ff11] border border-[#00f2ff33] rounded-full">
          v2.0 • Powered by Python & React
        </span>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] text-white">
          Distribution <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-[#9d50bb] to-[#ff2e97]">
            Laboratory
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[#94a3b8] mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
          The ultimate engine for visualizing, comparing, and analyzing probability models with high-fidelity neon precision.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 242, 255, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/analysis')}
            className="group flex items-center gap-3 bg-[#00f2ff] text-[#1a1a2e] font-black px-10 py-5 rounded-2xl text-xl transition-all"
          >
            LAUNCH APP
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <a href="#theory" className="text-[#94a3b8] hover:text-white font-bold tracking-wide transition-colors">
            EXPLORE THEORY
          </a>
        </div>
      </motion.div>

      {/* Feature Section grid */}
      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl mt-32">
        {[
          { 
            icon: BarChart3, 
            color: "#00f2ff", 
            title: "Simultis Plotting", 
            desc: "Simultaneously render Binomial, Poisson, and Normal curves on a single high-performance chart." 
          },
          { 
            icon: Scale, 
            color: "#ff2e97", 
            title: "Error Analysis", 
            desc: "Advanced delta-metric tracking for exact probability vs. approximation deviations." 
          },
          { 
            icon: Globe, 
            color: "#9d50bb", 
            title: "Real-world Logic", 
            desc: "Built-in scenario engine for Call Centers, Web Traffic, and Accident risk forecasting." 
          }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative glass-card p-10 group overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} style={{ backgroundImage: `linear-gradient(to bottom right, ${feature.color}, transparent)` }}></div>
            
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
              style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}33` }}
            >
              <feature.icon size={32} stroke={feature.color} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-[#94a3b8] leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Theoretical Briefing Section - STANDALONE */}
      <section id="theory" className="w-full max-w-6xl mt-32 space-y-12 mb-20">
        <div className="text-center space-y-4">
           <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Theoretical Briefing</h2>
           <p className="text-[#94a3b8] max-w-xl mx-auto italic text-xs uppercase tracking-[0.3em] font-bold opacity-80">Mathematical Architecture of the Poisson Engine</p>
           <div className="w-24 h-1 bg-gradient-to-r from-[#00f2ff] to-[#ff2e97] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4">
           {/* Formula Card */}
           <div className="glass-card p-10 relative overflow-hidden group border-t-2 border-t-[#00f2ff44]">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap size={140} className="text-[#00f2ff]" />
              </div>
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00f2ff11] flex items-center justify-center border border-[#00f2ff33]">
                       <span className="text-[#00f2ff] font-black text-lg">λ</span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff]">The Poisson Formula</h3>
                 </div>

                 <div className="bg-black/40 rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center justify-center gap-8 shadow-inner">
                    <div className="text-center italic text-xl md:text-2xl font-serif text-[#00f2ff] tracking-widest leading-relaxed">
                       P(X = k) = <span className="inline-block align-middle text-center"><span className="block border-b border-white/20 pb-2">λ<sup>k</sup> e<sup>-λ</sup></span><span className="block pt-2">k!</span></span>
                    </div>
                    <div className="grid grid-cols-2 gap-8 w-full border-t border-white/5 pt-8">
                       <div className="text-center">
                          <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-2">λ (Lambda)</p>
                          <p className="text-[11px] text-white/90 leading-relaxed italic uppercase tracking-tighter font-black">Avg Rate of occurrence</p>
                       </div>
                       <div className="text-center border-l border-white/5">
                          <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-2">k (Events)</p>
                          <p className="text-[11px] text-white/90 leading-relaxed italic uppercase tracking-tighter font-black">Exact Target Occurrences</p>
                       </div>
                    </div>
                 </div>

                 <p className="text-sm text-[#94a3b8] leading-relaxed font-medium bg-[#00f2ff05] p-6 rounded-2xl border border-[#00f2ff11]">
                    The Poisson distribution models the probability of a given number of events occurring in a fixed interval of time or space if these events occur with a known constant mean rate and independently of the time since the last event.
                 </p>
              </div>
           </div>

           {/* Examples Card */}
           <div className="glass-card p-10 space-y-10 border-t-2 border-t-[#ff2e9744] overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Activity size={140} className="text-[#ff2e97]" />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-[#ff2e9711] flex items-center justify-center border border-[#ff2e9733]">
                      <Activity size={20} className="text-[#ff2e97]" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#ff2e97]">Empirical Use Cases</h3>
                </div>

                <div className="space-y-4">
                   {[
                      { title: "Call Center Load", desc: "Modeling the number of incoming customer service calls received per hour at a desk." },
                      { title: "Industrial Safety", desc: "Analyzing the occurrence of specific equipment failure or accidents within a factory per year." },
                      { title: "Network Architecture", desc: "Predicting the number of users landing on a server per minute during traffic bursts." },
                      { title: "Urban Dynamics", desc: "The number of cars passing through a specific intersection every 10-minute cycle." }
                   ].map((ex, i) => (
                      <div key={i} className="group p-5 bg-white/5 border border-white/5 rounded-[1.5rem] hover:border-[#ff2e9755] hover:bg-[#ff2e970a] transition-all duration-300">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-1 rounded-full bg-[#ff2e97] group-hover:scale-150 transition-transform"></div>
                            <p className="text-xs font-black uppercase tracking-widest text-white group-hover:text-[#ff2e97] transition-colors">{ex.title}</p>
                         </div>
                         <p className="text-[11px] text-[#94a3b8] leading-relaxed font-medium italic pl-4 opacity-80">{ex.desc}</p>
                      </div>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </section>

      <footer className="w-full py-12 border-t border-white/5 flex flex-col items-center gap-4">
        <p className="text-[#94a3b8] text-[10px] tracking-[0.5em] font-black uppercase opacity-30">
          DISTRIBUTION LABORATORY • SYSTEMS OPERATIONAL
        </p>
        <div className="flex gap-4 opacity-20 hover:opacity-100 transition-opacity duration-500">
           <div className="w-1 h-1 rounded-full bg-[#00f2ff]"></div>
           <div className="w-1 h-1 rounded-full bg-[#ff2e97]"></div>
           <div className="w-1 h-1 rounded-full bg-[#9d50bb]"></div>
        </div>
      </footer>
    </div>
  );
}
