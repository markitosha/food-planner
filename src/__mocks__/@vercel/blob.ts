export const put = jest.fn().mockResolvedValue({
  url: 'https://example.com/mocked-image.jpg',
});

export const del = jest.fn().mockResolvedValue(undefined);

export const list = jest.fn().mockResolvedValue([]);

export const delBlob = jest.fn().mockResolvedValue(undefined);
