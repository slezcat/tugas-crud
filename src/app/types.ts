export type GroceryList = {
  groceryList: Grocery[];
  status: string;
  message: any;
};

export type Form = {
  title: String;
  fruit: String;
  date: String;
};

export interface Grocery {
  [id: string]: { title: string; date: string; fruit: string };
}
