import { Product } from './product'
import { KpiAction } from './kpi-action'

export class Kpi{
  id : number;
  name : string;
  symbol: string;
  product : Product;
  kpiAction : KpiAction;
}
