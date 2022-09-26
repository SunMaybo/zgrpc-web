import { serviceCreate, merge } from './request';

//这种方式可以采用单个项目的接口，也可以使用多个项目的接口，看自己的项目情况而定
let http = serviceCreate({
    baseURL: '/api',
    timeout: 1500000,//请求超时
    emulateJSON: true,//默认表单提交
})


export function getServices(config) {
    return http.get('/service', merge(config, {}));
}
export function getTarget(config) {
    return http.get('/system', merge(config, {}));
}

export function getMethodNames(serviceName,config) {
    return http.get('/method/'+serviceName, merge(config, {}));
}
export function getHistoriesData(serviceName,methodName,config) {
    return http.get("/histories"+"?service_name="+serviceName+"&method_name="+methodName, merge(config, {}));
}
export function getMetadata(serviceName,methodName,config) {
    return http.get("/metadata"+"?service_name="+serviceName+"&method_name="+methodName, merge(config, {}));
}

export function invoke(params, config) {
    return http.post('/invoke', params, merge(config, { emulateJSON: false }));
}
// //delete请求示例
// export function deleteData(params, config) {
//     return http0.delete('/project/list', merge(config,{ params }));
// }
// //post请求示例（表单提交）
// export function postDataFrom(params, config) {
//     return http0.post('/project/list', params, config);
// }
// //post请求示例（json提交）
// export function postDataJson(params, config) {
//     return http0.post('/project/list', params, merge(config, { emulateJSON: false }));
// }
// //put请求示例（表单提交）
// export function putDataFrom(params, config) {
//     return http0.put('/project/list', params, config);
// }
// //put请求示例（json提交）
// export function putDataJson(params, config) {
//     return http0.put('/project/list', params, merge(config, { emulateJSON: false }));
// }