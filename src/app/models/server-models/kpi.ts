import { Product } from './product'
import { KpiAction } from './kpi-action'

export class Kpi{
  id : number;
  name : string;
  kpi_symbol: string;
  product : Product;
  //kpiAction : KpiAction;
  isSelected : boolean;
  isSelectable : boolean;
}
