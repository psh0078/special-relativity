export type ObjectType = 'box' | 'clock' | 'flash';

export interface Position {
  x: number;
  y: number;
}

export interface ObjectProperties {
  id: number;
  type: ObjectType;
  position: Position;
  velocity: number;
  velocityLab: number;
  width: number;
  height: number;
  color?: string;
}

export class BaseObject {
  protected properties: ObjectProperties;

  constructor(props: ObjectProperties) {
    this.properties = props;
  }

  public updateProperties(newProps: Partial<ObjectProperties>): void {
    this.properties = {
      ...this.properties,
      ...newProps
    };
  }

  public getProperties(): ObjectProperties {
    return { ...this.properties };
  }
}

export class Box extends BaseObject {
  constructor(id: number, x: number, y:number, velocity: number, velocityLab: number) {
    super({
      id,
      type: 'box',
      position: { x, y},
      velocity,
      velocityLab,
      width: 50,
      height: 30,
      color: '#FFA500'
    });
  }
}
