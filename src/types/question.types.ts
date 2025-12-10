export enum QuestionType {
    MATCHING = 'matching',
    ORDERING = 'ordering',
    GAP = 'gap',
    MULTIPLE_CHOICE = 'multiple_choice',
  }
  
  export interface Question {
    _id: string;
    lessonId: string;
    typeQuestion: QuestionType;
    displayOrder: number;
    leftText?: Array<{ value: string; pairId: string }>;
    rightText?: Array<{ value: string; pairId: string }>;
    correctAnswer?: string;
    fragmentText?: string[];
    exactFragmentText?: string;
    answers?: string[];
    mediaUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CreateQuestionDto {
    lessonId: string;
    typeQuestion: QuestionType;
    displayOrder?: number;
    leftText?: Array<{ value: string }>;
    rightText?: Array<{ value: string }>;
    correctAnswer?: string;
    fragmentText?: string[];
    exactFragmentText?: string;
    answers?: string[];
    mediaUrl?: string;
  }
  
  export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {}
  