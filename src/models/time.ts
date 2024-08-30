import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PillChannel } from './pillChannel'

@Entity()
export class Time {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID'
  })
  id: string

  @Column()
  time: string

  @ManyToOne(() => PillChannel, (pillChannel) => pillChannel.times)
  pillChannel: PillChannel
}
