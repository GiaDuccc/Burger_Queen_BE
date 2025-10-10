export interface createComboRequest {
  comboName: string;
  description: string;
  price: number;
  foods: {
    foodId: string;
    quantity: number;
  }[];
}
