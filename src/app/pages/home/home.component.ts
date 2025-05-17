import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../sevices/api.service';
import { CommonModule } from '@angular/common';
import { CardMusicComponent } from '../../components/card-music/card-music.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogResultComponent } from '../../components/dialog-result/dialog-result.component';


interface Chart {
  albums: any,
  artists: any,
  playlists: any,
  podcasts: any,
  tracks: any,
}


interface Music {
  id: number,
  name: string,
  image: string,
  music: any,
  allArtist: any
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,CardMusicComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {


  constructor(private dialog: MatDialog) {}


  #apiService = inject(ApiService)
  #dialog = inject(MatDialog);


  //Antigo
  // constructor(
  //   private _apiService: ApiService
  // ) {}


  public getArtists = signal<any>([]);


  public music = signal<Music | null>(null);


  public point = signal(0);

  public usedArtistIds: Set<number> = new Set();

  public isTransitioning = signal(false);

  public round = signal(0);
  public totalRound = signal(10);


  ngOnInit(): void {

    this.#apiService.httpListChart$().subscribe({
      next: (next: Chart) => {
        this.getArtists.set(next.artists)
        this.setNextMusic()
      },
      error: (error) => console.log(error),
      complete: () => console.log('Complete!')
    })


  }

  countPoint(event: boolean) {
  console.warn('event',event)
  if (event) {
    this.point.set(this.point() + 10);
  }
  this.isTransitioning.set(true);
  setTimeout(() => {
    this.setNextMusic();
    this.round.set(this.round() + 1);
    this.isTransitioning.set(false);
  }, 2000);

  }

  setNextMusic() {
    const allArtists = this.getArtists();
    const availableArtists = allArtists.filter((artist:any) => !this.usedArtistIds.has(artist.id))

    if(availableArtists.length === 0) {
      console.log('FINALIZADO')
      this.dialog.open(DialogResultComponent, {
        data: { point: this.point() },
      });
      // this.usedArtistIds.clear();
      return;
    }

    console.log('availableArtists',availableArtists)

    const person = availableArtists[Math.floor(Math.random() * availableArtists.length)]
    this.usedArtistIds.add(person.id)

    const music = person.musics[Math.floor(Math.random() * person.musics.length)];


    let allArtist = [...allArtists]
    .filter(artist => artist.name !== person.name)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(res => ({name: res.name, value: false, click:false}))

    allArtist = [...allArtist, {name: person.name, value: true, click: false}]
    .sort(() => 0.5 - Math.random());

    this.music.set({
        id: person.id,
        name: person.name,
        image: person.picture,
        music: {
          title: music.title,
          preview: music.preview,
          image: music.md5_image
        },
        allArtist: allArtist
      })


    console.log('person', person)
    console.log('music', music)


  }

}
