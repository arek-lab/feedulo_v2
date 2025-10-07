import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [],
  templateUrl: './status-message.component.html',
  styleUrl: './status-message.component.css',
})
export class StatusMessageComponent {
  @Input() messages: string[] = [
    'Ładowanie...',
    'Przetwarzanie danych...',
    'Prawie gotowe...',
    'Sprawdzamy dane...',
    'Przygotowujemy draft...',
    'Budujemy treść...',
    'Dodajemy style...',
    'Finalizujemy szczegóły...',
    'Optymalizujemy wygląd...',
    'Prawie gotowe...',
    'Wysyłamy propozycję...',
  ];
  @Input() interval: number = 3000;
  @Input() autoStart: boolean = true;
  @Input() loop: boolean = true;

  currentMessage = signal<string>('');

  private loadingInterval?: ReturnType<typeof setInterval>;
  private currentMessageIndex = 0;

  ngOnInit(): void {
    if (this.autoStart && this.messages.length > 0) {
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    if (this.messages.length === 0) return;

    this.currentMessageIndex = 0;
    this.currentMessage.set(this.messages[0]);

    if (this.messages.length === 1) return;

    this.loadingInterval = setInterval(() => {
      this.currentMessageIndex++;

      if (this.currentMessageIndex < this.messages.length) {
        this.currentMessage.set(this.messages[this.currentMessageIndex]);
      } else if (this.loop) {
        // Zapętl od początku
        this.currentMessageIndex = 0;
        this.currentMessage.set(this.messages[0]);
      } else {
        // Zatrzymaj na ostatnim komunikacie
        this.stop();
      }
    }, this.interval);
  }

  stop(): void {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = undefined;
    }
  }

  reset(): void {
    this.stop();
    this.currentMessageIndex = 0;
    this.currentMessage.set('');
  }
}
