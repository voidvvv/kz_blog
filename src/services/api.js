import axios from 'axios';


// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/', // 替换为您的API基础URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加认证信息
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {

    //   config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['KZ_AUTH'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('请求错误：', error);
    // 处理401未授权错误
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      // 可以添加重定向到登录页面的逻辑
    }
    throw Promise.reject(error);
  }
);

// 博客相关API
export const blogApi = {
  // 获取博客列表
  getPosts: (params = {}) => {
    return api.get('/blog/list', { params });
  },

  // 获取单篇博客
  getPost: (id) => {
    return api.get(`/blog/get`, {params: {id: id}});
  },

  // 创建博客
  createPost: (postData) => {
    return api.post('/blog/add', postData);
  },

  // 更新博客
  updatePost: (id, postData) => {
    return api.put(`/blog/posts/${id}`, postData);
  },

  // 删除博客
  deletePost: (id) => {
    return api.delete(`/blog/posts/${id}`);
  }
};

// 用户相关API
export const userApi = {
  // 用户登录
  login: (credentials) => {
    return api.post('/login',{}, {params: credentials});
  },

  // 用户注册
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // 获取用户信息
  getProfile: () => {
    return api.get('/auth/profile');
  },

  // 更新用户信息
  updateProfile: (userData) => {
    return api.put('/auth/profile', userData);
  },

  // 退出
  logout: () => {
    return api.post('/logout');
  }
};

// 评论相关API
export const commentApi = {
  // 获取评论列表
  getComments: (postId) => {
    return api.get(`/posts/${postId}/comments`);
  },

  // 添加评论
  addComment: (postId, commentData) => {
    return api.post(`/posts/${postId}/comments`, commentData);
  },

  // 删除评论
  deleteComment: (commentId) => {
    return api.delete(`/comments/${commentId}`);
  }
};

export function getUserInfo () {
  return api.get('/user/current');
}

export default api; 