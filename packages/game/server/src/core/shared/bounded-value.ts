export default class BoundedValue {
  private _min = 0;
  private _max = 0;
  private _value = 0;

  public constructor(min = 0, max = 100, value = max) {
    this._min = min;
    this._max = max;
    this._value = value ?? max;
  }

  public get min(): number {
    return this._min;
  }

  public get max(): number {
    return this._max;
  }

  public get value(): number {
    return this._value;
  }

  public add(value: number): void {
    this._value = Math.min(this._value + value, this._max);
  }

  public remove(value: number): void {
    this._value = Math.max(this._value - value, this._min);
  }

  public setToMax(): void {
    this._value = this._max;
  }
}
