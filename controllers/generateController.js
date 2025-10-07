const {GoogleGenAI} = require('@google/genai');
const s3 = require('../storage/s3.js');
const BUCKET_PUB_URL = process.env.PUBLIC_BUCKET_URL;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apikey: GEMINI_API_KEY });

const IMAGE_MODEL = 'imagen-4.0-generate-001';

async function generate(req,res){
    const {prompt} = req.body;
    const {id} = req.user.id;

    try{
        const result = await ai.models.generateImages({
            model: IMAGE_MODEL,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '1:1',
            },
        });

        const generatedImage = result.generatedImages[0];
        if(!generatedImage || !generatedImage.image){
            throw new Error('API não retornou uma imagem válida.');
        }

        const base64Image = generatedImage.image.imageBytes;
        const mimeType = generatedImage.image.mimeType || 'image/png';
        const buffer = Buffer.from(base64Image, 'base64');
        const extension = mimeType.split('/')[1] || 'png';

        const time = Date.now();

        const fileName = `${id}-${time}.${extension}`;
        const filePath = `generated/images/${fileName}`;

        const mockFile ={
            buffer: buffer,
            mimetype: mimeType,
        };

        await s3.uploadFile(mockFile, filePath);
        const publicUrl = `${BUCKET_PUB_URL}/${filePath}`;

        return res.status(200).json({ image: publicUrl})
    }catch(err){
        console.log(err);
        console.error('Erro ao gerar a imagem:', err.message);
    }
    
}
module.exports = {generate}