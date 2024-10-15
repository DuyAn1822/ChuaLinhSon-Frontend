import axios from 'axios';
import Swal from 'sweetalert2';
import env from './env';

const apiClient = axios.create({
  baseURL: env.apiUrl
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
    if (error.response?.status === 423) {
      Swal.fire({
        icon: 'error',
        title: 'Tài khoản đang bị khóa',
        titleText: error.response.data?.message
      })
      // } else if (error.response?.status === 403) {
      //   // console.error('fix the api usage: ', error?.request?.responseURL);
      //   // Swal.fire({
      //   //   icon: 'error',
      //   //   title: 'fix api usage now!!!'
      //   // })
      //   // Swal.fire({
      //   //   icon: 'error',
      //   //   title: 'Đã có người đăng nhập vào tài khoản này!'
      //   // }).then(() => {
      //   //   localStorage.clear();    
      //   //   const event = new Event('storage');
      //   //   window.dispatchEvent(event);
      //   //   window.location.href = '/#login';
      //   // })
    } else {
      Swal.fire({
        icon: 'warning',
        title: error.response?.data?.message || 'Thao tác dữ liệu thất bại!'
      })
    }
    return Promise.reject(error);
  }
);

export default apiClient;
