// todo
export class CollectionEventMissing extends Error {
  constructor() {
    super();
    this.name = "CollectionMissing";
    this.message = "Collection event missing.";
  }
}
