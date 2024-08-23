import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { LogHistory } from './loghistory'

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
}
