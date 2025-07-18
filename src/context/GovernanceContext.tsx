import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: string;
  votesAgainst: string;
  totalVotes: string;
  quorum: string;
  userVote?: 'for' | 'against' | null;
  category: 'treasury' | 'protocol' | 'governance' | 'other';
}

interface GovernanceContextType {
  proposals: Proposal[];
  userVotingPower: string;
  isLoading: boolean;
  createProposal: (proposal: Omit<Proposal, 'id' | 'proposer' | 'startTime' | 'status' | 'votesFor' | 'votesAgainst' | 'totalVotes'>) => Promise<void>;
  vote: (proposalId: string, support: 'for' | 'against', votingPower: string) => Promise<void>;
  delegateVotes: (delegatee: string) => Promise<void>;
  getVotingHistory: (address: string) => Promise<any[]>;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (!context) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
};

interface GovernanceProviderProps {
  children: ReactNode;
}

export const GovernanceProvider: React.FC<GovernanceProviderProps> = ({ children }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userVotingPower, setUserVotingPower] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const { account, isConnected, tokenBalance } = useWallet();

  useEffect(() => {
    if (isConnected && account) {
      loadProposals();
      calculateVotingPower();
    }
  }, [isConnected, account, tokenBalance]);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      // Mock proposals - in real app, fetch from Snapshot or on-chain
      const mockProposals: Proposal[] = [
        {
          id: '1',
          title: 'Increase Token Minting Fee',
          description: 'Proposal to increase the minting fee from 0.001 ETH to 0.002 ETH to reduce spam and increase treasury funds.',
          proposer: '0x1234...5678',
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          status: 'active',
          votesFor: '125000',
          votesAgainst: '75000',
          totalVotes: '200000',
          quorum: '100000',
          category: 'protocol'
        },
        {
          id: '2',
          title: 'Treasury Allocation for Development',
          description: 'Allocate 50,000 CFT tokens from treasury for continued development and marketing efforts.',
          proposer: '0x5678...9012',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'passed',
          votesFor: '180000',
          votesAgainst: '45000',
          totalVotes: '225000',
          quorum: '100000',
          category: 'treasury'
        }
      ];

      setProposals(mockProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateVotingPower = () => {
    // In real app, this would consider token balance, delegation, etc.
    setUserVotingPower(tokenBalance);
  };

  const createProposal = async (proposalData: Omit<Proposal, 'id' | 'proposer' | 'startTime' | 'status' | 'votesFor' | 'votesAgainst' | 'totalVotes'>) => {
    if (!account) throw new Error('Wallet not connected');

    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      proposer: account,
      startTime: new Date(),
      status: 'pending',
      votesFor: '0',
      votesAgainst: '0',
      totalVotes: '0'
    };

    setProposals(prev => [newProposal, ...prev]);

    // In real app, submit to Snapshot or on-chain governance contract
    try {
      // await submitToSnapshot(newProposal);
      console.log('Proposal created:', newProposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  };

  const vote = async (proposalId: string, support: 'for' | 'against', votingPower: string) => {
    if (!account) throw new Error('Wallet not connected');

    try {
      // Update local state
      setProposals(prev =>
        prev.map(proposal => {
          if (proposal.id === proposalId) {
            const updatedProposal = { ...proposal };
            updatedProposal.userVote = support;
            
            if (support === 'for') {
              updatedProposal.votesFor = (parseInt(updatedProposal.votesFor) + parseInt(votingPower)).toString();
            } else {
              updatedProposal.votesAgainst = (parseInt(updatedProposal.votesAgainst) + parseInt(votingPower)).toString();
            }
            
            updatedProposal.totalVotes = (parseInt(updatedProposal.votesFor) + parseInt(updatedProposal.votesAgainst)).toString();
            
            return updatedProposal;
          }
          return proposal;
        })
      );

      // In real app, submit vote to Snapshot or on-chain
      // await submitVote(proposalId, support, votingPower);
      console.log(`Voted ${support} on proposal ${proposalId} with ${votingPower} voting power`);
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  const delegateVotes = async (delegatee: string) => {
    if (!account) throw new Error('Wallet not connected');

    try {
      // In real app, call delegation contract
      console.log(`Delegating votes to ${delegatee}`);
    } catch (error) {
      console.error('Error delegating votes:', error);
      throw error;
    }
  };

  const getVotingHistory = async (address: string) => {
    try {
      // In real app, fetch from Snapshot or on-chain events
      return [];
    } catch (error) {
      console.error('Error fetching voting history:', error);
      return [];
    }
  };

  const value = {
    proposals,
    userVotingPower,
    isLoading,
    createProposal,
    vote,
    delegateVotes,
    getVotingHistory
  };

  return (
    <GovernanceContext.Provider value={value}>
      {children}
    </GovernanceContext.Provider>
  );
};