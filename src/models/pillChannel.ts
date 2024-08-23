import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm'
import { User } from './user'
import { Medicine } from './medicine'

@Entity()
export class pillChannel {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID'
  })
  id: string

  @Column()
  channelIndex: number

  @ManyToOne(() => User, (user) => user.pillChannels)
  user: User

  @ManyToOne(() => Medicine, (medicine) => medicine.pillChannels)
  medicine: Medicine
}
