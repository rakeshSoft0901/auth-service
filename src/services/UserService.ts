import bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { IUpdateUserData, UserData } from '../types/user.type'
import createHttpError from 'http-errors'
import { HASH_SALT_ROUNDS } from '../constants'

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: UserData) {
    const user = await this.userRepository.findOneBy({ email: email })
    if (user) {
      const err = createHttpError(400, 'Email already exists')
      throw err
    }
    const hashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS)
    try {
      // Hash the password

      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      })
    } catch (err) {
      const error = createHttpError(500, 'Error creating user', { cause: err })
      throw error
    }
  }

  async all() {
    try {
      return await this.userRepository.find()
    } catch (err) {
      const error = createHttpError(500, 'Error fetching user', { cause: err })
      throw error
    }
  }

  async getUser(email: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne()

      return user
    } catch (err) {
      const error = createHttpError(500, 'Error fetching user', { cause: err })
      throw error
    }
  }

  async getUserById(id: number) {
    try {
      return await this.userRepository.findBy({ id: id })
    } catch (err) {
      const error = createHttpError(500, 'Error fetching user', { cause: err })
      throw error
    }
  }

  async update(id: number, { firstName, lastName }: IUpdateUserData) {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw createHttpError(400, 'User not found')
    }

    user.firstName = firstName
    user.lastName = lastName

    await this.userRepository.save(user)
    return user
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw createHttpError(404, 'User not found')
    }
    await this.userRepository.delete(id)
  }
}
