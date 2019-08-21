declare namespace Editor {

  interface ICanvaStoreState {
    dataDriver: {
      [id: number]: {
        [p: string]: PluginDataDriver.IDataDriver;
      };
    }
  }

  namespace PluginDataDriver {
    type IExpression = string | ICompExpression;

    interface ICompExpression {
      id: number;
      property: string;
    }

    interface IDataDriver {
      id: number;
      property: string;
      value: IExpression[];
    }
  }
}