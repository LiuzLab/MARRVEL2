import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HighlightSearch } from './highlight';

import {
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatIconModule,
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatTooltipModule,
  MatChipsModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule
} from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/pages/home/home.component';

import { SearchBoxComponent } from './components/search-box/search-box.component';
import { MailchimpComponent } from './components/mailchimp/mailchimp.component';
import { AboutComponent } from './components/pages/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { HumanResultComponent } from './components/pages/human-result/human-result.component';
import { SidenavComponent } from './components/pages/human-result/sidenav/sidenav.component';
import { OmimComponent } from './components/pages/human-result/omim/omim.component';
import { UnitDirective } from './directives/unit.directive';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { BasicDatatableComponent } from './components/basic-datatable/basic-datatable.component';
import { ClinvarComponent } from './components/pages/human-result/clinvar/clinvar.component';
import { ScrollTopButtonComponent } from './components/scroll-top-button/scroll-top-button.component';
import { GnomADComponent } from './components/pages/human-result/gnom-ad/gnom-ad.component';
import { GnomADGeneComponent } from './components/pages/human-result/gnom-ad-gene/gnom-ad-gene.component';
import { GnomADGeneVisualComponent } from './components/pages/human-result/gnom-ad-gene/gnom-ad-gene-visual/gnom-ad-gene-visual.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SearchBoxComponent,
    MailchimpComponent,
    AboutComponent,
    FooterComponent,
    HumanResultComponent,
    SidenavComponent,
    OmimComponent,
    UnitDirective,
    FilterInputComponent,
    HighlightSearch,
    BasicDatatableComponent,
    ClinvarComponent,
    ScrollTopButtonComponent,
    GnomADComponent,
    GnomADGeneComponent,
    GnomADGeneVisualComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatSidenavModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    MatButtonModule,
    HighlightSearch
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
