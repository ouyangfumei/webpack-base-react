
import css from "./index.less";
import css1 from "./index1.less";
import index1 from './index1.js'
import axios from 'axios';
console.log(111111110022234113);
console.log(process.env.NODE_ENV)
axios.get('/api/info').then(res=>{console.log(res) })