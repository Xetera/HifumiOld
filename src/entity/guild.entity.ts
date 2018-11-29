import { Column, Entity, PrimaryColumn, } from "typeorm";

@Entity()
export class Guild {

  @PrimaryColumn()
  public readonly id: string;
}
