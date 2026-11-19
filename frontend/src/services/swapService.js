import { swapService as mockSwap } from './mockApi';

export const swapService = {
  getIncomingRequests: () => mockSwap.getIncomingRequests(),
  getOutgoingRequests: () => mockSwap.getOutgoingRequests(),
  createProposal: (data) => mockSwap.createProposal(data),
  acceptRequest: (id) => mockSwap.acceptRequest(id),
  declineRequest: (id) => mockSwap.declineRequest(id),
  cancelRequest: (id) => mockSwap.cancelRequest(id),
  getActiveExchanges: () => mockSwap.getActiveExchanges(),
  completeExchange: (id) => mockSwap.completeExchange(id),
};
