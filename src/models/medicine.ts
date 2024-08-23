import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm'
import { LogHistory } from './loghistory'
import { pillChannel } from './pillChannel'

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

  @ManyToOne(() => pillChannel, (pillChannel) => pillChannel.medicine)
  pillChannels: pillChannel[]
}
