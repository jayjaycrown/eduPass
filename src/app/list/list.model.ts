export class List {
  constructor(
    public id: number,
    public title: string,
    public description: string,
  ) {}
}


export class Scan {
  constructor(
    public id: number,
    public content: string,
    public listId: string
  ){}
}
