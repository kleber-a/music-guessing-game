import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../sevices/api.service';
import { CommonModule } from '@angular/common';


interface Chart {
  albums: any,
  artists: any,
  playlists: any,
  podcasts: any,
  tracks: any,
}


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  #apiService = inject(ApiService)


  //Antigo
  // constructor(
  //   private _apiService: ApiService
  // ) {}


  public getArtists = signal<any>([]);

  public isPlaying = signal(false);
  public currentTime = signal(0);
  public duration = signal(0);

  public audioo!: HTMLAudioElement

  ngOnInit(): void {

    this.#apiService.httpListChart$().subscribe({
      next: (next: Chart) => {
        console.warn('next',next)
        this.getArtists.set(next.artists)
      },
      error: (error) => console.log(error),
      complete: () => console.log('Complete!')
    })


  }

  firts = false
  playAudio(item: any) {
    console.log('item',item.musics[0].preview)


      if (this.isPlaying()) {
        console.warn('12123')
      this.audioo.pause();
      this.isPlaying.set(false);
    } else {
      this.audioo = new Audio(item.musics[0].preview)
      this.audioo.play();
      this.isPlaying.set(true);
    }

    this.audioo.onloadedmetadata = () => {
      this.duration.set(this.audioo.duration);
    };

    this.audioo.ontimeupdate = () => {
      this.currentTime.set(this.audioo.currentTime);
    };

    this.audioo.onended = () => {
      this.isPlaying.set(false);
      this.currentTime.set(0);

    };


  }

  pause() {
    this.audioo.pause();
  }

}
