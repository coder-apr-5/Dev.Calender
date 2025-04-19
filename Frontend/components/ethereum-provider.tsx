"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type EthereumContextType = {
  ethereum: any | null
  isMetaMaskInstalled: boolean
  isConnected: boolean
  currentAccount: string | null
  connectWallet: () => Promise<void>
}

const EthereumContext = createContext<EthereumContextType>({
  ethereum: null,
  isMetaMaskInstalled: false,
  isConnected: false,
  currentAccount: null,
  connectWallet: async () => {},
})

export const useEthereum = () => useContext(EthereumContext)

export function EthereumProvider({ children }: { children: React.ReactNode }) {
  const [ethereum, setEthereum] = useState<any | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)

  useEffect(() => {
    const checkEthereum = async () => {
      try {
        // Check if window is defined (client-side)
        if (typeof window !== "undefined") {
          // Check if ethereum is injected by MetaMask
          if (window.ethereum) {
            setEthereum(window.ethereum)
            setIsMetaMaskInstalled(true)

            // Check if already connected
            const accounts = await window.ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0) {
              setCurrentAccount(accounts[0])
              setIsConnected(true)
            }

            // Listen for account changes
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
              if (accounts.length > 0) {
                setCurrentAccount(accounts[0])
                setIsConnected(true)
              } else {
                setCurrentAccount(null)
                setIsConnected(false)
              }
            })
          }
        }
      } catch (error) {
        console.error("Error checking for Ethereum:", error)
      }
    }

    checkEthereum()

    // Cleanup
    return () => {
      if (ethereum) {
        ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Please install MetaMask to use this feature")
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0])
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  return (
    <EthereumContext.Provider
      value={{
        ethereum,
        isMetaMaskInstalled,
        isConnected,
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </EthereumContext.Provider>
  )
}
