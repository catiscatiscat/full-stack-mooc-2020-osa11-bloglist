import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = async newObject => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async newObject => {
  const config = { headers: { Authorization: token } };
  const blogUrl = `${baseUrl}/${newObject.id}`;
  const response = await axios.put(blogUrl, newObject, config);
  return response.data;
};

const delBlog = async blogId => {
  const config = { headers: { Authorization: token } };
  const blogUrl = `${baseUrl}/${blogId}`;
  const response = await axios.delete(blogUrl, config);
  return response.status;
};

export default {
  setToken,
  getAll,
  create,
  update,
  delBlog,
};
