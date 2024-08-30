import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, OneToOne } from 'typeorm'
import { User } from './user'
import { Medicine } from './medicine'
import { Time } from './time'

@Entity()
export class PillChannel {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID'
  })
  id: string

  @Column()
  channelIndex: number

  @Column()
  amount: number

  @Column()
  Total: number

  @Column()
  amountPerTime: number

  @OneToMany(() => Time, (time) => time.pillChannel)
  times: Time[]

  @ManyToOne(() => User, (user) => user.pillChannels)
  user: User

  @ManyToOne(() => Medicine, (medicine) => medicine.pillChannels)
  medicine: Medicine
}
