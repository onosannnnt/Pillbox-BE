import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, OneToOne } from 'typeorm'
import { LogHistory } from './loghistory'
import { PillChannel } from './pillChannel'

@Entity()
export class Medicine {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID'
  })
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  note: string

  @Column()
  img: string

  @OneToMany(() => LogHistory, (logHistory) => logHistory.medicine)
  logHistories: LogHistory[]

  @OneToMany(() => PillChannel, (pillChannel) => pillChannel.medicine)
  pillChannels: PillChannel[]
}
