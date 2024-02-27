import * as z from 'zod'

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.string()
})

type Env = z.infer<typeof envSchema>

function env (): Env {
  try {
    const parsedEnv = envSchema.parse(process.env)
    return parsedEnv
  } catch (err) {
    const redColor = '\n\x1b[31m%s\x1b[0m'
    console.error(redColor, '[env] ERROR: MISSING ENVIRONMENT VARIABLES - ./src/environment/env.ts \n')
    process.exit(1)
  }
}

export default env()
