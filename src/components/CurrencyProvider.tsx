'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'INR' | 'BRL' | 'NZD'

export interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  label: string
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$',  label: 'US Dollar' },
  { code: 'EUR', symbol: '€',  label: 'Euro' },
  { code: 'GBP', symbol: '£',  label: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥',  label: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
  { code: 'INR', symbol: '₹',  label: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
  { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar' },
]

const STORAGE_KEY = 'lll_currency'

interface CurrencyContextType {
  currency: CurrencyCode
  currencyInfo: CurrencyInfo
  setCurrency: (code: CurrencyCode) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && CURRENCIES.some(c => c.code === saved)) {
        setCurrencyState(saved as CurrencyCode)
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, [])

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // localStorage not available
    }
  }, [])

  const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]

  return (
    <CurrencyContext.Provider value={{ currency, currencyInfo, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
