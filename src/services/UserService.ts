import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types/user.type'
import createHttpError from 'http-errors'

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: UserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role,
      })
    } catch (err) {
      const error = createHttpError(500, 'Error creating user', { cause: err })
      throw error
    }
  }
}
