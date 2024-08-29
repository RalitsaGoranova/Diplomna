export class OfferPassengerDto {
    travelId: number;
    startLocation:string;
    endLocation: string;
    startTime: string;
    status: string;
    note: string;

    constructor(data: any) {
        this.travelId=data.travelId;
        this.startLocation=data.startLocation;
        this.endLocation=data.endLocation;
        this.startTime=data.startTime;
        this.status = data.status;
        this.note = data.note;
    }
}

