const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Database (Per-session persistence for presentation)
let userStrategies = [
  {
    id: 1,
    name: 'P2P + SmallCap Sequential Growth',
    initialCapital: 500000,
    monthlySIP: 15000,
    calcType: 'compounding',
    interestRate: 16,
    horizonYears: 10,
    reinvestAfterMonths: 36,
    targetAsset: 'MidCap Mutual Fund'
  },
  {
    id: 2,
    name: 'Conservative LargeCap + Gold Shift',
    initialCapital: 500000,
    monthlySIP: 15000,
    calcType: 'simple',
    interestRate: 12,
    horizonYears: 10,
    reinvestAfterMonths: 24,
    targetAsset: 'Gold ETF'
  }
];

let userLoans = [
  { id: 1, name: 'Home Loan', amount: 2500000, rate: 8.5, tenureMonths: 180, monthlyEmi: 24600 },
  { id: 2, name: 'Personal Loan', amount: 300000, rate: 13.5, tenureMonths: 36, monthlyEmi: 10100 }
];

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Calculate Default Algorithmic Portfolio Plan
app.get('/api/default-plan', (req, res) => {
  const age = parseFloat(req.query.age) || 28;
  const income = parseFloat(req.query.income) || 85000;
  const netWorth = parseFloat(req.query.netWorth) || 3000000;

  const bankEmergencyCash = 100000;
  const liquidEmergencyFund = income * 24;
  const compulsoryGold = netWorth * 0.05;

  const investablePool = Math.max(0, (netWorth * 0.95) - bankEmergencyCash - liquidEmergencyFund);
  const p2pAllocation = Math.min(investablePool * 0.15, 5000000);
  const remainingPool = Math.max(0, investablePool - p2pAllocation);
  const silverEtfAllocation = remainingPool * 0.20;
  const equityPool = remainingPool * 0.80;

  const rawSmallCap = Math.max(0, (100 - age) * 0.55);
  const rawMidCap = Math.max(0, (100 - age) * 0.30);
  const rawLargeCap = Math.max(0, 100 - (rawSmallCap + rawMidCap));

  res.json({
    success: true,
    data: {
      bankEmergencyCash,
      liquidEmergencyFund,
      compulsoryGold,
      investablePool,
      p2pAllocation,
      silverEtfAllocation,
      equityPool,
      smallCapAmt: (equityPool * rawSmallCap) / 100,
      midCapAmt: (equityPool * rawMidCap) / 100,
      largeCapAmt: (equityPool * rawLargeCap) / 100,
      smallCapPct: rawSmallCap.toFixed(1),
      midCapPct: rawMidCap.toFixed(1),
      largeCapPct: rawLargeCap.toFixed(1),
    }
  });
});

// 2. Fetch & Save Custom Strategies
app.get('/api/strategies', (req, res) => {
  res.json({ success: true, data: userStrategies });
});

app.post('/api/strategies', (req, res) => {
  const newStrategy = { id: Date.now(), ...req.body };
  userStrategies.push(newStrategy);
  res.status(201).json({ success: true, data: newStrategy });
});

app.delete('/api/strategies/:id', (req, res) => {
  const id = Number(req.params.id);
  userStrategies = userStrategies.filter(s => s.id !== id);
  res.json({ success: true, message: "Strategy deleted successfully" });
});

// 3. Fetch & Save Loans
app.get('/api/loans', (req, res) => {
  res.json({ success: true, data: userLoans });
});

app.post('/api/loans', (req, res) => {
  const newLoan = { id: Date.now(), ...req.body };
  userLoans.push(newLoan);
  res.status(201).json({ success: true, data: newLoan });
});

app.delete('/api/loans/:id', (req, res) => {
  const id = Number(req.params.id);
  userLoans = userLoans.filter(l => l.id !== id);
  res.json({ success: true, message: "Loan deleted successfully" });
});

// 4. Arbitrage Rule Evaluator Engine (1.0% Hurdle Rate)
app.post('/api/arbitrage-check', (req, res) => {
  const { loanRate, investmentReturnRate } = req.body;
  const netSpread = investmentReturnRate - loanRate;
  const hurdleMet = netSpread >= 1.0;

  res.json({
    success: true,
    hurdleMet,
    netSpread: netSpread.toFixed(2),
    decision: hurdleMet ? "INVEST_FIRST" : "PAY_DEBT_FIRST"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 FSD Backend API Server running on port ${PORT}`));
