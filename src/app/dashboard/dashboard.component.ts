import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService, LLMResponse, UserData } from '../http.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StatusMessageComponent } from '../status-message/status-message.component';

type LeadershipStyle = 's1' | 's2' | 's3' | 's4';
type DevelopmentLevel = 'd1' | 'd2' | 'd3' | 'd4';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent,
    StatusMessageComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private httpService = inject(HttpService);
  isLoading = signal(false);
  styleAlert = signal<String | null>(null);
  dataForm = new FormGroup({
    leadershipStyle: new FormControl('s1'),
    developmentLevel: new FormControl('d1'),
    userQuery: new FormControl('', {
      validators: [Validators.required, Validators.minLength(20)],
    }),
  });
  styleMapping = {
    s1: 'd1',
    s2: 'd2',
    s3: 'd3',
    s4: 'd4',
  };
  styleWarning = {
    s1: 'S1 (instruowanie) - najlepszy dla D1 (debiutant) - niskie kompetencje, wysokie zaangażowanie.',
    s2: 'S2 (konsultowanie) - najlepszy dla D2 (uczeń rozczarowany) - częściowe kompetencje, spadające zaangażowanie.',
    s3: 'S3 (wspieranie) - najlepszy dla D3 (praktyk ostrożny) - wysokie kompetencje, zmienne zaangażowanie.',
    s4: 'S4 (delegowanie) - najlepszy dla D4 (ekspert samodzielny) - wysokie kompetencje, wysokie zaangażowanie.',
  };
  responseData = signal<LLMResponse | null>(null);
  userQuery = signal<string | null>(null);
  copied = signal(false);
  loadingMessages = [
    'Sprawdzamy dane...',
    'Przygotowujemy draft...',
    'Budujemy treść...',
    'Finalizujemy szczegóły...',
    'Prawie gotowe...',
    'Wysyłamy propozycję...',
  ];

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.responseData()?.feedback as string)
      .then(() => this.copied.set(true))
      .catch((err) => alert('Nie udało się skopiować'));
  }

  validateStyle() {
    this.styleAlert.set(null);
    const selectedStyle = this.dataForm.get('leadershipStyle')?.value;

    if (selectedStyle && this.styleMapping[selectedStyle as LeadershipStyle]) {
      const mappedValue = this.styleMapping[selectedStyle as LeadershipStyle];

      if (!(mappedValue === this.dataForm.value.developmentLevel)) {
        this.styleAlert.set(
          'Styl ' +
            this.styleWarning[selectedStyle as LeadershipStyle] +
            ' Upewnij się, czy otrzymany feedback odpowiada Twoim założeniom.'
        );
      }
    }
  }

  matchDevelopmentLevel() {
    this.styleAlert.set(null);
    const selectedStyle = this.dataForm.get('leadershipStyle')
      ?.value as LeadershipStyle;

    if (selectedStyle) {
      const mappedValue = this.styleMapping[selectedStyle];
      this.dataForm
        .get('developmentLevel')
        ?.setValue(mappedValue as DevelopmentLevel);
    }
  }
  onSubmit() {
    this.copied.set(false);
    this.isLoading.set(true);
    this.httpService
      .generateFeedback(this.dataForm.value as UserData)
      .subscribe({
        next: (res) => {
          this.responseData.set(res);
          this.userQuery.set(this.dataForm.get('userQuery')!.value);
          this.isLoading.set(false);
          this.dataForm.reset();
          this.dataForm.patchValue({
            leadershipStyle: 's1',
            developmentLevel: 'd1',
          });
        },
        error: (err) => {
          this.responseData.set({
            feedback:
              'Pojawił sie nieoczekiwany problem. Spróbuj ponownie za chwilę.',
            metadata: {
              development_level: 'd1',
              recommended_style: 's1',
              applied_style: 's1',
              is_aligned: true,
              warning: null,
              tokens: {
                input_tokens: 0,
                output_tokens: 0,
                total_tokens: 0,
              },
              credits: 0,
            },
          });
        },
      });
  }
}
