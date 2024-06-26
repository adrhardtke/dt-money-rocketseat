import React, { createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

export type Transaction = {
  id: number;
  description: string;
  type: "income" | "outcome";
  category: string;
  price: number;
  createdAt: string;
};

interface createTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

interface TransactionsContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: createTransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext({} as TransactionsContextType);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  async function fetchTransactions(query?: string) {
    // const url = new URL("http://localhost:3333/transactions");
    // if (query) url.searchParams.append("q", query);
    // const response = await fetch(url);
    // const data = await response.json();
    const response = await api.get("/transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });
    setTransactions(response.data);
  }

  async function createTransaction(data: createTransactionInput) {
    const { description, price, category, type } = data;
    const response = await api.post("/transactions", {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    });
    setTransactions((state) => [response.data, ...state]);
  }

  useEffect(() => {
    fetchTransactions();
  });

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
