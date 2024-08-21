import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { User } from './user'
import * as shortid from 'shortid'
import { Medicine } from './medicine'

@Entity()
export class LogHistory {
  @PrimaryColumn({ type: 'varchar', default: shortid.generate() })
  id: string

  @Column()
  task: string

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @ManyToOne(() => User, (user) => user.logHistories)
  user: User

  @ManyToOne(() => Medicine, (medicine) => medicine.logHistories)
  medicine: Medicine
}
