declare namespace Editor {
  type ISize = {
    width: string;
    height: string;
  }

  type IPosition = {
    top: string;
    right?: string;
    bottom?: string;
    left: string;
  }

  type ICoordinate = { x: number, y: number };

  type IFloat = 'left' | 'right' | 'none';

  type IDisplay = 'block' | 'inline' | 'inline-block' | 'none';

  type IPositionType = 'static' | 'relative' | 'fixed' | 'absolute';

  type IPadding = Required<IPosition>;

  type IMargin = IPosition;

  interface IGeneral extends IPosition {
    float: IFloat;
    display: IDisplay;
    position: IPositionType;
    visibility: 'hidden' | 'visible';
  }

  interface IDimension extends ISize {
    margin: string;
    padding: string;
  }

  interface IBaseStyle extends IGeneral, IDimension {

  }

  interface IClientPosition {
    clientY: number;
    clientX: number;
  }
}