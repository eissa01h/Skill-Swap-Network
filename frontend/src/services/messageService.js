import apiClient, { isBackendUnavailable } from './apiClient';
import { messageService as mockMessages } from './mockApi';

export const messageService = {
  async getConversations() {
    try {
      return await apiClient.get('/conversations');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMessages.getConversations();
      }
      throw err;
    }
  },

  async getMessages(conversationId) {
    try {
      return await apiClient.get(`/conversations/${conversationId}/messages`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        const convs = await mockMessages.getConversations();
        const conv = convs.find(c => c.id === conversationId || c.partner?.id === conversationId);
        return conv ? conv.thread : [];
      }
      throw err;
    }
  },

  async sendMessage(conversationId, content) {
    try {
      return await apiClient.post(`/conversations/${conversationId}/messages`, { content });
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMessages.sendMessage(conversationId, content);
      }
      throw err;
    }
  },
};

export default messageService;

