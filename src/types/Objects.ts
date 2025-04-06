import { forwardTransformRelativeVelocity } from '@/physics'

export type ObjectType = 'box' | 'clock' | 'flash';

export interface Position {
  x: number;
  y: number;
}

export interface ObjectProperties {
  id: number;
  type: ObjectType;
  position: Position;
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
  constructor(id: number, x: number, y:number, velocityLab: number) {
    super({
      id,
      type: 'box',
      position: { x, y},
      velocityLab,
      width: 50,
      height: 30,
      color: '#FFA500'
    });
  }

  public getVelocityInCurrentFrame(frameVelocity: number): number {
    return forwardTransformRelativeVelocity(this.properties.velocityLab, frameVelocity);
  }
}
