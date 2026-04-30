'use strict';

module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "ReviewReplies" (
        "review_reply_id" SERIAL PRIMARY KEY,
        "review_id" INTEGER NOT NULL REFERENCES "Reviews"("review_id") ON DELETE CASCADE,
        "autor_id" INTEGER NOT NULL REFERENCES "Users"("user_id") ON DELETE CASCADE,
        "autor_tipo" VARCHAR(20) NOT NULL CHECK ("autor_tipo" IN ('cliente', 'tatuador')),
        "resposta" VARCHAR(500) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_review_replies_review_createdAt"
      ON "ReviewReplies" ("review_id", "createdAt" ASC);
    `);
  },

  async down(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`DROP TABLE IF EXISTS "ReviewReplies";`);
  },
};
