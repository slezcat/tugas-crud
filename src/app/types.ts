export type NoteList = {
  noteList: Note[];
  status: string;
  message: any;
};

export type Form = {
  title: String;
  fruit: String;
  date: String;
};

export interface Note {
  [id: string]: { title: string; date: string; fruit: string };
}
