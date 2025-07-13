import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface NewsItem {
  id?: string;
  title: string;
  body: string;
  date: any; // Firestore Timestamp
  image?: string; // URL to Firebase Storage
}

interface GalleryItem {
  id?: string;
  imageUrl: string;
  caption?: string;
}

interface ContactMessage {
  name: string;
  email: string;
  message: string;
  timestamp: any; // Firestore Timestamp
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule here
    FormsModule
  ]
})
export class AppComponent implements OnInit {
  aboutText = 'Tässä on lyhyt esittely yhdistyksestä. Voit muokata tätä tekstiä hallintapaneelista.';

  news: Observable<NewsItem[]>;
  gallery: Observable<GalleryItem[]>;

  constructor(private firestore: Firestore) {
    const newsCollectionRef = collection(this.firestore, 'news');
    this.news = collectionData(query(newsCollectionRef, orderBy('date', 'desc')), { idField: 'id' }) as Observable<NewsItem[]>;

    const galleryCollectionRef = collection(this.firestore, 'gallery');
    this.gallery = collectionData(galleryCollectionRef, { idField: 'id' }) as Observable<GalleryItem[]>;
  }

  ngOnInit(): void {
    // Initialize Google Maps here if needed, e.g.:
    // this.initMap();
  }

  onContactSubmit(form: NgForm) {
    if (form.valid) {
      const newMessage: ContactMessage = {
        name: form.value.name,
        email: form.value.email,
        message: form.value.message,
        timestamp: new Date() // Firestore will convert this to a Timestamp
      };
      addDoc(collection(this.firestore, 'contact_messages'), newMessage)
        .then(() => {
          console.log('Viesti lähetetty onnistuneesti!');
          form.resetForm(); // Use resetForm() for NgForm
          alert('Viesti lähetetty onnistuneesti!'); // Simple confirmation
        })
        .catch(error => {
          console.error('Virhe viestin lähetyksessä:', error);
          alert('Virhe viestin lähetyksessä. Yritä uudelleen.');
        });
    } else {
      alert('Täytä kaikki pakolliset kentät.');
    }
  }

  // Example for Google Maps initialization (requires Google Maps API script in index.html)
  // initMap(): void {
  //   const mapElement = document.getElementById('map');
  //   if (mapElement) {
  //     // Replace with your actual coordinates
  //     const coordinates = { lat: 60.1699, lng: 24.9384 }; // Example: Helsinki, Finland
  //     const map = new google.maps.Map(mapElement, {
  //       center: coordinates,
  //       zoom: 12,
  //     });
  //     new google.maps.Marker({
  //       position: coordinates,
  //       map: map,
  //       title: 'Yhdistyksen Sijainti',
  //     });
  //   }
  // }
}
