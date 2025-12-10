export const QUESTION_TYPES = [
    { value: 'matching', label: 'Matching' },
    { value: 'ordering', label: 'Ordering' },
    { value: 'gap', label: 'Fill in the Gap' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
  ] as const;
  
  export const THEORY_TYPES = [
    { value: 'grammar', label: 'Grammar' },
    { value: 'phrase', label: 'Phrase' },
    { value: 'flashcard', label: 'Flashcard' },
  ] as const;
  
  export const DEFAULT_PAGE_SIZE = 10;
  
  export const SORT_OPTIONS = [
    { value: 'displayOrder:ASC', label: 'Display Order (Ascending)' },
    { value: 'displayOrder:DESC', label: 'Display Order (Descending)' },
    { value: 'createdAt:DESC', label: 'Newest First' },
    { value: 'createdAt:ASC', label: 'Oldest First' },
  ] as const;
  