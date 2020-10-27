export interface ICurrency {
  Date: string;
  PreviousDate: string;
  PreviousURL: string;
  Timestamp: string;
  Valute: IValute[];
}

export interface ISources {
  url: string;
  isJson: boolean;
  isXml?: boolean;
}

export interface IValute {
  CharCode: string;
  ID: string;
  Name: string;
  Nominal: number;
  NumCode: string;
  Previous: number;
  Value: number;
}
