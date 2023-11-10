export interface Debts {
  id: string;
  typeOfDebt: string;
  startDate: string;
  maturityDate: string;
  initialAmount: number;
  interestRate: number;
  currency: string;
}
export interface Member {
  id: string;
  email: string;
  accessLevel: string;
  username: string;
  isActive: boolean;
  joinedDate: string;
}
export type AccessLevel = {
  value: "Signatory" | "Manager" | "Viewer";
  label: string;
  details: string;
};
export type IsOpenMap = Record<string, boolean>;