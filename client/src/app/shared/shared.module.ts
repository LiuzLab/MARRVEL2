import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';

import { HighlightSearch } from '../highlight';
import { UnitDirective } from '../directives/unit.directive';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { FilterInputComponent } from '../components/filter-input/filter-input.component';
import { BasicDatatableComponent } from '../components/basic-datatable/basic-datatable.component';
import { ScrollTopButtonComponent } from '../components/scroll-top-button/scroll-top-button.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SearchBoxComponent } from '../components/search-box/search-box.component';
import { ModelGeneSearchComponent } from '../components/search-box/model-gene-search/model-gene-search.component';
import { YoutubeDialogComponent } from '../components/search-box/search-box.component';
import { MailchimpComponent } from '../components/mailchimp/mailchimp.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatRippleModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatSliderModule,
  MatMenuModule,
];

const SHARED_DECLARATIONS = [
  HighlightSearch,
  UnitDirective,
  ClickOutsideDirective,
  FilterInputComponent,
  BasicDatatableComponent,
  ScrollTopButtonComponent,
  NavbarComponent,
  FooterComponent,
  SearchBoxComponent,
  ModelGeneSearchComponent,
  YoutubeDialogComponent,
  MailchimpComponent,
];

@NgModule({
  declarations: SHARED_DECLARATIONS,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES,
    ...SHARED_DECLARATIONS,
  ],
})
export class SharedModule {}
