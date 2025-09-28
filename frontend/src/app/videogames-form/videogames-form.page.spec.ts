import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideogamesFormPage } from './videogames-form.page';

describe('VideogamesFormPage', () => {
  let component: VideogamesFormPage;
  let fixture: ComponentFixture<VideogamesFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideogamesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
