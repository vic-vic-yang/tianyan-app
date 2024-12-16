import { http } from './utils/http';

const userApi = {
  getUserInfo: async () => {
    return await http.get('/users/me');
  },
};

export default userApi;
