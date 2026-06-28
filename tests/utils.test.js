// Tests - Updated 2026-06-28

describe('Utility Functions', () => {
  test('capitalize works correctly', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
  });

  test('truncate works correctly', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
    expect(truncate('hi', 10)).toBe('hi');
  });

  test('formatDate returns string', () => {
    const result = formatDate(new Date('2026-01-01'));
    expect(typeof result).toBe('string');
  });
});
