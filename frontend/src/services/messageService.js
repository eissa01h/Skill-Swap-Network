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

  async sendMessage(conversationId, content, partnerInfo = null) {
    try {
      return await apiClient.post(`/conversations/${conversationId}/messages`, { content });
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMessages.sendMessage(conversationId, content, partnerInfo);
      }
      throw err;
    }
  },

  async deleteMessage(conversationId, messageId) {
    try {
      return await apiClient.delete(`/conversations/${conversationId}/messages/${messageId}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMessages.deleteMessage(conversationId, messageId);
      }
      throw err;
    }
  },

  async deleteConversation(conversationId) {
    try {
      return await apiClient.delete(`/conversations/${conversationId}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMessages.deleteConversation(conversationId);
      }
      throw err;
    }
  },

  async clearConversation(conversationId) {
    try {
      return await apiClient.post(`/conversations/${conversationId}/clear`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMessages.clearConversation(conversationId);
      }
      throw err;
    }
  },

  async canMessagePartner(partnerId, partnerName = '') {
    return await mockMessages.canMessagePartner(partnerId, partnerName);
  },

  async getEligibleChatPartners() {
    return await mockMessages.getEligibleChatPartners();
  },
};

export default messageService;

