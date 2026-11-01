const API_BASE = "http://localhost:5000/api";

export const getStrategies = async () => {
  const res = await fetch(`${API_BASE}/strategies`);
  return await res.json();
};

export const createStrategy = async (strategyData) => {
  const res = await fetch(`${API_BASE}/strategies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategyData)
  });
  return await res.json();
};

export const deleteStrategyApi = async (id) => {
  const res = await fetch(`${API_BASE}/strategies/${id}`, { method: 'DELETE' });
  return await res.json();
};

export const getLoans = async () => {
  const res = await fetch(`${API_BASE}/loans`);
  return await res.json();
};

export const createLoan = async (loanData) => {
  const res = await fetch(`${API_BASE}/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loanData)
  });
  return await res.json();
};

export const deleteLoanApi = async (id) => {
  const res = await fetch(`${API_BASE}/loans/${id}`, { method: 'DELETE' });
  return await res.json();
};
