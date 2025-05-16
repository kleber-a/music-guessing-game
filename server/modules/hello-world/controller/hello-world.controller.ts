import { Request, Response } from "express";
import axios from 'axios';

class HelloWorldController {
  public helloWorld(req: Request, res: Response) {
    return res.status(200).json({ data: 'Hello World' });
  }

   public async getArtistWithTopTracks(req: Request, res: Response) {
    try {
      // 1) Busca o chart geral (artistas)
      const chartRes = await axios.get('https://api.deezer.com/chart');

      const artists = chartRes.data.artists.data;

      // 2) Para cada artista, buscar as músicas usando o tracklist
      //    Usamos Promise.all para esperar todas as requisições terminarem
      const artistsWithMusics = await Promise.all(
        artists.map(async (artist: any) => {
          // Faz a requisição para pegar as músicas do artista
          const musicsRes = await axios.get(artist.tracklist);

          // Retorna o objeto do artista com as músicas incluídas
          return {
            ...artist,
            musics: musicsRes.data.data
          };
        })
      );

      // 3) Retorna tudo
      return res.status(200).json({
        artists: artistsWithMusics
      });

    } catch (error) {
      console.error('Erro ao buscar dados no Deezer:', error);
      return res.status(500).json({ error: 'Erro ao buscar dados no Deezer' });
    }
  }
}


export const helloWorldController = new HelloWorldController
