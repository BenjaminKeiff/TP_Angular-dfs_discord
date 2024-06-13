import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Salon } from '../../models/salon.type';
import { Serveur } from '../../models/serveur.type';

@Component({
    selector: 'app-principal',
    standalone: true,
    imports: [MatIconModule, RouterLink, MatTooltipModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule],
    templateUrl: './principal.component.html',
    styleUrl: './principal.component.scss',
})
export class PrincipalComponent {
    http: HttpClient = inject(HttpClient);
    listeServeur: Serveur[] = [];
    listeSalon: Salon[] = [];
    actualServer: string = '';
    formBuilder: FormBuilder = inject(FormBuilder);
    salonClicked: boolean = false;
    formulaire: FormGroup = this.formBuilder.group({
        nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });

    ngOnInit() {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            this.http.get<Serveur[]>('http://localhost:3000/serveur/possede').subscribe(listeServeur => (this.listeServeur = listeServeur));
        }
    }

    public OnSelectServer(serveur: Serveur): void {
        this.listeSalon = serveur.salon;
        this.actualServer = serveur._id;
    }

    public onAjoutSalon(): void {
        if (this.formulaire.valid) {
            const newSalon: Salon = {
                nom: this.formulaire.value.nom,
            };

            this.http.put<Serveur>(`http://localhost:3000/serveur/ajout-salon/${this.actualServer}`, newSalon).subscribe(
                updatedServeur => {
                    const index = this.listeServeur.findIndex(serveur => serveur._id === this.actualServer);
                    if (index !== -1) {
                        this.listeServeur[index] = updatedServeur;
                        this.listeSalon = updatedServeur.salon;
                    }
                    this.formulaire.reset();
                },
                error => {
                    console.error('Error adding salon:', error);
                }
            );
        }
    }
}
