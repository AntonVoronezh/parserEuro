import { cloneDeep } from 'lodash';

import { IValute } from '../models/currency';

export class CurrencyData {
  private data: IValute;

  log(): void {
    console.log('CurrencyData', this.data);
  }

  private get getCloneData(): IValute {
    return cloneDeep(this.data);
  }

  setData(data: IValute): void {
    this.data = data;
  }

  getData(): IValute {
    return this.getCloneData;
  }
}
