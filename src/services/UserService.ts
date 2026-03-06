import bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types/user.type'
import createHttpError from 'http-errors'
import { HASH_SALT_ROUNDS } from '../constants'

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: UserData) {
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
}
