import { transformVelocityToFrame, transformTimeToFrame } from '@/physics'

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
  currentTime?: number;
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

export class Clock extends BaseObject {
  constructor(id: number, x0: number, t0: number, velocityLab: number) {
    super({
      id,
      type: 'clock',
      initialConditions: { x0, t0 },
      velocityLab,
      width: 40,
      height: 40,
      color: '#4169E1',
      currentX: x0,
      currentTime: t0
    });
  }

  public getCurrentTime(): number {
    return this.properties.currentTime || this.properties.initialConditions.t0;
  }

  public updateTime(labTime: number): void {
    const x = this.properties.currentX || this.properties.initialConditions.x0;
    this.updateProperties({
      currentTime: transformTimeToFrame(labTime, this.properties.velocityLab, x)
    });
  }

  public getVelocityInCurrentFrame(frameVelocity: number): number {
    return transformVelocityToFrame(this.properties.velocityLab, frameVelocity);
  }
}
