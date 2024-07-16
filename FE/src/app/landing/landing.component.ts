import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import {TopBarComponent} from "../top-bar/top-bar.component";

export class TownGroup {
  letter: string;
  towns: string[];

  constructor(letter: string, towns: string[]) {
    this.letter = letter;
    this.towns = towns;
  }
}

// Define the filter function
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase(); // Convert input value to lowercase
  return opt.filter(item => item.toLowerCase().includes(filterValue)); // Filter options to include only those that contain the filterValue
};

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    CommonModule,
    RouterLink,
    TopBarComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.townForm = this.formBuilder.group({
      from: '',
      destination: '',
      departureDate: null,
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
    const from = this.townForm.get('from')!.value;
    const destination = this.townForm.get('destination')!.value;
    const departureDate = this.townForm.get('departureDate')!.value;
    const numberOfPeople = this.townForm.get('numberOfPeople')!.value;
    console.log('From:', from);
    console.log('To:', destination);
    console.log('Departure Date:', departureDate);
    console.log('Number of People:', numberOfPeople);
  }
}
