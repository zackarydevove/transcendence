

export type CreateLocalUserDto = {
  provider: "local";
  email: string;
  password: string;
  username: string;
}

export type CreateFortyTwoUserDto = {
  provider: "42";
  email: string;
  username: string;
}

export type CreateUserDto =
  | CreateLocalUserDto
  | CreateFortyTwoUserDto
