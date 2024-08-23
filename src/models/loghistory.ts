import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { User } from './user'
import { Medicine } from './medicine'

@Entity()
export class LogHistory {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID'
  })
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
