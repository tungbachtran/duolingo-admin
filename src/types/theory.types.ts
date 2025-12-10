export enum TheoryType {
    GRAMMAR = 'grammar',
    PHRASE = 'phrase',
    FLASHCARD = 'flashcard',
  }
  
  export interface Theory {
    _id: string;
    unitId: string;
    typeTheory: TheoryType;
    displayOrder: number;
    title?: string;
    content?: string;
    example?: string;
    audio?: string;
    translation?: string;
    phraseText?: string;
    term?: string;
    image?: string;
    ipa?: string;
    partOfSpeech?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CreateTheoryDto {
    unitId: string;
    typeTheory: TheoryType;
    displayOrder?: number;
    title?: string;
    content?: string;
    example?: string;
    audio?: string;
    translation?: string;
    phraseText?: string;
    term?: string;
    image?: string;
    ipa?: string;
    partOfSpeech?: string;
  }
  
  export type UpdateTheoryDto = Partial<CreateTheoryDto>
  