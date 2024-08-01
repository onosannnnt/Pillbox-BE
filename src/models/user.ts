import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { LogHistory } from "./loghistory"
import * as shortid from "shortid"

@Entity()
export class User {
    @PrimaryColumn({ type: "varchar", default: shortid.generate() })
    id: string

    @Column()
    email: string

    @Column()
    username: string

    @Column()
    lineID: string

    @Column()
    password: string

    @Column()
    role: string

    @Column()
    numberOfPillChannels: number

    @OneToMany(() => LogHistory, logHistory => logHistory.user)
    logHistories: LogHistory[]
}