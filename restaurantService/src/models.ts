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

export const defaultOrders: Pizza[] = [
  {
    id: "934",
    toppings: ["pepperoni", "mushrooms"],
    doughReady: false,
    toppingsReady: false,
    cooked: false,
    served: false,
  },
  {
    id: "914",
    toppings: ["ham", "pineapple", "cheese", "olives", "corn"],
    doughReady: false,
    toppingsReady: false,
    cooked: false,
    served: false,
  },
  {
    id: "54",
    toppings: ["sausage", "onions", "green peppers"],
    doughReady: false,
    toppingsReady: false,
    cooked: false,
    served: false,
  },
];
