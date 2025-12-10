export interface Course {
    _id: string;
    description?: string;
    displayOrder: number;
    thumbnail?: string;
    units?: Unit[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CreateCourseDto {
    description?: string;
    thumbnail?: string;
  }
  
  export interface UpdateCourseDto {
    description?: string;
    thumbnail?: string;
  }
  
  export interface Unit {
    _id: string;
    courseId: string;
    title?: string;
    description?: string;
    displayOrder: number;
    thumbnail?: string;
    lessons?: Lesson[];
  }
  
  export interface Lesson {
    _id: string;
    unitId: string;
    title?: string;
    experiencePoint?:number;
    objectives?: string;
    displayOrder: number;
    thumbnail?: string;
  }
  