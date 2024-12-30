import { http } from './utils/http';

const userApi = {
  getUserInfo: async () => {
    return await http.get('/users/me');
  },
  login: async (data: any) => {
    return await http.post('/users/login', data);
  },
};

export default userApi;
