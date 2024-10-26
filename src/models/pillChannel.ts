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
  total: number

  @Column()
  amountPerTime: number

  @Column({ default: false })
  isAlert: boolean

  @OneToMany(() => Time, (time) => time.pillChannel, { onDelete: 'CASCADE' })
  times: Time[]

  @ManyToOne(() => User, (user) => user.pillChannels)
  user: User

  @ManyToOne(() => Medicine, (medicine) => medicine.pillChannels, { onDelete: 'CASCADE' })
  medicine: Medicine
}
