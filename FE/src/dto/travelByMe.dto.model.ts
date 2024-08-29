export class TravelDTOByMe {
    id?: number;
    startLocation:string;
    endLocation: string;
    startTime: string;
    description: string;
    freeSpaces: number;
    creatorId: number;

    constructor(data: any) {
        this.id=data.id;
        this.startLocation = data.startLocation;
        this.endLocation = data.endLocation;
        this.startTime = data.startTime;
        this.freeSpaces = data.freeSpaces;
        this.description=data.description;
        this.creatorId=data.creatorId;
        console.log('DTO constructed with data:', data);
    }
}