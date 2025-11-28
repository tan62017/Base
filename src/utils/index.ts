
/**
 * px2vw   1920px为基准点
 */
export const px2vw = (num: number, baseWidth = 1920): string => {
  const domWidth = window.innerWidth || document.documentElement.clientWidth;
  const nowVw = ((num / baseWidth) * 100 * domWidth) / baseWidth;
  return nowVw.toFixed(3) + 'vw';
};

export const pxToRem = (num: number, baseWidth = 19.2): string => {
  if (!num) return '';

  return num / baseWidth + 'rem';
};

export const setHtmlFontSize = (designWidth = 1920, minWidth = 1080) => {
  // const docEle = document.documentElement;
  // const screenRatioByDesign = designWidth / minWidth;
  // const screenRatio = docEle.clientWidth / docEle.clientHeight;
  // const fontSize =
  //   ((screenRatio > screenRatioByDesign ? screenRatioByDesign / screenRatio : 1) *
  //     docEle.clientWidth) /
  //   100;

  // docEle.style.fontSize = fontSize.toFixed(3) + 'px';

  const docEle = document.documentElement;
  const screenRatioByDesign = designWidth / minWidth;
  const screenRatio = docEle.clientWidth / docEle.clientHeight;
  const fontSize =
    ((screenRatio > screenRatioByDesign ? screenRatioByDesign / screenRatio : 1) *
      docEle.clientWidth) /
    100;

  docEle.style.fontSize = fontSize.toFixed(3) + 'px';
};

/**
 * 数据转换+千分位
 * @param num 传入的数
 * @param isArr 是否需要转成Array
 * @param flag 转成数组的标志位split(flag)
 * @param re 无数据返回的的格式 '--'
 * @returns
 */
export const formatNumberWithCommas = (
  num: number | null | string | undefined,
  fixed = 2,
  isArr: boolean = false,
  flag: string = '.',
  re: string = '--',
): string | string[] | number => {
  if (!num || !Number(num)) return num || re;
  const str = Number(num).toFixed(fixed);
  if (!isArr) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    const arr = str.split(flag);
    arr.forEach((i) => {
      i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    return arr;
  }
};

export function getUrlParams(name: string) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.href.split('?')[1]?.match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export function setSessionStroge(key: string, value: string) {
  if (!key && !value) return;
  return sessionStorage.setItem(key, value);
}

export function getSessionStroge(key: string | number) {
  if (!key) return;
  key = key + '';
  return sessionStorage.getItem(key);
}