const tatuadorService = require('../services/tatuadorService');

async function getByBairro(req, res) {
  try {

    const bairro_id = req.params.bairro_id;
    const users = await tatuadorService.getUsersByBairro(bairro_id);

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({ message: 'Error getting users by bairro.' });

  }
}

async function getUserReviews(req, res) {
  try {

    const user_id = req.params.user_id;

    const user = tatuadorService.exist(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const reviews = await tatuadorService.getUserReviews(user_id);

    res.status(200).json(reviews);


  } catch (error) {

    res.status(500).json({ message: 'Error getting all users.' });

  }
}

async function getUserPhotos(req, res) {
  try {
    const user_id = req.params.user_id;
    const user = tatuadorService.exist(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const photos = await tatuadorService.getUserPhotos(user_id);
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error getting all photos.' });
  }
}

async function getUserStyles(req, res) {
  try {
    const user_id = req.params.user_id;
    const user = tatuadorService.exist(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const styles = await tatuadorService.getUserStyles(user_id);
    res.status(200).json(styles);
  } catch (error) {
    res.status(500).json({ message: 'Error getting all styles.' });
  }
}

async function getUserPerfil(req, res) {
  try {
    const user_id = req.params.user_id;
    const user = await tatuadorService.getUserPerfil(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error getting user perfil.' });
  }
}

module.exports = { getByBairro, getUserReviews, getUserPhotos, getUserStyles, getUserPerfil };
