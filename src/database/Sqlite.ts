import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { 
    name: 'finance.db', 
    location: 'default' 
  },
  () => 
    console.log('Database opened'),
  error => 
    console.log('Error opening database:', error),
);

export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         type TEXT,
         amount REAL,
         description TEXT,
         date TEXT
       )`,
      [],
      () => console.log('Table created'),
      (error) => console.log('Error creating table:', error),
    );
  });
};

export const addTransaction = (type, amount, description, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO transactions (type, amount, description, date) VALUES (?, ?, ?, ?)',
      [type, amount, description, new Date().toISOString()],
      () => callback(),
      (error) => console.log('Error adding transaction:', error),
    );
  });
};

export const getTransactions = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM transactions ORDER BY date DESC',
      [],
      (tx, results) => {
        const transactions = [];
        for (let i = 0; i < results.rows.length; i++) {
          transactions.push(results.rows.item(i));
        }
        callback(transactions);
      },
      (error) => console.log('Error fetching transactions:', error),
    );
  });
};

export const getBalance = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) AS balance FROM transactions',
      [],
      (tx, results) => {
        callback(results.rows.item(0).balance || 0);
      },
      (error) => console.log('Error calculating balance:', error),
    );
  });
};

export const deleteTransaction = (id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM transactions WHERE id = ?',
      [id],
      () => callback(),
      (error) => console.log('Error deleting transaction:', error),
    );
  });
};
