import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { LogHistory } from './loghistory'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID'
  })
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

  @OneToMany(() => LogHistory, (logHistory) => logHistory.user)
  logHistories: LogHistory[]
}
