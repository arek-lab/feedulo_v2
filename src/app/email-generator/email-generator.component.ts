import { Component, effect, inject, signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpService, ResponseEmailModel } from '../http.service';
import { CommonModule } from '@angular/common';
import {
  ActualLabel,
  EmailFormValue,
  EmailStyleConfig,
  INDUSTRY_LABELS,
  LENGTH_LABELS,
  PURPOSE_LABELS,
  TONE_LABELS,
} from './styles.model';
import { mapFormValueToEmailStyleSafe } from './styles.model';
import { MarkdownModule } from 'ngx-markdown';
import removeMarkdown from 'remove-markdown';
import { StatusMessageComponent } from '../status-message/status-message.component';

@Component({
  selector: 'app-email-generator',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    ReactiveFormsModule,
    MarkdownModule,
    StatusMessageComponent,
  ],
  templateUrl: './email-generator.component.html',
  styleUrl: './email-generator.component.css',
})
export class EmailGeneratorComponent {
  private httpService = inject(HttpService);
  isLoading = signal(false);
  styleAlert = signal<String | null>(null);
  dataForm = new FormGroup({
    styleTone: new FormControl('st1'),
    stylePurpose: new FormControl('sp1'),
    styleLength: new FormControl('sl1'),
    styleIndustry: new FormControl('si1'),
    userQuery: new FormControl('', {
      validators: [Validators.required, Validators.minLength(20)],
    }),
  });
  responseData = signal<ResponseEmailModel | null>(null);
  choosenStyle = signal<ActualLabel | null>(null);
  userRequest = signal<string | null>(null);
  copied = signal(false);
  loadingMessage = signal('Ładowanie...');
  labels = {
    tone: TONE_LABELS,
    length: LENGTH_LABELS,
    industry: INDUSTRY_LABELS,
    purpose: PURPOSE_LABELS,
  };
  loadingMessages = [
    'Sprawdzamy dane...',
    'Przygotowujemy draft...',
    'Budujemy treść...',
    'Dodajemy style...',
    'Finalizujemy szczegóły...',
    'Optymalizujemy wygląd...',
    'Prawie gotowe...',
    'Wysyłamy propozycję...',
  ];

  copyToClipboard() {
    const markdown = this.responseData()?.output_MD as string;
    const plainText = removeMarkdown(markdown);

    navigator.clipboard
      .writeText(plainText)
      .then(() => this.copied.set(true))
      .catch(() => alert('Nie udało się skopiować'));
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.dataForm.invalid) return;
    const email_info = this.dataForm.value.userQuery as string;
    const email_style: EmailStyleConfig = mapFormValueToEmailStyleSafe(
      this.dataForm.value as EmailFormValue
    );
    this.httpService.generateEmail({ email_info, email_style }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.choosenStyle.set({
          tone: TONE_LABELS[this.dataForm.controls.styleTone.value as string],
          length:
            LENGTH_LABELS[this.dataForm.controls.styleLength.value as string],
          purpose:
            PURPOSE_LABELS[this.dataForm.controls.stylePurpose.value as string],
          industry:
            INDUSTRY_LABELS[
              this.dataForm.controls.styleIndustry.value as string
            ],
        });
        this.userRequest.set(email_info);
        this.responseData.set(res);
        this.dataForm.reset();
        this.dataForm.patchValue({
          styleTone: 'st1',
          stylePurpose: 'sp1',
          styleLength: 'sl1',
          styleIndustry: 'si1',
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.responseData.set({
          user_query: '',
          output_MD:
            'Pojawił sie nieoczekiwany problem. Spróbuj ponownie za chwilę.',
          validation_pass: false,
          email_title: '',
          credtis: 0,
        });
      },
    });
  }
}
