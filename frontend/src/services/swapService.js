import { exchangeRequestService } from './exchangeRequestService';
import { exchangeService } from './exchangeService';

export const swapService = {
  getIncomingRequests: () => exchangeRequestService.getReceivedRequests(),
  getOutgoingRequests: () => exchangeRequestService.getSentRequests(),
  createProposal: (data) => exchangeRequestService.createRequest(data),
  acceptRequest: (id) => exchangeRequestService.acceptRequest(id),
  declineRequest: (id) => exchangeRequestService.declineRequest(id),
  cancelRequest: (id) => exchangeRequestService.cancelRequest(id),
  getActiveExchanges: () => exchangeService.getUserExchanges(),
  completeExchange: (id) => exchangeService.completeExchange(id),
};

export default swapService;
