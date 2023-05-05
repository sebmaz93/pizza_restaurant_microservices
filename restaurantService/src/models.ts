export interface Pizza {
  id: string;
  toppings: string[];
  doughReady: boolean;
  toppingsReady: boolean;
  cooked: boolean;
  served: boolean;
  receivedAt?: number;
  servedAt?: number;
}
