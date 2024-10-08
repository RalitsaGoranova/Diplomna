export class TravelDTO {
    id?: number;
    creatorId?: number;
    endLocation: string;
    startLocation:string;
startTime: string;
description: string;
freeSpaces: number;

    constructor(data: any) {
        this.id=data.id;
        this.creatorId = data.creatorId;
        this.endLocation = data.endLocation;
        this.startLocation = data.startLocation;
        this.startTime = data.startTime;
        this.freeSpaces = data.freeSpaces;
        this.description=data.description;
        console.log('DTO constructed with data:', data);
    }
}