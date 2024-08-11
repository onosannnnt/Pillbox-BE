import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm'
import { User } from './user'
import * as shortid from 'shortid'
import { Medicine } from './medicine'

@Entity()
export class LogHistory {
  @PrimaryColumn({ type: 'varchar', default: shortid.generate() })
  id: string

  @Column()
  task: string

  @Column()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.logHistories)
  user: User

  @ManyToOne(() => Medicine, (medicine) => medicine.logHistories)
  medicine: Medicine
}
