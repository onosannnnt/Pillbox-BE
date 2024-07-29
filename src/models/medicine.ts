import { Entity, Column, PrimaryColumn } from "typeorm"
import * as shortid from "shortid";

@Entity()
export class Medicine{
    @PrimaryColumn({ type: "varchar", default: shortid.generate() })
    id : string

    @Column()
    name : string

    @Column()
    description : string

    @Column()
    note : string
}