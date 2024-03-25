import axios from 'axios';
import configData from '../config.json'


const instance = configData.dev? axios.create({
  baseURL: 'http://localhost:5000',
}) : axios.create({
  baseURL: configData.baseUrl,
});

export default instance;
