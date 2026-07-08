export interface Persona {
  umur: string;
  gender: string;
  pekerjaan: string;
  gayaBicara: string;
  userName: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
