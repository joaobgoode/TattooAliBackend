jest.mock("../models/Follow.js", () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../models/Photo.js", () => ({
  count: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock("../models/user.js", () => ({
  findByPk: jest.fn(),
}));

const Follow = require("../models/Follow.js");
const Photo = require("../models/Photo.js");
const User = require("../models/user.js");
const followService = require("../services/followService.js");

describe("followService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getStatus retorna seguindo false quando não há registro", async () => {
    User.findByPk.mockResolvedValue({ user_id: 2, role: "tatuador" });
    Follow.findOne.mockResolvedValue(null);

    const out = await followService.getStatus(1, 2);

    expect(out).toEqual({ seguindo: false, ativo: false, follow_id: null });
  });

  it("follow lança 400 ao seguir a si mesmo", async () => {
    await expect(followService.follow(5, 5)).rejects.toMatchObject({
      message: "Não é possível seguir a si mesmo",
      statusCode: 400,
    });
    expect(User.findByPk).not.toHaveBeenCalled();
  });

  it("follow cria registro quando não existe", async () => {
    User.findByPk.mockResolvedValue({ user_id: 10, role: "tatuador" });
    Follow.findOne.mockResolvedValue(null);
    Follow.create.mockResolvedValue({
      follow_id: 99,
      cliente_id: 1,
      tatuador_id: 10,
      ativo: true,
    });

    const out = await followService.follow(1, 10);

    expect(Follow.create).toHaveBeenCalledWith({
      cliente_id: 1,
      tatuador_id: 10,
      ativo: true,
    });
    expect(out).toEqual({ seguindo: true, ativo: true, follow_id: 99 });
  });

  it("unfollow lança 404 quando não está seguindo", async () => {
    User.findByPk.mockResolvedValue({ user_id: 10, role: "tatuador" });
    Follow.findOne.mockResolvedValue(null);

    await expect(followService.unfollow(1, 10)).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("getFeed retorna vazio quando não segue ninguém", async () => {
    Follow.findAll.mockResolvedValueOnce([]);

    const out = await followService.getFeed(1, { page: 1, limit: 20 });

    expect(out.data).toEqual([]);
    expect(out.total).toBe(0);
    expect(out.totalPages).toBe(0);
    expect(Photo.count).not.toHaveBeenCalled();
  });

  it("getFeed pagina fotos dos tatuadores seguidos", async () => {
    Follow.findAll.mockResolvedValueOnce([
      { tatuador_id: 3 },
      { tatuador_id: 7 },
    ]);

    Photo.count.mockResolvedValue(25);
    Photo.findAll.mockResolvedValue([{ photo_id: 1 }, { photo_id: 2 }]);

    const out = await followService.getFeed(1, { page: 2, limit: 10 });

    expect(Photo.count).toHaveBeenCalled();
    expect(Photo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        offset: 10,
      })
    );
    expect(out.total).toBe(25);
    expect(out.page).toBe(2);
    expect(out.totalPages).toBe(3);
    expect(out.data).toHaveLength(2);
  });
});
