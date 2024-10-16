import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { LogHistory } from './loghistory'
import { PillChannel } from './pillChannel'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID'
  })
  id: string

  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
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

  @OneToMany(() => PillChannel, (pillChannel) => pillChannel.user)
  pillChannels: PillChannel[]
}
