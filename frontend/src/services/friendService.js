import { friendService as mockFriends } from './mockApi';

export const friendService = {
  async getFriends() {
    return await mockFriends.getFriends();
  },

  async addFriend(partner) {
    return await mockFriends.addFriend(partner);
  },

  async removeFriend(partnerId) {
    return await mockFriends.removeFriend(partnerId);
  },

  async isFriend(partnerId, partnerName = '') {
    return await mockFriends.isFriend(partnerId, partnerName);
  },
};

export default friendService;
