import Database from 'better-sqlite3';

const db = new Database('blockchain.db');

db.exec(`
CREATE TABLE IF NOT EXISTS blocks (
  hash TEXT PRIMARY KEY,
  number TEXT,
  timestamp INTEGER,
  gasUsed TEXT,
  gasLimit TEXT,
  parentHash TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
  hash TEXT PRIMARY KEY,
  blockHash TEXT,
  blockNumber TEXT,
  fromAddr TEXT,
  toAddr TEXT,
  value TEXT,
  gas TEXT,
  gasPrice TEXT,
  nonce TEXT,
  input TEXT,
  type TEXT,
  method TEXT,
  FOREIGN KEY(blockHash) REFERENCES blocks(hash)
);
`);

export default db; 