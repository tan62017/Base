import Http from '@/http/index';

/**
 * 获取数据最新时间
 * @param parmas 传参
 * @returns
 */
export const getLastDate = (parmas?: any) => {
  Http.cancelRequest('/data', 'GET'); // 取消重复请求
  return Http.get('/data', parmas, {
    enableCancel: true // 启用重复请求取消
  });
};

export const addData = (parmas: any) => {
  return Http.post('/addData', parmas);
};

