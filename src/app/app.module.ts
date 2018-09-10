import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatSelectModule,
  MatOptionModule,
  MatGridListModule,
  MatDialogModule,
  MatListModule,
  MatDividerModule,
  MatExpansionModule,
  MatProgressBarModule
} from '@angular/material';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { UtilModule } from './util/util.module';
import { EntriesComponent } from './entries/entries.component';
import { DetailsComponent } from './entries/details/details.component';
import { OracleComponent } from './oracle/oracle.component';

@NgModule({
  declarations: [
    AppComponent,
    NewEntryComponent,
    EntriesComponent,
    DetailsComponent,
    OracleComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatGridListModule,
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressBarModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    UtilModule
  ],
  entryComponents: [DetailsComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
