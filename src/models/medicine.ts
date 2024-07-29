import { Entity, Column, PrimaryColumn } from "typeorm"
import * as shortid from "shortid";

@Entity()
export class medicine{
    @PrimaryColumn({ type: "varchar", default: shortid.generate() })
    id : string

    @Column()
    name : string

    @Column()
    description : string

    @Column()
    note : string
}