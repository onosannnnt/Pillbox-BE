import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { LogHistory } from "./loghistory"
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

    @Column()
    img : string

    @OneToMany(() => LogHistory, logHistory => logHistory.medicine)
    logHistories : LogHistory[]
}