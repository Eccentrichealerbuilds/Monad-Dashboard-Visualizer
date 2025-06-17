const API_BASE_URL = 'http://52.87.190.26:4000';

// Fetches { tps: number }
export const getTps = async () => {
    const response = await fetch(`${API_BASE_URL}/stats/tps`);
    if (!response.ok) throw new Error('Failed to fetch TPS');
    return response.json();
};

// Fetches { blocksPerMinute: number }
export const getBlocksPerMinute = async () => {
    const response = await fetch(`${API_BASE_URL}/stats/blocks-per-minute`);
    if (!response.ok) throw new Error('Failed to fetch blocks per minute');
    return response.json();
};

// Fetches { uptimeSeconds: number }
export const getUptime = async () => {
    const response = await fetch(`${API_BASE_URL}/stats/uptime`);
    if (!response.ok) throw new Error('Failed to fetch uptime');
    return response.json();
};

// Fetches the latest blocks array
export const getBlocks = async () => {
  const response = await fetch(`${API_BASE_URL}/blocks`);
  if (!response.ok) {
    throw new Error('Failed to fetch blocks');
  }
  return response.json();
};

export const getTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/transactions`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
};

export const getTpsHistory = async () => {
    const response = await fetch(`${API_BASE_URL}/stats/tps-history`);
    if (!response.ok) {
        throw new Error('Failed to fetch TPS history');
    }
    return response.json();
}

export const getBlocksPerHour = async () => {
    const response = await fetch(`${API_BASE_URL}/stats/blocks-history`);
    if (!response.ok) {
        throw new Error('Failed to fetch blocks per hour');
    }
    return response.json();
}

export const getTopContracts = async () => {
    const response = await fetch(`${API_BASE_URL}/stats/top-contracts`);
    if (!response.ok) {
        throw new Error('Failed to fetch top contracts');
    }
    return response.json();
}

export const getTopAddresses = async () => {
    const response = await fetch(`${API_BASE_URL}/stats/top-senders`);
    if (!response.ok) {
        throw new Error('Failed to fetch top addresses');
    }
    return response.json();
}

export const getBlockByNumber = async (number: string) => {
  const response = await fetch(`http://52.87.190.26:4000/block-by-number/${number}`);
  if (!response.ok) {
    throw new Error('Block not found');
  }
  return response.json();
};

export const getTransactionReceiptByHash = async (hash: string) => {
  const response = await fetch(`http://52.87.190.26:4000/transaction-receipt/${hash}`);
  if (!response.ok) {
    throw new Error('Transaction not found');
  }
  return response.json();
};
