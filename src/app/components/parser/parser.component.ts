import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CurrencyService } from '../../services/currency.service';
import { CurrencyData } from '../../utils/currency-data';
import { SOURCES } from 'src/app/models/constants';
import { ISources, IValute } from '../../models/currency';
import { xml2json } from '../../helpers/json';
import { filter, map, pluck, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss'],
})
export class ParserComponent implements OnDestroy, OnInit {
  loading = false;
  currencyData = new CurrencyData();
  destroyed$ = new Subject<void>();
  isAllSourcesError = false;
  sources: ISources[];
  valute: IValute;
  interval: any;
  time: Date;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.getCurrency();
    this.interval = setInterval(() => this.getCurrency(), 10000);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();

    clearInterval(this.interval);
  }

  private getCurrency(): void {
    this.sources = SOURCES;
    this.getCurrencyBySource();
  }

  private getCurrencyBySource(): void {
    const sources: ISources[] = this.sources;
    this.loading = true;

    if (sources.length) {
      const { url, isJson, isXml } = sources[0];
      let data$: Observable<any>;

      if (isJson) {
        data$ = this.getCurrencyAsJson(url).pipe(
          takeUntil(this.destroyed$),
          pluck('Valute', 'EUR'),
          filter((valute) => valute.CharCode === 'EUR')
        );
      }

      if (!isJson && isXml) {
        data$ = this.getCurrencyAsXml(url).pipe(
          takeUntil(this.destroyed$),
          map((val) => {
            const node = new DOMParser().parseFromString(val, 'text/xml');
            return xml2json(node);
          }),
          pluck('ValCurs', 'Valute'),
          map((valute: IValute[]) => {
            return valute.filter((elem) => elem.CharCode === 'EUR')[0];
          })
        );
      }

      data$.pipe().subscribe(
        (val: IValute) => {
          this.currencyData.setData(val);
          this.valute = this.currencyData.getData();
          this.time = new Date();
          this.loading = false;
        },
        (error) => {
          sources.shift();
          this.getCurrencyBySource();
        }
      );
    } else {
      this.isAllSourcesError = true;
    }
  }

  private getCurrencyAsJson(url: string): Observable<any> {
    return this.currencyService.getCurrencyAsJson(url);
  }

  private getCurrencyAsXml(url: string): Observable<any> {
    return this.currencyService.getCurrencyAsXml(url);
  }
}
