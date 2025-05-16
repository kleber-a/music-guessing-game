import { Router } from 'express';
import { helloWorldController } from './controller/hello-world.controller';

//Router
const router = Router();
const baseUrl = '/api/hello-world'

router.get(`${baseUrl}`, helloWorldController.helloWorld)
router.get(`/api/test`, helloWorldController.getArtistWithTopTracks)

export const helloWorldRouter = router;
