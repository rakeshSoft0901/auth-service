import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number = 0

  // @Column()
  // token: string = ''

  @Column({ type: 'timestamp' })
  expiresAt: Date = new Date()

  @ManyToOne(() => User)
  user!: User

  @UpdateDateColumn()
  updatedAt: number = 0

  @CreateDateColumn()
  createdAt: number = 0
}
