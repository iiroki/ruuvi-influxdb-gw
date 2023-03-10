import os from 'node:os'
import { TEST_INFLUX_CONFIG } from './helpers/mock-data'
import { createInfluxWriteApi, InfluxCustomTag } from '../src/influx'

describe('Influx Write API', () => {
  it('Bucket, org and precision are set properly', () => {
    const writeApi = createInfluxWriteApi(TEST_INFLUX_CONFIG)
    const writeUrl = new URL(TEST_INFLUX_CONFIG.url + writeApi.path)
    expect(writeUrl.searchParams.get('bucket')).toBe(TEST_INFLUX_CONFIG.bucket)
    expect(writeUrl.searchParams.get('org')).toBe(TEST_INFLUX_CONFIG.org)
  })

  it('Default tags are set properly', () => {
    const { defaultTags } = createInfluxWriteApi({
      ...TEST_INFLUX_CONFIG,
      defaultTags: { foo: 'bar', baz: 'qux', fred: 'thud' }
    })

    expect(defaultTags).toHaveProperty('foo', 'bar')
    expect(defaultTags).toHaveProperty('baz', 'qux')
    expect(defaultTags).toHaveProperty('fred', 'thud')
  })

  it('Host name and platform are set as default tags', () => {
    const { defaultTags } = createInfluxWriteApi(TEST_INFLUX_CONFIG)
    expect(defaultTags).toHaveProperty(InfluxCustomTag.BtGatewayHost, os.hostname())
    expect(defaultTags).toHaveProperty(InfluxCustomTag.BtGatewayHostPlatform, os.platform())
  })

  it('Time precision is set to "ms"', () => {
    const writeApi = createInfluxWriteApi(TEST_INFLUX_CONFIG)
    const writeUrl = new URL(TEST_INFLUX_CONFIG.url + writeApi.path)
    expect(writeUrl.searchParams.get('precision')).toBe('ms')
  })
})
