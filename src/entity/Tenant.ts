import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column()
  address: string = ''

  @UpdateDateColumn()
  updatedAt: number = 0

  @CreateDateColumn()
  createdAt: number = 0
}
