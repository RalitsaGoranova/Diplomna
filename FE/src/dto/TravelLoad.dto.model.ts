export class TravelLoadDTO {
  id: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  description: string;
  freeSpaces: number;
  userHasSubmittedOffer: boolean; // New flag

  constructor(
    id: number,
    startLocation: string,
    endLocation: string,
    startTime: string,
    description: string,
    freeSpaces: number,
    userHasSubmittedOffer: boolean = false
  ) {
    this.id = id;
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.startTime = startTime;
    this.description = description;
    this.freeSpaces = freeSpaces;
    this.userHasSubmittedOffer = userHasSubmittedOffer;
  }
}
