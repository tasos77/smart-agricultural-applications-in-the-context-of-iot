import { z } from 'zod';

const loginBodySchema = z.object({
  email: z.email(),
  password: z.string()
})

const activateUserBodySchema = z.object({
  activateToken: z.string(),
  password: z.string()
})

const createUserBodySchema = z.object({
  email: z.email(),
  firstName: z.string(),
  lastName: z.string()
})

const logoutBodySchema = z.object({
  accessToken: z.string()
})

const fetchUserBodySchema = z.object({
  accessToken: z.string()
})

export { activateUserBodySchema, createUserBodySchema, fetchUserBodySchema, loginBodySchema, logoutBodySchema };

