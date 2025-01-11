import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createTable, addTransaction, getTransactions, getBalance, deleteTransaction } from './src/database/Sqlite';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [type, setType] = useState('income'); // "income" or "expense"
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    createTable();
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    getTransactions(setTransactions);
    getBalance(setBalance);
  };

  const handleAddTransaction = () => {
    if (amount && description) {
      addTransaction(type, parseFloat(amount), description, () => {
        setAmount('');
        setDescription('');
        fetchTransactions();
      });
    }
  };

  const handleDeleteTransaction = (id) => {
    deleteTransaction(id, fetchTransactions);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text>{item.date.split('T')[0]}</Text>
      <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
        {item.type === 'income' ? '+' : '-'}Rp.{item.amount.toFixed(2)}
      </Text>
      <Text>{item.description}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTransaction(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Finance Tracker</Text>
      <Text style={styles.balance}>Total Balance: Rp.{balance.toFixed(2)}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount} />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription} />
        <View style={styles.buttonContainer}>
          <Button title="Income" onPress={() => setType('income')} />
          <Button title="Expense" color="red" onPress={() => setType('expense')} />
        </View>
        <Button title="Add Transaction" onPress={handleAddTransaction} />
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction} />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  balance: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  inputContainer: { 
    marginBottom: 20 
  },
  input: { 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  transactionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 25,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
