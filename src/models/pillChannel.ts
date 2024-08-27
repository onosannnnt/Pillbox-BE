import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, ManyToMany, OneToMany } from 'typeorm'
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

  @OneToMany(() => Medicine, (medicine) => medicine.pillChannels)
  medicine: Medicine
}
