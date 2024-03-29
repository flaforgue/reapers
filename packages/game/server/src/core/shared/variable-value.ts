type VariableValueSideEffectHandler = (newCurrent: number) => void;

export default class VariableValue {
  private readonly _initial: number;
  private readonly _onValueChanged: VariableValueSideEffectHandler;
  private _current: number;

  public constructor(
    initial = 0,
    sideEffectHandler: VariableValueSideEffectHandler = (): void => undefined,
  ) {
    this._initial = initial;
    this._onValueChanged = sideEffectHandler;

    this._current = this._initial;
    this._onValueChanged(this._current);
  }

  public get initial(): number {
    return this._initial;
  }

  public get current(): number {
    return this._current;
  }

  public set current(value: number) {
    this._current = value;
    this._onValueChanged(this._current);
  }

  public multiply(value: number): void {
    this.current = this._current * value;
  }

  public divide(value: number): void {
    this.current = this._current / value;
  }

  public reset(): void {
    this.current = this._initial;
  }
}
