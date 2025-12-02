import { type App } from 'vue';

import {
  ElDatePicker,
  ElTable,
  ElIcon,
  ElTableColumn,
  ElPagination,
  ElDialog,
  ElCheckbox,
  ElTooltip,
  ElInput,
  ElSelect,
  ElBacktop,
  ElCarousel,
  ElCarouselItem,
} from 'element-plus';
import 'element-plus/dist/index.css';

export default (app: App<Element>): void => {
  app.use(ElDatePicker);
  app.use(ElTable);
  app.use(ElIcon);
  app.use(ElTableColumn);
  app.use(ElPagination);
  app.use(ElDialog);
  app.use(ElCheckbox);
  app.use(ElTooltip);
  app.use(ElInput);
  app.use(ElSelect);
  app.use(ElBacktop);
  app.use(ElCarousel);
  app.use(ElCarouselItem);
};
