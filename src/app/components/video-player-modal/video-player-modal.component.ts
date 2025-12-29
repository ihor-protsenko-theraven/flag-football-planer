import {Component, computed, HostListener, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-video-player-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player-modal.component.html',
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class VideoPlayerModalComponent {
  private sanitizer = inject(DomSanitizer);

  // Signals
  isOpen = signal(false);
  private _videoSrc = signal<string | null>(null);

  // Platform detection (YouTube vs Instagram)
  platform = computed(() => {
    const src = this._videoSrc();
    if (!src) return 'unknown';
    if (src.includes('instagram.com')) return 'instagram';
    return 'youtube';
  });

  safeVideoUrl = computed(() => {
    const src = this._videoSrc();
    if (!src) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  });

  // Публічний метод відкриття
  open(rawUrl: string) {
    const embedUrl = this.convertToEmbedUrl(rawUrl);

    if (embedUrl) {
      this._videoSrc.set(embedUrl);
      this.isOpen.set(true);
      this.toggleBodyScroll(true);
    } else {
      console.warn('Could not parse video URL:', rawUrl);
    }
  }

  close() {
    this.isOpen.set(false);
    this._videoSrc.set(null); // Очищаємо src, щоб зупинити відео
    this.toggleBodyScroll(false);
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }

  private convertToEmbedUrl(url: string): string | null {
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&rel=0`;
    }

    const igRegExp = /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;
    const igMatch = url.match(igRegExp);
    if (igMatch && igMatch[1]) {
      return `https://www.instagram.com/p/${igMatch[1]}/embed`;
    }

    return null;
  }

  private toggleBodyScroll(lock: boolean) {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = lock ? 'hidden' : '';
    }
  }
}
