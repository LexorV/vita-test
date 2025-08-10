export type ISODateTimeString = string;

export interface Comment {
  email: string;
  textComment: string;
  userInfo: string;
}

export interface ExportCommentWithMeta extends Comment {
  id: number;
  dateTime: ISODateTimeString;
}

export interface Post {
  briefDescription: string;
  comments: ExportCommentWithMeta[];
  dateTime: ISODateTimeString;
  fullDescription: string;
  id: number;
  title: string;
  userInfoId: number;
}

export type PostForUser = Omit<Post, 'userInfoId'>;

export interface User {
  blogName: string;
  fullName: string;
  id: number;
  post: PostForUser[];
}
