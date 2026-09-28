import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import { useLocalStorage } from './hooks/useLocalStorage'
import {
  generateId,
  sanitizeTransactions,
  sanitizeBudget,
} from './utils/transactionUtils'
import { generateSampleTransactions } from './utils/sampleData'
import { STORAGE_KEYS, DEFAULT_BUDGET } from './utils/constants'

function App() {
  const [transactions, setTransactions, transactionsLoading] = useLocalStorage(
    STORAGE_KEYS.TRANSACTIONS,
    [],
    sanitizeTransactions
  )
  const [budget, setBudget, budgetLoading] = useLocalStorage(
    STORAGE_KEYS.BUDGET,
    DEFAULT_BUDGET,
    sanitizeBudget
  )

  const isLoading = transactionsLoading || budgetLoading

  function handleAddTransaction(transactionData) {
    const newTransaction = { id: generateId(), ...transactionData }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  function handleDeleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  function handleUpdateBudget(nextBudget) {
    setBudget(nextBudget)
  }

  function handleClearAll() {
    setTransactions([])
  }

  function handleLoadSampleData() {
    setTransactions(generateSampleTransactions())
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Dashboard
              transactions={transactions}
              budget={budget}
              isLoading={isLoading}
              onAddTransaction={handleAddTransaction}
              onUpdateBudget={handleUpdateBudget}
              onDeleteTransaction={handleDeleteTransaction}
              onLoadSampleData={handleLoadSampleData}
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <Transactions
              transactions={transactions}
              isLoading={isLoading}
              onDeleteTransaction={handleDeleteTransaction}
              onClearAll={handleClearAll}
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App
