import { v4 as uuidv4 } from 'uuid';

export default class BoundedValue {
  private _min = 0;
  private _max = 0;
  private _value = 0;

  public constructor(min = 0, max = 100, value?: number) {
    this._min = min;
    this._max = max;
    this._value = value ?? max;
  }

  public get min() {
    return this._min;
  }

  public get max() {
    return this._max;
  }

  public get value() {
    return this._value;
  }

  public add(value: number) {
    this._value += value;
  }

  public remove(value: number) {
    this._value -= value;
  }
}
