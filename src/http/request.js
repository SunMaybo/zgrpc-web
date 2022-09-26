import axios from 'axios';
import buildURL from 'axios/lib/helpers/buildURL';
import { merge } from 'axios/lib/utils';

//判断指定参数是否是一个纯粹的对象，所谓"纯粹的对象"，就是该对象是通过"{}"或"new Object"创建的
function isPlainObject (val) {
  	return val && val.constructor.name === 'Object'
}

//请求之前进行拦截，可做的操作：1、添加loading的加载；2、添加请求头；3、判断表单提交还是json提交
let requestInterceptors = [
	config => {
		//添加loading的加载
		
		//添加请求头
		config.headers.authorization = sessionStorage.getItem('Token');
		//判断表单提交还是json提交
		if (config.emulateJSON && isPlainObject(config.data)) {
			config.data = buildURL('', config.data).substr(1);
		}
		return config;
	}
]

//请求响应之后进行拦截，可做操作：1、取消loading的加载；2、对返回状态进行判断：如请求错误、请求超时、获取数据失败、暂无数据等等
let responseInterceptors = [
	res => {
		//取消loading加载
		
		//对返回状态进行判断：如请求错误、请求超时、获取数据失败等等

		//返回结果
		return Promise.resolve(res);
	},
	err => {
		//取消loading加载
		
		//对返回状态进行判断：如请求错误、请求超时、获取数据失败等等

		//返回结果
		return Promise.reject(err);
	}
]

//组装请求
let serviceCreate = config => {
	let service = axios.create(merge({}, config));
	service.interceptors.request.use(...requestInterceptors);
	service.interceptors.response.use(...responseInterceptors);
	return service
}
serviceCreate();
export { serviceCreate, merge };