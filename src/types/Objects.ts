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
  width: number;
  height: number;
  color?: string;
}

export class BaseObject {
  protected properties: ObjectProperties;

  constructor(props: ObjectProperties) {
    this.properties = props;
  }

  public updatePosition(time: number): void {
    this.properties.position.x += this.properties.velocity * time;
  }

  public getProperties(): ObjectProperties {
    return { ...this.properties };
  }
}

export class Box extends BaseObject {
  constructor(id: number, x: number, velocity: number) {
    super({
      id,
      type: 'box',
      position: { x, y: velocity },
      velocity,
      width: 50,
      height: 30,
      color: '#FFA500'
    });
  }
}
