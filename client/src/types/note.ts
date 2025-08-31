export interface Note {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NewNote {
  title: string;
  content: string;
  tags: string[];
}

export interface EditNote {
  title: string;
  content: string;
  tags: string[];
}
