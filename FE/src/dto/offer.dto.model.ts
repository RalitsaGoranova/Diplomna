export class OfferDTO {
    id?: number;
    travelId: number;
    userId: number;
    note: string;
    status: string; // e.g., "submitted", "accepted", "declined"

    constructor(data: any) {
        this.id = data.id;
        this.travelId = data.travelId;
        this.userId = data.userId;
        this.note = data.note;
        this.status = data.status;
    }
}