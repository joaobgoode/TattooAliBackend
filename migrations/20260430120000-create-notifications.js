'use strict';

module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Notifications" (
        "notification_id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "Users"("user_id") ON DELETE CASCADE,
        "sessao_id" INTEGER NULL REFERENCES "Sessaos"("sessao_id") ON DELETE SET NULL,
        "tipo" VARCHAR(64) NOT NULL,
        "titulo" VARCHAR(140) NOT NULL,
        "mensagem" VARCHAR(500),
        "lida" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "idx_notifications_user_createdAt"
      ON "Notifications" ("user_id", "createdAt" DESC);
    `);
  },

  async down(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`DROP TABLE IF EXISTS "Notifications";`);
  },
};
