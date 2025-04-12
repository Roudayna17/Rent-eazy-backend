export class CreateReservationDto {
    readonly clientId: number;
    readonly offreId: number;
    readonly houseId: number;  // Change from offreId to houseId to match frontend
    readonly status?: boolean;
    readonly decisionMessage: string;
    readonly isRejected: boolean;
  }