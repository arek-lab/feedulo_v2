// Ton komunikacji w mailu
export enum ToneStyle {
  FORMAL = 'formal', // Oficjalny, dystyngowany - do instytucji i wyższej kadry
  BUSINESS_PROFESSIONAL = 'business_professional', // Profesjonalny - standardowa komunikacja B2B
  FRIENDLY_WARM = 'friendly_warm', // Przyjazny, ciepły - budowanie relacji z klientami
  NEUTRAL = 'neutral', // Neutralny - uniwersalny do większości sytuacji
  ASSERTIVE = 'assertive', // Asertywny - reklamacje, windykacja, pilne sprawy
}

// Długość i szczegółowość maila
export enum LengthStyle {
  CONCISE = 'concise', // Zwięzły, lakoniczny - krótkie wiadomości do punktu
  DETAILED = 'detailed', // Rozbudowany, szczegółowy - z pełnym kontekstem
  BULLET_POINTS = 'bullet_points', // Punktowy - z wyraźnymi listami i strukturą
}

// Cel biznesowy maila
export enum PurposeStyle {
  SALES = 'sales', // Sprzedażowy - prezentacja oferty, cold mailing
  FOLLOW_UP = 'follow_up', // Followup - przypomnienia, kontynuacja wątku
  INFORMATIONAL = 'informational', // Informacyjny - komunikaty, aktualizacje
  REQUEST_INQUIRY = 'request_inquiry', // Prośba/zapytanie - pytanie o informacje
  THANK_YOU = 'thank_you', // Podziękowania - wyrażenie wdzięczności
  APOLOGY = 'apology', // Przeprosiny - handling reklamacji i problemów
  NEGOTIATION = 'negotiation', // Negocjacyjny - ustalanie warunków współpracy
  NETWORKING = 'networking', // Networkingowy - nawiązywanie kontaktów biznesowych
}

// Branża / kontekst biznesowy
export enum IndustryStyle {
  CORPORATE = 'corporate', // Korporacyjny - dla dużych organizacji
  STARTUP = 'startup', // Startupowy - swobodny, nowoczesny
  CREATIVE = 'creative', // Kreatywny - dla branży kreatywnej, marketingu
  TECHNICAL = 'technical', // Techniczny - z żargonem branżowym IT
  LEGAL = 'legal', // Prawniczy - precyzyjny, z klauzulami
}

// Konfiguracja stylu generowanego maila
export interface EmailStyleConfig {
  tone: ToneStyle;
  length: LengthStyle;
  purpose: PurposeStyle;
  industry: IndustryStyle;
}

const TONE_MAP: Record<string, ToneStyle> = {
  st1: ToneStyle.BUSINESS_PROFESSIONAL,
  st2: ToneStyle.FORMAL,
  st3: ToneStyle.NEUTRAL,
  st4: ToneStyle.FRIENDLY_WARM,
  st5: ToneStyle.ASSERTIVE,
};

const LENGTH_MAP: Record<string, LengthStyle> = {
  sl1: LengthStyle.CONCISE,
  sl2: LengthStyle.DETAILED,
  sl3: LengthStyle.BULLET_POINTS,
};

const PURPOSE_MAP: Record<string, PurposeStyle> = {
  sp1: PurposeStyle.SALES,
  sp2: PurposeStyle.FOLLOW_UP,
  sp3: PurposeStyle.INFORMATIONAL,
  sp4: PurposeStyle.REQUEST_INQUIRY,
  sp5: PurposeStyle.THANK_YOU,
  sp6: PurposeStyle.NETWORKING,
};

const INDUSTRY_MAP: Record<string, IndustryStyle> = {
  si1: IndustryStyle.CORPORATE,
  si2: IndustryStyle.STARTUP,
  si3: IndustryStyle.CREATIVE,
  si4: IndustryStyle.TECHNICAL,
  si5: IndustryStyle.LEGAL,
};

export interface EmailFormValue {
  styleTone: string;
  stylePurpose: string;
  styleLength: string;
  styleIndustry: string;
  userQuery: string;
}

export function mapFormValueToEmailStyleSafe(
  formValue: EmailFormValue,
  defaults?: Partial<EmailStyleConfig>
): EmailStyleConfig {
  const toneValue = formValue.styleTone;
  const lengthValue = formValue.styleLength;
  const purposeValue = formValue.stylePurpose;
  const industryValue = formValue.styleIndustry;

  return {
    tone: TONE_MAP[toneValue] ?? defaults?.tone ?? ToneStyle.NEUTRAL,
    length: LENGTH_MAP[lengthValue] ?? defaults?.length ?? LengthStyle.CONCISE,
    purpose:
      PURPOSE_MAP[purposeValue] ??
      defaults?.purpose ??
      PurposeStyle.INFORMATIONAL,
    industry:
      INDUSTRY_MAP[industryValue] ??
      defaults?.industry ??
      IndustryStyle.CORPORATE,
  };
}

export const TONE_LABELS: Record<string, string> = {
  st1: 'profesjonalny (B2B)',
  st2: 'formalny',
  st3: 'neutralny',
  st4: 'przyjazny',
  st5: 'asertywny',
};

export const LENGTH_LABELS: Record<string, string> = {
  sl1: 'zwięzły / krótki',
  sl2: 'szczegółowy',
  sl3: 'punktowy',
};

export const PURPOSE_LABELS: Record<string, string> = {
  sp1: 'sprzedażowy',
  sp2: 'follow-up',
  sp3: 'informacyjny',
  sp4: 'prośba / zapytanie',
  sp5: 'podziękowanie',
  sp6: 'networkingowy',
};

export const INDUSTRY_LABELS: Record<string, string> = {
  si1: 'korporacyjny',
  si2: 'startupowy',
  si3: 'kreatywny',
  si4: 'techniczny',
  si5: 'prawniczy',
};

export interface ActualLabel {
  tone: string;
  length: string;
  purpose: string;
  industry: string;
}
