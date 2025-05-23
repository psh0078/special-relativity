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
  currentTime?: number;
}

export interface BaseObject {
  updateProperties(newProps: Partial<ObjectProperties>): void;
  getProperties(): ObjectProperties;
  getVelocityInCurrentFrame(frameVelocity: number): number;
}

export class Box implements BaseObject {
  protected properties: ObjectProperties;

  constructor(id: number, x0: number, t0:number, velocityLab: number) {
    this.properties = {
      id,
      type: 'box',
      initialConditions: { x0, t0},
      velocityLab,
      width: 80,
      height: 20,
      color: '#FFA500',
      currentX: x0
    };
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

  public getVelocityInCurrentFrame(frameVelocity: number): number {
    return transformVelocityToFrame(this.properties.velocityLab, frameVelocity);
  }
}

export class Clock implements BaseObject {
  protected properties: ObjectProperties;

  constructor(id: number, x0: number, t0: number, velocityLab: number) {
    this.properties = {
      id,
      type: 'clock',
      initialConditions: { x0, t0 },
      velocityLab,
      width: 40,
      height: 40,
      color: '#4169E1',
      currentX: x0,
    };
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

  public getVelocityInCurrentFrame(frameVelocity: number): number {
    return transformVelocityToFrame(this.properties.velocityLab, frameVelocity);
  }
}

export class Flash implements BaseObject {
  protected properties: ObjectProperties;

  constructor(id: number, x0: number, t0: number, velocityLab: number = 1) {
    this.properties = {
      id,
      type: 'flash',
      initialConditions: { x0, t0 },
      velocityLab,
      width: 20,
      height: 20,
      color: '#FF0000',
      currentX: x0
    };
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

  public getVelocityInCurrentFrame(frameVelocity: number): number {
    return transformVelocityToFrame(this.properties.velocityLab, frameVelocity);
  }
}
