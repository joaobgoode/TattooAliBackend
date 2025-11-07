const { GoogleGenAI } = require('@google/genai');
const generatedImageService = require('../services/generatedImageService.js');
const s3 = require('../storage/s3.js');

const BUCKET_PUB_URL = process.env.PUBLIC_BUCKET_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const IMAGE_MODEL = 'imagen-4.0-generate-001';

async function generate(req, res) {
  const { prompt } = req.body;
  const userId = req.user.id;

  try {
    const result = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt,
      config: { numberOfImages: 1, aspectRatio: '1:1' },
    });

    const generated = result.generatedImages?.[0]?.image;
    if (!generated?.imageBytes) {
      throw new Error('API não retornou uma imagem válida.');
    }

    const buffer = Buffer.from(generated.imageBytes, 'base64');
    const mimeType = generated.mimeType || 'image/png';
    const extension = mimeType.split('/')[1] || 'png';
    const timestamp = Date.now();

    const filePath = `generated/images/${userId}-${timestamp}.${extension}`;

    await s3.uploadFile({ buffer, mimetype: mimeType }, filePath);

    const publicUrl = `${BUCKET_PUB_URL}/${filePath}`;
    const image = await generatedImageService.createImage({
      url: publicUrl,
      user_id: userId,
    });

    return res.status(200).json({image: image.url});
  } catch (err) {
    console.error('Erro ao gerar a imagem:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function getAllGeneratedImages(req, res) {
  const userId = req.user.id;
  try {
    const images = await generatedImageService.getAll(userId);
    return res.status(200).json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

async function getGeneratedImageById(req, res) {
  const userId = req.user.id;
  const imageId = req.params.id;

  try {
    const belongs = await generatedImageService.belongsToUser(imageId, userId);
    if (!belongs) return res.status(404).json({ message: 'Imagem não encontrada' });

    const image = await generatedImageService.getImageById(imageId);
    return res.status(200).json(image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

async function deleteGeneratedImage(req, res) {
  const userId = req.user.id;
  const imageId = req.params.id;

  try {
    const belongs = await generatedImageService.belongsToUser(imageId, userId);
    if (!belongs) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    const image = await generatedImageService.getImageById(imageId);
    if (!image?.url) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    try {
      await s3.deleteFile(image.url);
    } catch (s3Err) {
      console.error('Erro ao deletar do S3:', s3Err);
      return res.status(500).json({ message: 'Falha ao deletar imagem do S3' });
    }

    const ok = await generatedImageService.deleteImage(imageId);
    if (!ok) {
      console.error(`Erro: imagem ${imageId} removida do S3 mas não do banco`);
      return res.status(500).json({ message: 'Erro ao deletar registro da imagem' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao deletar imagem' });
  }
}

module.exports = {
  generate,
  getAllGeneratedImages,
  getGeneratedImageById,
  deleteGeneratedImage,
};
