import { Action } from "redux";

class PayloadAction implements Action<string> {
  public type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public payload?: { [key: string]: any } = undefined;
}

export { PayloadAction };
