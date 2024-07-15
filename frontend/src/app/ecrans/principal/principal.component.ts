import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Message } from '../../models/message.type';
import { Salon } from '../../models/salon.type';
import { Serveur } from '../../models/serveur.type';

@Component({
    selector: 'app-principal',
    standalone: true,
    imports: [CommonModule, MatIconModule, RouterLink, MatTooltipModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule],
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent {
    http: HttpClient = inject(HttpClient);
    listeServeur: Serveur[] = [];
    listeSalon: Salon[] = [];
    actualServer: string = '';
    actualSalon: Salon | null = null;
    formBuilder: FormBuilder = inject(FormBuilder);
    salonClicked: boolean = false;
    formulaire: FormGroup = this.formBuilder.group({
        nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
    messageForm: FormGroup = this.formBuilder.group({
        contenu: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    });
    messages: Message[] = [];

    ngOnInit() {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            this.http.get<Serveur[]>('http://localhost:3000/serveur/possede').subscribe(listeServeur => (this.listeServeur = listeServeur));
        }
    }

    trackById(index: number, item: any): string {
        return item._id;
    }

    public OnSelectServer(serveur: Serveur): void {
        this.listeSalon = serveur.salon;
        this.actualServer = serveur._id;
    }

    public onAjoutSalon(): void {
        if (this.formulaire.valid) {
            const newSalon: Salon = {
                nom: this.formulaire.value.nom,
                messages: [], // Initialize the messages array
            };
            this.http.put<Serveur>(`http://localhost:3000/serveur/ajout-salon/${this.actualServer}`, newSalon).subscribe(updatedServeur => {
                const index = this.listeServeur.findIndex(serveur => serveur._id === this.actualServer);
                if (index !== -1) {
                    this.listeServeur[index] = updatedServeur;
                    this.listeSalon = updatedServeur.salon;
                }
                this.formulaire.reset();
            });
        }
    }

    public OnClickSalon(salon: Salon): void {
        this.actualSalon = salon;
        this.fetchMessages(salon._id!);
    }

    public onAjoutMessage(): void {
        if (this.messageForm.valid && this.actualSalon) {
            const newMessage: Message = {
                idSalon: this.actualSalon._id!,
                idUtilisateur: 'user-id-placeholder',
                contenu: this.messageForm.value.contenu,
                date: new Date().toISOString(),
            };
            this.http.post<Message>(`http://localhost:3000/salon/${this.actualSalon._id}/message/`, newMessage).subscribe(createdMessage => {
                this.actualSalon?.messages?.push(createdMessage.idSalon);
                this.messages.push(createdMessage);
                this.messageForm.reset();
            });
        }
    }

    private fetchMessages(salonId: string): void {
        this.http.get<Message[]>(`http://localhost:3000/salon/${this.actualSalon?._id}/messages/`).subscribe(fetchedMessages => {
            this.messages = fetchedMessages;
        });
    }
}
