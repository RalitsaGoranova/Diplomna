export class TravelDTO {
    id: number;
    destination: string;
    startDate: Date;
    endDate: Date;

    constructor(data: any) {
        this.id = data.id;
        this.destination = data.destination;
        this.startDate = new Date(data.startDate);
        this.endDate = new Date(data.endDate);
    }
}