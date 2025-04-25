import { transformVelocityToFrame } from '@/physics'

export interface Position {
  x: number;
  y: number;
}

export type ObjectType = 'box' | 'clock' | 'flash';

export interface InitialConditions {
  x0: number;
  t0: number;
}

export interface ObjectProperties {
  id: number;
  type: ObjectType;
  initialConditions: InitialConditions;
  velocityLab: number;
  width: number;
  height: number;
  color?: string;
  currentX?: number;
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
  constructor(id: number, x0: number, t0:number, velocityLab: number) {
    super({
      id,
      type: 'box',
      initialConditions: { x0, t0},
      velocityLab,
      width: 80,
      height: 20,
      color: '#FFA500',
      currentX: x0
    });
  }

  public getVelocityInCurrentFrame(frameVelocity: number): number {
    return transformVelocityToFrame(this.properties.velocityLab, frameVelocity);
  }
}
