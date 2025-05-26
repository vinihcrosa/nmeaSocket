import {describe, it, expect} from 'vitest';
import { NmeaSocket } from '.';

describe('index', () => {
  it('should create a NmeaSocket instance', () => {
    const socket = new NmeaSocket(
      'localhost',
      10110,
      true
    );
    expect(socket).toBeInstanceOf(NmeaSocket);
  });
})