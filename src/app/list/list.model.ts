export class List {
  constructor(
    public id: string,
    public title: string,
    public description: string,
  ) {}
}


export class Scan {
  constructor(
    public id: string,
    public content: string,
    public listId: string
  ){}
}
