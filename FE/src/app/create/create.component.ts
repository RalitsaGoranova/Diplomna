import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TravelDTO} from "../../dto/travel.dto.model";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatAutocomplete, MatAutocompleteTrigger, MatOptgroup, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {map, Observable, startWith} from "rxjs";
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

export class TownGroup {
  letter: string;
  towns: string[];

  constructor(letter: string, towns: string[]) {
    this.letter = letter;
    this.towns = towns;
  }
}

  export const _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase(); // Convert input value to lowercase
    return opt.filter(item => item.toLowerCase().includes(filterValue)); // Filter options to include only those that contain the filterValue
  };

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    TopBarComponent,
    FormsModule,
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatLabel,
    MatOptgroup,
    MatOption,
    NgForOf,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})

export class CreateComponent implements OnInit {
  townForm!: FormGroup;
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
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

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              protected dialog: MatDialog) {}
ngOnInit() {
    this.townForm = this.formBuilder.group({
      from: '',
      destination: '',
      departureDate: null,
      departureTime: null,
      numberOfPeople: 1,
      description: ''
    });

    this.townGroupOptionsFrom = this.townForm.get('from')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );

    this.townGroupOptionsTo = this.townForm.get('destination')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );
  }

  private _filterGroup(value: string): TownGroup[] {
    if (value) {
      return this.townGroups
          .map(group => ({ letter: group.letter, towns: _filter(group.towns, value) }))
          .filter(group => group.towns.length > 0);
    }

    return this.townGroups;
  }


  onSubmit() {
    const date = this.townForm.get('departureDate')!.value;
    const time = this.townForm.get('departureTime')!.value;

    // Combine date and time into ISO string format
    const startTime = `${date}T${time}`;

    const travelData = {
      startLocation: this.townForm.get('from')!.value, // Matches startLocation in backend
      endLocation: this.townForm.get('destination')!.value, // Matches endLocation in backend
      startTime: startTime, // Matches startTime in backend
      freeSpaces: this.townForm.get('numberOfPeople')!.value, // Matches freeSpaces in backend
      description: this.townForm.get('description')!.value // Matches description in backend
    };

    console.log('Sending data to API:', travelData);
    this.authService.submitTravel(travelData).subscribe(
        response => {
          console.log('Travel created:', response);
        }
    );
    this.openSuccessDialog();
  }
  openSuccessDialog(): void {
    this.dialog.open(this.successDialog).afterClosed().subscribe(() => {
      window.location.reload();  // Reload the page after closing the dialog
    });
  }
}
