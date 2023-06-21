import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

describe('Create Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create new gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some Description.',
        phone: '1199999',
        latitude: -22.8196352,
        longitude: -47.087616,
      })

    expect(response.statusCode).toEqual(201)
  })
})
