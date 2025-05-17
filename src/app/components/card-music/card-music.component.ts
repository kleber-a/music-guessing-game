import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, signal, SimpleChanges, computed, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { sign } from 'crypto';

interface Music {
  id: number,
  name: string,
  image: string,
  music: any,
  allArtist: any
}

interface Artist {
  name: string;
  value: boolean;
  click: boolean;
}

@Component({
  selector: 'card-music',
  imports: [CommonModule, MatIconModule],
  standalone: true,
  templateUrl: './card-music.component.html',
  styleUrl: './card-music.component.scss'
})
export class CardMusicComponent implements OnInit, OnChanges {

  public music = signal<Music | null>(null);

  public audio!: HTMLAudioElement;
  public isPlaying = signal(false);
  public currentTime = signal(0);
  public duration = signal(0);
  public volume = signal(1);


  public selection = signal<Artist[]>([])
  public isAccepted = signal(null)

  public hasClicked = signal(false);

  @Input() set inputMusic(value: Music | null) {
    if (value) {

      console.log('valueeee', value)
      this.music.set(value);
      this.selection.set(value.allArtist)
    }
  }

  @Input() round: number = 0
  @Input() totalRound: number = 0


  @Output() public outputTeste = new EventEmitter<boolean>(false);

  public progress = computed(() => {
    const dur = this.duration();
    const curr = this.currentTime();
    return dur > 0 ? (curr / dur) * 100 : 0;
  });

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes',changes)
    if(!changes['inputMusic']?.firstChange){
      this.hasClicked.set(false);
    }
  }

  playMusic() {

    if (this.isPlaying()) {
      console.warn('12123')
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio = new Audio(this.music()?.music?.preview)
      this.audio.play();
      this.isPlaying.set(true);
      this.audio.volume = this.volume();
    }


    this.audio.onloadedmetadata = () => {
      this.duration.set(this.audio.duration);
      console.log('duration', this.duration())
    };

    this.audio.ontimeupdate = () => {
      this.currentTime.set(this.audio.currentTime);
      console.log('currentTime', this.currentTime())
    };

    this.audio.onended = () => {
      this.isPlaying.set(false);
      this.currentTime.set(0);
    };


  }

  setVolume(newVolume: number) {
    this.volume.set(newVolume);
    if (this.audio) {
      this.audio.volume = newVolume;
    }
  }

  seekMusic(newTime: number) {
    if (this.audio && this.duration() > 0) {
      this.audio.currentTime = newTime;
      this.currentTime.set(newTime);
    }
  }

  checkResponse(value: any) {
    if(this.hasClicked()) return
    value.click = true;
    console.log('isPlaying',this.isPlaying())
    if(this.isPlaying()) {
      this.isPlaying.set(false);
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.load();
    }

    this.hasClicked.set(true);
    console.log('value',value)
    this.outputTeste.emit(value?.value ? true : false);


  }

}
