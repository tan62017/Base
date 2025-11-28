import { type App } from 'vue';

export default (Vue: App<Element>) => {

  Vue.directive('resize', {
    mounted(el: HTMLElement, binding: any) {
    },
    unmounted(el: HTMLElement, binding: any) {
    },
  });

};
