import {Component, OnInit} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {_filter, TownGroup} from "../landing/landing.component";
import {AsyncPipe, CommonModule, NgForOf} from "@angular/common";
import {MatAutocomplete, MatAutocompleteTrigger, MatOptgroup, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {TravelDTO} from "../../dto/travel.dto.model";
import {AuthService} from "../../services/auth.service";
import {TravelOfferDialogComponent} from "../travel-offer-dialog/travel-offer-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    TopBarComponent,
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatLabel,
    MatOptgroup,
    MatOption,
    NgForOf,
    CommonModule,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  townForm!: FormGroup;
  townGroups: TownGroup[] = [
    {
      letter: 'A',
      towns: ['Aitos', 'Asenovgrad', 'Aheloy', 'Akhtopol', 'Apriltsi']
    },
    {
      letter: 'B',
      towns: ['Balchik', 'Bansko', 'Batak', 'Belitsa', 'Belene', 'Belovo', 'Beloslav', 'Berkovitsa', 'Blagoevgrad', 'Botevgrad', 'Bratsigovo', 'Bregovo', 'Breznik', 'Burgas', 'Byala Slatina']
    },
    {
      letter: 'V',
      towns: ['Varna', 'Veliko Tarnovo', 'Velingrad', 'Vetovo', 'Vidin', 'Vratsa']
    },
    {
      letter: 'G',
      towns: ['Gabrovo', 'General Toshevo', 'Glavinitsa', 'Godech', 'Gorna Oryahovitsa', 'Gotse Delchev', 'Gramada']
    },
    {
      letter: 'D',
      towns: ['Devin', 'Dimitrovgrad', 'Dobrich', 'Dolna Banya', 'Dolna Mitropoliya', 'Dolni Dubnik', 'Dospat', 'Dragoman', 'Dryanovo', 'Dupnitsa', 'Dalgopol']
    },
    {
      letter: 'E',
      towns: ['Elena', 'Elin Pelin', 'Elhovo', 'Etropole']
    },
    {
      letter: 'Zh',
      towns: ['Zhelezitsa', 'Zheravna']
    },
    {
      letter: 'Z',
      towns: ['Zavet', 'Zemen', 'Zlataritsa', 'Zlatitsa', 'Zlatograd']
    },
    {
      letter: 'I',
      towns: ['Ivaylovgrad', 'Isperikh', 'Ihtiman']
    },
    {
      letter: 'K',
      towns: ['Kableshkovo', 'Kavarna', 'Kazanlak', 'Kalofe', 'Kameno', 'Kaolinovo', 'Karlovo', 'Karnobat', 'Kaspichan', 'Kavarna', 'Kermen', 'Kilifarevo', 'Kiten', 'Kneja', 'Kozloduy', 'Koprivshtitsa', 'Kostenets', 'Kostenbrod', 'Kotel', 'Kocherinovo', 'Kresna', 'Krivodol', 'Kubrat', 'Kuklen', 'Kula', 'Kardzhali', 'Kyustendil']
    },
    {
      letter: 'L',
      towns: ['Lovech', 'Lom', 'Lukovit']
    },
    {
      letter: 'M',
      towns: ['Madan', 'Madzharovo', 'Malko Tarnovo', 'Mezdra', 'Melnik', 'Momin Prohod', 'Momchilgrad', 'Montana', 'Muglizh', 'Murtitsa']
    },
    {
      letter: 'N',
      towns: ['Nevestino', 'Nesebar', 'Nikola Kozlevo', 'Nikopol', 'Nova Zagora', 'Novi Pazar', 'Novo selo']
    },
    {
      letter: 'O',
      towns: ['Omurtag', 'Opaka', 'Oryahovo', 'Oryahovitsa']
    },
    {
      letter: 'P',
      towns: ['Pavel banya', 'Pavlikeni', 'Pazardzhik', 'Panagyurishte', 'Pernik', 'Perushtitsa', 'Petrich', 'Peshtera', 'Pirdop', 'Pleven', 'Pliska', 'Plovdiv', 'Polski Trambesh', 'Pomorie', 'Popovo', 'Pordim', 'Pravets', 'Primorsko', 'Provadiya', 'Pyrvomay', 'Pyrvomaytsi']
    },
    {
      letter: 'R',
      towns: ['Radnevo', 'Radomir', 'Razgrad', 'Razlog', 'Rakitovo', 'Rakovski', 'Rila', 'Roman', 'Rudozem', 'Ruse', 'Ruen', 'Razhentsi']
    },
    {
      letter: 'S',
      towns: ['Samokov', 'Sandanski', 'Sapareva banya', 'Sveti Vlas', 'Svilengrad', 'Svishtov', 'Svoge', 'Sevlievo', 'Septemvri', 'Silistra', 'Simeonovgrad', 'Simitli', 'Slavyanovo', 'Sliven', 'Slivnitsa', 'Slivo pole', 'Smolyan', 'Smyadovo', 'Sozopol', 'Sopot', 'Sofia', 'Sredets', 'Stamboliyski', 'Stambolovo', 'Stara Zagora', 'Strazhitsa', 'Straldzha', 'Strelcha', 'Strumyani', 'Sungurlare', 'Suhindol', 'Suhozem', 'Syedinenie', 'Sirnitsa']
    },
    {
      letter: 'T',
      towns: ['Tvarditsa', 'Teteven', 'Topolovgrad', 'Troyan']
    },
  ];

  townGroupOptionsFrom!: Observable<TownGroup[]>;
  townGroupOptionsTo!: Observable<TownGroup[]>;
  travels: TravelDTO[] = [];
  sortedTravels: TravelDTO[] = [];
  searchTriggered: boolean = false;
  offerStatusMap: Map<number, boolean> = new Map<number, boolean>();


  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.townForm = this.formBuilder.group({
      from: '',
      destination: '',
      departureDate: null,
      departureTime: null,
      numberOfPeople: 1
    });

    this.townGroupOptionsFrom = this.townForm.get('from')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );

    this.townGroupOptionsTo = this.townForm.get('destination')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );

    this.loadTravels();
  }

  private _filterGroup(value: string): TownGroup[] {
    if (value) {
      return this.townGroups
          .map(group => ({ letter: group.letter, towns: _filter(group.towns, value) }))
          .filter(group => group.towns.length > 0);
    }
    return this.townGroups;
  }

  private loadTravels(): void {
    this.authService.getAllTravels().subscribe({
      next: (data) => {
        console.log('Travels loaded:', data);
        this.travels = data;
        this.sortedTravels = [...this.travels];

        this.travels.forEach(travel => {
          this.authService.hasUserSubmittedOffer(travel.id).subscribe(hasSubmitted => {
            if (travel.id != null) {
              this.offerStatusMap.set(travel.id, hasSubmitted);
            }
          });
        });
      },
      error: (err) => console.error('Error fetching travels:', err)
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  onSubmit() {
    const from = this.townForm.get('from')!.value;
    const destination = this.townForm.get('destination')!.value;
    const date = this.townForm.get('departureDate')!.value;
    const time = this.townForm.get('departureTime')!.value;
    const numberOfPeople = this.townForm.get('numberOfPeople')!.value;

    const startTime = `${date}T${time}`;

    this.sortedTravels = this.travels.filter(travel =>
        travel.startLocation === from &&
        travel.endLocation === destination &&
        travel.freeSpaces >= numberOfPeople &&
        travel.startTime >= startTime
    );
    this.searchTriggered = true;
  }

  openDialog(travelId: number): void {
    if (travelId) {
      this.authService.hasUserSubmittedOffer(travelId)
          .subscribe(hasSubmitted => {
            if (!hasSubmitted) {
              const dialogRef = this.dialog.open(TravelOfferDialogComponent, {
                width: '300px',
                data: { note: '' },
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.authService.sendOffer(travelId, { note: result }).subscribe({
                    next: response => console.log('Offer submitted successfully:', response),
                    error: err => console.error('Error submitting offer:', err)
                  });
                  window.location.reload();
                }
              });
            } else {
              console.log('User has already submitted an offer for this travel.');
            }
          });
    } else {
      console.error('Travel ID is undefined or null');
    }
  }

  hasSubmittedOffer(travelId: number): boolean {
    return this.offerStatusMap.get(travelId) || false;
  }
}