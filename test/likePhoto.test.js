const likePhotoService = require("../services/likePhotoService");
const LikePhoto = require("../models/LikePhoto");
const User = require("../models/user");
const Photo = require("../models/Photo");

jest.mock("../models/LikePhoto", () => ({
  findOne: jest.fn(),
  findOrCreate: jest.fn(),
  count: jest.fn(),
}));

jest.mock("../models/user", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../models/Photo", () => ({
  findByPk: jest.fn(),
}));

describe("likePhotoService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar like quando usuário e foto existem e não há like anterior", async () => {
    User.findByPk.mockResolvedValue({ user_id: 1 });
    Photo.findByPk.mockResolvedValue({ photo_id: 10 });
    LikePhoto.findOrCreate.mockResolvedValue([{ like_id: 5 }, true]);

    const result = await likePhotoService.likePhoto(10, 1);

    expect(User.findByPk).toHaveBeenCalledWith(1, { attributes: ["user_id"] });
    expect(Photo.findByPk).toHaveBeenCalledWith(10, { attributes: ["photo_id"] });
    expect(LikePhoto.findOrCreate).toHaveBeenCalledWith({
      where: { photo_id: 10, user_id: 1 },
    });
    expect(result).toEqual({
      liked: true,
      created: true,
      like_id: 5,
    });
  });

  it("deve retornar false em hasLikedPhoto se não existir like", async () => {
    LikePhoto.findOne.mockResolvedValue(null);

    const result = await likePhotoService.hasLikedPhoto(10, 1);

    expect(LikePhoto.findOne).toHaveBeenCalledWith({
      where: { photo_id: 10, user_id: 1 },
    });
    expect(result).toBe(false);
  });

  it("deve retornar true em hasLikedPhoto se like existir", async () => {
    LikePhoto.findOne.mockResolvedValue({ like_id: 7 });

    const result = await likePhotoService.hasLikedPhoto(10, 1);

    expect(result).toBe(true);
  });

  it("deve remover like existente em unlikePhoto", async () => {
    const mockLike = { destroy: jest.fn().mockResolvedValue() };
    LikePhoto.findOne.mockResolvedValue(mockLike);

    const result = await likePhotoService.unlikePhoto(10, 1);

    expect(LikePhoto.findOne).toHaveBeenCalledWith({
      where: { photo_id: 10, user_id: 1 },
    });
    expect(mockLike.destroy).toHaveBeenCalled();
    expect(result).toEqual({ removed: true });
  });

  it("deve retornar removed false em unlikePhoto quando não existir like", async () => {
    LikePhoto.findOne.mockResolvedValue(null);

    const result = await likePhotoService.unlikePhoto(10, 1);

    expect(result).toEqual({ removed: false });
  });

  it("deve contar likes com getPhotoLikesCount", async () => {
    Photo.findByPk.mockResolvedValue({ photo_id: 10 });
    LikePhoto.count.mockResolvedValue(3);

    const count = await likePhotoService.getPhotoLikesCount(10);

    expect(Photo.findByPk).toHaveBeenCalledWith(10, { attributes: ["photo_id"] });
    expect(LikePhoto.count).toHaveBeenCalledWith({ where: { photo_id: 10 } });
    expect(count).toBe(3);
  });
});