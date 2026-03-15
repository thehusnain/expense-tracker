import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync('expense_tracker.db');

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        card_number TEXT NOT NULL,
        card_holder TEXT NOT NULL,
        card_type TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    db = null;
    throw error;
  }
};

const ensureDb = async () => {
  if (!db) {
    await initDatabase();
  }
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// User functions
export const createUser = async (name, email, password) => {
  const database = await ensureDb();
  try {
    const result = await database.runAsync(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?);',
      [name, email, password]
    );

    const user = await database.getFirstAsync('SELECT * FROM users WHERE id = ?;', [result.lastInsertRowId]);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const database = await ensureDb();
  try {
    const user = await database.getFirstAsync(
      'SELECT * FROM users WHERE email = ? AND password = ?;',
      [email, password]
    );

    if (user) {
      return user;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Transaction functions
export const addTransaction = async (userId, amount, category, type, description, date, time) => {
  const database = await ensureDb();
  try {
    const result = await database.runAsync(
      'INSERT INTO transactions (user_id, amount, category, type, description, date, time) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [userId, amount, category, type, description, date, time]
    );
    return result;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getTransactions = async (userId) => {
  const database = await ensureDb();
  try {
    const rows = await database.getAllAsync(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, time DESC;',
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId) => {
  const database = await ensureDb();
  try {
    const result = await database.runAsync('DELETE FROM transactions WHERE id = ?;', [transactionId]);
    return result;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const getTransactionCount = async (userId) => {
  const database = await ensureDb();
  try {
    const result = await database.getFirstAsync('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?;', [userId]);
    return result.count;
  } catch (error) {
    console.error('Error counting transactions:', error);
    return 0;
  }
};

// Card functions
export const addCard = async (userId, cardNumber, cardHolder, cardType, expiryDate) => {
  const database = await ensureDb();
  try {
    const result = await database.runAsync(
      'INSERT INTO cards (user_id, card_number, card_holder, card_type, expiry_date) VALUES (?, ?, ?, ?, ?);',
      [userId, cardNumber, cardHolder, cardType, expiryDate]
    );
    return result;
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
};

export const getCards = async (userId) => {
  const database = await ensureDb();
  try {
    const rows = await database.getAllAsync('SELECT * FROM cards WHERE user_id = ?;', [userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};