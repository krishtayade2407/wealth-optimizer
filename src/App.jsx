import React, { useState, useMemo } from 'react';

// ==========================================
// UTILITY & FORMATTING FUNCTIONS
// ==========================================
const formatINR = (val, compact = true) => {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Math.round(val);
  if (compact) {
    if (Math.abs(num) >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (Math.abs(num) >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    if (Math.abs(num) >= 1000) return `₹${(num / 1000).toFixed(1)} k`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// ==========================================
// INLINE SVG ICONS (DEPENDENCY-FREE)
// ==========================================
const Icon = {
  ShieldAlert: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
  ),
  TrendingUp: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
  ),
  PieChart: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
  ),
  DollarSign: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  ),
  Scale: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
  ),
  Layers: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
  ),
  Code: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
  ),
  Download: () => (
    <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
  ),
  Zap: () => (
    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
  )
};

// ==========================================
// SVG PIE / DONUT CHART
// ==========================================
const DonutChart = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  if (total <= 0) return <div className="text-center py-8 text-slate-400">No Allocation Data</div>;

  let cumulativeAngle = 0;
  const slices = data.map((item) => {
    const percentage = item.value / total;
    const startAngle = cumulativeAngle;
    const angle = percentage * 360;
    cumulativeAngle += angle;

    const x1 = 100 + 70 * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = 100 + 70 * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = 100 + 70 * Math.cos((Math.PI * (startAngle + angle - 90)) / 180);
    const y2 = 100 + 70 * Math.sin((Math.PI * (startAngle + angle - 90)) / 180);
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    return { ...item, pathData, percentage: (percentage * 100).toFixed(1) };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative w-52 h-52 flex-shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {slices.map((slice, idx) => (
            <path key={idx} d={slice.pathData} fill={slice.color} className="transition-all duration-300 hover:opacity-85 cursor-pointer" />
          ))}
          <circle cx="100" cy="100" r="45" fill="#0f172a" />
          <text x="100" y="96" textAnchor="middle" fill="#94a3b8" fontSize="9" className="font-semibold">PORTFOLIO</text>
          <text x="100" y="112" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{formatINR(total, true)}</text>
        </svg>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs w-full max-w-md">
        {slices.map((slice, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }}></span>
              <span className="text-slate-200 font-medium truncate max-w-[110px]">{slice.name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-100 font-bold block">{formatINR(slice.value, true)}</span>
              <span className="text-slate-400 text-[10px]">{slice.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// SVG MULTI-LINE PROJECTION CHART
// ==========================================
const ProjectionLineChart = ({ series, xLabels }) => {
  const padding = 40;
  const width = 600;
  const height = 240;

  const allValues = series.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues, 10000);
  const minVal = 0;

  const getX = (idx) => padding + (idx / (xLabels.length - 1)) * (width - 2 * padding);
  const getY = (val) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = height - padding - ratio * (height - 2 * padding);
          const val = maxVal * ratio;
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#334155" strokeDasharray="3 3" />
              <text x={padding - 5} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9">{formatINR(val, true)}</text>
            </g>
          );
        })}

        {xLabels.map((label, idx) => {
          const x = getX(idx);
          return (
            <g key={idx}>
              <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="#1e293b" />
              <text x={x} y={height - padding + 15} textAnchor="middle" fill="#64748b" fontSize="10">{label}</text>
            </g>
          );
        })}

        {series.map((s, sIdx) => {
          const pathD = s.data.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`).join(' ');
          return (
            <g key={sIdx}>
              <path d={pathD} fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {s.data.map((val, idx) => (
                <circle key={idx} cx={getX(idx)} cy={getY(val)} r="3" fill={s.color} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {series.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
            <span>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('benchmark');

  // Demographic State
  const [userInfo, setUserInfo] = useState({
    age: 28,
    monthlyIncome: 85000,
    netWorth: 3000000,
    timeHorizonYears: 10,
  });

  // Default Algorithmic Engine Calculations
  const benchmarkCalc = useMemo(() => {
    const age = Math.max(18, Math.min(80, userInfo.age));
    const netWorth = Math.max(100000, userInfo.netWorth);
    const monthlyInc = Math.max(10000, userInfo.monthlyIncome);

    const bankEmergency = 100000;
    const liquidEmergency = 24 * monthlyInc;
    const compulsoryGold = netWorth * 0.05;

    const investablePool = Math.max(0, netWorth * 0.95 - (bankEmergency + liquidEmergency));
    
    const p2pUncapped = investablePool * 0.15;
    const p2pLending = Math.min(5000000, p2pUncapped);
    
    const remainingBalance = Math.max(0, investablePool - p2pLending);
    const silverETF = remainingBalance * 0.20;
    const totalEquityPool = remainingBalance * 0.80;

    const rawSmallCap = Math.max(0, (100 - age) * 0.55);
    const rawMidCap = Math.max(0, (100 - age) * 0.30);
    const rawLargeCap = Math.max(0, 100 - (rawSmallCap + rawMidCap));

    const smallCapAmt = (totalEquityPool * rawSmallCap) / 100;
    const midCapAmt = (totalEquityPool * rawMidCap) / 100;
    const largeCapAmt = (totalEquityPool * rawLargeCap) / 100;

    const weightedReturnRate =
      (bankEmergency * 0.035 +
        liquidEmergency * 0.065 +
        compulsoryGold * 0.10 +
        p2pLending * 0.16 +
        silverETF * 0.12 +
        smallCapAmt * 0.16 +
        midCapAmt * 0.14 +
        largeCapAmt * 0.12) / netWorth;

    const riskScore = Math.round(
      (smallCapAmt / netWorth) * 95 +
      (p2pLending / netWorth) * 90 +
      (midCapAmt / netWorth) * 75 +
      (silverETF / netWorth) * 60 +
      (largeCapAmt / netWorth) * 45 +
      (compulsoryGold / netWorth) * 20 +
      (liquidEmergency / netWorth) * 10
    );

    const growthLabels = Array.from({ length: userInfo.timeHorizonYears + 1 }, (_, i) => `Yr ${i}`);
    const growthData = growthLabels.map((_, yr) => Math.round(netWorth * Math.pow(1 + weightedReturnRate, yr)));

    return {
      bankEmergency,
      liquidEmergency,
      compulsoryGold,
      investablePool,
      p2pLending,
      silverETF,
      totalEquityPool,
      smallCapAmt,
      midCapAmt,
      largeCapAmt,
      smallCapPct: rawSmallCap.toFixed(1),
      midCapPct: rawMidCap.toFixed(1),
      largeCapPct: rawLargeCap.toFixed(1),
      portfolioCAGR: (weightedReturnRate * 100).toFixed(2),
      riskScore,
      growthLabels,
      growthData,
    };
  }, [userInfo]);

  // Custom Multi-Strategy Engine State
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'P2P + SmallCap Sequential Growth',
      initialCapital: 500000,
      monthlySIP: 15000,
      interestRate: 16,
      calcType: 'compounding',
      horizonYears: 10,
      reinvestAfterMonths: 36,
      targetAsset: 'MidCap Mutual Fund'
    },
    {
      id: 2,
      name: 'Conservative LargeCap + Gold Shift',
      initialCapital: 500000,
      monthlySIP: 15000,
      interestRate: 12,
      calcType: 'simple',
      horizonYears: 10,
      reinvestAfterMonths: 24,
      targetAsset: 'Gold ETF'
    }
  ]);

  // Custom Strategy Form Input State
  const [newStratName, setNewStratName] = useState('');
  const [newStratCap, setNewStratCap] = useState(100000);
  const [newStratSip, setNewStratSip] = useState(5000);
  const [newStratRate, setNewStratRate] = useState(14);
  const [newStratType, setNewStratType] = useState('compounding');
  const [newStratHorizon, setNewStratHorizon] = useState(10);
  const [newStratReinvestMonths, setNewStratReinvestMonths] = useState(24);
  const [newStratTargetAsset, setNewStratTargetAsset] = useState('LargeCap Fund');

  const addCustomStrategy = () => {
    if (!newStratName) return;
    setStrategies([
      ...strategies,
      {
        id: Date.now(),
        name: newStratName,
        initialCapital: Number(newStratCap),
        monthlySIP: Number(newStratSip),
        interestRate: Number(newStratRate),
        calcType: newStratType,
        horizonYears: Number(newStratHorizon),
        reinvestAfterMonths: Number(newStratReinvestMonths),
        targetAsset: newStratTargetAsset
      }
    ]);
    setNewStratName('');
  };

  const deleteStrategy = (id) => {
    setStrategies(strategies.filter((s) => s.id !== id));
  };

  // Loans State
  const [loans, setLoans] = useState([
    { id: 1, name: 'Home Loan', amount: 2500000, rate: 8.5, tenureMonths: 180, monthlyEmi: 24600 },
    { id: 2, name: 'Personal Loan', amount: 300000, rate: 13.5, tenureMonths: 36, monthlyEmi: 10100 }
  ]);
  const [newLoanName, setNewLoanName] = useState('');
  const [newLoanAmount, setNewLoanAmount] = useState(200000);
  const [newLoanRate, setNewLoanRate] = useState(11.5);
  const [newLoanEmi, setNewLoanEmi] = useState(5000);

  const addLoan = () => {
    if (!newLoanName) return;
    setLoans([
      ...loans,
      {
        id: Date.now(),
        name: newLoanName,
        amount: Number(newLoanAmount),
        rate: Number(newLoanRate),
        tenureMonths: 36,
        monthlyEmi: Number(newLoanEmi)
      }
    ]);
    setNewLoanName('');
  };

  const deleteLoan = (id) => {
    setLoans(loans.filter((l) => l.id !== id));
  };

  // Arbitrage Decision Engine Logic (1.0% Hurdle Spread Requirement)
  const arbitrageAnalysis = useMemo(() => {
    if (loans.length === 0) return { decision: 'NO_DEBT', highestInterestLoan: null };

    const highestInterestLoan = [...loans].sort((a, b) => b.rate - a.rate)[0];
    const bestInvestYield = 16.0; // P2P / SmallCap benchmark rate
    const netSpread = bestInvestYield - highestInterestLoan.rate;
    const hurdleMet = netSpread >= 1.0;

    return {
      highestInterestLoan,
      bestInvestYield,
      netSpread: netSpread.toFixed(2),
      hurdleMet,
      recommendedAction: hurdleMet 
        ? `INVESTMENT ARBITRAGE OPTIMAL: Expected return (${bestInvestYield}%) beats high loan rate (${highestInterestLoan.rate}%) by ${netSpread.toFixed(2)}% (≥ 1.0% hurdle requirement). Prioritize investing spare capital.`
        : `DEBT PAYOFF PRIORITY: Net spread (${netSpread.toFixed(2)}%) is below the 1.0% risk hurdle requirement. Direct spare capital into loan prepayments immediately.`
    };
  }, [loans]);

  // Download State JSON Backup
  const exportProjectData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ userInfo, strategies, loans }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Financial_Strategy_Optimization_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const chartData = [
    { name: 'Bank Cash', value: benchmarkCalc.bankEmergency, color: '#f59e0b' },
    { name: 'Liquid Buffer (24x)', value: benchmarkCalc.liquidEmergency, color: '#3b82f6' },
    { name: 'Gold ETF (5%)', value: benchmarkCalc.compulsoryGold, color: '#eab308' },
    { name: 'P2P Lending (16%)', value: benchmarkCalc.p2pLending, color: '#6366f1' },
    { name: 'Silver ETF', value: benchmarkCalc.silverETF, color: '#06b6d4' },
    { name: 'Small Cap Fund', value: benchmarkCalc.smallCapAmt, color: '#f43f5e' },
    { name: 'Mid Cap Fund', value: benchmarkCalc.midCapAmt, color: '#f97316' },
    { name: 'Large Cap Fund', value: benchmarkCalc.largeCapAmt, color: '#10b981' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Top Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-emerald-500 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Icon.TrendingUp />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">WealthArchitect FSD</h1>
              <p className="text-xs text-slate-400">Algorithmic Portfolio Optimization & Debt Arbitrage Engine</p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm">
            {[
              { id: 'benchmark', label: 'Default Allocation', icon: Icon.PieChart },
              { id: 'custom', label: 'Strategy Builder', icon: Icon.Layers },
              { id: 'loan', label: 'Debt Arbitrage', icon: Icon.Scale },
              { id: 'comparison', label: 'Master Matrix', icon: Icon.Sparkles },
              { id: 'fsd', label: 'FSD Architecture', icon: Icon.Code }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all font-medium ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <TabIcon /> <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={exportProjectData}
            className="hidden lg:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold transition"
          >
            <Icon.Download /> Export State
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Demographic Controls */}
        <section className="mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-2">
              <Icon.Sparkles /> Global Investor Inputs
            </h2>
            <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-800/50 px-2.5 py-0.5 rounded-full font-medium">
              Live Algorithmic Synchronization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-semibold">Investor Age</label>
                <span className="text-sm font-bold text-indigo-400">{userInfo.age} Yrs</span>
              </div>
              <input
                type="range" min="18" max="75" value={userInfo.age}
                onChange={(e) => setUserInfo({ ...userInfo, age: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>18 (Aggressive)</span>
                <span>75 (Conservative)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Monthly Income (₹)</label>
              <input
                type="number" value={userInfo.monthlyIncome}
                onChange={(e) => setUserInfo({ ...userInfo, monthlyIncome: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-indigo-300 focus:outline-none focus:border-indigo-500 font-semibold"
              />
              <div className="text-[10px] text-slate-500 mt-1">24x Liquid Buffer: {formatINR(userInfo.monthlyIncome * 24)}</div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Total Net Worth (₹)</label>
              <input
                type="number" value={userInfo.netWorth}
                onChange={(e) => setUserInfo({ ...userInfo, netWorth: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 focus:outline-none focus:border-emerald-500 font-semibold"
              />
              <div className="text-[10px] text-slate-500 mt-1">5% Gold Hedge: {formatINR(userInfo.netWorth * 0.05)}</div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Horizon Timeline (Years)</label>
              <input
                type="number" value={userInfo.timeHorizonYears} min="5" max="30"
                onChange={(e) => setUserInfo({ ...userInfo, timeHorizonYears: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>
        </section>

        {/* TAB 1: DEFAULT ALLOCATION */}
        {activeTab === 'benchmark' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30">
                    System Default Benchmark
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">Age-Optimized Dynamic Portfolio</h2>
                  <p className="text-slate-400 text-xs mt-1">Automated compounding strategy with compulsory emergency buffers and gold hedging.</p>
                </div>

                <div className="flex items-center gap-6 bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <div>
                    <div className="text-[11px] text-slate-400">Projected Portfolio CAGR</div>
                    <div className="text-2xl font-black text-emerald-400">{benchmarkCalc.portfolioCAGR}%</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Risk Score Index: <strong className="text-amber-400">{benchmarkCalc.riskScore}/100</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Allocation Graphic */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-6">Asset Class Allocation Breakdown</h3>
              <DonutChart data={chartData} />
            </div>

            {/* Compulsory Reserve Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Icon.DollarSign />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">Mandatory Cash</span>
                </div>
                <div className="text-xs text-slate-400">Bank Emergency Liquidity</div>
                <div className="text-xl font-bold text-white mt-1">{formatINR(benchmarkCalc.bankEmergency)}</div>
                <p className="text-[11px] text-slate-500 mt-2">Instant-access bank balance for immediate living needs.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Icon.ShieldAlert />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">24x Monthly Income</span>
                </div>
                <div className="text-xs text-slate-400">Liquid Emergency Fund</div>
                <div className="text-xl font-bold text-white mt-1">{formatINR(benchmarkCalc.liquidEmergency)}</div>
                <p className="text-[11px] text-slate-500 mt-2">Locked reserve protecting against prolonged income loss.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
                    <Icon.Sparkles />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded">5% Net Worth</span>
                </div>
                <div className="text-xs text-slate-400">Gold ETF Hedge</div>
                <div className="text-xl font-bold text-white mt-1">{formatINR(benchmarkCalc.compulsoryGold)}</div>
                <p className="text-[11px] text-slate-500 mt-2">Inflation protection commodity buffer.</p>
              </div>
            </div>

            {/* Remaining Investable Capital & Equity Mix */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-1">95% Investable Capital Surplus Breakdown</h3>
              <p className="text-xs text-slate-400 mb-6">Investable Surplus after Reserves: <span className="text-indigo-400 font-bold">{formatINR(benchmarkCalc.investablePool)}</span></p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">P2P Lending (16% p.a.)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{formatINR(benchmarkCalc.p2pLending)}</div>
                  <div className="text-[11px] text-slate-500 mt-1">15% Surplus (Max ₹50L Cap)</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Silver ETF (3% Dip Strategy)</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">{formatINR(benchmarkCalc.silverETF)}</div>
                  <div className="text-[11px] text-slate-500 mt-1">1/5th Remaining Surplus</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Equity Mutual Funds Pool</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{formatINR(benchmarkCalc.totalEquityPool)}</div>
                  <div className="text-[11px] text-slate-500 mt-1">4/5ths Remaining Surplus</div>
                </div>
              </div>

              {/* Age-Based Equity Partition Cards */}
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">Age-Driven Equity Partitioning ({userInfo.age} Years Old)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-slate-950 p-5 rounded-xl border border-rose-500/30">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Small Cap Fund (16% p.a.)</span>
                    <span className="text-rose-400 font-bold">{benchmarkCalc.smallCapPct}%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{formatINR(benchmarkCalc.smallCapAmt)}</div>
                  <div className="mt-4 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2">
                    <Icon.ShieldAlert />
                    <p className="text-[10px] text-rose-200">
                      <strong>Risk Warning:</strong> Holding for &lt; 10 years carries high short-term loss risk. Strictly for long horizons.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Mid Cap Fund (14% p.a.)</span>
                    <span className="text-amber-400 font-bold">{benchmarkCalc.midCapPct}%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{formatINR(benchmarkCalc.midCapAmt)}</div>
                  <p className="text-[11px] text-slate-400 mt-4">Balanced growth spread over 10-year holding periods.</p>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Large Cap Fund (12% p.a.)</span>
                    <span className="text-emerald-400 font-bold">{benchmarkCalc.largeCapPct}%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{formatINR(benchmarkCalc.largeCapAmt)}</div>
                  <p className="text-[11px] text-slate-400 mt-4">Bluechip anchor portfolio providing capital defense.</p>
                </div>

              </div>
            </div>

            {/* Projection Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Default Portfolio Compound Wealth Trajectory</h3>
              <ProjectionLineChart 
                series={[{ name: 'Default Plan Wealth', data: benchmarkCalc.growthData, color: '#10b981' }]} 
                xLabels={benchmarkCalc.growthLabels} 
              />
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGY BUILDER */}
        {activeTab === 'custom' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add Custom Strategy Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Icon.Plus /> Create Custom Strategy
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Strategy Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. High Yield Aggressive" 
                      value={newStratName} 
                      onChange={(e) => setNewStratName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Initial Capital (₹)</label>
                    <input 
                      type="number" 
                      value={newStratCap} 
                      onChange={(e) => setNewStratCap(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Monthly SIP (₹)</label>
                    <input 
                      type="number" 
                      value={newStratSip} 
                      onChange={(e) => setNewStratSip(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Expected Rate (%)</label>
                      <input 
                        type="number" 
                        value={newStratRate} 
                        onChange={(e) => setNewStratRate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Interest Type</label>
                      <select 
                        value={newStratType} 
                        onChange={(e) => setNewStratType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="compounding">Compounding</option>
                        <option value="simple">Simple</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Shift Target Asset After (Months)</label>
                    <input 
                      type="number" 
                      value={newStratReinvestMonths} 
                      onChange={(e) => setNewStratReinvestMonths(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Target Reinvestment Asset</label>
                    <input 
                      type="text" 
                      value={newStratTargetAsset} 
                      onChange={(e) => setNewStratTargetAsset(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button 
                    onClick={addCustomStrategy}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    <Icon.Plus /> Save Strategy
                  </button>
                </div>
              </div>

              {/* Strategy Cards List */}
              <div className="lg:col-span-2 space-y-6">
                {strategies.map((st) => {
                  const r = st.interestRate / 100;
                  const n = st.horizonYears;
                  const P = st.initialCapital;
                  const pmt = st.monthlySIP;

                  let finalValue = 0;
                  if (st.calcType === 'compounding') {
                    const lumpSumFV = P * Math.pow(1 + r, n);
                    const sipFV = pmt * (((Math.pow(1 + r / 12, n * 12) - 1) / (r / 12)) * (1 + r / 12));
                    finalValue = lumpSumFV + sipFV;
                  } else {
                    const lumpSumFV = P * (1 + r * n);
                    const totalSipCapital = pmt * 12 * n;
                    const sipInterest = totalSipCapital * (r / 2);
                    finalValue = lumpSumFV + totalSipCapital + sipInterest;
                  }

                  return (
                    <div key={st.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
                      <button 
                        onClick={() => deleteStrategy(st.id)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition"
                        title="Delete Strategy"
                      >
                        <Icon.Trash />
                      </button>

                      <div className="flex justify-between items-start mb-4 pr-6">
                        <div>
                          <h4 className="font-bold text-lg text-white">{st.name}</h4>
                          <span className="text-[11px] text-slate-400">Target Horizon: {st.horizonYears} Years</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                          st.calcType === 'compounding' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {st.calcType} Interest
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
                        <div>
                          <div className="text-[11px] text-slate-500">Initial Capital</div>
                          <div className="text-sm font-bold text-white">{formatINR(st.initialCapital)}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-500">Monthly SIP</div>
                          <div className="text-sm font-bold text-white">{formatINR(st.monthlySIP)}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-500">Annual Yield</div>
                          <div className="text-sm font-bold text-emerald-400">{st.interestRate}% p.a.</div>
                        </div>
                      </div>

                      <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl mb-4 text-xs text-indigo-200 flex items-center gap-2">
                        <Icon.ChevronRight />
                        <span>Sequential Rule: Reinvest profit gains into <strong>{st.targetAsset}</strong> after <strong>{st.reinvestAfterMonths} months</strong>.</span>
                      </div>

                      <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                        <span className="text-xs text-slate-400">Projected 10-Year Wealth</span>
                        <div className="text-2xl font-extrabold text-emerald-400">{formatINR(finalValue)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOAN ARBITRAGE OPTIMIZER */}
        {activeTab === 'loan' && (
          <div className="space-y-8">
            
            {/* Arbitrage Rule Decision Card */}
            <div className={`border rounded-2xl p-6 ${arbitrageAnalysis.hurdleMet ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-rose-950/30 border-rose-500/40'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${arbitrageAnalysis.hurdleMet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  <Icon.Zap />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Algorithmic Arbitrage Decision (1.0% Hurdle Enforced)</h3>
                  <p className="text-sm mt-1 text-slate-300 font-medium">{arbitrageAnalysis.recommendedAction}</p>
                </div>
              </div>
            </div>

            {/* Loan Portfolio & Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add Loan Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Icon.Plus /> Add Active Loan
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Loan Name</label>
                    <input 
                      type="text" placeholder="e.g. Car Loan" value={newLoanName}
                      onChange={(e) => setNewLoanName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Principal Amount (₹)</label>
                    <input 
                      type="number" value={newLoanAmount}
                      onChange={(e) => setNewLoanAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Interest Rate (%)</label>
                    <input 
                      type="number" value={newLoanRate}
                      onChange={(e) => setNewLoanRate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Monthly EMI (₹)</label>
                    <input 
                      type="number" value={newLoanEmi}
                      onChange={(e) => setNewLoanEmi(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button 
                    onClick={addLoan}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
                  >
                    <Icon.Plus /> Add Loan to Portfolio
                  </button>
                </div>
              </div>

              {/* Active Loans List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Active Loans List</h3>
                {loans.map((loan) => (
                  <div key={loan.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white">{loan.name}</h4>
                        <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 bg-rose-500/10 rounded">{loan.rate}% Interest</span>
                      </div>
                      <div className="text-xl font-bold text-slate-200 mt-1">{formatINR(loan.amount)}</div>
                      <div className="text-xs text-slate-500 mt-1">Monthly EMI: {formatINR(loan.monthlyEmi)}</div>
                    </div>
                    <button 
                      onClick={() => deleteLoan(loan.id)} 
                      className="text-slate-500 hover:text-rose-400 p-2"
                      title="Delete Loan"
                    >
                      <Icon.Trash />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: MASTER COMPARISON MATRIX */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Master Strategy Matrix</h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Strategy Name</th>
                      <th className="p-4">Risk Index</th>
                      <th className="p-4">Expected CAGR</th>
                      <th className="p-4">10-Yr Projected Value</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="bg-indigo-950/20">
                      <td className="p-4 font-bold text-white">Default Benchmark Plan</td>
                      <td className="p-4 text-amber-400 font-bold">{benchmarkCalc.riskScore}/100</td>
                      <td className="p-4 text-emerald-400 font-bold">{benchmarkCalc.portfolioCAGR}%</td>
                      <td className="p-4 font-bold text-white">{formatINR(userInfo.netWorth * Math.pow(1 + Number(benchmarkCalc.portfolioCAGR)/100, 10))}</td>
                      <td className="p-4"><span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold">System Default</span></td>
                    </tr>
                    {strategies.map((s) => (
                      <tr key={s.id}>
                        <td className="p-4 font-medium text-slate-200">{s.name}</td>
                        <td className="p-4 text-slate-400">Custom</td>
                        <td className="p-4 text-emerald-400 font-bold">{s.interestRate}%</td>
                        <td className="p-4 font-bold text-slate-200">{formatINR(s.initialCapital * Math.pow(1 + s.interestRate/100, 10))}</td>
                        <td className="p-4"><span className="px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full text-[10px]">User Custom</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FSD ARCHITECTURE & API SPECS */}
        {activeTab === 'fsd' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Icon.Code /> Full-Stack Architecture Specifications
              </h3>
              <p className="text-xs text-slate-400">Presentation documentation for project submission and evaluator viva.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="font-bold text-indigo-400 text-sm mb-3">Backend REST API Endpoints</h4>
                <ul className="space-y-3 font-mono text-slate-300">
                  <li className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400">GET</span> /api/default-plan?age=28&income=85000
                  </li>
                  <li className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-indigo-400">POST</span> /api/strategies (Creates sequential plan)
                  </li>
                  <li className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-indigo-400">POST</span> /api/arbitrage-check (1.0% hurdle check)
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="font-bold text-indigo-400 text-sm mb-3">Core Financial Formulas</h4>
                <ul className="space-y-2 text-slate-300">
                  <li><strong>Small Cap Equity %:</strong> (100 - Age) * 0.55</li>
                  <li><strong>Mid Cap Equity %:</strong> (100 - Age) * 0.30</li>
                  <li><strong>Large Cap Equity %:</strong> Remainder</li>
                  <li><strong>P2P Cap Rule:</strong> Min(15% Investable Pool, ₹50,00,000)</li>
                  <li><strong>Debt Arbitrage Rule:</strong> Invest only if Return &ge; (Loan Rate + 1.0%)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
