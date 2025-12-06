import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

interface TokenContextType {
  tokens: number;
  deductTokens: (amount: number) => boolean;
  addTokens: (amount: number) => void;
  redeemCode: (code: string) => { success: boolean; message: string; amount?: number };
  referralCode: string;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState(100);
  const { giftCodes } = useAdmin();
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);

  // Load tokens from local storage
  useEffect(() => {
    const savedTokens = localStorage.getItem('gravity_tokens');
    const savedRedeemed = localStorage.getItem('gravity_redeemed');
    if (savedTokens) setTokens(parseInt(savedTokens));
    if (savedRedeemed) setRedeemedCodes(JSON.parse(savedRedeemed));
  }, []);

  // Save tokens to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('gravity_tokens', tokens.toString());
    localStorage.setItem('gravity_redeemed', JSON.stringify(redeemedCodes));
  }, [tokens, redeemedCodes]);

  const deductTokens = (amount: number) => {
    if (tokens >= amount) {
      setTokens((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addTokens = (amount: number) => {
    setTokens((prev) => prev + amount);
  };

  const redeemCode = (code: string) => {
    if (redeemedCodes.includes(code)) {
      return { success: false, message: "Code already redeemed" };
    }

    const validCode = giftCodes.find(c => c.code === code && c.active);
    
    if (validCode) {
      addTokens(validCode.amount);
      setRedeemedCodes([...redeemedCodes, code]);
      return { success: true, message: "Code redeemed successfully!", amount: validCode.amount };
    }

    return { success: false, message: "Invalid or expired code" };
  };

  // Mock Referral Code
  const referralCode = "GRAVITY-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <TokenContext.Provider value={{ tokens, deductTokens, addTokens, redeemCode, referralCode }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error('useTokens must be used within a TokenProvider');
  return context;
};
