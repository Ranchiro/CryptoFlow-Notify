import React, { useState } from 'react';
import { Vote, Plus, Clock, CheckCircle, XCircle, Users, TrendingUp } from 'lucide-react';
import { useGovernance } from '../context/GovernanceContext';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

const Governance: React.FC = () => {
  const { proposals, userVotingPower, isLoading, vote, createProposal } = useGovernance();
  const { isConnected } = useWallet();
  const { addToast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    quorum: '100000',
    category: 'protocol' as const
  });

  const handleVote = async (proposalId: string, support: 'for' | 'against') => {
    try {
      await vote(proposalId, support, userVotingPower);
      addToast(`Vote cast successfully!`, 'success');
    } catch (error) {
      addToast('Failed to cast vote', 'error');
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProposal(newProposal);
      addToast('Proposal created successfully!', 'success');
      setShowCreateForm(false);
      setNewProposal({
        title: '',
        description: '',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quorum: '100000',
        category: 'protocol'
      });
    } catch (error) {
      addToast('Failed to create proposal', 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-400 bg-blue-500/20';
      case 'passed':
        return 'text-green-400 bg-green-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const calculateProgress = (votesFor: string, votesAgainst: string) => {
    const total = parseInt(votesFor) + parseInt(votesAgainst);
    if (total === 0) return { forPercent: 0, againstPercent: 0 };
    
    return {
      forPercent: (parseInt(votesFor) / total) * 100,
      againstPercent: (parseInt(votesAgainst) / total) * 100
    };
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl">🗳️</div>
          <h2 className="text-2xl font-bold text-white">Wallet Not Connected</h2>
          <p className="text-gray-400">Please connect your wallet to participate in governance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Governance</h1>
        <p className="text-gray-400">Participate in protocol governance and vote on proposals</p>
      </div>

      {/* Voting Power */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Your Voting Power</h3>
            <div className="text-3xl font-bold text-purple-400">{userVotingPower} CFT</div>
          </div>
          <div className="text-right">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Proposal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Proposal Form */}
      {showCreateForm && (
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Create New Proposal</h3>
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={newProposal.title}
                onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={newProposal.description}
                onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={newProposal.category}
                  onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="protocol">Protocol</option>
                  <option value="treasury">Treasury</option>
                  <option value="governance">Governance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quorum Required</label>
                <input
                  type="number"
                  value={newProposal.quorum}
                  onChange={(e) => setNewProposal({ ...newProposal, quorum: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create Proposal
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.map((proposal) => {
          const progress = calculateProgress(proposal.votesFor, proposal.votesAgainst);
          const hasVoted = proposal.userVote !== undefined && proposal.userVote !== null;
          
          return (
            <div key={proposal.id} className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(proposal.status)}
                    <h3 className="text-xl font-semibold text-white">{proposal.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{proposal.description}</p>
                  
                  {/* Voting Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Votes For: {proposal.votesFor}</span>
                      <span className="text-gray-400">Votes Against: {proposal.votesAgainst}</span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500"
                          style={{ width: `${progress.forPercent}%` }}
                        />
                        <div
                          className="bg-red-500"
                          style={{ width: `${progress.againstPercent}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Total Votes: {proposal.totalVotes}</span>
                      <span>Quorum: {proposal.quorum}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Buttons */}
              {proposal.status === 'active' && !hasVoted && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => handleVote(proposal.id, 'for')}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Vote className="h-4 w-4" />
                    <span>Vote For</span>
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 'against')}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Vote className="h-4 w-4" />
                    <span>Vote Against</span>
                  </button>
                </div>
              )}

              {hasVoted && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-blue-400">
                    You voted: <span className="font-medium">{proposal.userVote?.toUpperCase()}</span>
                  </div>
                </div>
              )}

              {/* Proposal Details */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Category</div>
                  <div className="text-white capitalize">{proposal.category}</div>
                </div>
                <div>
                  <div className="text-gray-400">Proposer</div>
                  <div className="text-white font-mono">{proposal.proposer.slice(0, 10)}...</div>
                </div>
                <div>
                  <div className="text-gray-400">Start Date</div>
                  <div className="text-white">{proposal.startTime.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">End Date</div>
                  <div className="text-white">{proposal.endTime.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {proposals.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Proposals Yet</h3>
          <p className="text-gray-400">Be the first to create a governance proposal!</p>
        </div>
      )}
    </div>
  );
};

export default Governance;